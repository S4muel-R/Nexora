from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from accounts import views as accounts_views
from core.views import health
from institutions.views import InstitutionViewSet, MyInstitutionView
from students.views import StudentViewSet

router = DefaultRouter()
router.register("institutions", InstitutionViewSet, basename="institution")
router.register("students", StudentViewSet, basename="student")

api_patterns = [
    path("health/", health, name="health"),
    path("auth/login/", accounts_views.login, name="login"),
    path("auth/logout/", accounts_views.logout, name="logout"),
    path("auth/me/", accounts_views.me, name="me"),
    path("my-institution/", MyInstitutionView.as_view(), name="my-institution"),
    path("", include(router.urls)),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_patterns)),
]
