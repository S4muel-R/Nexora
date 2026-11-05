# Registro de ejecución de pruebas — Nexora

| Campo | Valor |
|---|---|
| Norma | ISO/IEC/IEEE 29119-3, "Test Execution Log" |
| Versión | 1.0 |
| Fecha | 2026-11-04 |
| Casos | [Especificación de casos](Especificacion-de-casos.md) |

Cada ejecución registra cuándo, dónde y sobre qué versión se probó, el resultado y la evidencia. Las fallas del
**producto** se registran como incidentes; las fallas del **script de prueba** se corrigen en el script y se anotan aquí
(no son defectos del producto).

| ID | Fecha | Tipo | Ambiente | Versión (commit) | Ejecutadas | Aprobadas | Fallidas | Resultado / hallazgo | Evidencia |
|---|---|---|---|---|---|---|---|---|---|
| EJ-01 | 2026-11-04 | API e integración (pytest) | Local, Windows, Python 3.13, SQLite | `33870ec` | 54 | 53 | 1 | **Falla de producto**: CP-A16 (HU07-E1), el estudiante queda inactivo → **INC-001** (ADLCDS-103) | `evidencias/EV_pytest_ejecucion-1_20261104.txt` |
| EJ-02 | 2026-11-04 | Reprueba INC-001 + regresión (pytest) | Local, SQLite | `356df07` | 56 | 56 | 0 | INC-001 corregido; cobertura 96 % | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` |
| EJ-03 | 2026-11-04 | Regresión (pytest) tras datos ficticios | Local, SQLite | rama `feature/ADLCDS-26-datos-ficticios` | 57 | 57 | 0 | Sin hallazgos | Salida de consola (no archivada) |
| EJ-04 | 2026-11-04 | Unitarias de interfaz (Vitest) | Local, Node 22, jsdom | rama `feature/ADLCDS-33-frontend-incremento` | 12 | 8 | 4 | **Falla del script de prueba**: faltaba limpiar el DOM entre pruebas (`cleanup`); se corrigió `src/test/setup.ts` | — |
| EJ-05 | 2026-11-04 | Unitarias de interfaz (Vitest) | Local, Node 22, jsdom | `45664d9` | 12 | 12 | 0 | Sin hallazgos | `frontend/reports/junit.xml` |
| EJ-06 | 2026-11-04 | Exploratoria EXP-01 (ver abajo) | Local, Chrome 1024 px y 375 px | `45664d9` | — | — | — | **Falla de producto**: mensaje técnico con fecha vacía → **INC-002** (ADLCDS-104) | `evidencias/EV_INC-002_falla_20261104.jpg` |
| EJ-07 | 2026-11-04 | Reprueba INC-002 + regresión (pytest) | Local, SQLite | `5418908` | 60 | 60 | 0 | INC-002 corregido en la API | Salida de consola; ver EJ-08 |
| EJ-08 | 2026-11-04 | Reprueba INC-002 en la interfaz (manual) | Local, Chrome 1024 px | `5418908` | 1 | 1 | 0 | El campo muestra "Ingrese una fecha de nacimiento válida." | `evidencias/EV_INC-002_reprueba_20261104.jpg` |
| EJ-09 | 2026-11-04 | Sistema (Playwright) | Local, Chromium 1280 × 800 y Pixel 7 | rama `test/ADLCDS-41-playwright` | 30 | 28 | 2 | **Falla del script de prueba**: selector ambiguo en CP-S07 (el nombre aparecía en la alerta y en la tabla); se corrigió el selector | — |
| EJ-10 | 2026-11-04 | Sistema (Playwright) | Local, Chromium 1280 × 800 y Pixel 7 | `2ee5e0a` | 30 | 30 | 0 | Sin hallazgos; incluye la reprueba de INC-002 en ambos dispositivos (CP-S13) | `evidencias/EV_playwright_ejecucion-1_20261104.txt` · `evidencias/e2e/` (36 capturas) |
| EJ-11 | Pendiente | Regresión completa en CI (PostgreSQL) | GitHub Actions | PR hacia `main` | — | — | — | Se ejecuta al abrir los Pull Requests | Artefactos `reportes-backend`, `reportes-frontend`, `evidencias-e2e` |
| EJ-12 | Pendiente | Aceptación manual por Wilberth | Local o Docker | Versión integrada en `main` | — | — | — | Ejecutar CP-S01 – CP-S15 a mano y tomar capturas | — |


## Sesión exploratoria EXP-01

| Campo | Valor |
|---|---|
| Charter | Explorar el formulario y la lista de estudiantes con datos vacíos, duplicados e inválidos, en computadora y teléfono, para descubrir mensajes confusos o datos que se guarden mal |
| Duración | 15 minutos |
| Responsable | Samuel |
| Datos | Escuela Los Robles (`seed_demo`), cuenta `admin@robles.test` |
| Observaciones | 1) Guardar el formulario vacío muestra un mensaje técnico de formato en la fecha → INC-002. 2) Identificación duplicada muestra el mensaje correcto (HU07-E4). 3) En 375 px la tabla se convierte en tarjetas y no hay desplazamiento horizontal (`scrollWidth = clientWidth = 375`), cumple RNF03. |
| Ideas para siguientes sesiones | Mensajes de "Este campo no puede estar en blanco." de nombre y apellidos (claros pero genéricos); visibilidad de la alerta cuando el formulario es largo en teléfono |

## Resumen

| Ejecución final por nivel | Ejecutadas | Aprobadas | % |
|---|---|---|---|
| API e integración (EJ-07) | 60 | 60 | 100 % |
| Unitarias de interfaz (EJ-05) | 12 | 12 | 100 % |
| Sistema (EJ-10) | 30 | 30 | 100 % |
| **Total** | **102** | **102** | **100 %** |
