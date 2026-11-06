# Registro de ejecución de pruebas — Nexora

| Campo | Valor |
|---|---|
| Norma | ISO/IEC/IEEE 29119-3, "Test Execution Log" |
| Versión | 1.1 |
| Fecha | 2026-11-05 |
| Casos | [Especificación de casos](Especificacion-de-casos.md) |

Cada ejecución registra cuándo, dónde y sobre qué versión se probó, el resultado y la evidencia (anexo del avance 1,
sección 7: comando reproducible, versión del código, ambiente y resultado real). Las fallas del **producto** se
registran como incidentes; las fallas del **script de prueba** se corrigen en el script y se anotan aquí (no son
defectos del producto).

## 1. Ejecuciones

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
| EJ-10 | 2026-11-04 | Sistema (Playwright) | Local, Chromium 1280 × 800 y Pixel 7 | `2ee5e0a` | 30 | 30 | 0 | Sin hallazgos; incluye la reprueba de INC-002 (CP-S13). Las capturas quedaron con fecha UTC (`_20261105`): falla del script corregida en EJ-14 | `evidencias/EV_playwright_ejecucion-1_20261104.txt` · capturas en el historial de git (`2ee5e0a`) |
| EJ-11 | 2026-11-05 | Regresión completa en CI: análisis estático, pytest con **PostgreSQL 16**, Vitest, compilación y Playwright | GitHub Actions, Ubuntu, Python 3.12, Node 22 | PR #1 – #10 (sección 2) | 10 ejecuciones | 8 | 2 | PR #4: **INC-001** reproducido en PostgreSQL (esperado: la corrección está en #5). PR #10: CP-S11 falla → **INC-004**. PR #9 en verde, pero CP-S11 falló una vez y pasó al reintentar (INC-004 oculto) | Sección 2 · `evidencias/EV_INC-001_falla-CI_20261105.txt` · `evidencias/EV_INC-004_falla-CI_*` · `evidencias/ci/` |
| EJ-12 | Pendiente | Aceptación manual por Wilberth | Local o Docker | Versión integrada en `main` | — | — | — | Ejecutar CP-S01 – CP-S21 a mano y tomar capturas | — |
| EJ-13 | 2026-11-05 | Reproducción y reprueba de INC-004 (Vitest) | Local, Node 22, jsdom | `a487970` → `7a36635` | 13 | 12 → 13 | 1 → 0 | CP-U05 falla sin la corrección y pasa con ella | `evidencias/EV_INC-004_falla_20261105.txt` · `EV_INC-004_reprueba_20261105.txt` |
| EJ-14 | 2026-11-05 | Sistema (Playwright), con accesibilidad (CP-S16, CP-S17) y reprueba de INC-004 (CP-S18) | Local, Chromium 1280 × 800 y Pixel 7, axe-core 4.10 | `265b6cd` | 36 | 36 | 0 | 0 violaciones WCAG detectables en 6 estados de pantalla × 2 dispositivos. CP-S18 contra la versión sin corregir: falla (esperado). **Falla del script**: capturas con fecha UTC → fecha local | `evidencias/EV_playwright_ejecucion-2_20261105.txt` · `evidencias/accesibilidad/*.json` · `EV_INC-004_falla-local-sin-correccion_20261105.png` |
| EJ-15 | 2026-11-05 | Revisión de seguridad: dependencias, secretos y código contra el avance 1 | Local; npm 10, pip-audit 2.9.0 | `a487970` – `265b6cd` | 4 | 3 | 1 | `npm audit`: 2 críticos y 11 moderados en desarrollo → **INC-005**. `pip-audit`: 0. Secretos: 7 coincidencias, todas valores de prueba. Revisión de sesión: token en `localStorage` → **INC-006** | `evidencias/seguridad/` · [Revisión de seguridad](Revision-seguridad.md) |
| EJ-16 | 2026-11-05 | Configuración de despliegue (`check --deploy`) y regresión pytest | Local, SQLite | `a487970` → `e867548` | 62 | 62 | 0 | Antes: 4 advertencias → **INC-003**. Después: solo W021 (aceptada) | `evidencias/seguridad/EV_INC-003_check-deploy_20261105.txt` |
| EJ-17 | 2026-11-05 | Regresión completa en CI (PR #11, ejecución 1) | GitHub Actions, PostgreSQL 16 | `265b6cd` | 111 | 111 | 0 | En verde, pero CP-S10 falló una vez en teléfono y pasó al reintentar → **INC-007** | [Ejecución 42147274526](https://github.com/S4muel-R/Nexora/actions/runs/42147274526) · `evidencias/EV_INC-007_falla-CI_*` |
| EJ-18 | 2026-11-05 | Reproducción, corrección y regresión completa tras INC-007 | Local, SQLite, Chromium | `265b6cd` → `9599320` | 116 + 40 | 116 + 40 | 0 | CP-A27, CP-U06 (INC-007) y CP-S19 fallan sin la corrección y pasan con ella. pytest 63/63 (94 %), Vitest 15/15, Playwright 38/38. Estabilidad: CP-S10, CP-S11, CP-S18 y CP-S19 × 5 sin reintentos, 40/40 | `evidencias/EV_INC-007_falla-local_*` · `EV_pytest_ejecucion-4_20261105.txt` · `EV_vitest_ejecucion-2_20261105.txt` · `EV_playwright_ejecucion-3_20261105.txt` · `EV_playwright_estabilidad_20261105.txt` |
| EJ-19 | 2026-11-05 | Regresión completa en CI (PR #11, ejecución 2) | GitHub Actions, PostgreSQL 16 | `9599320` | 116 | 116 | 0 | Sin fallas ni pruebas intermitentes | [Ejecución 42148745101](https://github.com/S4muel-R/Nexora/actions/runs/42148745101) |
| EJ-20 | 2026-11-05 | Regresión completa en CI (PR #11, ejecución 3), primera con `failOnFlakyTests` | GitHub Actions, PostgreSQL 16 | `b403436` | 116 | 115 | 1 | CP-S09 falló en teléfono y pasó al reintentar; ahora eso hace fallar el CI → **INC-008** | [Ejecución 42148970848](https://github.com/S4muel-R/Nexora/actions/runs/42148970848) · `evidencias/ci/` |
| EJ-21 | 2026-11-05 | Robustez: suite de sistema contra la API con latencia aleatoria de 0 a 700 ms por petición, sin reintentos, 2 repeticiones | Local, Chromium; ajustes temporales con un middleware de latencia (no versionados) | `b403436` + INC-008 | 80 | 75 | 5 | CP-S11 falla 4 de 4 → **INC-004 reabierto** (se podía guardar antes de cargar los niveles). CP-S16 en teléfono queda con la sesión anterior → **INC-009** | `evidencias/EV_playwright_latencia-1_20261105.txt` · `EV_INC-008_falla-local_*` · `EV_INC-009_falla-local_*` |
| EJ-22 | 2026-11-05 | Corrección de INC-004, INC-008 e INC-009 y regresión completa | Local, SQLite, Chromium | `f15dec5` | 121 + 84 | 121 + 84 | 0 | CP-U07, CP-S20 y CP-S21 fallan sin la corrección y pasan con ella. pytest 63/63 (94 %), Vitest 16/16, Playwright 42/42 sin reintentos; con latencia 84/84 sin reintentos | `EV_pytest_ejecucion-5_20261105.txt` · `EV_vitest_ejecucion-3_20261105.txt` · `EV_playwright_ejecucion-4_20261105.txt` · `EV_playwright_latencia-2_20261105.txt` |
| EJ-23 | 2026-11-05 | Regresión completa en CI (PR #11, ejecución 4), con `failOnFlakyTests` | GitHub Actions, PostgreSQL 16 | `f15dec5` | 121 | 121 | 0 | En verde sin pruebas intermitentes | [Ejecución 42152244891](https://github.com/S4muel-R/Nexora/actions/runs/42152244891) |

## 2. Detalle de EJ-11, EJ-17 – EJ-20 y EJ-23 (GitHub Actions)

Cada PR ejecuta el flujo `.github/workflows/ci.yml` (desde `f4e6a01` también en los PR encadenados). Los artefactos
`reportes-backend` (cobertura y JUnit), `reportes-frontend` y `evidencias-e2e` (informe HTML de Playwright y capturas)
quedan en cada ejecución.

| PR | Rama | Commit | Ejecución | Backend (pytest, PostgreSQL) | Frontend (Vitest) | Sistema (Playwright) | Resultado |
|---|---|---|---|---|---|---|---|
| [#1](https://github.com/S4muel-R/Nexora/pull/1) | `feature/ADLCDS-9-estructura-base` | `f4e6a01` | [42144499910](https://github.com/S4muel-R/Nexora/actions/runs/42144499910) | 3/3 · 92 % | 6/6 | — | Verde |
| [#2](https://github.com/S4muel-R/Nexora/pull/2) | `docs/ADLCDS-14-requisitos` | `2812d03` | [42144505060](https://github.com/S4muel-R/Nexora/actions/runs/42144505060) | 3/3 | 6/6 | — | Verde |
| [#3](https://github.com/S4muel-R/Nexora/pull/3) | `feature/ADLCDS-18-arquitectura-api` | `d5d1529` | [42144508641](https://github.com/S4muel-R/Nexora/actions/runs/42144508641) | 3/3 | 6/6 | — | Verde |
| [#4](https://github.com/S4muel-R/Nexora/pull/4) | `feature/ADLCDS-28-backend-incremento` | `85f3bb8` | [42144515765](https://github.com/S4muel-R/Nexora/actions/runs/42144515765) | **53/54** (INC-001) | 6/6 | — | **Rojo** (esperado) |
| [#5](https://github.com/S4muel-R/Nexora/pull/5) | `fix/ADLCDS-103-estudiante-inactivo` | `2250ae2` | [42144520512](https://github.com/S4muel-R/Nexora/actions/runs/42144520512) | 56/56 · 96 % | 6/6 | — | Verde |
| [#6](https://github.com/S4muel-R/Nexora/pull/6) | `feature/ADLCDS-26-datos-ficticios` | `81248e8` | [42144523534](https://github.com/S4muel-R/Nexora/actions/runs/42144523534) | 57/57 | 6/6 | — | Verde |
| [#7](https://github.com/S4muel-R/Nexora/pull/7) | `feature/ADLCDS-33-frontend-incremento` | `11a1ea5` | [42144528739](https://github.com/S4muel-R/Nexora/actions/runs/42144528739) | 57/57 | 12/12 | — | Verde |
| [#8](https://github.com/S4muel-R/Nexora/pull/8) | `fix/ADLCDS-104-mensaje-fecha` | `db66013` | [42144534570](https://github.com/S4muel-R/Nexora/actions/runs/42144534570) | 60/60 · 96 % | 12/12 | — | Verde |
| [#9](https://github.com/S4muel-R/Nexora/pull/9) | `test/ADLCDS-41-playwright` | `218bbd4` | [42144538741](https://github.com/S4muel-R/Nexora/actions/runs/42144538741) | 60/60 | 12/12 | 29 + **1 intermitente** (CP-S11) | Verde (INC-004 oculto) |
| [#10](https://github.com/S4muel-R/Nexora/pull/10) | `docs/ADLCDS-24-documentacion-pruebas` | `a487970` | [42144543564](https://github.com/S4muel-R/Nexora/actions/runs/42144543564) | 60/60 | 12/12 | 28 + 1 intermitente + **1 fallida** (CP-S11) | **Rojo** (INC-004) |
| [#11](https://github.com/S4muel-R/Nexora/pull/11) | `test/ADLCDS-92-accesibilidad-seguridad` | `265b6cd` | [42147274526](https://github.com/S4muel-R/Nexora/actions/runs/42147274526) | 62/62 · 94 % | 13/13 | 35 + **1 intermitente** (CP-S10) | Verde (INC-007 oculto) |
| #11 | ídem | `9599320` | [42148745101](https://github.com/S4muel-R/Nexora/actions/runs/42148745101) | 63/63 · 94 % | 15/15 | 38/38 | Verde |
| #11 | ídem | `b403436` | [42148970848](https://github.com/S4muel-R/Nexora/actions/runs/42148970848) | 63/63 | 15/15 | 37 + **1 intermitente** (CP-S09) → falla por `failOnFlakyTests` | **Rojo** (INC-008) |
| #11 | ídem | `f15dec5` | [42152244891](https://github.com/S4muel-R/Nexora/actions/runs/42152244891) | 63/63 · 94 % | 16/16 | 42/42, sin intermitentes | Verde |

Las diferencias de SQLite a PostgreSQL que preocupaban en el plan (unicidad sin distinguir mayúsculas, restricciones)
no produjeron fallas: las mismas pruebas pasan en ambos motores.

## 3. Sesión exploratoria EXP-01

| Campo | Valor |
|---|---|
| Charter | Explorar el formulario y la lista de estudiantes con datos vacíos, duplicados e inválidos, en computadora y teléfono, para descubrir mensajes confusos o datos que se guarden mal |
| Duración | 15 minutos |
| Responsable | Samuel |
| Datos | Escuela Los Robles (`seed_demo`), cuenta `admin@robles.test` |
| Observaciones | 1) Guardar el formulario vacío muestra un mensaje técnico de formato en la fecha → INC-002. 2) Identificación duplicada muestra el mensaje correcto (HU07-E4). 3) En 375 px la tabla se convierte en tarjetas y no hay desplazamiento horizontal (`scrollWidth = clientWidth = 375`), cumple RNF03. |
| Ideas para siguientes sesiones | Mensajes de "Este campo no puede estar en blanco." de nombre y apellidos (claros pero genéricos); visibilidad de la alerta cuando el formulario es largo en teléfono |

## 4. Resumen

| Ejecución final por nivel | Ejecutadas | Aprobadas | % |
|---|---|---|---|
| API e integración (EJ-22, CI EJ-23) | 63 | 63 | 100 % |
| Unitarias de interfaz (EJ-22, CI EJ-23) | 16 | 16 | 100 % |
| Sistema, incluida accesibilidad (EJ-22, CI EJ-23) | 42 | 42 | 100 % |
| **Total automatizadas** | **121** | **121** | **100 %** |
| Robustez con latencia (EJ-22) | 84 | 84 | 100 % |
| Revisiones de seguridad (CP-SEG01 – CP-SEG04) | 4 | 3 | 75 % (INC-006 abierto) |
