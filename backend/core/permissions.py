"""Permisos por rol (RN01). El aislamiento por institución lo aplica InstitutionScopedMixin."""

from rest_framework.permissions import SAFE_METHODS, BasePermission

from accounts.models import User


def _role(request) -> str | None:
    user = request.user
    return getattr(user, "role", None) if user and user.is_authenticated else None


class IsPlatformAdmin(BasePermission):
    def has_permission(self, request, view) -> bool:
        return _role(request) == User.Role.PLATFORM_ADMIN


class IsInstitutionMember(BasePermission):
    """Personal administrativo o docente de una institución."""

    def has_permission(self, request, view) -> bool:
        return _role(request) in {User.Role.INSTITUTION_ADMIN, User.Role.TEACHER}


class TeacherReadOnly(BasePermission):
    """El personal docente solo consulta; el administrativo puede modificar."""

    def has_permission(self, request, view) -> bool:
        if request.method in SAFE_METHODS:
            return True
        return _role(request) == User.Role.INSTITUTION_ADMIN
