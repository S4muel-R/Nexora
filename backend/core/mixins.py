"""Aislamiento de información por institución (nota técnica S1-07, alternativa C)."""


class InstitutionScopedMixin:
    """Filtra el queryset por la institución del usuario autenticado y la asigna al crear.

    Un registro de otra institución no forma parte del queryset, por lo que DRF responde 404 (RN02).
    La institución nunca se toma de los datos enviados por el cliente.
    """

    def get_queryset(self):
        return super().get_queryset().filter(institution=self.request.user.institution)

    def perform_create(self, serializer):
        serializer.save(institution=self.request.user.institution)
