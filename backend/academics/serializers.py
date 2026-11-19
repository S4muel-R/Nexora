from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from accounts.models import User, normalize_email
from core.exceptions import ConflictError
from students.models import Student

from .models import AcademicPeriod, Group, Teacher


class InstitutionContextMixin:
    @property
    def institution(self):
        return self.context["request"].user.institution


class AcademicPeriodSerializer(InstitutionContextMixin, serializers.ModelSerializer):
    """HU05-E5: periodo lectivo; al marcar uno como vigente, los demás dejan de serlo."""

    class Meta:
        model = AcademicPeriod
        fields = ["id", "name", "start_date", "end_date", "is_current"]
        read_only_fields = ["id"]

    def validate_name(self, value: str) -> str:
        name = value.strip()
        if not name:
            raise serializers.ValidationError("El nombre es obligatorio.")
        duplicates = AcademicPeriod.objects.filter(institution=self.institution, name__iexact=name)
        if self.instance:
            duplicates = duplicates.exclude(pk=self.instance.pk)
        if duplicates.exists():
            raise ConflictError("Ya existe un periodo lectivo con ese nombre.")
        return name

    def validate(self, attrs):
        start = attrs.get("start_date", getattr(self.instance, "start_date", None))
        end = attrs.get("end_date", getattr(self.instance, "end_date", None))
        if start and end and start > end:
            raise serializers.ValidationError(
                {"end_date": ["La fecha de fin debe ser posterior o igual a la de inicio."]}
            )
        return attrs

    @transaction.atomic
    def save(self, **kwargs):
        period = super().save(**kwargs)
        if period.is_current:
            AcademicPeriod.objects.filter(institution=period.institution).exclude(
                pk=period.pk
            ).update(is_current=False)
        return period


class TeacherSerializer(InstitutionContextMixin, serializers.ModelSerializer):
    """HU08: docente con su cuenta de rol docente. Desactivarlo también desactiva su cuenta."""

    first_name = serializers.CharField(source="user.first_name", max_length=150)
    last_name = serializers.CharField(source="user.last_name", max_length=150)
    email = serializers.EmailField(source="user.email")
    password = serializers.CharField(
        write_only=True, required=False, trim_whitespace=False, style={"input_type": "password"}
    )

    class Meta:
        model = Teacher
        fields = ["id", "first_name", "last_name", "email", "password", "is_active"]
        read_only_fields = ["id"]
        extra_kwargs = {"is_active": {"default": True}}

    def validate_email(self, value: str) -> str:
        email = normalize_email(value)
        duplicates = User.objects.filter(email=email)
        if self.instance:
            duplicates = duplicates.exclude(pk=self.instance.user_id)
        if duplicates.exists():
            raise ConflictError("Ya existe una cuenta con ese correo.")
        return email

    def validate_first_name(self, value: str) -> str:
        return value.strip()

    def validate_last_name(self, value: str) -> str:
        return value.strip()

    def validate(self, attrs):
        if not self.instance and not attrs.get("password"):
            raise serializers.ValidationError(
                {"password": ["La contraseña inicial es obligatoria."]}
            )
        if attrs.get("password"):
            validate_password(attrs["password"])
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop("institution", None)
        user_data = validated_data.pop("user")
        password = validated_data.pop("password")
        user = User.objects.create_user(
            password=password,
            role=User.Role.TEACHER,
            institution=self.institution,
            is_active=validated_data.get("is_active", True),
            **user_data,
        )
        return Teacher.objects.create(institution=self.institution, user=user, **validated_data)

    @transaction.atomic
    def update(self, instance, validated_data):
        user = instance.user
        for field, value in validated_data.pop("user", {}).items():
            setattr(user, field, value)
        if "password" in validated_data:
            user.set_password(validated_data.pop("password"))
        if "is_active" in validated_data:
            # HU08-E2 (RN06): un docente desactivado no puede iniciar sesión.
            user.is_active = validated_data["is_active"]
        user.save()
        return super().update(instance, validated_data)


class PersonSummarySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.SerializerMethodField()

    def get_name(self, obj) -> str:
        if isinstance(obj, Teacher):
            return f"{obj.user.first_name} {obj.user.last_name}"
        return f"{obj.first_name} {obj.last_name}"


class StudentSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["id", "identification", "first_name", "last_name", "level", "is_active"]


class GroupSerializer(InstitutionContextMixin, serializers.ModelSerializer):
    """HU09: grupo de un nivel en un periodo, con sus docentes y estudiantes."""

    period_name = serializers.CharField(source="period.name", read_only=True)
    teachers = serializers.SerializerMethodField()
    students = serializers.SerializerMethodField()
    student_count = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = [
            "id",
            "code",
            "level",
            "period",
            "period_name",
            "teachers",
            "students",
            "student_count",
        ]
        read_only_fields = ["id"]

    def get_teachers(self, group) -> list[dict]:
        return PersonSummarySerializer(group.teachers.select_related("user"), many=True).data

    def get_students(self, group) -> list[dict]:
        students = Student.objects.filter(enrollments__group=group).order_by(
            "last_name", "first_name"
        )
        return StudentSummarySerializer(students, many=True).data

    def get_student_count(self, group) -> int:
        return group.enrollments.count()

    def validate_period(self, period):
        if period.institution_id != self.institution.id:
            raise serializers.ValidationError("El periodo no pertenece a la institución.")
        return period

    def validate_level(self, value: str) -> str:
        if value not in self.institution.levels:
            raise serializers.ValidationError("El nivel no pertenece a la institución.")
        return value

    def validate(self, attrs):
        code = attrs.get("code", getattr(self.instance, "code", "")).strip()
        if not code:
            raise serializers.ValidationError({"code": ["El código es obligatorio."]})
        attrs["code"] = code
        period = attrs.get("period", getattr(self.instance, "period", None))
        duplicates = Group.objects.filter(period=period, code__iexact=code)
        if self.instance:
            duplicates = duplicates.exclude(pk=self.instance.pk)
        if duplicates.exists():
            # HU09-E4 (CA12).
            raise ConflictError("Ya existe un grupo con ese código en este periodo.")
        return attrs


class StudentIdsSerializer(serializers.Serializer):
    students = serializers.ListField(child=serializers.IntegerField(), allow_empty=False)


class TeacherIdsSerializer(serializers.Serializer):
    teachers = serializers.ListField(child=serializers.IntegerField(), allow_empty=False)


class TransferSerializer(serializers.Serializer):
    student = serializers.IntegerField()
    target_group = serializers.IntegerField()
