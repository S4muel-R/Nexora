from django.db import models


class Student(models.Model):
    """Estudiante de una institución (RF04).

    La identificación es única dentro de la institución (RN04).
    """

    institution = models.ForeignKey(
        "institutions.Institution", on_delete=models.PROTECT, related_name="students"
    )
    identification = models.CharField("identificación", max_length=20)
    first_name = models.CharField("nombre", max_length=100)
    last_name = models.CharField("apellidos", max_length=100)
    birth_date = models.DateField("fecha de nacimiento")
    level = models.CharField("nivel", max_length=20)
    is_active = models.BooleanField("activo", default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "estudiante"
        ordering = ["last_name", "first_name"]
        constraints = [
            models.UniqueConstraint(
                fields=["institution", "identification"],
                name="unique_student_identification_per_institution",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.last_name}, {self.first_name}"
