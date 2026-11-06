"""Datos de prueba ficticios de los escenarios del catálogo de requisitos (sección 6)."""

import datetime

import pytest
from rest_framework.test import APIClient

from accounts.models import User
from institutions.models import Institution
from students.models import Student

PASSWORD = "Prueba-Nexora-2026"


@pytest.fixture
def api_client() -> APIClient:
    return APIClient()


@pytest.fixture
def robles(db) -> Institution:
    return Institution.objects.create(name="Escuela Los Robles", levels=["primaria"])


@pytest.fixture
def monteverde(db) -> Institution:
    return Institution.objects.create(name="Colegio Monteverde", levels=["secundaria"])


def make_user(email, role, institution=None, **extra) -> User:
    return User.objects.create_user(
        email=email,
        password=PASSWORD,
        first_name=extra.pop("first_name", "Nombre"),
        last_name=extra.pop("last_name", "Apellido"),
        role=role,
        institution=institution,
        **extra,
    )


@pytest.fixture
def platform_admin(db) -> User:
    return make_user("plataforma@nexora.test", User.Role.PLATFORM_ADMIN)


@pytest.fixture
def robles_admin(robles) -> User:
    return make_user("admin@robles.test", User.Role.INSTITUTION_ADMIN, robles)


@pytest.fixture
def robles_teacher(robles) -> User:
    return make_user("docente@robles.test", User.Role.TEACHER, robles)


@pytest.fixture
def monteverde_admin(monteverde) -> User:
    return make_user("admin@monteverde.test", User.Role.INSTITUTION_ADMIN, monteverde)


@pytest.fixture
def client_for():
    """Devuelve un cliente con la sesión del usuario indicado iniciada (cookie de sesión)."""

    def _client(user: User) -> APIClient:
        client = APIClient()
        client.force_login(user)
        return client

    return _client


def make_student(institution, identification="1-1111-1111", **extra) -> Student:
    data = {
        "first_name": "Ana",
        "last_name": "Mora",
        "birth_date": datetime.date(2016, 3, 14),
        "level": institution.levels[0],
    }
    data.update(extra)
    return Student.objects.create(institution=institution, identification=identification, **data)
