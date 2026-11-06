# Nexora

Plataforma web de gestión educativa para kínderes, escuelas y colegios. La primera versión reúne la información de
estudiantes, docentes y grupos, el registro de asistencia y la consulta de reportes básicos, con acceso según la función
de cada persona.

## Estructura del repositorio

- [`backend/`](backend) — API en Django + Django REST Framework, pruebas con pytest.
- [`frontend/`](frontend) — interfaz en React + TypeScript (Vite), pruebas con Vitest.
- [`Docs/`](Docs/README.md) — documentación del proyecto (planificación, requisitos, diseño, desarrollo, pruebas y entregables).
- [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — integración continua: análisis estático, pruebas, cobertura y compilación.

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
cd frontend && npm test
```

## Forma de trabajo

Ramas, commits, revisiones y Pull Requests siguen los [estándares del proyecto](Docs/01-Planificacion/Estandares.md).
Todo cambio entra a `main` por Pull Request con CI en verde y la aprobación de otro integrante.
