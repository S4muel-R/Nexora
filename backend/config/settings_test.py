"""Configuración para pruebas automatizadas: valores fijos y hash de contraseñas rápido."""

import os

os.environ.setdefault("DJANGO_DEBUG", "true")
os.environ.setdefault("DJANGO_SECRET_KEY", "clave-de-pruebas")

from config.settings import *  # noqa: E402,F403

PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]

# Pruebas de robustez: con NEXORA_LATENCIA_MAX_MS la API responde con una demora aleatoria
# (EJ-21, ACR-03).
if os.environ.get("NEXORA_LATENCIA_MAX_MS"):
    MIDDLEWARE = ["core.testing.random_latency", *MIDDLEWARE]  # noqa: F405
