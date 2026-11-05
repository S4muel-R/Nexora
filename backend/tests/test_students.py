"""HU07 Gestionar estudiantes sin duplicados (RF04, RN04 – RN06)."""

import datetime

import pytest
from django.urls import reverse
from django.utils import timezone

from students.models import Student

from .conftest import make_student

pytestmark = pytest.mark.django_db

STUDENTS = reverse("student-list")


def payload(**overrides):
    data = {
        "identification": "1-1111-1111",
        "first_name": "Ana",
        "last_name": "Mora",
        "birth_date": "2016-03-14",
        "level": "primaria",
    }
    data.update(overrides)
    return data


def detail(student):
    return reverse("student-detail", args=[student.pk])


def test_hu07_e1_registrar_estudiante(client_for, robles_admin, robles):
    response = client_for(robles_admin).post(STUDENTS, payload())

    assert response.status_code == 201
    student = Student.objects.get(identification="1-1111-1111")
    assert student.institution == robles
    assert student.is_active


@pytest.mark.parametrize("fmt", ["multipart", "json"])
def test_adlcds_103_estudiante_nuevo_queda_activo_en_cualquier_formato(
    client_for, robles_admin, fmt
):
    """Regresión de ADLCDS-103 (INC-001)."""
    client = client_for(robles_admin)

    response = client.post(STUDENTS, payload(), format=fmt)

    assert response.status_code == 201
    assert response.json()["is_active"] is True
    assert [s["identification"] for s in client.get(STUDENTS).json()] == ["1-1111-1111"]


def test_hu07_e2_editar_apellido(client_for, robles_admin, robles):
    student = make_student(robles)

    response = client_for(robles_admin).patch(detail(student), {"last_name": "Vargas"})

    assert response.status_code == 200
    student.refresh_from_db()
    assert student.last_name == "Vargas"


def test_hu07_e2_desactivados_ocultos_salvo_filtro(client_for, robles_admin, robles):
    student = make_student(robles)
    client = client_for(robles_admin)

    client.patch(detail(student), {"is_active": False}, format="json")

    assert client.get(STUDENTS).json() == []
    with_inactive = client.get(STUDENTS, {"include_inactive": "true"}).json()
    assert [s["is_active"] for s in with_inactive] == [False]


@pytest.mark.parametrize("term", ["ana", "MORA", "1111"])
def test_hu07_e3_buscar_por_nombre_apellido_o_identificacion(
    client_for, robles_admin, robles, term
):
    make_student(robles, "1-1111-1111", first_name="Ana", last_name="Mora")
    make_student(robles, "2-2222-2222", first_name="Luis", last_name="Quesada")

    response = client_for(robles_admin).get(STUDENTS, {"search": term})

    assert [s["identification"] for s in response.json()] == ["1-1111-1111"]


def test_hu07_e4_identificacion_duplicada(client_for, robles_admin, robles):
    make_student(robles, "1-1111-1111")

    response = client_for(robles_admin).post(STUDENTS, payload(identification=" 1-1111-1111 "))

    assert response.status_code == 409
    assert response.json()["error"]["message"] == "Ya existe un estudiante con esa identificación."
    assert Student.objects.count() == 1


def test_hu07_e4_editar_a_identificacion_existente(client_for, robles_admin, robles):
    make_student(robles, "1-1111-1111")
    other = make_student(robles, "2-2222-2222")

    response = client_for(robles_admin).patch(detail(other), {"identification": "1-1111-1111"})

    assert response.status_code == 409


def test_hu07_e5_fecha_de_nacimiento_futura(client_for, robles_admin):
    tomorrow = timezone.localdate() + datetime.timedelta(days=1)

    response = client_for(robles_admin).post(STUDENTS, payload(birth_date=tomorrow.isoformat()))

    assert response.status_code == 400
    assert response.json()["error"]["fields"]["birth_date"] == [
        "La fecha de nacimiento no puede ser futura."
    ]


@pytest.mark.parametrize("value", ["", None, "14/03/2016"], ids=["vacia", "nula", "formato"])
def test_adlcds_104_fecha_invalida_con_mensaje_claro(client_for, robles_admin, value):
    """Regresión de ADLCDS-104 (INC-002): sin mensajes técnicos de formato (RNF04)."""
    response = client_for(robles_admin).post(STUDENTS, payload(birth_date=value), format="json")

    assert response.status_code == 400
    assert response.json()["error"]["fields"]["birth_date"] == [
        "Ingrese una fecha de nacimiento válida."
    ]


def test_hu07_e5_nivel_que_no_pertenece_a_la_institucion(client_for, robles_admin):
    response = client_for(robles_admin).post(STUDENTS, payload(level="secundaria"))

    assert response.status_code == 400
    assert response.json()["error"]["fields"]["level"] == [
        "El nivel no pertenece a la institución."
    ]


@pytest.mark.parametrize("identification", ["123", "1" * 21, "1-111/111"])
def test_rn04_formato_de_identificacion(client_for, robles_admin, identification):
    response = client_for(robles_admin).post(STUDENTS, payload(identification=identification))

    assert response.status_code == 400
    assert "identification" in response.json()["error"]["fields"]


def test_hu07_docente_consulta_pero_no_modifica(client_for, robles_teacher, robles):
    student = make_student(robles)
    client = client_for(robles_teacher)

    assert client.get(STUDENTS).status_code == 200
    assert client.post(STUDENTS, payload(identification="9-9999-9999")).status_code == 403
    assert client.patch(detail(student), {"last_name": "X"}).status_code == 403


def test_rn06_no_existe_borrado_fisico(client_for, robles_admin, robles):
    student = make_student(robles)

    response = client_for(robles_admin).delete(detail(student))

    assert response.status_code == 405
    assert Student.objects.filter(pk=student.pk).exists()
