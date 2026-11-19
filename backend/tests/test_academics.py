"""HU05-E5 periodo lectivo, HU08 docentes y HU09 grupos (RF03, RF05, RF06; CA09 – CA16)."""

import datetime

import pytest
from django.urls import reverse

from academics.models import AcademicPeriod, Enrollment, Group, Teacher
from accounts.models import User

from .conftest import PASSWORD, make_student, make_user

pytestmark = pytest.mark.django_db

PERIODS = reverse("period-list")
TEACHERS = reverse("teacher-list")
GROUPS = reverse("group-list")


def make_period(institution, name="2026", current=True) -> AcademicPeriod:
    return AcademicPeriod.objects.create(
        institution=institution,
        name=name,
        start_date=datetime.date(2026, 2, 2),
        end_date=datetime.date(2026, 12, 11),
        is_current=current,
    )


def make_teacher(institution, email="docente1@robles.test", **extra) -> Teacher:
    user = make_user(email, User.Role.TEACHER, institution, **extra)
    return Teacher.objects.create(institution=institution, user=user)


def make_group(institution, period, code="4-A", level=None) -> Group:
    return Group.objects.create(
        institution=institution, period=period, code=code, level=level or institution.levels[0]
    )


def url(name, *args):
    return reverse(name, args=args)


def error(response):
    return response.json()["error"]


# HU05-E5 — periodo lectivo (GAP-01).


def test_hu05_e5_definir_periodo_vigente(client_for, robles_admin, robles):
    old = make_period(robles, "2025", current=True)

    response = client_for(robles_admin).post(
        PERIODS,
        {"name": "2026", "start_date": "2026-02-02", "end_date": "2026-12-11", "is_current": True},
    )

    assert response.status_code == 201
    period = AcademicPeriod.objects.get(name="2026")
    assert period.institution == robles and period.is_current
    old.refresh_from_db()
    assert not old.is_current


def test_hu05_e5_fechas_invertidas(client_for, robles_admin):
    response = client_for(robles_admin).post(
        PERIODS, {"name": "2026", "start_date": "2026-12-11", "end_date": "2026-02-02"}
    )

    assert response.status_code == 400
    assert error(response)["fields"]["end_date"] == [
        "La fecha de fin debe ser posterior o igual a la de inicio."
    ]


def test_hu05_e5_nombre_repetido(client_for, robles_admin, robles):
    make_period(robles)

    response = client_for(robles_admin).post(
        PERIODS, {"name": "2026", "start_date": "2026-02-02", "end_date": "2026-12-11"}
    )

    assert response.status_code == 409
    assert error(response)["message"] == "Ya existe un periodo lectivo con ese nombre."


def test_hu05_e5_docente_consulta_pero_no_crea(client_for, robles_teacher, robles):
    make_period(robles)
    client = client_for(robles_teacher)

    assert [p["name"] for p in client.get(PERIODS).json()] == ["2026"]
    response = client.post(
        PERIODS, {"name": "2027", "start_date": "2027-02-01", "end_date": "2027-12-10"}
    )
    assert response.status_code == 403


# HU08 — docentes y sus cuentas.


def teacher_payload(**overrides):
    data = {
        "first_name": "Laura",
        "last_name": "Solís",
        "email": "docente1@robles.test",
        "password": PASSWORD,
    }
    data.update(overrides)
    return data


def test_hu08_e1_ca09_registrar_docente_con_cuenta(client_for, robles_admin, robles, api_client):
    response = client_for(robles_admin).post(TEACHERS, teacher_payload())

    assert response.status_code == 201
    assert "password" not in response.json()
    teacher = Teacher.objects.get(user__email="docente1@robles.test")
    assert teacher.is_active and teacher.institution == robles
    assert teacher.user.role == User.Role.TEACHER and teacher.user.institution == robles
    login = api_client.post(
        reverse("login"), {"email": "docente1@robles.test", "password": PASSWORD}
    )
    assert login.status_code == 200
    assert login.json()["user"]["role"] == "teacher"


