from django.contrib import admin

from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = [
        "identification",
        "last_name",
        "first_name",
        "level",
        "institution",
        "is_active",
    ]
    list_filter = ["institution", "level", "is_active"]
    search_fields = ["identification", "first_name", "last_name"]
