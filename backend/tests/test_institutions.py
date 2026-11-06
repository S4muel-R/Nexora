"""HU03 Opciones por rol · HU04 Registrar institución · HU05 Actualizar mi institución."""

import pytest
from django.urls import reverse

from accounts.models import User
from institutions.models import Institution

from .conftest import PASSWORD, make_student

pytestmark = pytest.mark.django_db

INSTITUTIONS = reverse("institution-list")
MY_INSTITUTION = reverse("my-institution")


def new_institution(**overrides):
    data = {
        "name": "Escuela Los Robles",
        "levels": ["primaria"],
        "address": "San José",
        "admin": {
            "email": "admin@robles.test",
            "first_name": "Laura",
            "last_name": "Solís",
            "password": PASSWORD,
        },
    }
    data.update(overrides)
    return data


def test_hu04_e1_registrar_institucion_y_administradora(client_for, platform_admin, api_client):
    response = client_for(platform_admin).post(INSTITUTIONS, new_institution(), format="json")

    assert response.status_code == 201
    institution = Institution.objects.get(name="Escuela Los Robles")
    assert institution.is_active
    admin = User.objects.get(email="admin@robles.test")
    assert admin.role == User.Role.INSTITUTION_ADMIN
    assert admin.institution == institution
    login = api_client.post(reverse("login"), {"email": "admin@robles.test", "password": PASSWORD})
    assert login.status_code == 200


def test_hu04_e2_institucion_con_varios_niveles(client_for, platform_admin):
    data = new_institution(name="Colegio Monteverde", levels=["secundaria", "primaria"])
    data["admin"]["email"] = "admin@monteverde.test"

    response = client_for(platform_admin).post(INSTITUTIONS, data, format="json")

    assert response.status_code == 201
    assert response.json()["levels"] == ["primaria", "secundaria"]


def test_hu04_e3_nombre_duplicado_sin_distinguir_mayusculas(client_for, platform_admin, robles):
    data = new_institution(name="escuela los robles")

    response = client_for(platform_admin).post(INSTITUTIONS, data, format="json")

    assert response.status_code == 409
    assert response.json()["error"]["message"] == "Ya existe una institución con ese nombre."
    assert not User.objects.filter(email="admin@robles.test").exists()


@pytest.mark.parametrize("levels", [[], ["universidad"], ["primaria", "primaria"]])
def test_hu04_e4_niveles_invalidos(client_for, platform_admin, levels):
    response = client_for(platform_admin).post(
        INSTITUTIONS, new_institution(levels=levels), format="json"
    )

    assert response.status_code == 400
    assert "levels" in response.json()["error"]["fields"]
    assert not Institution.objects.exists()


def test_hu04_e4_correo_de_administradora_en_uso(client_for, platform_admin, monteverde_admin):
    data = new_institution()
    data["admin"]["email"] = "ADMIN@monteverde.test"

    response = client_for(platform_admin).post(INSTITUTIONS, data, format="json")

    assert response.status_code == 400
    assert response.json()["error"]["fields"]["admin"]["email"]
    assert not Institution.objects.filter(name="Escuela Los Robles").exists()


def test_hu04_solo_plataforma_registra_instituciones(client_for, robles_admin):
    response = client_for(robles_admin).post(INSTITUTIONS, new_institution(), format="json")

    assert response.status_code == 403


def test_hu05_e1_actualizar_datos_de_mi_institucion(client_for, robles_admin):
    client = client_for(robles_admin)

    response = client.patch(MY_INSTITUTION, {"phone": "2222-3333", "address": "Heredia"})

    assert response.status_code == 200
    reloaded = client.get(MY_INSTITUTION).json()
    assert reloaded["phone"] == "2222-3333"
    assert reloaded["address"] == "Heredia"


def test_hu05_e2_agregar_nivel(client_for, robles_admin):
    response = client_for(robles_admin).patch(
        MY_INSTITUTION, {"levels": ["primaria", "preescolar"]}, format="json"
    )

    assert response.status_code == 200
    assert response.json()["levels"] == ["preescolar", "primaria"]


@pytest.mark.parametrize("field, value", [("name", "   "), ("email", "no-es-correo")])
def test_hu05_e3_datos_invalidos_no_se_guardan(client_for, robles_admin, robles, field, value):
    response = client_for(robles_admin).patch(MY_INSTITUTION, {field: value})

    assert response.status_code == 400
    assert field in response.json()["error"]["fields"]
    robles.refresh_from_db()
    assert robles.name == "Escuela Los Robles"


def test_hu05_e4_no_quitar_nivel_con_estudiantes_activos(client_for, robles_admin, robles):
    robles.levels = ["preescolar", "primaria"]
    robles.save()
    make_student(robles, level="primaria")

    response = client_for(robles_admin).patch(
        MY_INSTITUTION, {"levels": ["preescolar"]}, format="json"
    )

    assert response.status_code == 400
    assert response.json()["error"]["fields"]["levels"] == [
        "No se puede quitar un nivel con estudiantes activos."
    ]


def test_hu03_e3_docente_no_modifica_la_institucion(client_for, robles_teacher):
    client = client_for(robles_teacher)

    assert client.get(MY_INSTITUTION).status_code == 200
    response = client.patch(MY_INSTITUTION, {"phone": "0000"})
    assert response.status_code == 403
    assert response.json()["error"]["message"] == "No tiene permiso para realizar esta acción."


def test_hu03_e3_docente_no_accede_a_gestion_de_instituciones(client_for, robles_teacher):
    assert client_for(robles_teacher).get(INSTITUTIONS).status_code == 403


def test_hu03_e2_plataforma_no_accede_a_gestion_escolar(client_for, platform_admin):
    client = client_for(platform_admin)

    assert client.get(reverse("student-list")).status_code == 403
    assert client.get(MY_INSTITUTION).status_code == 403
