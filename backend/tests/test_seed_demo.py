"""Datos ficticios de 3 instituciones (S3-05)."""

import pytest
from django.core.management import call_command

from academics.models import Group, Teacher
from accounts.models import User
from institutions.models import Institution
from students.models import Student

pytestmark = pytest.mark.django_db


def test_seed_demo_carga_tres_instituciones_y_es_idempotente():
    call_command("seed_demo")
    call_command("seed_demo")

    assert Institution.objects.count() == 3
    assert User.objects.filter(role=User.Role.PLATFORM_ADMIN).count() == 1
    assert Student.objects.filter(identification="3-3333-3333").count() == 2


def test_seed_demo_carga_periodo_docentes_y_grupos():
    call_command("seed_demo")
    call_command("seed_demo", reset=True)

    assert Teacher.objects.count() == 3
    group = Group.objects.get(code="4-A")
    assert group.period.is_current
    assert group.teachers.get().user.email == "docente@robles.test"
    assert group.enrollments.count() == 3
    assert not Group.objects.get(code="4-B").teachers.exists()
