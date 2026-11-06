# Revisión de seguridad — Nexora

| Campo | Valor |
|---|---|
| Referencia | Avance 1, secciones 7.1 y 7.2 (OWASP ASVS 5.0 como guía) · Anexo de correcciones, sección 7 |
| Alcance | Incremento HU01 – HU07 (API Django + DRF, interfaz React), repositorio y dependencias |
| Versión | 1.0 |
| Fecha | 2026-11-05 |
| Responsable | Samuel (ejecución) · Luis (revisión pendiente) |
| Ejecuciones | EJ-15, EJ-16, EJ-18 del [Registro de ejecución](Registro-de-ejecucion.md) |

> Como fija el avance 1, se seleccionan controles pertinentes de OWASP ASVS 5.0; **no se declara una verificación
> integral de ASVS** ni una auditoría de seguridad. Los controles marcados como pendientes quedan en el backlog.

## 1. Pruebas y herramientas

| Revisión | Herramienta y comando | Resultado | Evidencia |
|---|---|---|---|
| Acceso no autorizado y aislamiento entre las 3 instituciones ficticias | pytest (CP-A07, CP-A13 – CP-A15, CP-A22, CP-A23), Playwright (CP-S06, CP-S10) | Todos los intentos rechazados: 401 sin sesión, 403 por rol, 404 para recursos de otra institución (RN02) | `evidencias/EV_pytest_ejecucion-4_20261105.txt` · CI con PostgreSQL (EJ-11, EJ-19) |
| Dependencias del frontend | `npm audit`, `npm audit --omit=dev` | Antes: 2 críticos y 11 moderados en desarrollo (**INC-005**). Después: 0 en producción; 7 moderados aceptados | `evidencias/seguridad/EV_SEG-npm-audit_*` |
| Dependencias del backend | `pip-audit -r requirements.txt` (2.9.0) | 0 vulnerabilidades en 10 paquetes | `evidencias/seguridad/EV_SEG-pip-audit_20261105.txt` |
| Secretos en el repositorio | `scripts/secret_scan.py` sobre `git log -p --all` (23 commits) | 7 coincidencias, todas valores de prueba ficticios (ver sección 3) | `evidencias/seguridad/EV_SEG-secretos_20261105.txt` |
| Configuración de despliegue | `manage.py check --deploy` | Antes: W004, W008, W012, W016 (**INC-003**). Después, con `DJANGO_HTTPS=true`: solo W021 (aceptada) | `evidencias/EV_INC-003_check-deploy_20261105.txt` |
| Gestión de la sesión contra la arquitectura aprobada | Revisión de código | Token en `localStorage` en lugar de cookie HttpOnly con CSRF (**INC-006**, abierto) | Sección 2, control V3 |
| Sesión anterior inválida | Playwright con la API retrasada (CP-S19), pytest (CP-A27) | Un token viejo impedía iniciar sesión o cerraba la nueva (**INC-007**, corregido) | `evidencias/EV_INC-007_*` |

## 2. Matriz de controles (selección de OWASP ASVS 5.0)

