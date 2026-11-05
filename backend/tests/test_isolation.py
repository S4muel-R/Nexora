"""HU06 Impedir el acceso a datos de otra institución (RF02, RN02). Pruebas de seguridad."""

import pytest
from django.urls import reverse

from .conftest import make_student

pytestmark = pytest.mark.django_db


@pytest.fixture
def students(robles, monteverde):
    return {
        "robles": make_student(robles, "1-1111-1111", first_name="Ana"),
        "monteverde": make_student(monteverde, "2-2222-2222", first_name="Bruno"),
    }


def test_hu06_e1_lista_solo_estudiantes_de_mi_institucion(client_for, robles_admin, students):
    response = client_for(robles_admin).get(reverse("student-list"))

    identifications = [s["identification"] for s in response.json()]
    assert identifications == ["1-1111-1111"]


def test_hu06_e2_misma_identificacion_en_dos_instituciones(
    client_for, robles_admin, monteverde_admin, robles, monteverde
):
    make_student(robles, "3-3333-3333", first_name="Carla")
    make_student(monteverde, "3-3333-3333", first_name="Diego")

    robles_view = client_for(robles_admin).get(reverse("student-list")).json()
    monteverde_view = client_for(monteverde_admin).get(reverse("student-list")).json()

    assert [s["first_name"] for s in robles_view] == ["Carla"]
    assert [s["first_name"] for s in monteverde_view] == ["Diego"]


@pytest.mark.parametrize(
    "method, payload",
    [("get", None), ("patch", {"last_name": "Cambiado"}), ("patch", {"is_active": False})],
    ids=["consultar", "editar", "desactivar"],
)
def test_hu06_e3_estudiante_de_otra_institucion_responde_404(
    client_for, robles_admin, students, method, payload
):
    other = students["monteverde"]
    url = reverse("student-detail", args=[other.pk])

    response = getattr(client_for(robles_admin), method)(url, payload, format="json")

    assert response.status_code == 404
    other.refresh_from_db()
    assert other.last_name == "Mora"
    assert other.is_active


def test_hu06_e3_no_se_puede_crear_en_otra_institucion(client_for, robles_admin, monteverde):
    payload = {
        "identification": "4-4444-4444",
        "first_name": "Eva",
        "last_name": "Rojas",
        "birth_date": "2015-01-01",
        "level": "primaria",
        "institution": monteverde.pk,
    }

    response = client_for(robles_admin).post(reverse("student-list"), payload)

    assert response.status_code == 201
    assert not monteverde.students.exists()


@pytest.mark.parametrize("method", ["get", "patch"])
def test_hu06_e4_institucion_ajena_responde_404(client_for, robles_admin, monteverde, method):
    url = reverse("institution-detail", args=[monteverde.pk])

    response = getattr(client_for(robles_admin), method)(url, {"phone": "1111"})

    assert response.status_code == 404
    monteverde.refresh_from_db()
    assert monteverde.phone == ""


def test_hu06_e4_mi_institucion_devuelve_la_propia(client_for, monteverde_admin, robles):
    response = client_for(monteverde_admin).get(reverse("my-institution"))

    assert response.json()["name"] == "Colegio Monteverde"
