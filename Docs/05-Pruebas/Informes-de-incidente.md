# Informes de incidente (registro de defectos) — Nexora

| Campo | Valor |
|---|---|
| Norma | ISO/IEC/IEEE 29119-3, "Incident Report" · clasificación por ISO/IEC 25010:2023 |
| Referencia | Instrucciones del Proyecto Integrador, sección 16 · Anexo de correcciones del avance 1, secciones 7 y 9 |
| Versión | 1.1 |
| Fecha | 2026-11-05 |
| Fuente oficial | Jira ADLCDS, tipo *Bug* (ADLCDS-103, 104 y 117 – 123) |

Ciclo de vida: **Detección → Registro → Clasificación → Análisis → Asignación → Corrección → Reprueba → Cierre**.
En Jira: *Por hacer* (registrado y asignado) → *En curso* (en corrección o corregido pendiente de integración) →
*Listo* (reprobado e integrado en `main`).

Severidad según el [Plan de pruebas](Plan-de-pruebas.md), sección 9 (v1.1): **Crítica** expone datos de otra
institución, impide de forma sostenida iniciar sesión o pierde información; **Alta** una función principal no cumple
su escenario, aunque sea de forma intermitente, o la sesión queda expuesta en un equipo compartido; **Media** falla con
alternativa o es un riesgo de seguridad que requiere otra condición; **Baja** confunde sin impedir la tarea.

## Resumen

