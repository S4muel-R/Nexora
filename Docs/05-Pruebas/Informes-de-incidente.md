# Informes de incidente (registro de defectos) — Nexora

| Campo | Valor |
|---|---|
| Norma | ISO/IEC/IEEE 29119-3, "Incident Report" · clasificación por ISO/IEC 25010:2023 |
| Referencia | Instrucciones del Proyecto Integrador, sección 16 |
| Versión | 1.0 |
| Fecha | 2026-11-04 |
| Fuente oficial | Jira ADLCDS, tipo *Bug* |

Ciclo de vida: **Detección → Registro → Clasificación → Análisis → Asignación → Corrección → Reprueba → Cierre**.
En Jira: *Por hacer* (registrado y asignado) → *En curso* (en corrección o corregido pendiente de integración) →
*Listo* (reprobado e integrado en `main`).

## Resumen

| ID | Jira | Título | Módulo | Severidad | Prioridad | ISO/IEC 25010 | Detección | Estado |
|---|---|---|---|---|---|---|---|---|
| INC-001 | [ADLCDS-103](https://proyectosulacit.atlassian.net/browse/ADLCDS-103) | Estudiante registrado queda inactivo con datos de formulario | API de estudiantes | Alta | Alta | Adecuación funcional | Prueba automatizada de API (EJ-01) | Corregido y reprobado · pendiente de integrar |
| INC-002 | [ADLCDS-104](https://proyectosulacit.atlassian.net/browse/ADLCDS-104) | Mensaje técnico al dejar vacía la fecha de nacimiento | Estudiantes (interfaz y API) | Baja | Media | Capacidad de interacción | Prueba exploratoria (EJ-06) | Corregido y reprobado · pendiente de integrar |

---

## INC-001 — Estudiante registrado queda inactivo cuando los datos se envían como formulario

| Campo | Valor |
|---|---|
| Identificador | INC-001 · Jira [ADLCDS-103](https://proyectosulacit.atlassian.net/browse/ADLCDS-103) |
| Descripción | Al registrar un estudiante con datos de formulario (`multipart/form-data`) sin el campo `is_active`, la API responde 201 pero guarda al estudiante como inactivo, por lo que no aparece en la lista. |
| Módulo afectado | Backend · `students/serializers.py` · `POST /api/v1/students/` |
| Historia / escenario | HU07-E1 · RF04 |
| Caso de prueba | CP-A16 (`test_hu07_e1_registrar_estudiante`) |
| Característica ISO/IEC 25010 | Adecuación funcional → corrección funcional |
| Ambiente | Local, Windows, Python 3.13, SQLite · commit `33870ec` |
| Pasos para reproducir | 1. Iniciar sesión como `admin@robles.test`. 2. `POST /api/v1/students/` como formulario con identificación `1-1111-1111`, nombre, apellidos, fecha y nivel, sin `is_active`. 3. `GET /api/v1/students/`. |
| Resultado esperado | Estudiante activo y visible en la lista (HU07-E1). |
| Resultado obtenido | `is_active = false`; la lista no lo muestra. Salida de pytest: `assert student.is_active` → `assert False`. |
| Severidad / prioridad | Alta / Alta — el registro queda oculto y la persona usuaria cree que no se guardó. |
| Responsable | Detección y corrección: Samuel (desde la tarea de Luis, ADLCDS-43) · Reprueba: Samuel; revisión del PR: pendiente Luis |
| Análisis | En DRF, un `BooleanField` ausente en datos de formulario se interpreta como `False`. El serializador exponía `is_active` sin valor por defecto. Con JSON no ocurre, por eso pasó inadvertido en el diseño. Causa raíz en [Análisis de causa raíz](Analisis-causa-raiz.md), ACR-03. |
| Corrección | `extra_kwargs = {"is_active": {"default": True}}`; prueba de regresión para multipart y JSON. Commit `356df07`, rama `fix/ADLCDS-103-estudiante-inactivo`. |
| Resultado de reprueba | 2026-11-04 (EJ-02): 56/56 aprobadas, incluida CP-A16. Además CP-S11 (Playwright) registra estudiantes desde la interfaz en computadora y teléfono (EJ-10). |
| Evidencia | Falla: `evidencias/EV_pytest_ejecucion-1_20261104.txt` · Reprueba: `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · `evidencias/e2e/EV_CP-S11_registrado_*.png` |
| Estado | Corregido y reprobado; se cierra al integrar el PR en `main` con CI en verde. |

---

## INC-002 — Mensaje técnico al dejar vacía la fecha de nacimiento del estudiante

| Campo | Valor |
|---|---|
| Identificador | INC-002 · Jira [ADLCDS-104](https://proyectosulacit.atlassian.net/browse/ADLCDS-104) |
| Descripción | Al guardar el formulario de estudiante sin fecha de nacimiento, el campo muestra "Fecha con formato erróneo. Use uno de los siguientes formatos en su lugar: YYYY-MM-DD.", un mensaje técnico que no indica que el campo está vacío. |
| Módulo afectado | Frontend · Estudiantes (formulario) y Backend · `students/serializers.py` |
| Historia / requisito | HU07-E5 · RNF04 |
| Caso de prueba | Sesión exploratoria EXP-01; caso agregado: CP-S13 y variantes de CP-A20 |
| Característica ISO/IEC 25010 | Capacidad de interacción → protección contra errores de la persona usuaria |
| Ambiente | Local, Chrome 1024 px · frontend `45664d9` |
| Pasos para reproducir | 1. Iniciar sesión como `admin@robles.test`. 2. Estudiantes → Registrar estudiante. 3. Pulsar Guardar sin llenar campos. |
| Resultado esperado | Mensaje claro, por ejemplo "Ingrese una fecha de nacimiento válida." |
| Resultado obtenido | Mensaje técnico de formato `YYYY-MM-DD`. |
| Severidad / prioridad | Baja / Media — no impide registrar, pero confunde. |
| Responsable | Detección, corrección y reprueba: Samuel |
| Análisis | El formulario envía la fecha vacía como `""`; DRF la intenta interpretar y devuelve su mensaje de formato. Los estándares pedían mensajes claros, pero no se definieron mensajes propios por tipo de campo. Ver ACR-03. |
| Corrección | Mensajes propios para `required`, `null` e `invalid` en `birth_date`; pruebas de regresión con fecha vacía, nula y mal formada. Commit `5418908`, rama `fix/ADLCDS-104-mensaje-fecha`. |
| Resultado de reprueba | 2026-11-04: API 60/60 (EJ-07); interfaz manual (EJ-08); Playwright CP-S13 en computadora y teléfono (EJ-10). |
| Evidencia | Falla: `evidencias/EV_INC-002_falla_20261104.jpg` · Reprueba: `evidencias/EV_INC-002_reprueba_20261104.jpg` · `evidencias/e2e/EV_CP-S13_mensaje-fecha_*.png` |
| Estado | Corregido y reprobado; se cierra al integrar el PR en `main` con CI en verde. |

---

## Fallas de scripts de prueba (no son defectos del producto)

| Ejecución | Script | Falla | Corrección |
|---|---|---|---|
| EJ-04 | `frontend/src/test/setup.ts` | Sin `globals: true`, Testing Library no limpiaba el DOM entre pruebas y 4 pruebas veían pantallas de la prueba anterior | `afterEach(cleanup)` |
| EJ-09 | `frontend/e2e/instituciones.spec.ts` | `getByText(nombre)` encontraba el nombre en la alerta y en la tabla (modo estricto de Playwright) | Selector limitado a la celda de la tabla |

Se registran para el análisis de causa raíz del proceso de pruebas (ACR-03) y para las métricas de eficacia de los
scripts.
