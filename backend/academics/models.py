from django.conf import settings
from django.db import models
from django.db.models.functions import Lower


class AcademicPeriod(models.Model):
    """Periodo lectivo de una institución (RF03, HU05-E5). Solo uno es el vigente."""

    institution = models.ForeignKey(
        "institutions.Institution", on_delete=models.PROTECT, related_name="periods"
    )
    name = models.CharField("nombre", max_length=50)
    start_date = models.DateField("inicio")
    end_date = models.DateField("fin")
    is_current = models.BooleanField("vigente", default=False)

    class Meta:
        verbose_name = "periodo lectivo"
        verbose_name_plural = "periodos lectivos"
        ordering = ["-start_date"]
        constraints = [
            models.UniqueConstraint(
                "institution", Lower("name"), name="unique_period_name_per_institution"
            ),
        ]

    def __str__(self) -> str:
        return self.name


class Teacher(models.Model):
    """Docente de una institución, vinculado a su cuenta de rol docente (RF05, HU08)."""

    institution = models.ForeignKey(
        "institutions.Institution", on_delete=models.PROTECT, related_name="teachers"
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="teacher_profile"
    )
    is_active = models.BooleanField("activo", default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "docente"
        ordering = ["user__last_name", "user__first_name"]

    def __str__(self) -> str:
        return f"{self.user.last_name}, {self.user.first_name}"


class Group(models.Model):
    """Grupo de un nivel en un periodo (RF06, HU09). El código no se repite en el periodo."""

    institution = models.ForeignKey(
        "institutions.Institution", on_delete=models.PROTECT, related_name="groups"
    )
    period = models.ForeignKey(AcademicPeriod, on_delete=models.PROTECT, related_name="groups")
    code = models.CharField("código", max_length=20)
    level = models.CharField("nivel", max_length=20)
    teachers = models.ManyToManyField(Teacher, related_name="groups", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "grupo"
        ordering = ["period__start_date", "code"]
        constraints = [
            models.UniqueConstraint("period", Lower("code"), name="unique_group_code_per_period"),
        ]

    def __str__(self) -> str:
        return f"{self.code} ({self.period})"


class Enrollment(models.Model):
    """Estudiante asignado a un grupo. Un estudiante pertenece a un solo grupo por periodo."""

    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="enrollments")
    student = models.ForeignKey(
        "students.Student", on_delete=models.PROTECT, related_name="enrollments"
    )
    period = models.ForeignKey(AcademicPeriod, on_delete=models.PROTECT, related_name="+")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "asignación de estudiante"
        verbose_name_plural = "asignaciones de estudiantes"
        constraints = [
            models.UniqueConstraint(
                fields=["student", "period"], name="unique_student_group_per_period"
            ),
        ]

    def __str__(self) -> str:
        return f"{self.student} en {self.group}"

    def save(self, *args, **kwargs):
        self.period_id = self.group.period_id
        super().save(*args, **kwargs)
