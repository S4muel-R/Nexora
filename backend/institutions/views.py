from rest_framework import generics, mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.models import User
from core.permissions import IsInstitutionMember, IsPlatformAdmin, TeacherReadOnly

from .models import Institution
from .serializers import InstitutionCreateSerializer, InstitutionSerializer


class InstitutionViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """HU04: gestión de instituciones por la administración de la plataforma.

    Para cualquier otro rol el queryset está vacío, así que el detalle responde 404 (HU06-E4).
    """

    queryset = Institution.objects.all()

    def get_permissions(self):
        if self.action in {"list", "create"}:
            return [IsPlatformAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.role == User.Role.PLATFORM_ADMIN:
            return super().get_queryset()
        return Institution.objects.none()

    def get_serializer_class(self):
        return InstitutionCreateSerializer if self.action == "create" else InstitutionSerializer


class MyInstitutionView(generics.RetrieveUpdateAPIView):
    """HU05: el personal de una institución consulta sus datos; el administrativo los actualiza."""

    serializer_class = InstitutionSerializer
    permission_classes = [IsInstitutionMember, TeacherReadOnly]

    def get_object(self):
        return self.request.user.institution
