from django.contrib.auth import login as start_session
from django.contrib.auth import logout as end_session
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from core.exceptions import AccountDisabled, InvalidCredentials

from .models import User, normalize_email
from .serializers import LoginSerializer, UserSerializer


# INC-007: sin autenticación previa, para que un token anterior inválido no impida iniciar sesión.
@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def login(request):
    """HU01: inicia sesión con correo y contraseña; la sesión queda en una cookie HttpOnly."""
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    email = normalize_email(serializer.validated_data["email"])
    user = User.objects.select_related("institution").filter(email=email).first()
    # Mismo mensaje para correo inexistente y contraseña incorrecta (RN07).
    if user is None or not user.check_password(serializer.validated_data["password"]):
        raise InvalidCredentials()
    if not user.is_active or (user.institution and not user.institution.is_active):
        raise AccountDisabled()

    start_session(request._request, user)
    return Response({"user": UserSerializer(user).data})


@api_view(["POST"])
def logout(request):
    """HU02: cierra la sesión en el servidor y elimina la cookie, de modo que deja de ser válida."""
    end_session(request._request)
    return Response(status=status.HTTP_204_NO_CONTENT)


@ensure_csrf_cookie
@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def csrf(request):
    """Entrega la cookie `csrftoken` que la interfaz envía en X-CSRFToken en cada escritura."""
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def me(request):
    return Response(UserSerializer(request.user).data)
