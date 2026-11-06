"""Datos ficticios de 3 instituciones para pruebas manuales y de interfaz (S3-05, S4-04).

Uso: python manage.py seed_demo [--reset]
Todos los datos son inventados. La contraseña de todas las cuentas es DEMO_PASSWORD.
"""

import datetime

from django.core.management.base import BaseCommand
from django.db import transaction

from accounts.models import User
from institutions.models import Institution
from students.models import Student

DEMO_PASSWORD = "Nexora-Demo-2026"

INSTITUTIONS = [
    {
        "name": "Escuela Los Robles",
        "levels": ["primaria"],
        "address": "Barrio Los Robles, San José",
        "phone": "2222-1000",
        "email": "info@robles.test",
        "admin": ("admin@robles.test", "Laura", "Solís Mena"),
        "teacher": ("docente@robles.test", "Andrés", "Castro Rojas"),
        "students": [
            ("1-1111-1111", "Ana", "Mora Vargas", "2016-03-14", "primaria"),
            ("1-1111-1112", "Bruno", "Quesada Arias", "2016-07-02", "primaria"),
            ("1-1111-1113", "Camila", "Jiménez Soto", "2015-11-20", "primaria"),
            ("1-1111-1114", "Diego", "Rodríguez Leiva", "2017-01-09", "primaria"),
            ("1-1111-1115", "Elena", "Chaves Umaña", "2016-05-27", "primaria"),
            ("3-3333-3333", "Fabián", "Núñez Brenes", "2015-09-15", "primaria"),
        ],
    },
    {
        "name": "Colegio Monteverde",
        "levels": ["secundaria"],
        "address": "Monteverde, Puntarenas",
        "phone": "2645-2000",
        "email": "info@monteverde.test",
        "admin": ("admin@monteverde.test", "Marco", "Villalobos Ruiz"),
        "teacher": ("docente@monteverde.test", "Sofía", "Herrera Campos"),
        "students": [
            ("2-2222-2221", "Gabriela", "Alfaro Méndez", "2010-02-11", "secundaria"),
            ("2-2222-2222", "Héctor", "Salas Ramírez", "2009-08-30", "secundaria"),
            ("2-2222-2223", "Isabel", "Montero Pérez", "2011-04-18", "secundaria"),
            ("3-3333-3333", "Javier", "Calderón Mora", "2010-12-05", "secundaria"),
        ],
    },
    {
        "name": "Kínder Arcoíris",
        "levels": ["preescolar"],
        "address": "Centro, Heredia",
        "phone": "2260-3000",
        "email": "info@arcoiris.test",
        "admin": ("admin@arcoiris.test", "Patricia", "Gómez Araya"),
        "teacher": ("docente@arcoiris.test", "Rosa", "Fernández Vega"),
        "students": [
            ("4-4444-4441", "Lucía", "Vindas Solano", "2021-06-21", "preescolar"),
            ("4-4444-4442", "Mateo", "Barrantes Cruz", "2021-10-03", "preescolar"),
        ],
    },
]


class Command(BaseCommand):
    help = "Carga datos ficticios de 3 instituciones (idempotente)."

    def add_arguments(self, parser):
        parser.add_argument("--reset", action="store_true", help="Borra los datos antes de cargar.")

    @transaction.atomic
    def handle(self, *args, reset=False, **options):
        if reset:
            Student.objects.all().delete()
            User.objects.all().delete()
            Institution.objects.all().delete()

        self._user("plataforma@nexora.test", "Equipo", "Nexora", User.Role.PLATFORM_ADMIN, None)
        for data in INSTITUTIONS:
            institution, _ = Institution.objects.update_or_create(
                name=data["name"],
                defaults={k: data[k] for k in ("levels", "address", "phone", "email")},
            )
            self._user(*data["admin"], User.Role.INSTITUTION_ADMIN, institution)
            self._user(*data["teacher"], User.Role.TEACHER, institution)
            for identification, first, last, birth, level in data["students"]:
                Student.objects.update_or_create(
                    institution=institution,
                    identification=identification,
                    defaults={
                        "first_name": first,
                        "last_name": last,
                        "birth_date": datetime.date.fromisoformat(birth),
                        "level": level,
                        "is_active": True,
                    },
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Datos ficticios cargados: {Institution.objects.count()} instituciones, "
                f"{User.objects.count()} usuarios, {Student.objects.count()} estudiantes."
            )
        )

    def _user(self, email, first_name, last_name, role, institution):
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": first_name,
                "last_name": last_name,
                "role": role,
                "institution": institution,
            },
        )
        if created:
            user.set_password(DEMO_PASSWORD)
            user.save()
        return user
