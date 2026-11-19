"""HU10 asistencia, HU11 listados y HU12 resumen de asistencia (RF07, RF08)."""

from django.db import IntegrityError, transaction
from django.db.models import Count, Q
from django.utils import timezone
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from academics.models import Enrollment, Group
from accounts.models import User
from core.exceptions import ConflictError
from core.permissions import IsInstitutionAdmin, IsInstitutionMember
from students.models import Student

from .models import AttendanceChange, AttendanceRecord
from .serializers import (
    ChangeSerializer,
    CorrectionSerializer,
    RangeSerializer,
    SheetQuerySerializer,
    SheetSerializer,
)

ALREADY_RECORDED = (
    "La asistencia de esta fecha ya fue registrada. Corríjala en lugar de registrarla de nuevo."
)
ONLY_ASSIGNED = "Solo el personal docente asignado al grupo registra o corrige su asistencia."


def visible_groups(user):
    """Grupos visibles: todos los de la institución, o solo los asignados al docente (CA16)."""
    groups = Group.objects.filter(institution=user.institution).select_related("period")
    if user.role == User.Role.TEACHER:
        groups = groups.filter(teachers__user=user, teachers__is_active=True).distinct()
    return groups


def get_group(user, group_id) -> Group:
    group = visible_groups(user).filter(pk=group_id).first()
    if group is None:
        # Grupo de otra institución o sin asignación: no existe para el usuario (RN02, HU10-E5).
        raise NotFound()
    return group


def require_assigned_teacher(user, group: Group) -> None:
    if (
        user.role != User.Role.TEACHER
        or not group.teachers.filter(user=user, is_active=True).exists()
    ):
        raise PermissionDenied(ONLY_ASSIGNED)


def full_name(student: Student) -> str:
    return f"{student.first_name} {student.last_name}"


def enrolled_students(group: Group):
    return Student.objects.filter(enrollments__group=group).order_by("last_name", "first_name")


class AttendanceSheetView(APIView):
    """Lista de asistencia de un grupo en una fecha (GET) y su registro inicial (POST)."""

    permission_classes = [IsInstitutionMember]

    def get(self, request):
        query = SheetQuerySerializer(data=request.query_params)
        query.is_valid(raise_exception=True)
        group = get_group(request.user, query.validated_data["group"])
        date = query.validated_data["date"]
        records = {
            r.student_id: r
            for r in AttendanceRecord.objects.filter(group=group, date=date).prefetch_related(
                "changes__changed_by"
            )
        }
        entries = []
        for student in enrolled_students(group):
            record = records.get(student.pk)
            entries.append(
                {
                    "student": student.pk,
                    "name": full_name(student),
                    "identification": student.identification,
                    "record": record.pk if record else None,
                    "status": record.status if record else None,
                    "changes": ChangeSerializer(record.changes.all(), many=True).data
                    if record
                    else [],
                }
            )
        return Response(
            {
                "group": group.pk,
                "group_code": group.code,
                "date": date,
                "recorded": bool(records),
                "can_edit": request.user.role == User.Role.TEACHER,
                "entries": entries,
            }
        )

    @transaction.atomic
    def post(self, request):
        data = SheetSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        group = get_group(request.user, data.validated_data["group"])
        require_assigned_teacher(request.user, group)
        date = data.validated_data["date"]
        if date > timezone.localdate():
            raise ValidationError({"date": ["La fecha no puede ser futura."]})
        if not group.period.start_date <= date <= group.period.end_date:
            raise ValidationError({"date": ["La fecha está fuera del periodo lectivo del grupo."]})
        if AttendanceRecord.objects.filter(group=group, date=date).exists():
            # HU10-E3 (CA18): no se duplica; la interfaz abre la lista en modo corrección.
            raise ConflictError(ALREADY_RECORDED)

        expected = set(Enrollment.objects.filter(group=group).values_list("student_id", flat=True))
        entries = {e["student"]: e["status"] for e in data.validated_data["entries"]}
        unknown = set(entries) - expected
        if unknown:
            raise ValidationError(
                {"entries": [f"El estudiante {min(unknown)} no pertenece al grupo."]}
            )
        if set(entries) != expected:
            raise ValidationError(
                {"entries": ["Marque el estado de todos los estudiantes del grupo."]}
            )
        try:
            with transaction.atomic():
                AttendanceRecord.objects.bulk_create(
                    AttendanceRecord(
                        group=group,
                        student_id=student,
                        date=date,
                        status=status,
                        recorded_by=request.user,
                    )
                    for student, status in entries.items()
                )
        except IntegrityError as exc:
            raise ConflictError(ALREADY_RECORDED) from exc
        return Response({"group": group.pk, "date": date, "recorded": len(entries)}, status=201)


