"""HU10 asistencia, HU11 listados y HU12 resumen (RF07, RF08; CA15 – CA24)."""

import datetime

import pytest
from django.urls import reverse
from django.utils import timezone

from academics.models import Enrollment
from attendance.models import AttendanceChange, AttendanceRecord

from .conftest import make_student
from .test_academics import error, make_group, make_period, make_teacher

pytestmark = pytest.mark.django_db

SHEET = reverse("attendance")
DAY = datetime.date(2026, 11, 2)


@pytest.fixture
def setup(robles):
    """Grupo 4-A con dos estudiantes y su docente; 4-B sin asignación para esa docente."""
    period = make_period(robles)
    a, b = make_group(robles, period, "4-A"), make_group(robles, period, "4-B")
    ana = make_student(robles, "1-1", first_name="Ana", last_name="Mora")
    luis = make_student(robles, "1-2", first_name="Luis", last_name="Vega")
    for student in (ana, luis):
        Enrollment.objects.create(group=a, student=student)
    teacher = make_teacher(robles)
    a.teachers.add(teacher)
    return {"a": a, "b": b, "ana": ana, "luis": luis, "teacher": teacher.user}


def sheet(group, students, day=DAY, status="presente"):
    return {
        "group": group.pk,
        "date": day.isoformat(),
        "entries": [{"student": s.pk, "status": status} for s in students],
    }


def record(setup, student="ana", status="ausente", day=DAY):
    return AttendanceRecord.objects.create(
        group=setup["a"],
        student=setup[student],
        date=day,
        status=status,
        recorded_by=setup["teacher"],
    )


# HU10 — registrar y corregir.


def test_hu10_e1_ca15_ca17_registrar_asistencia(client_for, setup):
    client = client_for(setup["teacher"])
    payload = sheet(setup["a"], [setup["ana"], setup["luis"]])
    payload["entries"][1]["status"] = "ausente"

    response = client.post(SHEET, payload, format="json")

    assert response.status_code == 201
    assert response.json()["recorded"] == 2
    listed = client.get(SHEET, {"group": setup["a"].pk, "date": DAY.isoformat()}).json()
    assert listed["recorded"] is True
    assert [(e["name"], e["status"]) for e in listed["entries"]] == [
        ("Ana Mora", "presente"),
        ("Luis Vega", "ausente"),
    ]


def test_hu10_e1_debe_marcar_a_todos(client_for, setup):
    response = client_for(setup["teacher"]).post(
        SHEET, sheet(setup["a"], [setup["ana"]]), format="json"
    )

    assert response.status_code == 400
    assert error(response)["fields"]["entries"] == [
        "Marque el estado de todos los estudiantes del grupo."
    ]
    assert not AttendanceRecord.objects.exists()


def test_hu10_e1_fecha_futura_o_fuera_del_periodo(client_for, setup):
    client = client_for(setup["teacher"])
    students = [setup["ana"], setup["luis"]]
    tomorrow = timezone.localdate() + datetime.timedelta(days=1)

    future = client.post(SHEET, sheet(setup["a"], students, tomorrow), format="json")
    outside = client.post(
        SHEET, sheet(setup["a"], students, datetime.date(2026, 1, 15)), format="json"
    )

    assert error(future)["fields"]["date"] == ["La fecha no puede ser futura."]
    assert error(outside)["fields"]["date"] == [
        "La fecha está fuera del periodo lectivo del grupo."
    ]


def test_hu10_e3_ca18_no_duplica_la_asistencia_del_dia(client_for, setup):
    record(setup)

    response = client_for(setup["teacher"]).post(
        SHEET, sheet(setup["a"], [setup["ana"], setup["luis"]]), format="json"
    )

    assert response.status_code == 409
    assert "Corríjala" in error(response)["message"]
    assert AttendanceRecord.objects.count() == 1


