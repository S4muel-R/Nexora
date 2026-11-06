"""Formato único de errores de la API (Estándares, sección 3)."""

import logging

from rest_framework import exceptions, status
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)

DEFAULT_MESSAGES = {
    status.HTTP_400_BAD_REQUEST: "Los datos enviados no son válidos.",
    status.HTTP_401_UNAUTHORIZED: "Debe iniciar sesión.",
    status.HTTP_403_FORBIDDEN: "No tiene permiso para realizar esta acción.",
    status.HTTP_404_NOT_FOUND: "El recurso no existe.",
    status.HTTP_405_METHOD_NOT_ALLOWED: "Método no permitido.",
    status.HTTP_409_CONFLICT: "El registro ya existe.",
}


class ConflictError(exceptions.APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = DEFAULT_MESSAGES[status.HTTP_409_CONFLICT]
    default_code = "conflict"


def _error(code: str, message: str, fields: dict | None, http_status: int) -> Response:
    body = {"error": {"code": code, "message": message}}
    if fields:
        body["error"]["fields"] = fields
    return Response(body, status=http_status)


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        logger.exception("Error no controlado en %s", context.get("view"))
        return _error(
            "server_error",
            "Ocurrió un error inesperado. Intente de nuevo.",
            None,
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if isinstance(exc, exceptions.ValidationError):
        detail = exc.detail if isinstance(exc.detail, dict) else {"non_field_errors": exc.detail}
        return _error(
            "validation_error",
            DEFAULT_MESSAGES[status.HTTP_400_BAD_REQUEST],
            detail,
            response.status_code,
        )

    code = exc.get_codes() if isinstance(exc, exceptions.APIException) else "error"
    if not isinstance(code, str):
        code = "error"
    message = DEFAULT_MESSAGES.get(response.status_code, str(getattr(exc, "detail", exc)))
    return _error(code, message, None, response.status_code)
