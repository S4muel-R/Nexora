"""Herramientas de prueba que no se activan en producción."""

import os
import random
import time


def random_latency(get_response):
    """Retrasa cada petición a la API entre 0 y NEXORA_LATENCIA_MAX_MS milisegundos.

    Se usa en las pruebas de robustez (ACR-03); sin la variable no hace nada.
    """
    max_seconds = int(os.environ.get("NEXORA_LATENCIA_MAX_MS", "0")) / 1000

    def middleware(request):
        if max_seconds and request.path.startswith("/api/"):
            time.sleep(random.uniform(0, max_seconds))
        return get_response(request)

    return middleware
