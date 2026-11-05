from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from accounts.models import User, normalize_email
from core.exceptions import ConflictError

from .models import LEVEL_ORDER, Institution


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = [
            "id",
            "name",
            "levels",
            "address",
            "phone",
            "email",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_active", "created_at", "updated_at"]

    def validate_name(self, value: str) -> str:
        name = value.strip()
        if not name:
            raise serializers.ValidationError("El nombre es obligatorio.")
        duplicates = Institution.objects.filter(name__iexact=name)
        if self.instance:
            duplicates = duplicates.exclude(pk=self.instance.pk)
        if duplicates.exists():
            raise ConflictError("Ya existe una institución con ese nombre.")
        return name

    def validate_levels(self, value) -> list[str]:
        if not isinstance(value, list) or not value:
            raise serializers.ValidationError("Seleccione al menos un nivel.")
        invalid = [level for level in value if level not in LEVEL_ORDER]
        if invalid:
            raise serializers.ValidationError(f"Nivel no válido: {', '.join(map(str, invalid))}.")
        if len(set(value)) != len(value):
            raise serializers.ValidationError("Hay niveles repetidos.")
        return [level for level in LEVEL_ORDER if level in value]

    def validate(self, attrs):
        if self.instance and "levels" in attrs:
            removed = set(self.instance.levels) - set(attrs["levels"])
            in_use = self.instance.students.filter(is_active=True, level__in=removed).exists()
            if removed and in_use:
                raise serializers.ValidationError(
                    {"levels": ["No se puede quitar un nivel con estudiantes activos."]}
                )
        return attrs


class InstitutionAdminSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate_email(self, value: str) -> str:
        email = normalize_email(value)
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Ya existe una cuenta con ese correo.")
        return email

    def validate_password(self, value: str) -> str:
        validate_password(value)
        return value


class InstitutionCreateSerializer(InstitutionSerializer):
    """HU04: registra la institución junto con su persona administradora."""

    admin = InstitutionAdminSerializer(write_only=True)

    class Meta(InstitutionSerializer.Meta):
        fields = [*InstitutionSerializer.Meta.fields, "admin"]

    @transaction.atomic
    def create(self, validated_data):
        admin_data = validated_data.pop("admin")
        institution = Institution.objects.create(**validated_data)
        User.objects.create_user(
            institution=institution, role=User.Role.INSTITUTION_ADMIN, **admin_data
        )
        return institution