def test_hu10_e2_ca19_corregir_conserva_historial(client_for, setup):
    attendance = record(setup)
    client = client_for(setup["teacher"])

    response = client.post(
        reverse("attendance-correct", args=[attendance.pk]),
        {"status": "presente", "reason": "Llegó tarde"},
    )

    assert response.status_code == 200
    attendance.refresh_from_db()
    assert attendance.status == "presente"
    change = AttendanceChange.objects.get(record=attendance)
    assert (change.previous_status, change.new_status, change.reason) == (
        "ausente",
        "presente",
        "Llegó tarde",
    )
    assert change.changed_by == setup["teacher"] and change.changed_at is not None
    listed = client.get(SHEET, {"group": setup["a"].pk, "date": DAY.isoformat()}).json()
    assert listed["entries"][0]["changes"][0]["changed_by"] == "docente1@robles.test"


@pytest.mark.parametrize("reason", [None, "", "   "])
def test_hu10_e4_ca20_motivo_obligatorio(client_for, setup, reason):
    attendance = record(setup)
    data = {"status": "presente"}
    if reason is not None:
        data["reason"] = reason

    response = client_for(setup["teacher"]).post(
        reverse("attendance-correct", args=[attendance.pk]), data
    )

    assert response.status_code == 400
    assert error(response)["fields"]["reason"] == ["El motivo es obligatorio."]
    attendance.refresh_from_db()
    assert attendance.status == "ausente" and not attendance.changes.exists()


def test_hu10_correccion_con_el_mismo_estado(client_for, setup):
    attendance = record(setup)

    response = client_for(setup["teacher"]).post(
        reverse("attendance-correct", args=[attendance.pk]),
        {"status": "ausente", "reason": "Sin cambio"},
    )

    assert response.status_code == 400


def test_hu10_e5_ca16_docente_sin_asignacion(client_for, setup, robles):
    b = setup["b"]
    other = make_student(robles, "1-3")
    Enrollment.objects.create(group=b, student=other)
    client = client_for(setup["teacher"])

    assert client.get(SHEET, {"group": b.pk, "date": DAY.isoformat()}).status_code == 404
    assert client.post(SHEET, sheet(b, [other]), format="json").status_code == 404
    foreign = AttendanceRecord.objects.create(
        group=b, student=other, date=DAY, status="ausente", recorded_by=setup["teacher"]
    )
    correct = client.post(
        reverse("attendance-correct", args=[foreign.pk]), {"status": "presente", "reason": "x"}
    )
    assert correct.status_code == 404
    assert not AttendanceRecord.objects.filter(group=b, status="presente").exists()


def test_hu10_personal_administrativo_consulta_pero_no_registra(client_for, setup, robles_admin):
    client = client_for(robles_admin)

    listed = client.get(SHEET, {"group": setup["a"].pk, "date": DAY.isoformat()})
    created = client.post(SHEET, sheet(setup["a"], [setup["ana"], setup["luis"]]), format="json")

    assert listed.status_code == 200 and listed.json()["can_edit"] is False
    assert created.status_code == 403


def test_hu10_aislamiento_asistencia(client_for, setup, monteverde_admin):
    attendance = record(setup)
    client = client_for(monteverde_admin)

    assert client.get(SHEET, {"group": setup["a"].pk, "date": DAY.isoformat()}).status_code == 404
    response = client.post(
        reverse("attendance-correct", args=[attendance.pk]), {"status": "presente", "reason": "x"}
    )
    assert response.status_code == 404


# HU11 — listados.


def test_hu11_e1_ca21_listado_por_grupo(client_for, setup, robles_admin):
    response = client_for(robles_admin).get(reverse("report-groups"))

    assert response.status_code == 200
    rows = {r["code"]: r for r in response.json()}
    assert rows["4-A"]["student_count"] == 2
    assert rows["4-A"]["teachers"] == ["Nombre Apellido"]
    assert rows["4-B"]["student_count"] == 0


