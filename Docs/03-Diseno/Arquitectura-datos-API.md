# Arquitectura, modelo de datos y contrato de API — Nexora

| Campo | Valor |
|---|---|
| Código | S2-05 (incluye la nota técnica S1-07) |
| EDT | 1.2.2.2 |
| Responsable | Luis |
| Versión | 1.0 |
| Fecha | 2026-11-04 |
| Criterio de entrega | Arquitectura, base de datos y API diseñadas |
| Alcance | Incremento del segundo entregable: HU01 – HU07 |

## 1. Arquitectura

```
 Navegador (computadora o teléfono)
        │  HTTPS / JSON
        ▼
 frontend/  React + TypeScript (Vite)
        │  Authorization: Token <token>
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
| Autenticación por token de DRF | Simple, sin dependencias adicionales; cerrar sesión elimina el token (HU02-E3) |
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

## 4. Contrato de API (`/api/v1`)

Todas las rutas exigen `Authorization: Token <token>` salvo las marcadas como públicas. Los errores siguen el formato de
los Estándares, sección 3.

### Autenticación

| Método y ruta | Rol | Cuerpo | Respuesta |
|---|---|---|---|
| `POST /auth/login/` (pública) | — | `{ "email", "password" }` | `200 { "token", "user": { "id", "email", "first_name", "last_name", "role", "institution": { "id", "name" } \| null } }` · `400 invalid_credentials` · `403 account_disabled` |
| `POST /auth/logout/` | Cualquiera | — | `204` (elimina el token) |
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

## 5. Pantallas del prototipo (S2-07)

| # | Pantalla | Rol | Historias | Versión móvil |
|---|---|---|---|---|
| 1 | Inicio de sesión | Todos | HU01 | Sí |
| 2 | Inicio (menú por rol) y cierre de sesión | Todos | HU02, HU03 | Sí, menú compacto |
| 3 | Instituciones: lista | `platform_admin` | HU04 | Sí, tarjetas |
| 4 | Instituciones: registro con administrador | `platform_admin` | HU04 | Sí |
| 5 | Mi institución: consulta y actualización | `institution_admin` | HU05 | Sí |
| 6 | Estudiantes: lista con búsqueda, registro, edición y desactivación | `institution_admin`, `teacher` (consulta) | HU07 | Sí, tarjetas |

El prototipo se construye directamente en React; las capturas en computadora (1280 px) y teléfono (390 px) se guardan
en `Docs/03-Diseno/prototipo/`.
