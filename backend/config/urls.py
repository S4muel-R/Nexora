from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from academics.views import AcademicPeriodViewSet, GroupViewSet, TeacherViewSet
from accounts import views as accounts_views
from attendance import views as attendance_views
from core.views import health
from institutions.views import InstitutionViewSet, MyInstitutionView
from students.views import StudentViewSet

router = DefaultRouter()
router.register("institutions", InstitutionViewSet, basename="institution")
router.register("students", StudentViewSet, basename="student")
router.register("periods", AcademicPeriodViewSet, basename="period")
router.register("teachers", TeacherViewSet, basename="teacher")
router.register("groups", GroupViewSet, basename="group")

api_patterns = [
    path("health/", health, name="health"),
    path("auth/login/", accounts_views.login, name="login"),
    path("auth/logout/", accounts_views.logout, name="logout"),
    path("auth/me/", accounts_views.me, name="me"),
    path("auth/csrf/", accounts_views.csrf, name="csrf"),
    path("my-institution/", MyInstitutionView.as_view(), name="my-institution"),
    path("attendance/", attendance_views.AttendanceSheetView.as_view(), name="attendance"),
    path(
        "attendance/<int:pk>/correct/",
        attendance_views.AttendanceCorrectionView.as_view(),
        name="attendance-correct",
    ),
    path("reports/groups/", attendance_views.GroupReportView.as_view(), name="report-groups"),
    path("reports/students/", attendance_views.StudentReportView.as_view(), name="report-students"),
    path(
        "reports/attendance/",
        attendance_views.AttendanceReportView.as_view(),
        name="report-attendance",
    ),
    path("", include(router.urls)),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_patterns)),
]
