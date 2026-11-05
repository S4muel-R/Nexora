from django.db import models
from django.db.models.functions import Lower


class Level(models.TextChoices):
    PRESCHOOL = "preescolar", "Preescolar"
    PRIMARY = "primaria", "Primaria"
    SECONDARY = "secundaria", "Secundaria"


LEVEL_ORDER = [choice.value for choice in Level]


class Institution(models.Model):
    """Kínder, escuela o colegio (RF03).

    Sus niveles determinan los niveles válidos de sus estudiantes.
    """

    name = models.CharField("nombre", max_length=150)
    levels = models.JSONField("niveles", default=list)
    address = models.CharField("dirección", max_length=255, blank=True)
    phone = models.CharField("teléfono", max_length=30, blank=True)
    email = models.EmailField("correo", blank=True)
    is_active = models.BooleanField("activa", default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "institución"
        verbose_name_plural = "instituciones"
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(Lower("name"), name="unique_institution_name_ci"),
        ]

    def __str__(self) -> str:
        return self.name
