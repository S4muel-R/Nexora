from django.conf import settings
from django.db import models


class AttendanceRecord(models.Model):
    """Asistencia de un estudiante en un grupo y fecha (RF07, HU10). Un solo registro por día."""

    class Status(models.TextChoices):
        PRESENT = "presente", "Presente"
        ABSENT = "ausente", "Ausente"

    group = models.ForeignKey(
        "academics.Group", on_delete=models.PROTECT, related_name="attendance"
    )
    student = models.ForeignKey(
        "students.Student", on_delete=models.PROTECT, related_name="attendance"
    )
    date = models.DateField("fecha")
    status = models.CharField("estado", max_length=10, choices=Status.choices)
    recorded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="+"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "asistencia"
        ordering = ["date", "student__last_name", "student__first_name"]
        constraints = [
            models.UniqueConstraint(
                fields=["group", "student", "date"], name="unique_attendance_per_day"
            ),
        ]

    def __str__(self) -> str:
        return f"{self.student} {self.date}: {self.status}"


class AttendanceChange(models.Model):
    """Corrección de asistencia: valor anterior, nuevo, motivo, autor y fecha (HU10-E2)."""

    record = models.ForeignKey(AttendanceRecord, on_delete=models.CASCADE, related_name="changes")
    previous_status = models.CharField("estado anterior", max_length=10)
    new_status = models.CharField("estado nuevo", max_length=10)
    reason = models.CharField("motivo", max_length=255)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="+"
    )
    changed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "corrección de asistencia"
        verbose_name_plural = "correcciones de asistencia"
        ordering = ["changed_at"]

    def __str__(self) -> str:
        return f"{self.previous_status} → {self.new_status}: {self.reason}"
