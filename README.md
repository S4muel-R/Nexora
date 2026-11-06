# Nexora

Plataforma web de gestión educativa para kínderes, escuelas y colegios. La primera versión reúne la información de
estudiantes, docentes y grupos, el registro de asistencia y la consulta de reportes básicos, con acceso según la función
de cada persona.

## Estructura del repositorio

- [`backend/`](backend) — API en Django + Django REST Framework, pruebas con pytest.
- [`frontend/`](frontend) — interfaz en React + TypeScript (Vite), pruebas con Vitest.
- [`Docs/`](Docs/README.md) — documentación del proyecto (planificación, requisitos, diseño, desarrollo, pruebas y entregables).
- [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — integración continua: análisis estático, pruebas, cobertura, compilación y pruebas de sistema.
- [`scripts/md2docx.py`](scripts/md2docx.py) — genera los `.docx` de `Docs/06-Entregables/` a partir de los `.md` (requiere `pip install python-docx`).

## Ejecutar con Docker

```bash
docker compose up --build
```

Interfaz en http://localhost:5173 y API en http://localhost:8000/api/v1/health/.

## Ejecutar sin Docker

Backend (usa SQLite si no se define `DATABASE_URL`):

```bash
cd backend
python -m venv .venv
.venv/Scripts/pip install -r requirements-dev.txt
.venv/Scripts/python manage.py migrate --settings=config.settings_test
.venv/Scripts/python manage.py runserver --settings=config.settings_test
```

Frontend:

```bash
cd frontend
npm ci
npm run dev
```

## Pruebas

```bash
cd backend && .venv/Scripts/python -m pytest --cov
cd frontend && npm run coverage
cd frontend && npm run e2e
```

`npm run e2e` levanta la API con datos ficticios (`manage.py seed_demo`) y la interfaz, y ejecuta los recorridos de
Playwright en computadora y teléfono. Las capturas de evidencia quedan en `Docs/05-Pruebas/evidencias/e2e/`.

Variantes:

- `E2E_PREVIEW=1 npm run e2e` prueba la versión compilada (`vite build` + `vite preview`), que es la que se entrega.
- Con `NEXORA_LATENCIA_MAX_MS=700` en el ambiente de la API, cada petición tarda entre 0 y 700 ms: sirve para encontrar
  errores que dependen del orden de las respuestas (ejecutar con `--retries=0`).

La sesión vive en una cookie HttpOnly con protección CSRF; la interfaz y la API deben compartir el host (`localhost`) y
el origen de la interfaz debe estar en `CORS_ALLOWED_ORIGINS`.

## Forma de trabajo

Ramas, commits, revisiones y Pull Requests siguen los [estándares del proyecto](Docs/01-Planificacion/Estandares.md).
Todo cambio entra a `main` por Pull Request con CI en verde y la aprobación de otro integrante.
