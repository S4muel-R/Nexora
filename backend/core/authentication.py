from rest_framework.authentication import SessionAuthentication


class CookieSessionAuthentication(SessionAuthentication):
    """Sesión de Django en cookie HttpOnly con protección CSRF (avance 1, sección 7.1; INC-006).

    Responde 401 en lugar de 403 cuando no hay sesión, para que la interfaz distinga
    "sesión vencida" de "sin permiso" (HU02-E3).
    """

    def authenticate_header(self, request):
        return "Session"