def test_hu08_e1_contrasena_inicial_obligatoria(client_for, robles_admin):
    payload = teacher_payload()
    del payload["password"]

    response = client_for(robles_admin).post(TEACHERS, payload)

    assert response.status_code == 400
    assert error(response)["fields"]["password"] == ["La contraseña inicial es obligatoria."]


def test_hu08_e2_docente_desactivado_no_inicia_sesion_ni_se_asigna(
    client_for, robles_admin, robles, api_client
):
    teacher = make_teacher(robles)
    group = make_group(robles, make_period(robles))
    admin = client_for(robles_admin)

    response = admin.patch(url("teacher-detail", teacher.pk), {"is_active": False})

    assert response.status_code == 200
    teacher.user.refresh_from_db()
    assert not teacher.user.is_active
    login = api_client.post(
        reverse("login"), {"email": "docente1@robles.test", "password": PASSWORD}
    )
    assert login.status_code == 403
    assert teacher.pk not in [t["id"] for t in admin.get(TEACHERS).json()]
    assign = admin.post(url("group-add-teachers", group.pk), {"teachers": [teacher.pk]})
    assert assign.status_code == 400
    assert not group.teachers.exists()


def test_hu08_e3_ca10_correo_duplicado(client_for, robles_admin, robles):
    make_teacher(robles)

    response = client_for(robles_admin).post(
        TEACHERS, teacher_payload(email="DOCENTE1@robles.test")
    )

    assert response.status_code == 409
    assert error(response)["message"] == "Ya existe una cuenta con ese correo."
    assert Teacher.objects.count() == 1


def test_hu08_solo_personal_administrativo(client_for, robles_teacher, robles):
    make_teacher(robles)

    assert client_for(robles_teacher).get(TEACHERS).status_code == 403
    assert client_for(robles_teacher).post(TEACHERS, teacher_payload()).status_code == 403


def test_hu08_aislamiento_docentes(client_for, monteverde_admin, robles):
    teacher = make_teacher(robles)
    client = client_for(monteverde_admin)

    assert client.get(TEACHERS).json() == []
    assert client.get(url("teacher-detail", teacher.pk)).status_code == 404


# HU09 — grupos y asignaciones.


def test_hu09_e1_ca11_ca13_ca15_crear_grupo_y_asignar(client_for, robles_admin, robles):
    period = make_period(robles)
    students = [make_student(robles, f"1-0000-{i:04d}", first_name=f"E{i}") for i in range(25)]
    teacher = make_teacher(robles)
    admin = client_for(robles_admin)

    created = admin.post(GROUPS, {"code": "4-A", "level": "primaria", "period": period.pk})
    assert created.status_code == 201
    group_id = created.json()["id"]
    assert (
        admin.post(
            url("group-add-students", group_id), {"students": [s.pk for s in students]}
        ).status_code
        == 200
    )
    response = admin.post(url("group-add-teachers", group_id), {"teachers": [teacher.pk]})

    assert response.status_code == 200
    body = response.json()
    assert body["student_count"] == 25
    assert body["teachers"] == [{"id": teacher.pk, "name": "Nombre Apellido"}]
    assert body["period_name"] == "2026"


def test_hu09_e2_ca13_trasladar_estudiante(client_for, robles_admin, robles):
    period = make_period(robles)
    a, b = make_group(robles, period, "4-A"), make_group(robles, period, "4-B")
    student = make_student(robles)
    Enrollment.objects.create(group=a, student=student)

    response = client_for(robles_admin).post(
        url("group-transfer", a.pk), {"student": student.pk, "target_group": b.pk}
    )

    assert response.status_code == 200
    assert response.json()["student_count"] == 0
    assert list(b.enrollments.values_list("student_id", flat=True)) == [student.pk]


