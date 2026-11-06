"""Datos ficticios de 3 instituciones (S3-05)."""

import pytest
from django.core.management import call_command

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
