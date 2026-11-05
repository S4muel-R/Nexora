from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.db.models import Q


def normalize_email(email: str) -> str:
    return (email or "").strip().lower()


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("El correo es obligatorio.")
        user = self.model(email=normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", User.Role.PLATFORM_ADMIN)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Persona usuaria. Se identifica con su correo (HU01) y tiene un rol (RN01)."""

    class Role(models.TextChoices):
        PLATFORM_ADMIN = "platform_admin", "Administración de la plataforma"
        INSTITUTION_ADMIN = "institution_admin", "Personal administrativo"
        TEACHER = "teacher", "Personal docente"

    username = None
    email = models.EmailField("correo", unique=True)
    first_name = models.CharField("nombre", max_length=150)
    last_name = models.CharField("apellidos", max_length=150)
    role = models.CharField("rol", max_length=20, choices=Role.choices)
    institution = models.ForeignKey(
        "institutions.Institution",
        verbose_name="institución",
        on_delete=models.PROTECT,
        related_name="users",
        null=True,
        blank=True,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = UserManager()

    class Meta:
        verbose_name = "usuario"
        constraints = [
            models.CheckConstraint(
                condition=Q(role="platform_admin") | Q(institution__isnull=False),
                name="user_institution_required_unless_platform_admin",
            ),
        ]

    def save(self, *args, **kwargs):
        self.email = normalize_email(self.email)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.email
