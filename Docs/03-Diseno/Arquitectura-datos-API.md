# Arquitectura, modelo de datos y contrato de API — Nexora

| Campo | Valor |
|---|---|
| Código | S2-05 (incluye la nota técnica S1-07) |
| EDT | 1.2.2.2 |
| Responsable | Luis |
| Versión | 1.3 |
| Fecha | 2026-11-18 |
| Criterio de entrega | Arquitectura, base de datos y API diseñadas |
| Alcance | Incremento del segundo entregable: HU01 – HU07 |

## 1. Arquitectura

```
 Navegador (computadora o teléfono)
        │  HTTPS / JSON
        ▼
 frontend/  React + TypeScript (Vite)
        │  Cookie de sesión HttpOnly + X-CSRFToken
        ▼
 backend/   Django + Django REST Framework
   ├── accounts      usuarios, roles, inicio y cierre de sesión
   ├── institutions  instituciones y niveles
   ├── students      estudiantes
   └── core          aislamiento por institución, formato de errores, estado del servicio
        │
        ▼
 PostgreSQL 16 (Docker y CI)  ·  SQLite (desarrollo local sin Docker)
```

| Decisión | Justificación |
|---|---|
| API REST separada de la interfaz | Permite probar la API de forma aislada (pirámide de pruebas) y usar la interfaz en computadora y teléfono |
| Sesión de Django en cookie HttpOnly con CSRF (desde la v1.2; INC-006) | Es lo que fija el avance 1 (§7.1): JavaScript no puede leer la credencial; las escrituras exigen el token CSRF; vence tras 2 horas sin actividad; cerrar sesión la invalida en el servidor (HU02-E3). La v1.0 usaba el token de DRF en `localStorage` |
| Usuario propio con correo como identificador | Las personas usuarias ingresan con correo (HU01); se define antes de la primera migración |
| Un esquema de base de datos compartido con `institution_id` | Ver sección 2 |

## 2. Nota técnica: aislamiento de información por institución (S1-07)

### Alternativas evaluadas

| Alternativa | Ventajas | Limitaciones |
|---|---|---|
| A. Base de datos por institución | Aislamiento físico total | Alta complejidad operativa (migraciones y respaldos por institución); desproporcionado para un prototipo |
| B. Esquema de PostgreSQL por institución (`django-tenants`) | Aislamiento fuerte dentro de una sola base | Dependencia adicional; no funciona en SQLite; complica las pruebas y el CI |
| C. Esquema compartido con `institution_id` y filtrado obligatorio en la capa de acceso | Simple, portable, fácil de probar; una sola migración | El aislamiento depende de que **todas** las consultas filtren; requiere pruebas específicas |

### Recomendación: alternativa C

1. Toda tabla con datos escolares tiene `institution_id` obligatorio.
2. La institución se toma **siempre del usuario autenticado**, nunca de un parámetro enviado por el cliente.
3. Las vistas heredan de `InstitutionScopedMixin`, que filtra el `queryset` por la institución del usuario y asigna la
   institución al crear. Un recurso de otra institución no está en el `queryset`, por lo que DRF responde 404 (RN02).
4. El rol `platform_admin` no tiene institución y no accede a datos escolares (403).
5. Pruebas automatizadas de aislamiento para cada recurso: listar, consultar, editar y desactivar datos de otra
   institución (HU06).

## 3. Modelo de datos

```
Institution 1 ──── * User          (User.institution es nulo solo para platform_admin)
Institution 1 ──── * Student
Institution 1 ──── * AcademicPeriod (uno vigente)
Institution 1 ──── * Teacher 1 ──── 1 User (rol teacher)
AcademicPeriod 1 ── * Group * ──── * Teacher
Group 1 ──── * Enrollment * ──── 1 Student      (un grupo por estudiante y periodo)
Group 1 ──── * AttendanceRecord * ──── 1 Student (uno por grupo, estudiante y fecha)
AttendanceRecord 1 ──── * AttendanceChange      (historial de correcciones)
```

