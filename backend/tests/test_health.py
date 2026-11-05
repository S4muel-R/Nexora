import pytest
from django.urls import reverse
from rest_framework.test import APIRequestFactory

from core.exceptions import api_exception_handler


@pytest.mark.django_db
def test_health_responde_ok_sin_autenticacion(api_client):
    response = api_client.get(reverse("health"))

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_metodo_no_permitido_usa_formato_estandar_de_error(api_client):
    response = api_client.post(reverse("health"))

    assert response.status_code == 405
    assert response.json() == {
        "error": {"code": "method_not_allowed", "message": "Método no permitido."}
    }


def test_error_no_controlado_devuelve_500_sin_traza():
    request = APIRequestFactory().get("/")
    context = {"view": None, "request": request}

    response = api_exception_handler(RuntimeError("detalle interno"), context)

    assert response.status_code == 500
    assert response.data["error"]["code"] == "server_error"
    assert "detalle interno" not in str(response.data)
