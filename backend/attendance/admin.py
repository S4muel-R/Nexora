from django.contrib import admin

from .models import AttendanceChange, AttendanceRecord

admin.site.register([AttendanceRecord, AttendanceChange])