### `accounts_user`

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | bigint | PK |
| `email` | varchar(254) | Único; se guarda en minúsculas y sin espacios (HU01-E2) |
| `password` | varchar(128) | Hash de Django (RNF01) |
| `first_name`, `last_name` | varchar(150) | Obligatorios |
| `role` | varchar(20) | `platform_admin`, `institution_admin`, `teacher` (RN01) |
| `institution_id` | FK → institution | Obligatorio salvo para `platform_admin` (restricción en BD) |
| `is_active` | boolean | Falso impide iniciar sesión (RN06) |

### `institutions_institution`

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | bigint | PK |
| `name` | varchar(150) | Único sin distinguir mayúsculas (RN03) |
| `levels` | JSON (lista) | Valores `preescolar`, `primaria`, `secundaria`; al menos uno, sin repetidos |
| `address` | varchar(255) | Opcional |
| `phone` | varchar(30) | Opcional |
| `email` | varchar(254) | Opcional, formato válido |
| `is_active` | boolean | Por defecto verdadero |
| `created_at`, `updated_at` | timestamp | Automáticos |

### `students_student`

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | bigint | PK |
| `institution_id` | FK → institution | Obligatorio; lo asigna el servidor |
| `identification` | varchar(20) | 5 – 20 caracteres `[A-Za-z0-9-]`; **único por institución** (restricción en BD, RN04) |
| `first_name`, `last_name` | varchar(100) | Obligatorios |
| `birth_date` | date | No futura (RN05) |
| `level` | varchar(20) | Uno de los niveles de la institución (RN05) |
| `is_active` | boolean | Borrado lógico (RN06) |
| `created_at`, `updated_at` | timestamp | Automáticos |

### `academics_academicperiod` (HU05-E5)

| Campo | Tipo | Reglas |
|---|---|---|
| `institution_id` | FK → institution | Lo asigna el servidor |
| `name` | varchar(50) | Único por institución sin distinguir mayúsculas |
| `start_date`, `end_date` | date | Fin posterior o igual al inicio |
| `is_current` | boolean | Al marcar uno como vigente, los demás de la institución dejan de serlo |

### `academics_teacher` (HU08)

| Campo | Tipo | Reglas |
|---|---|---|
| `institution_id` | FK → institution | Lo asigna el servidor |
| `user_id` | FK única → user | Cuenta con rol `teacher` creada junto con el docente; correo único |
| `is_active` | boolean | Desactivar al docente desactiva su cuenta (HU08-E2) |

### `academics_group` y `academics_enrollment` (HU09)

| Campo | Tipo | Reglas |
|---|---|---|
| `group.period_id`, `group.level`, `group.code` | FK, varchar | Periodo y nivel de la institución; código único por periodo sin distinguir mayúsculas (CA12) |
| `group.teachers` | M2M → teacher | Solo docentes activos de la institución |
| `enrollment.student_id`, `enrollment.period_id` | FK | Estudiante activo del mismo nivel; **único por estudiante y periodo** (restricción en BD, CA14) |

### `attendance_attendancerecord` y `attendance_attendancechange` (HU10)

| Campo | Tipo | Reglas |
|---|---|---|
| `record.group_id`, `student_id`, `date` | FK, date | Único por grupo, estudiante y fecha (CA18); fecha no futura y dentro del periodo |
| `record.status` | varchar(10) | `presente` o `ausente` |
| `change.previous_status`, `new_status`, `reason`, `changed_by_id`, `changed_at` | — | Motivo obligatorio (CA20); conserva valor anterior, nuevo, autor y fecha (CA19) |

## 4. Contrato de API (`/api/v1`)

Todas las rutas exigen la cookie de sesión `sessionid` (HttpOnly, `SameSite=Lax`) salvo las marcadas como públicas; las
peticiones que escriben (POST, PATCH) envían además el encabezado `X-CSRFToken` con el valor de la cookie `csrftoken`.
Sin sesión válida la API responde `401`. Los errores siguen el formato de los Estándares, sección 3.