def test_hu11_e2_ca21_filtro_por_nivel(client_for, robles, robles_admin):
    robles.levels = ["primaria", "secundaria"]
    robles.save()
    period = make_period(robles)
    make_group(robles, period, "4-A", "primaria")
    group = make_group(robles, period, "10-1", "secundaria")
    student = make_student(robles, "2-1", level="secundaria", first_name="Sofía")
    make_student(robles, "2-2", level="primaria")
    Enrollment.objects.create(group=group, student=student)
    client = client_for(robles_admin)

    groups = client.get(reverse("report-groups"), {"level": "secundaria"}).json()
    students = client.get(reverse("report-students"), {"level": "secundaria"}).json()

    assert [g["code"] for g in groups] == ["10-1"]
    assert [(s["name"], s["group"]) for s in students] == [("Mora, Sofía", "10-1")]


def test_hu11_e3_sin_resultados_devuelve_lista_vacia(client_for, setup, robles_admin):
    response = client_for(robles_admin).get(reverse("report-groups"), {"level": "secundaria"})

    assert response.status_code == 200 and response.json() == []


def test_hu11_e4_ca22_docente_y_otra_institucion(client_for, setup, monteverde_admin):
    teacher = client_for(setup["teacher"])
    for name in ("report-groups", "report-students"):
        assert teacher.get(reverse(name)).status_code == 403
    other = client_for(monteverde_admin)
    assert other.get(reverse("report-groups")).json() == []
    assert other.get(reverse("report-students")).json() == []
    assert other.get(reverse("report-students"), {"group": setup["a"].pk}).json() == []


# HU12 — resumen de asistencia.


def test_hu12_e1_ca23_resumen_de_cinco_fechas(client_for, setup, robles_admin):
    for offset in range(5):
        day = DAY + datetime.timedelta(days=offset)
        record(setup, "ana", "presente", day)
        record(setup, "luis", "ausente" if offset < 2 else "presente", day)

    response = client_for(robles_admin).get(
        reverse("report-attendance"),
        {"group": setup["a"].pk, "start": "2026-11-02", "end": "2026-11-06"},
    )

    assert response.status_code == 200
    body = response.json()
    assert len(body["dates"]) == 5
    rows = {r["name"]: r for r in body["students"]}
    assert (rows["Ana Mora"]["present"], rows["Ana Mora"]["percentage"]) == (5, 100.0)
    assert (rows["Luis Vega"]["absent"], rows["Luis Vega"]["percentage"]) == (2, 60.0)
    assert body["totals"] == {"present": 8, "absent": 2, "percentage": 80.0}


def test_hu12_e1_estudiante_sin_registro_en_una_fecha(client_for, setup, robles_admin):
    record(setup, "ana", "presente")

    body = (
        client_for(robles_admin)
        .get(
            reverse("report-attendance"),
            {"group": setup["a"].pk, "start": "2026-11-02", "end": "2026-11-02"},
        )
        .json()
    )

    luis = next(r for r in body["students"] if r["name"] == "Luis Vega")
    assert luis["unrecorded"] == 1 and luis["percentage"] is None


def test_hu12_e2_docente_solo_sus_grupos(client_for, setup):
    client = client_for(setup["teacher"])
    params = {"start": "2026-11-02", "end": "2026-11-06"}

    assert (
        client.get(reverse("report-attendance"), {**params, "group": setup["a"].pk}).status_code
        == 200
    )
    assert (
        client.get(reverse("report-attendance"), {**params, "group": setup["b"].pk}).status_code
        == 404
    )


def test_hu12_e3_ca24_rango_invertido(client_for, setup, robles_admin):
    response = client_for(robles_admin).get(
        reverse("report-attendance"),
        {"group": setup["a"].pk, "start": "2026-11-06", "end": "2026-11-02"},
    )

    assert response.status_code == 400
    assert error(response)["fields"]["end"] == [
        "La fecha inicial debe ser anterior o igual a la final."
    ]
