"""Configuración de seguridad para un ambiente publicado (INC-003, `manage.py check --deploy`)."""

import os
import subprocess
import sys
from pathlib import Path

BACKEND = Path(__file__).resolve().parent.parent


def run_deploy_check(**extra_env):
    env = {
        **os.environ,
        "DJANGO_SETTINGS_MODULE": "config.settings",
        "DJANGO_DEBUG": "false",
        "DJANGO_SECRET_KEY": "clave-de-prueba-" + "x" * 50,
        "DJANGO_ALLOWED_HOSTS": "nexora.example",
        "DATABASE_URL": "sqlite:///:memory:",
        **extra_env,
    }
    return subprocess.run(
        [sys.executable, "manage.py", "check", "--deploy", "--fail-level", "WARNING"],
        cwd=BACKEND,
        env=env,
        capture_output=True,
        text=True,
    )


def test_inc_003_ambiente_https_sin_advertencias_de_despliegue():
    result = run_deploy_check(DJANGO_HTTPS="true", DJANGO_HSTS_SECONDS="31536000")
    output = result.stdout + result.stderr

    for warning in ("security.W004", "security.W008", "security.W012", "security.W016"):
        assert warning not in output
    # Única advertencia aceptada: no se solicita la lista de precarga HSTS,
    # decisión casi irreversible que no corresponde a un prototipo.
    assert "identified 1 issue" in output and "security.W021" in output


def test_inc_003_sin_https_check_deploy_advierte():
    result = run_deploy_check(DJANGO_HTTPS="false")

    assert result.returncode != 0
    assert "security.W008" in result.stderr