### Autenticación

| Método y ruta | Rol | Cuerpo | Respuesta |
|---|---|---|---|
| `GET /auth/csrf/` (pública) | — | — | `204` y cookie `csrftoken` (legible por la interfaz) |
| `POST /auth/login/` (pública; ignora cualquier sesión o encabezado anterior, INC-007) | — | `{ "email", "password" }` | `200 { "user": { "id", "email", "first_name", "last_name", "role", "institution": { "id", "name" } \| null } }` y cookie `sessionid` · `400 invalid_credentials` · `403 account_disabled` |
| `POST /auth/logout/` | Cualquiera | — | `204`; invalida la sesión en el servidor y vacía la cookie. La interfaz cierra la sesión de inmediato y, si la petición no se confirma, la repite al volver a abrir (INC-009) |
| `GET /auth/me/` | Cualquiera | — | `200` usuario actual · `401` |

### Instituciones

| Método y ruta | Rol | Cuerpo | Respuesta |
|---|---|---|---|
| `GET /institutions/` | `platform_admin` | — | `200` lista |
| `POST /institutions/` | `platform_admin` | `{ "name", "levels", "address", "phone", "email", "admin": { "email", "first_name", "last_name", "password" } }` | `201` · `400` campos · `409` nombre duplicado |
| `GET, PATCH /institutions/{id}/` | `platform_admin` | Campos de la institución | `200` · `404` |
| `GET, PATCH /my-institution/` | `institution_admin` (GET también `teacher`) | Campos de la institución, sin `admin` | `200` · `400` (incluye nivel con estudiantes activos, HU05-E4) · `403` |

`institution_admin` y `teacher` reciben `404` en `/institutions/{id}/` (HU06-E4).

### Estudiantes

| Método y ruta | Rol | Cuerpo / parámetros | Respuesta |
|---|---|---|---|
| `GET /students/` | `institution_admin`, `teacher` | `?search=texto` · `?include_inactive=true` | `200` lista de la institución del usuario |
| `POST /students/` | `institution_admin` | `{ "identification", "first_name", "last_name", "birth_date", "level" }` | `201` · `400` campos · `409` identificación duplicada |
| `GET /students/{id}/` | `institution_admin`, `teacher` | — | `200` · `404` si es de otra institución |
| `PATCH /students/{id}/` | `institution_admin` | Campos editables, incluido `is_active` | `200` · `400` · `404` · `409` |

### Periodos, docentes y grupos (HU05-E5, HU08, HU09)

| Método y ruta | Roles | Cuerpo / parámetros | Respuestas |
|---|---|---|---|
| `GET, POST /periods/` · `PATCH /periods/{id}/` | `institution_admin` (docente solo consulta) | `{ "name", "start_date", "end_date", "is_current" }` | `200/201` · `400` fechas · `409` nombre repetido |
| `GET, POST /teachers/` · `PATCH /teachers/{id}/` | `institution_admin` | `{ "first_name", "last_name", "email", "password", "is_active" }` · `?include_inactive=true` | `201` · `400` · `409` correo en uso · `403` docente |
| `GET, POST /groups/` · `GET, PATCH /groups/{id}/` | `institution_admin`; el docente consulta solo sus grupos | `{ "code", "level", "period" }` · `?period=` | `201` · `409` código repetido · `404` grupo ajeno o sin asignación |
| `POST /groups/{id}/students/` · `DELETE /groups/{id}/students/{student}/` | `institution_admin` | `{ "students": [ids] }` | `200` grupo actualizado · `400` inactivo, otro nivel u otra institución · `409` ya tiene grupo en el periodo |
| `POST /groups/{id}/transfer/` | `institution_admin` | `{ "student", "target_group" }` | `200` · `400` destino de otro periodo o nivel |
| `POST /groups/{id}/teachers/` · `DELETE /groups/{id}/teachers/{teacher}/` | `institution_admin` | `{ "teachers": [ids] }` | `200` · `400` docente desactivado |

