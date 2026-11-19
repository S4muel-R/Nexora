from rest_framework import serializers

from .models import AttendanceChange, AttendanceRecord

DATE_ORDER = "La fecha inicial debe ser anterior o igual a la final."


class EntrySerializer(serializers.Serializer):
    student = serializers.IntegerField()
    status = serializers.ChoiceField(choices=AttendanceRecord.Status.choices)


class SheetQuerySerializer(serializers.Serializer):
    group = serializers.IntegerField()
    date = serializers.DateField()


class SheetSerializer(SheetQuerySerializer):
    """HU10-E1: asistencia de todos los estudiantes del grupo en una fecha."""

    entries = EntrySerializer(many=True, allow_empty=False)


class CorrectionSerializer(serializers.Serializer):
    """HU10-E2 y HU10-E4: nuevo estado y motivo obligatorio."""

    status = serializers.ChoiceField(choices=AttendanceRecord.Status.choices)
    reason = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
        error_messages={"max_length": "El motivo no puede superar 255 caracteres."},
    )

    def validate_reason(self, value: str) -> str:
        reason = value.strip()
        if not reason:
            raise serializers.ValidationError("El motivo es obligatorio.")
        return reason

    def validate(self, attrs):
        if "reason" not in attrs:
            raise serializers.ValidationError({"reason": ["El motivo es obligatorio."]})
        return attrs


class ChangeSerializer(serializers.ModelSerializer):
    changed_by = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceChange
        fields = ["previous_status", "new_status", "reason", "changed_by", "changed_at"]

    def get_changed_by(self, change) -> str:
        return change.changed_by.email


class RangeSerializer(serializers.Serializer):
    group = serializers.IntegerField()
    start = serializers.DateField()
    end = serializers.DateField()

    def validate(self, attrs):
        if attrs["start"] > attrs["end"]:
            raise serializers.ValidationError({"end": [DATE_ORDER]})
        return attrs
