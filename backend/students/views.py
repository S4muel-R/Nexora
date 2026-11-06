from django.db import IntegrityError
from django.db.models import Q
from rest_framework import mixins, viewsets

from core.exceptions import ConflictError
from core.mixins import InstitutionScopedMixin
from core.permissions import IsInstitutionMember, TeacherReadOnly

from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(
    InstitutionScopedMixin,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """HU07: estudiantes de la institución del usuario. No se eliminan: se desactivan (RN06)."""

    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsInstitutionMember, TeacherReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == "list":
            if self.request.query_params.get("include_inactive") != "true":
                queryset = queryset.filter(is_active=True)
            search = self.request.query_params.get("search", "").strip()
            if search:
                queryset = queryset.filter(
                    Q(first_name__icontains=search)
                    | Q(last_name__icontains=search)
                    | Q(identification__icontains=search)
                )
        return queryset

    def perform_create(self, serializer):
        try:
            super().perform_create(serializer)
        except IntegrityError as exc:
            # Respaldo ante solicitudes simultáneas: la restricción de la BD garantiza RN04.
            raise ConflictError("Ya existe un estudiante con esa identificación.") from exc
