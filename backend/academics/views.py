from django.db import IntegrityError, transaction
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from accounts.models import User
from core.exceptions import ConflictError
from core.mixins import InstitutionScopedMixin
from core.permissions import IsInstitutionAdmin, IsInstitutionMember, TeacherReadOnly
from students.models import Student

from .models import AcademicPeriod, Enrollment, Group, Teacher
from .serializers import (
    AcademicPeriodSerializer,
    GroupSerializer,
    StudentIdsSerializer,
    TeacherIdsSerializer,
    TeacherSerializer,
    TransferSerializer,
)

ALREADY_ENROLLED = "El estudiante ya pertenece a un grupo en este periodo."


class ScopedViewSet(
    InstitutionScopedMixin,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """Base sin borrado (RN06): los registros se desactivan o se corrigen."""


class AcademicPeriodViewSet(ScopedViewSet):
    """HU05-E5: periodos lectivos de la institución."""

    queryset = AcademicPeriod.objects.all()
    serializer_class = AcademicPeriodSerializer
    permission_classes = [IsInstitutionMember, TeacherReadOnly]

    def perform_create(self, serializer):
        try:
            super().perform_create(serializer)
        except IntegrityError as exc:
            raise ConflictError("Ya existe un periodo lectivo con ese nombre.") from exc


class TeacherViewSet(ScopedViewSet):
    """HU08: docentes de la institución y sus cuentas. Solo el personal administrativo."""

    queryset = Teacher.objects.select_related("user")
    serializer_class = TeacherSerializer
    permission_classes = [IsInstitutionAdmin]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == "list" and self.request.query_params.get("include_inactive") != "true":
            queryset = queryset.filter(is_active=True)
        return queryset


class GroupViewSet(ScopedViewSet):
    """HU09: grupos de la institución. El personal docente solo ve sus grupos (CA16)."""

    queryset = Group.objects.select_related("period").prefetch_related("teachers__user")
    serializer_class = GroupSerializer
    permission_classes = [IsInstitutionMember, TeacherReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.role == User.Role.TEACHER:
            queryset = queryset.filter(teachers__user=self.request.user, teachers__is_active=True)
        period = self.request.query_params.get("period")
        if self.action == "list" and period:
            queryset = queryset.filter(period_id=period)
        return queryset.distinct()

    def perform_create(self, serializer):
        try:
            super().perform_create(serializer)
        except IntegrityError as exc:
            raise ConflictError("Ya existe un grupo con ese código en este periodo.") from exc

    def _student(self, student_id: int) -> Student:
        student = Student.objects.filter(
            institution=self.request.user.institution, pk=student_id
        ).first()
        if student is None:
            # CA14: un estudiante de otra institución no existe para esta institución (RN02).
            raise ValidationError({"students": [f"El estudiante {student_id} no existe."]})
        return student

    def _detail(self, group: Group) -> Response:
        return Response(self.get_serializer(group).data)

    @action(detail=True, methods=["post"], url_path="students")
    @transaction.atomic
    def add_students(self, request, pk=None):
        """HU09-E1: asigna estudiantes activos del mismo nivel que no tengan grupo en el periodo."""
        group = self.get_object()
        data = StudentIdsSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        for student_id in data.validated_data["students"]:
            student = self._student(student_id)
            if not student.is_active:
                raise ValidationError({"students": [f"{student} está desactivado."]})
            if student.level != group.level:
                raise ValidationError(
                    {"students": [f"El nivel de {student} no coincide con el del grupo."]}
                )
            if Enrollment.objects.filter(student=student, period=group.period).exists():
                raise ConflictError(ALREADY_ENROLLED)
            try:
                with transaction.atomic():
                    Enrollment.objects.create(group=group, student=student)
            except IntegrityError as exc:
                raise ConflictError(ALREADY_ENROLLED) from exc
        return self._detail(group)

    @action(detail=True, methods=["delete"], url_path=r"students/(?P<student_id>\d+)")
    def remove_student(self, request, pk=None, student_id=None):
        group = self.get_object()
        deleted, _ = Enrollment.objects.filter(group=group, student_id=student_id).delete()
        if not deleted:
            raise ValidationError({"students": ["El estudiante no pertenece al grupo."]})
        return self._detail(group)

    @action(detail=True, methods=["post"])
    @transaction.atomic
    def transfer(self, request, pk=None):
        """HU09-E2: traslada un estudiante a otro grupo del mismo periodo y nivel."""
        group = self.get_object()
        data = TransferSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        enrollment = Enrollment.objects.filter(
            group=group, student_id=data.validated_data["student"]
        ).first()
        if enrollment is None:
            raise ValidationError({"student": ["El estudiante no pertenece al grupo."]})
        target = self.get_queryset().filter(pk=data.validated_data["target_group"]).first()
        if target is None or target.pk == group.pk:
            raise ValidationError({"target_group": ["Seleccione otro grupo de la institución."]})
        if target.period_id != group.period_id or target.level != group.level:
            raise ValidationError(
                {"target_group": ["El grupo destino debe ser del mismo periodo y nivel."]}
            )
        enrollment.group = target
        enrollment.save()
        return self._detail(group)

    @action(detail=True, methods=["post"], url_path="teachers")
    def add_teachers(self, request, pk=None):
        """HU09-E1 y CA15: asigna docentes activos de la institución."""
        group = self.get_object()
        data = TeacherIdsSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        for teacher_id in data.validated_data["teachers"]:
            teacher = Teacher.objects.filter(
                institution=request.user.institution, pk=teacher_id
            ).first()
            if teacher is None:
                raise ValidationError({"teachers": [f"El docente {teacher_id} no existe."]})
            if not teacher.is_active:
                # HU08-E2: un docente desactivado no recibe asignaciones nuevas.
                raise ValidationError({"teachers": [f"{teacher} está desactivado."]})
            group.teachers.add(teacher)
        return self._detail(group)

    @action(detail=True, methods=["delete"], url_path=r"teachers/(?P<teacher_id>\d+)")
    def remove_teacher(self, request, pk=None, teacher_id=None):
        group = self.get_object()
        teacher = group.teachers.filter(pk=teacher_id).first()
        if teacher is None:
            raise ValidationError({"teachers": ["El docente no está asignado al grupo."]})
        group.teachers.remove(teacher)
        return Response(self.get_serializer(group).data, status=status.HTTP_200_OK)
