from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from core.exceptions import AccountDisabled, InvalidCredentials

from .models import User, normalize_email
from .serializers import LoginSerializer, UserSerializer


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    """HU01: inicia sesión con correo y contraseña y devuelve un token."""
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    email = normalize_email(serializer.validated_data["email"])
    user = User.objects.select_related("institution").filter(email=email).first()
    # Mismo mensaje para correo inexistente y contraseña incorrecta (RN07).
    if user is None or not user.check_password(serializer.validated_data["password"]):
        raise InvalidCredentials()
    if not user.is_active or (user.institution and not user.institution.is_active):
        raise AccountDisabled()

    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key, "user": UserSerializer(user).data})


@api_view(["POST"])
def logout(request):
    """HU02: elimina el token, de modo que deja de ser válido."""
    Token.objects.filter(user=request.user).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def me(request):
    return Response(UserSerializer(request.user).data)
