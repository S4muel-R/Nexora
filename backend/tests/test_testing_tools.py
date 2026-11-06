"""Middleware de latencia para las pruebas de robustez (core.testing, ACR-03)."""

from django.test import RequestFactory

from core import testing


def test_latencia_aleatoria_solo_en_la_api(monkeypatch):
    monkeypatch.setenv("NEXORA_LATENCIA_MAX_MS", "500")
    pauses = []
    monkeypatch.setattr(testing.time, "sleep", pauses.append)
    middleware = testing.random_latency(lambda request: "respuesta")
    factory = RequestFactory()

    assert middleware(factory.get("/api/v1/health/")) == "respuesta"
    assert middleware(factory.get("/admin/")) == "respuesta"
    assert len(pauses) == 1
    assert 0 <= pauses[0] <= 0.5


def test_sin_variable_no_hay_latencia(monkeypatch):
    monkeypatch.delenv("NEXORA_LATENCIA_MAX_MS", raising=False)
    pauses = []
    monkeypatch.setattr(testing.time, "sleep", pauses.append)

    testing.random_latency(lambda request: None)(RequestFactory().get("/api/v1/health/"))

    assert pauses == []
