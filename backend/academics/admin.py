from django.contrib import admin

from .models import AcademicPeriod, Enrollment, Group, Teacher

admin.site.register([AcademicPeriod, Teacher, Group, Enrollment])