### Asistencia y reportes (HU10 – HU12)

| Método y ruta | Roles | Cuerpo / parámetros | Respuestas |
|---|---|---|---|
| `GET /attendance/?group=&date=` | `institution_admin`; docente asignado | — | `200` lista con estado, registro y correcciones · `404` grupo ajeno |
| `POST /attendance/` | Docente asignado al grupo | `{ "group", "date", "entries": [{ "student", "status" }] }` | `201` · `400` faltan estudiantes, fecha futura o fuera del periodo · `403` personal administrativo · `409` ya registrada (modo corrección) |
| `POST /attendance/{id}/correct/` | Docente asignado al grupo | `{ "status", "reason" }` | `200` con el cambio · `400` "El motivo es obligatorio." |
| `GET /reports/groups/?level=&period=` · `GET /reports/students/?level=&group=` | `institution_admin` | — | `200` lista (vacía si no hay resultados) · `403` docente |
| `GET /reports/attendance/?group=&start=&end=` | `institution_admin`; docente asignado | — | `200` presentes, ausentes, sin registro y porcentaje por estudiante y del grupo · `400` rango invertido |

`POST /auth/logout/` elimina la sesión en el servidor y, desde INC-012, no envía la cookie de sesión vacía: una
respuesta tardía no puede borrar la sesión iniciada después (`core/middleware.py`).

### Desviación corregida respecto del avance 1 (INC-006)

La versión 1.0 de este contrato usaba `Authorization: Token` con el token guardado en `localStorage`, lo que contradecía
la sección 7.1 del avance 1. La revisión de seguridad del 2026-11-05 lo detectó (CP-SEG04) y CC-13 lo corrigió con la
sesión en cookie descrita arriba (commit `796cef8`). Ver la [Revisión de seguridad](../05-Pruebas/Revision-seguridad.md).

Para un ambiente publicado, `DJANGO_HTTPS=true` activa la redirección a HTTPS, las cookies seguras y HSTS (INC-003).

## 5. Pantallas del prototipo (S2-07)

| # | Pantalla | Rol | Historias | Versión móvil |
|---|---|---|---|---|
| 1 | Inicio de sesión | Todos | HU01 | Sí |
| 2 | Inicio (menú por rol) y cierre de sesión | Todos | HU02, HU03 | Sí, menú compacto |
| 3 | Instituciones: lista | `platform_admin` | HU04 | Sí, tarjetas |
| 4 | Instituciones: registro con administrador | `platform_admin` | HU04 | Sí |
| 5 | Mi institución: consulta y actualización | `institution_admin` | HU05 | Sí |
| 6 | Estudiantes: lista con búsqueda, registro, edición y desactivación | `institution_admin`, `teacher` (consulta) | HU07 | Sí, tarjetas |
| 7 | Mi institución: periodos lectivos | `institution_admin`, `teacher` (consulta) | HU05-E5 | Sí, tarjetas |
| 8 | Docentes: lista, registro con cuenta, edición y desactivación | `institution_admin` | HU08 | Sí, tarjetas |
| 9 | Grupos: lista por periodo, creación y detalle con asignaciones y traslados | `institution_admin`, `teacher` (sus grupos) | HU09 | Sí, tarjetas |
| 10 | Asistencia: lista por grupo y fecha, modo corrección con motivo e historial | `teacher` (sus grupos), `institution_admin` (consulta) | HU10 | Sí |
| 11 | Reportes: listados por grupo y estudiante, resumen de asistencia | `institution_admin`; `teacher` solo el resumen de sus grupos | HU11, HU12 | Sí, tarjetas |

El prototipo se construye directamente en React; las capturas en computadora (1280 px) y teléfono (390 px) se guardan
en `Docs/03-Diseno/prototipo/`.
