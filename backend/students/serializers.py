import re

from django.utils import timezone
from rest_framework import serializers

from core.exceptions import ConflictError

from .models import Student

IDENTIFICATION_PATTERN = re.compile(r"^[A-Za-z0-9-]{5,20}$")
BIRTH_DATE_MESSAGE = "Ingrese una fecha de nacimiento válida."


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "identification",
            "first_name",
            "last_name",
            "birth_date",
            "level",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        # Sin un valor por defecto explícito, DRF interpreta un booleano ausente en datos de
        # formulario como False y el estudiante quedaba inactivo al registrarse (ADLCDS-103).
        extra_kwargs = {
            "is_active": {"default": True},
            # Mensajes claros en lugar del texto técnico de DRF sobre formatos (ADLCDS-104, RNF04).
            "birth_date": {
                "error_messages": {
                    "required": BIRTH_DATE_MESSAGE,
                    "null": BIRTH_DATE_MESSAGE,
                    "invalid": BIRTH_DATE_MESSAGE,
                }
            },
        }

    @property
    def institution(self):
        return self.context["request"].user.institution

    def validate_identification(self, value: str) -> str:
        identification = value.strip()
        if not IDENTIFICATION_PATTERN.match(identification):
            raise serializers.ValidationError(
                "Debe tener entre 5 y 20 caracteres: letras, números o guiones."
            )
        duplicates = Student.objects.filter(
            institution=self.institution, identification__iexact=identification
        )
        if self.instance:
            duplicates = duplicates.exclude(pk=self.instance.pk)
        if duplicates.exists():
            raise ConflictError("Ya existe un estudiante con esa identificación.")
        return identification

    def validate_first_name(self, value: str) -> str:
        return value.strip()

    def validate_last_name(self, value: str) -> str:
        return value.strip()

    def validate_birth_date(self, value):
        if value > timezone.localdate():
            raise serializers.ValidationError("La fecha de nacimiento no puede ser futura.")
        return value

    def validate_level(self, value: str) -> str:
        if value not in self.institution.levels:
            raise serializers.ValidationError("El nivel no pertenece a la institución.")
        return value
