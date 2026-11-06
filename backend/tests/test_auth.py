"""HU01 Iniciar sesión · HU02 Cerrar sesión (RF01)."""

import pytest
from django.conf import settings
from django.urls import reverse
from rest_framework.test import APIClient

from accounts.models import User

from .conftest import PASSWORD

pytestmark = pytest.mark.django_db

LOGIN = reverse("login")


def test_hu01_e1_inicio_de_sesion_exitoso(api_client, robles_admin):
    response = api_client.post(LOGIN, {"email": "admin@robles.test", "password": PASSWORD})

    assert response.status_code == 200
    body = response.json()
    assert "token" not in body
    assert body["user"]["role"] == "institution_admin"
    assert body["user"]["institution"]["name"] == "Escuela Los Robles"
    assert "password" not in body["user"]


def test_inc_007_sesion_anterior_invalida_no_impide_iniciar_sesion(api_client, robles_admin):
    api_client.cookies[settings.SESSION_COOKIE_NAME] = "sesion-anterior-invalida"
    api_client.credentials(HTTP_AUTHORIZATION="Token token-de-una-version-anterior")

    response = api_client.post(LOGIN, {"email": "admin@robles.test", "password": PASSWORD})

    assert response.status_code == 200
    assert api_client.get(reverse("me")).json()["email"] == "admin@robles.test"


def test_inc_006_sesion_en_cookie_httponly_samesite(api_client, robles_admin):
    response = api_client.post(LOGIN, {"email": "admin@robles.test", "password": PASSWORD})

    cookie = response.cookies[settings.SESSION_COOKIE_NAME]
    assert cookie.value
    assert cookie["httponly"]
    assert cookie["samesite"] == "Lax"
    assert api_client.get(reverse("me")).status_code == 200


def test_inc_006_escrituras_exigen_token_csrf(robles_admin):
    client = APIClient(enforce_csrf_checks=True)
    client.post(LOGIN, {"email": "admin@robles.test", "password": PASSWORD})

    without_token = client.post(reverse("logout"))
    assert without_token.status_code == 403

    client.get(reverse("csrf"))
    csrf_token = client.cookies[settings.CSRF_COOKIE_NAME].value
    with_token = client.post(reverse("logout"), HTTP_X_CSRFTOKEN=csrf_token)
    assert with_token.status_code == 204


def test_inc_006_csrf_entrega_cookie_legible_por_la_interfaz(api_client):
    response = api_client.get(reverse("csrf"))

    assert response.status_code == 204
    cookie = response.cookies[settings.CSRF_COOKIE_NAME]
    assert cookie.value
    assert not cookie["httponly"]


def test_inc_006_sesion_vence_por_inactividad(api_client, robles_admin):
    response = api_client.post(LOGIN, {"email": "admin@robles.test", "password": PASSWORD})

    max_age = int(response.cookies[settings.SESSION_COOKIE_NAME]["max-age"])
    assert max_age == settings.SESSION_COOKIE_AGE
    assert settings.SESSION_COOKIE_AGE <= 2 * 60 * 60
    assert settings.SESSION_SAVE_EVERY_REQUEST


def test_hu01_e2_correo_con_mayusculas_y_espacios(api_client, robles_admin):
    response = api_client.post(LOGIN, {"email": "  Admin@Robles.test ", "password": PASSWORD})

    assert response.status_code == 200


@pytest.mark.parametrize(
    "email, password",
    [("admin@robles.test", "incorrecta"), ("noexiste@robles.test", PASSWORD)],
    ids=["contrasena-incorrecta", "correo-inexistente"],
)
def test_hu01_e3_credenciales_invalidas_mismo_mensaje(api_client, robles_admin, email, password):
    response = api_client.post(LOGIN, {"email": email, "password": password})

    assert response.status_code == 400
    assert response.json()["error"] == {
        "code": "invalid_credentials",
        "message": "Correo o contraseña incorrectos.",
    }


def test_hu01_e4_cuenta_desactivada(api_client, robles_admin):
    robles_admin.is_active = False
    robles_admin.save()

    response = api_client.post(LOGIN, {"email": "admin@robles.test", "password": PASSWORD})

    assert response.status_code == 403
    assert response.json()["error"]["code"] == "account_disabled"


def test_hu01_e4_institucion_desactivada_impide_acceso(api_client, robles_admin, robles):
    robles.is_active = False
    robles.save()

    response = api_client.post(LOGIN, {"email": "admin@robles.test", "password": PASSWORD})

    assert response.status_code == 403


def test_hu01_e5_campos_vacios(api_client):
    response = api_client.post(LOGIN, {"email": "", "password": ""})

    assert response.status_code == 400
    assert set(response.json()["error"]["fields"]) == {"email", "password"}


def test_rnf01_contrasena_guardada_con_hash(robles_admin):
    stored = User.objects.get(pk=robles_admin.pk).password

    assert stored != PASSWORD
    assert robles_admin.check_password(PASSWORD)


def test_hu02_e1_cerrar_sesion_elimina_la_sesion(client_for, robles_admin):
    client = client_for(robles_admin)

    response = client.post(reverse("logout"))

    assert response.status_code == 204
    assert response.cookies[settings.SESSION_COOKIE_NAME].value == ""


def test_hu02_e3_sesion_anterior_ya_no_es_valida(client_for, robles_admin):
    client = client_for(robles_admin)
    old_session = client.cookies[settings.SESSION_COOKIE_NAME].value
    client.post(reverse("logout"))
    client.cookies[settings.SESSION_COOKIE_NAME] = old_session

    response = client.get(reverse("me"))

    assert response.status_code == 401
    assert response.json()["error"]["message"] == "Debe iniciar sesión."


def test_rnf02_api_exige_sesion(api_client):
    for name in ["me", "student-list", "my-institution", "institution-list"]:
        assert api_client.get(reverse(name)).status_code == 401, name