def test_hu09_e3_ca14_estudiante_ya_asignado_en_el_periodo(client_for, robles_admin, robles):
    period = make_period(robles)
    a, b = make_group(robles, period, "4-A"), make_group(robles, period, "4-B")
    student = make_student(robles)
    Enrollment.objects.create(group=a, student=student)

    response = client_for(robles_admin).post(
        url("group-add-students", b.pk), {"students": [student.pk]}
    )

    assert response.status_code == 409
    assert error(response)["message"] == "El estudiante ya pertenece a un grupo en este periodo."
    assert not b.enrollments.exists()


def test_hu09_e3_ca14_estudiante_de_otra_institucion(client_for, robles_admin, robles, monteverde):
    group = make_group(robles, make_period(robles))
    other = make_student(monteverde, level="secundaria")

    response = client_for(robles_admin).post(
        url("group-add-students", group.pk), {"students": [other.pk]}
    )

    assert response.status_code == 400
    assert not group.enrollments.exists()


def test_hu09_estudiante_inactivo_o_de_otro_nivel(client_for, robles_admin, robles):
    robles.levels = ["primaria", "secundaria"]
    robles.save()
    group = make_group(robles, make_period(robles))
    inactive = make_student(robles, "1-1", is_active=False)
    other_level = make_student(robles, "1-2", level="secundaria")
    admin = client_for(robles_admin)

    for student in (inactive, other_level):
        response = admin.post(url("group-add-students", group.pk), {"students": [student.pk]})
        assert response.status_code == 400
    assert not group.enrollments.exists()


def test_hu09_e4_ca12_codigo_repetido_en_el_periodo(client_for, robles_admin, robles):
    period = make_period(robles)
    make_group(robles, period, "4-A")
    admin = client_for(robles_admin)

    response = admin.post(GROUPS, {"code": "4-a", "level": "primaria", "period": period.pk})

    assert response.status_code == 409
    assert error(response)["message"] == "Ya existe un grupo con ese código en este periodo."
    other = make_period(robles, "2027", current=False)
    again = admin.post(GROUPS, {"code": "4-A", "level": "primaria", "period": other.pk})
    assert again.status_code == 201


def test_hu09_periodo_de_otra_institucion(client_for, robles_admin, monteverde):
    period = make_period(monteverde)

    response = client_for(robles_admin).post(
        GROUPS, {"code": "4-A", "level": "primaria", "period": period.pk}
    )

    assert response.status_code == 400
    assert "period" in error(response)["fields"]


def test_hu09_quitar_estudiante_y_docente(client_for, robles_admin, robles):
    group = make_group(robles, make_period(robles))
    student = make_student(robles)
    teacher = make_teacher(robles)
    Enrollment.objects.create(group=group, student=student)
    group.teachers.add(teacher)
    admin = client_for(robles_admin)

    assert (
        admin.delete(url("group-remove-student", group.pk, student.pk)).json()["student_count"] == 0
    )
    assert admin.delete(url("group-remove-teacher", group.pk, teacher.pk)).json()["teachers"] == []


def test_ca16_docente_solo_ve_sus_grupos(client_for, robles):
    period = make_period(robles)
    mine, other = make_group(robles, period, "4-A"), make_group(robles, period, "4-B")
    teacher = make_teacher(robles)
    mine.teachers.add(teacher)
    client = client_for(teacher.user)

    assert [g["code"] for g in client.get(GROUPS).json()] == ["4-A"]
    assert client.get(url("group-detail", other.pk)).status_code == 404
    assert (
        client.post(GROUPS, {"code": "4-C", "level": "primaria", "period": period.pk}).status_code
        == 403
    )


def test_hu09_aislamiento_grupos(client_for, monteverde_admin, robles):
    group = make_group(robles, make_period(robles))
    client = client_for(monteverde_admin)

    assert client.get(GROUPS).json() == []
    assert client.get(url("group-detail", group.pk)).status_code == 404
    assert client.patch(url("group-detail", group.pk), {"code": "X"}).status_code == 404