| Capítulo ASVS | Control seleccionado | Cómo se cumple en Nexora | Verificación | Estado |
|---|---|---|---|---|
| V6 Autenticación | Las contraseñas se guardan con un algoritmo de hash adecuado | Hash de Django (PBKDF2) | CP-A23 | Cumple |
| V6 Autenticación | Mensaje genérico ante credenciales inválidas (no revela si el correo existe) | RN07 | CP-A03, CP-S02 | Cumple |
| V6 Autenticación | Las cuentas e instituciones desactivadas no pueden iniciar sesión | RN06 | CP-A04 | Cumple |
| V6 Autenticación | Límite de intentos fallidos o protección contra fuerza bruta | No implementado | — | **Pendiente** (Sprint 7, S7-05) |
| V3 Gestión de sesiones | El cierre de sesión invalida la credencial en el servidor | `logout` elimina el token | CP-A06, CP-S04 | Cumple |
| V3 Gestión de sesiones | La credencial de sesión no es accesible desde JavaScript y las escrituras usan protección CSRF (avance 1, §7.1) | Token en `localStorage` y encabezado `Authorization` | CP-SEG04 | **No cumple → INC-006** |
| V3 Gestión de sesiones | Una credencial anterior inválida no interfiere con una sesión nueva | Inicio de sesión sin autenticación previa; 401 solo para el token vigente | CP-A27, CP-U06, CP-S19 | Cumple tras INC-007 |
| V3 Gestión de sesiones | Vencimiento de la sesión por inactividad | El token no vence | — | **Pendiente** (se decide con CC-13) |
| V8 Autorización | La autorización se comprueba en el servidor, no solo ocultando botones | `core/permissions.py`, `IsAuthenticated` por defecto | CP-A07, CP-A22, CP-A23 | Cumple |
| V8 Autorización | Acceso a recursos limitado a la institución del usuario (control de acceso por registro) | `InstitutionScopedMixin`; 404 para recursos ajenos | CP-A13 – CP-A15, CP-S10 | Cumple |
| V8 Autorización | La administración de la plataforma no tiene acceso académico automático (avance 1, §7.1) | `IsInstitutionMember` | CP-A07 (`test_hu03_e2_plataforma_no_accede_a_gestion_escolar`) | Cumple |
| V2 Validación | Validación de entradas en el servidor con mensajes claros | Serializadores de DRF; RN03 – RN05 | CP-A09 – CP-A12, CP-A19 – CP-A21 | Cumple |
| V16 Errores y registros | Los errores no exponen trazas ni detalles internos | `core/exceptions.py` (500 sin traza) | CP-A24 | Cumple |
| V12 Comunicaciones seguras | HTTPS, HSTS y cookies seguras en un ambiente publicado | `DJANGO_HTTPS` | CP-A26 | Cumple tras INC-003 (sin ambiente publicado todavía) |
| V13 Configuración | Sin secretos en el código ni en el historial; clave obligatoria fuera de desarrollo | `DJANGO_SECRET_KEY` obligatoria con `DEBUG=false` | CP-SEG03 | Cumple |
| V15 Arquitectura segura | Dependencias sin vulnerabilidades conocidas | `npm audit`, `pip-audit` | CP-SEG01, CP-SEG02 | Cumple con riesgo residual (INC-005) |
| V3 / V14 Encabezados | Política de seguridad de contenido (CSP) en la interfaz | No implementada | — | **Pendiente** (mitigación de INC-006) |

Resumen: 13 controles cumplen, 1 no cumple (INC-006) y 3 están pendientes en el backlog.

## 3. Coincidencias de la búsqueda de secretos

| Coincidencia | Archivo | Valoración |
|---|---|---|
| `SECRET_KEY = "solo-para-desarrollo-local"` | `backend/config/settings.py` | Solo se usa con `DEBUG=true`; con `DEBUG=false` la clave es obligatoria por variable de entorno |
| Contraseña de las cuentas ficticias | `seed_demo.py`, `frontend/e2e/helpers.ts` | Datos de prueba de instituciones ficticias, solo para el ambiente local y el CI |
| Contraseña de las pruebas | `backend/tests/conftest.py` | Usuarios creados y borrados por la suite |
| `postgres://nexora:nexora@…` | `ci.yml`, `.env.example`, `docker-compose.yml` | Base local o del servicio temporal del CI, sin datos reales |

No se encontraron tokens de GitHub, de Atlassian, claves de nube ni claves privadas.

## 4. Riesgo residual aceptado

| Riesgo | Motivo | Revisión |
|---|---|---|
| 7 avisos moderados de minimatch 10.2.6 (vía typescript-eslint) | La corrección exige minimatch 11 (9 días de publicada) y typescript-eslint aún no la admite; solo afecta a la herramienta de análisis con patrones del propio equipo | Sprint 4 |
| W021: no se solicita la lista de precarga HSTS | Decisión casi irreversible para un dominio; no corresponde a un prototipo | Al publicar un ambiente |
