"""Middleware propio de Nexora."""

from django.conf import settings


def keep_session_cookie_on_logout(get_response):
    """INC-012: la respuesta del cierre de sesión no borra la cookie de sesión del navegador.

    El cierre elimina la sesión en el servidor, así que la cookie que queda ya no sirve (HU02-E3).
    Si su respuesta llegara después de un nuevo inicio de sesión, borrar la cookie eliminaría la
    sesión nueva. Debe ir antes de `SessionMiddleware` para actuar después de él sobre la respuesta.
    """

    def middleware(request):
        response = get_response(request)
        match = getattr(request, "resolver_match", None)
        name = settings.SESSION_COOKIE_NAME
        if match and match.url_name == "logout" and name in response.cookies:
            if response.cookies[name].value == "":
                del response.cookies[name]
        return response

    return middleware
