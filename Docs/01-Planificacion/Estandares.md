# Estándares del proyecto Nexora

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-11-04 |
| Referencia | Instrucciones del Proyecto Integrador, sección 10 |
| Cumplimiento | Lo verifica la revisión de cada Pull Request (sección 8) y, cuando es automatizable, GitHub Actions |

## 1. Programación

| Área | Estándar | Verificación automática |
|---|---|---|
| Backend (Python 3.12+, Django, DRF) | PEP 8; líneas de máximo 100 caracteres; anotaciones de tipo en funciones públicas | `ruff check` y `ruff format --check` en CI |
| Frontend (TypeScript, React) | Modo `strict` de TypeScript; componentes funcionales con hooks; sin `any` salvo justificación | `eslint` y `tsc --noEmit` en CI |
| Lógica de negocio | En el backend (serializadores, servicios y permisos), nunca solo en la interfaz | Revisión de PR |
| Pruebas | Toda funcionalidad nueva entra con pruebas; un defecto corregido entra con una prueba que lo reproduce | Revisión de PR + cobertura en CI |

## 2. Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Módulos y apps de Django | `snake_case`, en inglés | `institutions`, `students` |
| Clases Python | `PascalCase` | `InstitutionSerializer` |
| Funciones y variables Python | `snake_case` | `get_active_students` |
| Componentes React y sus archivos | `PascalCase` | `LoginPage.tsx` |
| Funciones, variables y hooks TS | `camelCase`; hooks con prefijo `use` | `useAuth` |
| Rutas de la API | Sustantivos en plural, `kebab-case`, versionadas | `/api/v1/institutions/` |
| Identificadores de artefactos | `RF01`, `HU01`, `HU01-E1` (escenario), `CP-001` (caso), `INC-001` (incidente), `CC-01` (cambio), `R01` (riesgo) | — |
| Evidencias | `EV_<CP|INC>-<id>_<paso|falla|reprueba>_<AAAAMMDD>.png` | `EV_INC-003_falla_20261106.png` |

El código se escribe en inglés y la interfaz y la documentación en español.

## 3. Tratamiento de errores

- La API responde siempre con el mismo formato de error:

  ```json
  { "error": { "code": "validation_error", "message": "Texto para la persona usuaria", "fields": { "email": ["..."] } } }
  ```

- Códigos HTTP: `400` datos inválidos, `401` sin sesión, `403` sin permiso, `404` no existe **o pertenece a otra
  institución** (no se revela su existencia), `409` duplicado, `500` error interno.
- El backend registra los errores 500 con su traza; nunca la envía al cliente.
- La interfaz muestra `message` en lenguaje claro, marca los campos de `fields` y nunca muestra trazas técnicas.

## 4. Base de datos

- PostgreSQL 16 en Docker y en CI; SQLite solo como alternativa local sin Docker.
- Tablas y columnas en `snake_case`; claves primarias `id`; claves foráneas `<entidad>_id`.
- Toda tabla con datos de una institución tiene `institution_id` obligatorio; las consultas se filtran siempre por la
  institución del usuario autenticado (aislamiento, nota técnica S1-07).
- Unicidad declarada en la base de datos, no solo en el código (por ejemplo, identificación del estudiante por
  institución).
- Cambios de esquema solo mediante migraciones de Django versionadas en el repositorio.
- Borrado lógico (`is_active = false`) para estudiantes, docentes y usuarios.

## 5. Documentación

- Fuentes en Markdown dentro de `Docs/`; versión `.docx` en `Docs/06-Entregables/` para OneDrive.
- Cada documento inicia con una tabla de control: código, EDT, responsable, versión, fecha y criterio de entrega.
- Los documentos de pruebas siguen la estructura de ISO/IEC/IEEE 29119-3.
- Cada documento termina con su historial de versiones.

## 6. Gestión del proyecto

- Jira (`ADLCDS`) es la fuente de verdad del backlog: historias, tareas, errores y sprints.
- Estados: **Por hacer → En curso → En revisión → Finalizada**. Una tarea pasa a *Finalizada* solo si cumple su
  criterio de entrega y su PR está integrado.
- Cada sprint cierra con Sprint Review grabado y su análisis de ejecución (sección 4.2 de las instrucciones).
- Daily Scrum grabado y guardado en OneDrive / Grabaciones del Proyecto.

## 7. Control de versiones

- Rama principal `main`, protegida: sin push directo; todo entra por Pull Request.
- Ramas: `<tipo>/<CLAVE-JIRA>-<descripcion-corta>`, con tipo `feature`, `fix`, `docs`, `test`, `chore`.
  Ejemplo: `feature/ADLCDS-33-login`.
- Mensajes de commit: `<tipo>: <descripción en presente>`, con tipo `feat`, `fix`, `docs`, `test`, `refactor`,
  `chore`, `ci`. Se menciona la clave de Jira cuando aplica: `fix: valida duplicados de estudiantes (ADLCDS-120)`.
- Integración por *squash merge* para mantener un historial legible.

## 8. Revisiones

- Todo PR requiere **una aprobación de otro integrante** y CI en verde.
- La persona revisora usa la lista de la plantilla de PR (`.github/pull_request_template.md`): cumple el criterio de
  aceptación, incluye pruebas, respeta los estándares, no expone datos sensibles, actualiza la documentación.
- Los requisitos se revisan por pares con la lista de chequeo de la sección 7 de las instrucciones.
- Los hallazgos de revisión se responden en el PR; los que se convierten en defecto se registran en Jira.

## 9. Seguridad

- Contraseñas con el hash por defecto de Django; nunca en texto plano ni en el repositorio.
- Secretos (clave de Django, credenciales de BD) por variables de entorno; `.env` excluido de Git; `.env.example`
  documenta las variables.
- Autenticación por token; toda ruta de la API exige sesión salvo inicio de sesión y estado del servicio.
- Permisos por rol (administración de la plataforma, administrativo, docente) y por institución en cada vista.
- Solo datos ficticios en desarrollo y pruebas.

## 10. Historial de versiones

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 2026-11-04 | Versión inicial. |