| ID | Jira | Título | Módulo | Severidad | Prioridad | ISO/IEC 25010 | Detección | Estado |
|---|---|---|---|---|---|---|---|---|
| INC-001 | [ADLCDS-103](https://proyectosulacit.atlassian.net/browse/ADLCDS-103) | Estudiante registrado queda inactivo con datos de formulario | API de estudiantes | Alta | Alta | Adecuación funcional | Prueba automatizada de API (EJ-01) y CI de PR #4 | Corregido y reprobado · pendiente de integrar |
| INC-002 | [ADLCDS-104](https://proyectosulacit.atlassian.net/browse/ADLCDS-104) | Mensaje técnico al dejar vacía la fecha de nacimiento | Estudiantes (interfaz y API) | Baja | Media | Capacidad de interacción | Prueba exploratoria (EJ-06) | Corregido y reprobado · pendiente de integrar |
| INC-003 | [ADLCDS-118](https://proyectosulacit.atlassian.net/browse/ADLCDS-118) | Sin configuración HTTPS para un ambiente publicado | Configuración del backend | Media | Media | Seguridad | `manage.py check --deploy` (EJ-16) | Corregido y reprobado · pendiente de integrar |
| INC-004 | [ADLCDS-119](https://proyectosulacit.atlassian.net/browse/ADLCDS-119) | El formulario de estudiante se puede usar antes de cargar los niveles (reabierto una vez) | Estudiantes (interfaz) | Media | Alta | Adecuación funcional | CI de PR #9 (intermitente) y #10 (EJ-11); reabierto en EJ-21 | Corregido y reprobado · pendiente de integrar |
| INC-005 | [ADLCDS-120](https://proyectosulacit.atlassian.net/browse/ADLCDS-120) | Dependencias de desarrollo con avisos de seguridad críticos | Frontend (herramientas) | Media | Media | Seguridad | `npm audit` (EJ-15) | Corregido · 7 avisos moderados aceptados |
| INC-006 | [ADLCDS-121](https://proyectosulacit.atlassian.net/browse/ADLCDS-121) | La sesión usa un token en `localStorage` en lugar de cookie HttpOnly con CSRF | Autenticación (interfaz y API) | Media | Alta | Seguridad | Revisión de código contra el avance 1 (CP-SEG04, EJ-15) | Corregido y reprobado · pendiente de integrar |
| INC-007 | [ADLCDS-117](https://proyectosulacit.atlassian.net/browse/ADLCDS-117) | Una sesión anterior inválida impide o cierra el nuevo inicio de sesión | Autenticación (interfaz y API) | Alta | Alta | Fiabilidad · Seguridad | CI de PR #11 (intermitente, EJ-17) | Corregido y reprobado · pendiente de integrar |
| INC-008 | [ADLCDS-123](https://proyectosulacit.atlassian.net/browse/ADLCDS-123) | Una carga repetida de Mi institución sobrescribe lo que se está escribiendo | Mi institución (interfaz) | Baja | Media | Adecuación funcional | CI de PR #11 con `failOnFlakyTests` (EJ-20) | Corregido y reprobado · pendiente de integrar |
| INC-009 | [ADLCDS-122](https://proyectosulacit.atlassian.net/browse/ADLCDS-122) | Cerrar sesión y recargar enseguida restaura la sesión | Autenticación (interfaz) | Alta | Alta | Seguridad | Suite con API lenta (EJ-21) | Corregido y reprobado · pendiente de integrar |

---

## INC-001 — Estudiante registrado queda inactivo cuando los datos se envían como formulario

| Campo | Valor |
|---|---|
| Identificador | INC-001 · Jira [ADLCDS-103](https://proyectosulacit.atlassian.net/browse/ADLCDS-103) |
| Descripción | Al registrar un estudiante con datos de formulario (`multipart/form-data`) sin el campo `is_active`, la API responde 201 pero guarda al estudiante como inactivo, por lo que no aparece en la lista. |
| Módulo afectado | Backend · `students/serializers.py` · `POST /api/v1/students/` |
| Historia / escenario | HU07-E1 · RF04 · CA07 (línea base) |
| Caso de prueba | CP-A16 (`test_hu07_e1_registrar_estudiante`) |
| Característica ISO/IEC 25010 | Adecuación funcional → corrección funcional |
| Ambiente | Local, Windows, Python 3.13, SQLite · commit `33870ec`. Reproducido también en GitHub Actions con PostgreSQL 16 (PR #4). |
| Pasos para reproducir | 1. Iniciar sesión como `admin@robles.test`. 2. `POST /api/v1/students/` como formulario con identificación `1-1111-1111`, nombre, apellidos, fecha y nivel, sin `is_active`. 3. `GET /api/v1/students/`. |
| Resultado esperado | Estudiante activo y visible en la lista (HU07-E1). |
| Resultado obtenido | `is_active = false`; la lista no lo muestra. Salida de pytest: `assert student.is_active` → `assert False`. |
| Severidad / prioridad | Alta / Alta — el registro queda oculto y la persona usuaria cree que no se guardó. |
| Responsable | Detección y corrección: Samuel (desde la tarea de Luis, ADLCDS-43) · Reprueba: Samuel; revisión del PR: pendiente Luis |
| Análisis | En DRF, un `BooleanField` ausente en datos de formulario se interpreta como `False`. El serializador exponía `is_active` sin valor por defecto. Con JSON no ocurre, por eso pasó inadvertido en el diseño. Causa raíz en [Análisis de causa raíz](Analisis-causa-raiz.md), ACR-03. |
| Corrección | `extra_kwargs = {"is_active": {"default": True}}`; prueba de regresión para multipart y JSON. Commit `356df07`, rama `fix/ADLCDS-103-estudiante-inactivo` (PR #5). |
| Resultado de reprueba | EJ-02: 56/56 aprobadas, incluida CP-A16. CI de PR #5 en PostgreSQL: 56/56 (EJ-11). |
| Evidencia | Falla: `evidencias/EV_pytest_ejecucion-1_20261104.txt` · `evidencias/EV_INC-001_falla-CI_20261105.txt` (CI, PostgreSQL) · Reprueba: `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · `evidencias/e2e/EV_CP-S11_registrado_*.png` |
| Estado | Corregido y reprobado; se cierra al integrar el PR en `main` con CI en verde. |

---

## INC-002 — Mensaje técnico al dejar vacía la fecha de nacimiento del estudiante

| Campo | Valor |
|---|---|
| Identificador | INC-002 · Jira [ADLCDS-104](https://proyectosulacit.atlassian.net/browse/ADLCDS-104) |
| Descripción | Al guardar el formulario de estudiante sin fecha de nacimiento, el campo muestra "Fecha con formato erróneo. Use uno de los siguientes formatos en su lugar: YYYY-MM-DD.", un mensaje técnico que no indica que el campo está vacío. |
| Módulo afectado | Frontend · Estudiantes (formulario) y Backend · `students/serializers.py` |
| Historia / requisito | HU07-E5 · RF04 · RNF04 |
| Caso de prueba | Sesión exploratoria EXP-01; caso agregado: CP-S13 y variantes de CP-A20 |
| Característica ISO/IEC 25010 | Capacidad de interacción → protección contra errores de la persona usuaria |
| Ambiente | Local, Chrome 1024 px · frontend `45664d9` |
| Pasos para reproducir | 1. Iniciar sesión como `admin@robles.test`. 2. Estudiantes → Registrar estudiante. 3. Pulsar Guardar sin llenar campos. |
| Resultado esperado | Mensaje claro, por ejemplo "Ingrese una fecha de nacimiento válida." |
| Resultado obtenido | Mensaje técnico de formato `YYYY-MM-DD`. |
| Severidad / prioridad | Baja / Media — no impide registrar, pero confunde. |
| Responsable | Detección, corrección y reprueba: Samuel |
| Análisis | El formulario envía la fecha vacía como `""`; DRF la intenta interpretar y devuelve su mensaje de formato. Los estándares pedían mensajes claros, pero no se definieron mensajes propios por tipo de campo. Ver ACR-03. |
| Corrección | Mensajes propios para `required`, `null` e `invalid` en `birth_date`; pruebas de regresión con fecha vacía, nula y mal formada. Commit `5418908`, rama `fix/ADLCDS-104-mensaje-fecha` (PR #8). |
| Resultado de reprueba | API 60/60 (EJ-07); interfaz manual (EJ-08); Playwright CP-S13 en computadora y teléfono (EJ-10, EJ-14, EJ-18). |
| Evidencia | Falla: `evidencias/EV_INC-002_falla_20261104.jpg` · Reprueba: `evidencias/EV_INC-002_reprueba_20261104.jpg` · `evidencias/e2e/EV_CP-S13_mensaje-fecha_*.png` |
| Estado | Corregido y reprobado; se cierra al integrar el PR en `main` con CI en verde. |

---

## INC-003 — Sin configuración HTTPS para un ambiente publicado

| Campo | Valor |
|---|---|
| Identificador | INC-003 · Jira [ADLCDS-118](https://proyectosulacit.atlassian.net/browse/ADLCDS-118) |
| Descripción | Con la configuración de producción (`DEBUG=false`), `manage.py check --deploy` reporta cuatro advertencias de seguridad: W004 (sin HSTS), W008 (sin redirección a HTTPS), W012 (cookie de sesión no segura) y W016 (cookie CSRF no segura). El avance 1 (sección 7) exige HTTPS si se habilita un ambiente en la nube. |
| Módulo afectado | Backend · `config/settings.py` |
| Historia / requisito | RNF de seguridad (avance 1, secciones 7 y 7.2 — OWASP ASVS V14) |
| Caso de prueba | CP-A26 (`test_inc_003_*`) |
| Característica ISO/IEC 25010 | Seguridad → confidencialidad |
| Ambiente | Local, Python 3.13, `DJANGO_DEBUG=0`, clave aleatoria, `DJANGO_ALLOWED_HOSTS=nexora.example` · commit `a487970` |
| Pasos para reproducir | 1. `DJANGO_DEBUG=0 DJANGO_SECRET_KEY=<aleatoria> manage.py check --deploy`. |
| Resultado esperado | Sin advertencias de seguridad para un ambiente HTTPS. |
| Resultado obtenido | 4 advertencias (W004, W008, W012, W016). |
| Severidad / prioridad | Media / Media — no hay ambiente publicado todavía; en uno publicado las credenciales viajarían sin cifrar si no se fuerza HTTPS. |
| Responsable | Detección, corrección y reprueba: Samuel · revisión: pendiente Luis |
| Análisis | El plan técnico no tenía una lista de configuración de despliegue; la revisión de seguridad se hizo por primera vez en este entregable. Ver ACR-04. |
| Corrección | Variable `DJANGO_HTTPS` (falsa por defecto para el desarrollo local) que activa `SECURE_SSL_REDIRECT`, `SECURE_PROXY_SSL_HEADER`, cookies seguras y HSTS. Commit `e867548`, PR #11. W021 (lista de precarga HSTS) se acepta: es una decisión casi irreversible que no corresponde a un prototipo. |
| Resultado de reprueba | CP-A26: con HTTPS solo queda W021; sin HTTPS sigue W008 (la prueba lo verifica). pytest 63/63 (EJ-18). |
| Evidencia | `evidencias/seguridad/EV_INC-003_check-deploy_20261105.txt` (antes y después) · `evidencias/EV_pytest_ejecucion-4_20261105.txt` |
| Estado | Corregido y reprobado; se cierra al integrar el PR #11. |

---

## INC-004 — El nivel no se preselecciona si el formulario se abre antes de cargar los niveles

| Campo | Valor |
|---|---|
| Identificador | INC-004 · Jira [ADLCDS-119](https://proyectosulacit.atlassian.net/browse/ADLCDS-119) |
| Descripción | En una institución con un solo nivel, el formulario "Registrar estudiante" preselecciona ese nivel solo si los niveles ya se cargaron al pulsar el botón. Si `/my-institution/` responde después, el campo Nivel queda en "Seleccione…" y al guardar aparece "Este campo no puede estar en blanco." |
| Módulo afectado | Frontend · `src/pages/StudentsPage.tsx` |
| Historia / escenario | HU07-E1 · RF04 · CA07 |
| Caso de prueba | CP-S11 (detección); CP-U05 y CP-S18 (reprueba) |
| Característica ISO/IEC 25010 | Adecuación funcional → corrección funcional |
| Ambiente | GitHub Actions, Ubuntu, Chromium, PostgreSQL 16 · PR #9 (`218bbd4`, fallo en teléfono que pasó al reintentar) y PR #10 (`a487970`, falló en teléfono dos veces y en computadora una vez) |
| Pasos para reproducir | 1. Iniciar sesión como `admin@robles.test`. 2. Abrir Estudiantes y pulsar Registrar estudiante antes de que termine de cargar la institución (en local: retrasar `/my-institution/` 1,5 s). 3. Llenar identificación, fecha, nombre y apellidos; Guardar. |
| Resultado esperado | Nivel "Primaria" preseleccionado y estudiante registrado (HU07-E1). |
| Resultado obtenido | Nivel vacío; alerta "Los datos enviados no son válidos." y "Este campo no puede estar en blanco." |
| Severidad / prioridad | Media / Alta — el registro falla de forma intermitente; la persona puede elegir el nivel a mano, pero el error no se entiende. |
| Responsable | Detección, corrección y reprueba: Samuel |
| Análisis | `openForm` tomaba la lista de niveles en el momento del clic y no reaccionaba cuando llegaban después. En local la API responde antes del clic, por eso no se veía. El reintento automático del CI ocultó la falla en PR #9. Ver ACR-03. |
| Corrección 1 | Efecto que, con el formulario de registro abierto y un único nivel, lo preselecciona al llegar los niveles. Commit `7a36635`, PR #11. |
| Reprueba 1 | CP-U05 falla sin la corrección y pasa con ella (EJ-13). CP-S18 retrasa la respuesta 1,5 s: falla sin la corrección y pasa con ella (EJ-14). Estabilidad: 5 repeticiones sin reintentos, 0 fallas (EJ-18). |
| **Reapertura** | 2026-11-05 (EJ-21): con la API lenta (latencia aleatoria de 0 a 700 ms), CP-S11 falló 4 de 4 veces. La corrección 1 cubría abrir el formulario antes de cargar los niveles, pero no **guardarlo** antes de que terminara la carga: el nivel llegaba después del envío. |
| Corrección 2 | Registrar estudiante y Editar se habilitan solo cuando los niveles ya cargaron. Commit `f15dec5`, PR #11. |
| Reprueba 2 | CP-U05 actualizado (botón deshabilitado mientras carga). Suite con latencia: 84/84 sin reintentos (EJ-22). Suite normal: 42/42 sin reintentos. |
| Evidencia | Falla: `evidencias/EV_INC-004_falla-CI_telefono_20261105.png` · `EV_INC-004_falla-CI_computadora_20261105.png` · `EV_INC-004_falla-CI-contexto_20261105.md` · `EV_INC-004_falla_20261105.txt` · `EV_INC-004_falla-local-sin-correccion_20261105.png` · Reapertura: `EV_playwright_latencia-1_20261105.txt` · Reprueba: `EV_INC-004_reprueba_20261105.txt` · `e2e/EV_CP-S18_nivel-preseleccionado_*.png` · `EV_playwright_latencia-2_20261105.txt` · `EV_playwright_ejecucion-4_20261105.txt` |
| Estado | Corregido y reprobado (segunda corrección); se cierra al integrar el PR #11. |

---

## INC-005 — Dependencias de desarrollo con avisos de seguridad críticos

| Campo | Valor |
|---|---|
| Identificador | INC-005 · Jira [ADLCDS-120](https://proyectosulacit.atlassian.net/browse/ADLCDS-120) |
| Descripción | `npm audit` reporta 13 avisos: 2 críticos (vitest: lectura de archivos y ejecución de código mediante el servidor de mocks; tinypool: contaminación de prototipo) y 11 moderados (minimatch, glob, typescript-eslint). Todos están en dependencias de desarrollo; las de producción tienen 0. |
| Módulo afectado | Frontend · `package.json`, `package-lock.json` |
| Historia / requisito | RNF de seguridad (avance 1, sección 7.2 — revisión de dependencias del anexo, sección 7) |
| Caso de prueba | CP-SEG01 |
| Característica ISO/IEC 25010 | Seguridad → integridad |
| Ambiente | Local, Node 22, npm 10 · commit `a487970` |
| Pasos para reproducir | `cd frontend && npm audit` |
| Resultado esperado | 0 avisos críticos o altos. |
| Resultado obtenido | 2 críticos, 11 moderados. |
| Severidad / prioridad | Media / Media — no llegan al producto publicado, pero se ejecutan en los equipos del equipo y en el CI. |
| Responsable | Samuel |
| Análisis | No había auditoría de dependencias en el plan ni en el CI. Ver ACR-04. |
| Corrección | vitest y @vitest/coverage-v8 3.2 → 4.1.12 (versión publicada el 2026-10-15 con la corrección; se descartó la 5.1.0 por tener 3 días) y `npm audit fix`. Commit `c42730e`, PR #11. |
| Resultado de reprueba | `npm audit --omit=dev`: 0. `npm audit`: 7 moderados de minimatch 10.2.6 vía typescript-eslint; la corrección exige minimatch 11 (publicada hace 9 días), que typescript-eslint aún no admite. **Riesgo residual aceptado**: denegación de servicio con patrones glob en una herramienta de análisis que solo recibe patrones del propio equipo. Se revisa en el Sprint 4. Vitest 15/15 con la versión nueva (EJ-18). |
| Evidencia | `evidencias/seguridad/EV_SEG-npm-audit_antes_20261105.txt` · `EV_SEG-npm-audit_despues_20261105.txt` · `evidencias/EV_vitest_ejecucion-2_20261105.txt` |
| Estado | Corregido con riesgo residual aceptado; se cierra al integrar el PR #11. |

---

## INC-006 — La sesión usa un token en `localStorage` en lugar de cookie HttpOnly con CSRF

| Campo | Valor |
|---|---|
| Identificador | INC-006 · Jira [ADLCDS-121](https://proyectosulacit.atlassian.net/browse/ADLCDS-121) |
| Descripción | El avance 1 (sección 7.1) fija que "las sesiones usarán cookies HttpOnly y protección CSRF". La implementación usa `TokenAuthentication` de DRF: el token se guarda en `localStorage` y se envía en el encabezado `Authorization`. Un script que lograra ejecutarse en la página (XSS) podría leer el token. |
| Módulo afectado | Frontend · `src/api/client.ts` (`tokenStore`) · Backend · `config/settings.py` (`DEFAULT_AUTHENTICATION_CLASSES`) |
| Historia / requisito | HU01, HU02 · RF01 · avance 1, sección 7.1 · OWASP ASVS V3 (gestión de sesiones) |
| Caso de prueba | CP-SEG04 (revisión de código contra la arquitectura aprobada) |
| Característica ISO/IEC 25010 | Seguridad → confidencialidad |
| Ambiente | Revisión estática del commit `a487970` |
| Pasos para reproducir | 1. Iniciar sesión. 2. En la consola del navegador: `localStorage.getItem('nexora.token')` devuelve el token. |
| Resultado esperado | La credencial de sesión no es accesible desde JavaScript (cookie HttpOnly) y las escrituras exigen el token CSRF. |
| Resultado obtenido | El token es legible desde JavaScript. |
| Severidad / prioridad | Media / Alta — explotarlo requiere además una vulnerabilidad XSS (React escapa el contenido y no se encontró ninguna), pero es una desviación de la línea base aprobada. |
| Responsable | Luis (backend) y Samuel (interfaz) |
| Análisis | El contrato de API del Sprint 2 (`Arquitectura-datos-API.md`) eligió `Authorization: Token` sin contrastarlo con la sección 7.1 del avance 1 ni registrar el cambio. Ver ACR-04. |
| Decisión | CC-13, opción A (2026-11-05): cumplir la arquitectura aprobada en lugar de documentar la desviación, porque el cambio cabía antes de la entrega y elimina el riesgo en lugar de mitigarlo. |
| Corrección | Sesión de Django en cookie `sessionid` HttpOnly y `SameSite=Lax`, que vence tras 2 horas sin actividad (`SESSION_SAVE_EVERY_REQUEST`); `GET /auth/csrf/` entrega la cookie `csrftoken` y la interfaz la envía en `X-CSRFToken` en cada escritura; `CookieSessionAuthentication` responde 401 sin sesión; migración que elimina la tabla de tokens. Se conservan INC-007 (época de sesión) e INC-009 (marca de cierre pendiente que se completa al volver a abrir). Commit `796cef8`, PR #11. |
| Hallazgo durante la reprueba | Con la API lenta (EJ-24), la primera versión dejaba iniciar sesión mientras se completaba un cierre pendiente: la respuesta de ese cierre borraba la cookie de la sesión nueva (CP-S10 y CP-S16 fallaron 3 veces en 80). Se corrigió antes de integrar: la pantalla de ingreso espera a que termine la validación de la sesión. |
| Resultado de reprueba | CP-A28 (cookie HttpOnly, SameSite, vencimiento), CP-A29 (CSRF obligatorio), CP-U08 (la interfaz no guarda credenciales y envía `X-CSRFToken`), CP-SEG04 aprobado. pytest 69/69, Vitest 28/28, Playwright 42/42 en desarrollo y 42/42 sobre la versión compilada, 84/84 con latencia (EJ-24). |
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · `EV_vitest_ejecucion-4_20261105.txt` · `EV_playwright_ejecucion-5_20261105.txt` · `EV_playwright_compilada_20261105.txt` · Hallazgo en la reprueba: `EV_playwright_latencia-3_INC-006-falla_20261105.txt` · `EV_INC-006_reprueba-latencia-falla_computadora_20261105.png` · Reprueba final: `EV_playwright_latencia-4_20261105.txt` · [Revisión de seguridad](Revision-seguridad.md), control V3 |
| Estado | Corregido y reprobado; se cierra al integrar el PR #11. |

---

## INC-007 — Una sesión anterior inválida impide o cierra el nuevo inicio de sesión

| Campo | Valor |
|---|---|
| Identificador | INC-007 · Jira [ADLCDS-117](https://proyectosulacit.atlassian.net/browse/ADLCDS-117) |
| Descripción | Si en el navegador queda el token de una sesión que ya no es válida (cerrada en otra pestaña, o una recarga antes de terminar el cierre de sesión): (1) `POST /auth/login/` envía ese token y DRF responde 401 "Debe iniciar sesión." antes de llegar a la vista, y (2) la validación pendiente de `/auth/me/` con el token viejo, al responder 401 después del nuevo inicio de sesión, borra la sesión recién iniciada y devuelve a la pantalla de ingreso con los campos vacíos. |
| Módulo afectado | Backend · `accounts/views.py` (`login`) · Frontend · `src/api/client.ts`, `src/auth/AuthContext.tsx` |
| Historia / escenario | HU01-E1, HU02-E3 · RF01 · CA01 |
| Caso de prueba | CP-S10 (detección, al volver a ingresar después de cerrar sesión); CP-A27, CP-U06 y CP-S19 (reprueba) |
| Característica ISO/IEC 25010 | Fiabilidad → madurez · Seguridad (gestión de sesiones) |
| Ambiente | GitHub Actions, perfil teléfono · PR #11 (`265b6cd`): CP-S10 falló y pasó al reintentar. Reproducido en local con un token inválido y `/auth/me/` retrasado 1,5 s. |
| Pasos para reproducir | 1. Guardar en `localStorage` un token inválido (`nexora.token`). 2. Abrir `/ingresar` con `/auth/me/` lento. 3. Ingresar como `admin@robles.test`. |
| Resultado esperado | Se ingresa y la sesión se conserva. |
| Resultado obtenido | Alerta "Debe iniciar sesión." con datos correctos, o regreso a la pantalla de ingreso tras ingresar. |
| Severidad / prioridad | Alta / Alta — impide iniciar sesión (función principal) de forma intermitente. |
| Responsable | Detección, corrección y reprueba: Samuel · revisión: pendiente Luis |
| Análisis | La vista de inicio de sesión heredaba la autenticación por token por defecto; el cliente atendía cualquier 401 como cierre de la sesión vigente sin comparar el token, y el contexto aplicaba la respuesta de `/auth/me/` aunque ya hubiera otra sesión. Ver ACR-03. |
| Corrección | `@authentication_classes([])` en `login`; el cliente solo cierra la sesión si el 401 corresponde al token vigente; el contexto descarta la validación pendiente al iniciar sesión. Commit `9599320`, PR #11. |
| Resultado de reprueba | CP-A27 y CP-U06 fallan sin la corrección y pasan con ella. CP-S19: falla sin la corrección (EV) y pasa con ella. Regresión: pytest 63/63, Vitest 15/15, Playwright 38/38 (EJ-18). Estabilidad: CP-S10, CP-S11, CP-S18 y CP-S19 × 5 repeticiones sin reintentos, 40/40. |
| Evidencia | Falla: `evidencias/EV_INC-007_falla-CI_telefono_20261105.png` · `EV_INC-007_falla-CI-contexto_20261105.md` · `EV_INC-007_falla-local_computadora_20261105.png` · `EV_INC-007_falla-local_20261105.txt` · Reprueba: `e2e/EV_CP-S19_sesion-conservada_*.png` · `EV_playwright_ejecucion-3_20261105.txt` · `EV_playwright_estabilidad_20261105.txt` |
| Estado | Corregido y reprobado; se cierra al integrar el PR #11. |

---

## INC-008 — Una carga repetida de Mi institución sobrescribe lo que se está escribiendo

| Campo | Valor |
|---|---|
| Identificador | INC-008 · Jira [ADLCDS-123](https://proyectosulacit.atlassian.net/browse/ADLCDS-123) |
| Descripción | En Mi institución, si una segunda carga de `/my-institution/` responde después de que la persona empezó a escribir, el formulario vuelve a los valores anteriores y al guardar se guarda el valor viejo. En el servidor de desarrollo React monta la pantalla dos veces (`StrictMode`), lo que produce esa segunda carga. |
| Módulo afectado | Frontend · `src/pages/MyInstitutionPage.tsx` (y el mismo patrón en `StudentsPage.tsx`) |
| Historia / escenario | HU05-E1 · RF03 · CA05 |
| Caso de prueba | CP-S09 (detección); CP-S20 (reprueba) |
| Característica ISO/IEC 25010 | Adecuación funcional → corrección funcional |
| Ambiente | GitHub Actions, perfil teléfono · PR #11 (`b403436`): CP-S09 falló ("Expected 2222-4060, Received 2222-2353") y pasó al reintentar; con `failOnFlakyTests` el CI quedó en rojo (EJ-20) |
| Pasos para reproducir | 1. Ingresar como `admin@robles.test`. 2. Abrir Mi institución con la segunda carga retrasada 1,5 s. 3. Escribir un teléfono. 4. Esperar 2 s. |
| Resultado esperado | El campo conserva el teléfono escrito. |
| Resultado obtenido | El campo vuelve al teléfono anterior. |
| Severidad / prioridad | Baja / Media — en la versión de producción hay una sola carga; el efecto mostraba un patrón sin cancelación que afecta a las pruebas y a montajes repetidos. |
| Responsable | Samuel |
| Análisis | El efecto de carga no descartaba la respuesta de una carga cancelada. Las pruebas de sistema usan el servidor de desarrollo (con `StrictMode`), no la versión compilada. Ver ACR-03. |
| Corrección | Indicador de vigencia en la limpieza del efecto (`active = false`): la respuesta de una carga descartada no cambia el estado. Commit `f15dec5`, PR #11. |
| Resultado de reprueba | CP-S20 falla sin la corrección (computadora y teléfono) y pasa con ella; CP-S09 y CP-S20 × 3 repeticiones sin reintentos, 12/12 (EJ-22). |
| Evidencia | Falla: `evidencias/EV_INC-008_falla-local_computadora_20261105.png` · `EV_INC-008_falla-local_20261105.txt` · captura del CI en `evidencias/ci/` · Reprueba: `e2e/EV_CP-S20_valor-conservado_*.png` · `EV_playwright_ejecucion-4_20261105.txt` |
| Estado | Corregido y reprobado; se cierra al integrar el PR #11. |

---

## INC-009 — Cerrar sesión y recargar enseguida restaura la sesión

| Campo | Valor |
|---|---|
| Identificador | INC-009 · Jira [ADLCDS-122](https://proyectosulacit.atlassian.net/browse/ADLCDS-122) |
| Descripción | Al pulsar "Cerrar sesión", el token solo se borraba del navegador cuando el servidor respondía a `POST /auth/logout/`. Si la página se recargaba o se cerraba antes, el token quedaba en `localStorage` y la sesión se restauraba al volver a abrir la aplicación. |
| Módulo afectado | Frontend · `src/auth/AuthContext.tsx` (`logout`), `src/api/client.ts` |
| Historia / escenario | HU02-E1 · RF01 · CA01. HU02 existe "para que nadie use mi cuenta en un equipo compartido". |
| Caso de prueba | CP-S16 con la API lenta (detección); CP-U07 y CP-S21 (reprueba) |
| Característica ISO/IEC 25010 | Seguridad → confidencialidad |
| Ambiente | Local, Chromium, API con latencia aleatoria de 0 a 700 ms (EJ-21): CP-S16 cerró la sesión de la plataforma, ingresó como `admin@robles.test` y al recargar seguía con la sesión de la plataforma |
| Pasos para reproducir | 1. Ingresar. 2. Pulsar "Cerrar sesión" con el servidor lento. 3. Recargar de inmediato. |
| Resultado esperado | Pantalla de ingreso, sin token en el navegador. |
| Resultado obtenido | Se vuelve a entrar con la misma cuenta. |
| Severidad / prioridad | Alta / Alta — en un equipo compartido otra persona entra con la cuenta de quien creyó cerrar la sesión. |
| Responsable | Samuel · revisión: pendiente Luis |
| Análisis | El cierre de sesión dependía de la respuesta del servidor para borrar la credencial local. Ver ACR-03 y ACR-04. |
| Corrección | El token se borra antes de avisar al servidor; el aviso usa `keepalive` para completarse aunque la página se cierre. Commit `f15dec5`, PR #11. Con la sesión en cookie HttpOnly (INC-006, `796cef8`) la interfaz no puede borrar la cookie: deja una marca de cierre pendiente que, si el aviso no llegó, se completa al volver a abrir la aplicación antes de restaurar la sesión. |
| Resultado de reprueba | CP-U07 y CP-S21 fallan sin la corrección y pasan con ella. Suite con latencia 84/84; suite normal 42/42 sin reintentos (EJ-22). Con la sesión en cookie, CP-S21 aborta el primer aviso de cierre y comprueba en la API que la sesión quedó cerrada: falla sin la marca de cierre pendiente (`EV_INC-009_falla-cookie-sin-cierre-pendiente_*`) y pasa con ella (EJ-24). |
| Evidencia | Falla: `evidencias/EV_INC-009_falla-local_computadora_20261105.png` (tras recargar, la sesión sigue abierta) · `EV_INC-009_falla-local_20261105.txt` · `EV_playwright_latencia-1_20261105.txt` · Reprueba: `e2e/EV_CP-S21_sesion-cerrada_*.png` · `EV_vitest_ejecucion-3_20261105.txt` · `EV_playwright_latencia-2_20261105.txt` |
| Estado | Corregido y reprobado; se cierra al integrar el PR #11. |

---

## Fallas de scripts de prueba (no son defectos del producto)

| Ejecución | Script | Falla | Corrección |
|---|---|---|---|
| EJ-04 | `frontend/src/test/setup.ts` | Sin `globals: true`, Testing Library no limpiaba el DOM entre pruebas y 4 pruebas veían pantallas de la prueba anterior | `afterEach(cleanup)` |
| EJ-09 | `frontend/e2e/instituciones.spec.ts` | `getByText(nombre)` encontraba el nombre en la alerta y en la tabla (modo estricto de Playwright) | Selector limitado a la celda de la tabla |
| EJ-14 | `frontend/e2e/helpers.ts` | Las capturas se nombraban con la fecha UTC: las de EJ-10 (2026-11-04, 20:44 hora local) quedaron como `_20261105`, contra el estándar `AAAAMMDD` local | Fecha local (`toLocaleDateString('en-CA')`). Las capturas de EJ-10 se conservan en el historial de git (`2ee5e0a`); las actuales son de EJ-18 |

Se registran para el análisis de causa raíz del proceso de pruebas (ACR-03) y para la métrica de eficacia de los
scripts (MP-05).

## Estado en Jira

Los nueve incidentes están registrados como *Bug* y en *En curso*: corregidos y reprobados, pendientes de integrar en
`main` (PR #5, #8 y #11). La reapertura de INC-004 y la corrección de INC-006 quedaron como comentarios en ADLCDS-119 y
ADLCDS-121.
