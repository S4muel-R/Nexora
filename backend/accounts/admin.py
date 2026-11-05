from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class NexoraUserAdmin(UserAdmin):
    ordering = ["email"]
    list_display = ["email", "first_name", "last_name", "role", "institution", "is_active"]
    list_filter = ["role", "is_active", "institution"]
    search_fields = ["email", "first_name", "last_name"]
    fieldsets = [
        (None, {"fields": ["email", "password"]}),
        ("Datos personales", {"fields": ["first_name", "last_name"]}),
        ("Acceso", {"fields": ["role", "institution", "is_active", "is_staff", "is_superuser"]}),
    ]
    add_fieldsets = [
        (
            None,
            {
                "fields": [
                    "email",
                    "first_name",
                    "last_name",
                    "role",
                    "institution",
                    "password1",
                    "password2",
                ]
            },
        ),
    ]