class AttendanceCorrectionView(APIView):
    """HU10-E2: corrige una asistencia y conserva anterior, nuevo, motivo, autor y fecha."""

    permission_classes = [IsInstitutionMember]

    @transaction.atomic
    def post(self, request, pk):
        record = (
            AttendanceRecord.objects.select_for_update()
            .filter(pk=pk, group__in=visible_groups(request.user))
            .select_related("group")
            .first()
        )
        if record is None:
            raise NotFound()
        require_assigned_teacher(request.user, record.group)
        data = CorrectionSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        new_status = data.validated_data["status"]
        if new_status == record.status:
            raise ValidationError({"status": ["El nuevo estado debe ser distinto del actual."]})
        change = AttendanceChange.objects.create(
            record=record,
            previous_status=record.status,
            new_status=new_status,
            reason=data.validated_data["reason"],
            changed_by=request.user,
        )
        record.status = new_status
        record.save(update_fields=["status"])
        return Response(
            {"record": record.pk, "status": record.status, "change": ChangeSerializer(change).data}
        )


class GroupReportView(APIView):
    """HU11-E1 y HU11-E2: grupos con su docente y cantidad de estudiantes."""

    permission_classes = [IsInstitutionAdmin]

    def get(self, request):
        groups = (
            Group.objects.filter(institution=request.user.institution)
            .select_related("period")
            .prefetch_related("teachers__user")
            .annotate(student_count=Count("enrollments"))
        )
        level = request.query_params.get("level")
        if level:
            groups = groups.filter(level=level)
        period = request.query_params.get("period")
        if period:
            groups = groups.filter(period_id=period)
        rows = [
            {
                "id": g.pk,
                "code": g.code,
                "level": g.level,
                "period": g.period.name,
                "teachers": [f"{t.user.first_name} {t.user.last_name}" for t in g.teachers.all()],
                "student_count": g.student_count,
            }
            for g in groups
        ]
        return Response(rows)


class StudentReportView(APIView):
    """HU11-E2: estudiantes activos con su grupo del periodo vigente, por nivel o grupo."""

    permission_classes = [IsInstitutionAdmin]

    def get(self, request):
        institution = request.user.institution
        students = Student.objects.filter(institution=institution, is_active=True)
        level = request.query_params.get("level")
        if level:
            students = students.filter(level=level)
        group = request.query_params.get("group")
        if group:
            students = students.filter(
                enrollments__group_id=group, enrollments__group__institution=institution
            )
        current = institution.periods.filter(is_current=True).first()
        groups = {
            e.student_id: e.group.code
            for e in Enrollment.objects.filter(student__in=students, period=current).select_related(
                "group"
            )
        }
        rows = [
            {
                "id": s.pk,
                "identification": s.identification,
                "name": f"{s.last_name}, {s.first_name}",
                "level": s.level,
                "group": groups.get(s.pk),
            }
            for s in students.distinct()
        ]
        return Response(rows)


class AttendanceReportView(APIView):
    """HU12: resumen de asistencia de un grupo en un rango de fechas (docente: solo sus grupos)."""

    permission_classes = [IsInstitutionMember]

    def get(self, request):
        query = RangeSerializer(data=request.query_params)
        query.is_valid(raise_exception=True)
        group = get_group(request.user, query.validated_data["group"])
        start, end = query.validated_data["start"], query.validated_data["end"]
        records = AttendanceRecord.objects.filter(group=group, date__range=(start, end))
        dates = sorted(set(records.values_list("date", flat=True)))
        counts = {
            row["student"]: row
            for row in records.values("student").annotate(
                present=Count("pk", filter=Q(status=AttendanceRecord.Status.PRESENT)),
                absent=Count("pk", filter=Q(status=AttendanceRecord.Status.ABSENT)),
            )
        }
        students = []
        for student in enrolled_students(group):
            row = counts.get(student.pk, {"present": 0, "absent": 0})
            students.append(
                {
                    "student": student.pk,
                    "name": full_name(student),
                    "present": row["present"],
                    "absent": row["absent"],
                    "unrecorded": len(dates) - row["present"] - row["absent"],
                    "percentage": percentage(row["present"], row["present"] + row["absent"]),
                }
            )
        present = sum(s["present"] for s in students)
        absent = sum(s["absent"] for s in students)
        return Response(
            {
                "group": group.pk,
                "group_code": group.code,
                "start": start,
                "end": end,
                "dates": dates,
                "students": students,
                "totals": {
                    "present": present,
                    "absent": absent,
                    "percentage": percentage(present, present + absent),
                },
            }
        )


def percentage(part: int, total: int) -> float | None:
    return round(100 * part / total, 1) if total else None
