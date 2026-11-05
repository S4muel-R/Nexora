# Informe de ejecución de los sprints — Nexora

| Campo | Valor |
|---|---|
| Referencia | Instrucciones del Proyecto Integrador, secciones 4.2 y 22 (segundo entregable) |
| Código | S3-02 / S4-02 (informe de avance) |
| Versión | 1.0 |
| Fecha de corte | 2026-11-04 |
| Fuentes | Jira ADLCDS, historial de GitHub, [Métricas](Metricas.md), [Gestión de cambios](Gestion-de-cambios.md) |

Estado de cada tarea al corte: **Hecha** (cumple su criterio de entrega y está en GitHub), **Parcial** (avance
verificable con pendientes) o **Pendiente**.

## Sprint 1 — Inicio y necesidades (20/10 – 03/11)

**Objetivo.** Iniciar el proyecto y levantar las necesidades de las personas usuarias.

| Tarea | Responsable | Estado | Evidencia / pendiente |
|---|---|---|---|
| S1-01 Acta constitutiva (ADLCDS-1) | Wilberth | Pendiente | — |
| S1-02 Registro de interesados (ADLCDS-3) | Wilberth | Pendiente | — |
| S1-03 Riesgos y comunicación (ADLCDS-4) | Wilberth | Pendiente | Riesgos de producto en el plan de pruebas; falta el registro R01 – R10 |
| S1-04 Informe de necesidades (ADLCDS-5) | Wilberth | Parcial | Necesidades N01 – N09 en el catálogo; falta el informe |
| S1-05 Sesiones de consulta, lado técnico (ADLCDS-6) | Luis | Pendiente | Reprogramadas (CC-06) |
| S1-06 RF01 – RF08 con criterios (ADLCDS-7) | Luis | **Hecha** | `Docs/02-Requisitos/Catalogo-de-requisitos.md` |
| S1-07 Estudio de aislamiento (ADLCDS-8) | Luis | **Hecha** | `Docs/03-Diseno/Arquitectura-datos-API.md`, sección 2 |
| S1-08 Repositorio GitHub y Project (ADLCDS-9) | Luis | Parcial | Repositorio y estructura listos; falta GitHub Project y permisos de colaboradores |
| S1-09 Sesiones de consulta, lado interfaz (ADLCDS-10) | Samuel | Parcial | Plantillas de acta listas; sesiones reprogramadas (CC-06) |
| S1-10 Guion de consulta (ADLCDS-11) | Samuel | **Hecha** | `Docs/02-Requisitos/S1-10_Guion-de-consulta.md` |
| S1-11 Perfiles y recorrido (ADLCDS-12) | Samuel | Parcial | Borrador v0.1; se valida con las sesiones |
| S1-12 Repositorio en OneDrive (ADLCDS-13) | Samuel | Parcial | Estructura y permisos documentados; falta crear y compartir la carpeta |

| Indicador | Valor |
|---|---|
| Cumplimiento del objetivo | No cumplido: las necesidades no se validaron con personas usuarias |
| Tareas completadas / comprometidas | 3 / 12 (**25 %**); 5 parciales |
| Tareas trasladadas | 9 |
| Desviación del cronograma | +1 día para lo completado; las sesiones de consulta sin fecha |
| Defectos detectados | 0 de producto; 14 hallazgos de requisitos (VR-01 – VR-14) |
| Cambios realizados | CC-03, CC-04, CC-06 |
| Problemas encontrados | Sprint en paralelo con el Sprint 2; tareas sin criterios verificables; descripciones duplicadas |
| Acciones de mejora | Ver ACR-01 y ACR-02: replanificación, Daily grabado, Definition of Ready |

## Sprint 2 — Líneas base y diseño (20/10 – 03/11)

**Objetivo.** Establecer las líneas base del proyecto y el diseño inicial: arquitectura, datos, componentes y criterios
técnicos.

| Tarea | Responsable | Estado | Evidencia / pendiente |
|---|---|---|---|
| S2-01 Refinar requisitos (ADLCDS-14) | Wilberth | **Hecha** | Catálogo v1.0, verificación y registro de refinamiento |
| S2-02 Alcance, cronograma y presupuesto (ADLCDS-15) | Wilberth | Pendiente | El calendario se replanifica con CC-01 |
| S2-03 Matrices RACI, comunicaciones y riesgos (ADLCDS-16) | Wilberth | Pendiente | — |
| S2-04 Plan de pruebas e instituciones ficticias (ADLCDS-17) | Luis | **Hecha** | `Docs/05-Pruebas/Plan-de-pruebas.md`, `seed_demo` |
| S2-05 Arquitectura, datos y API (ADLCDS-18) | Luis | **Hecha** | `Docs/03-Diseno/Arquitectura-datos-API.md` |
| S2-06 Django, PostgreSQL y Docker (ADLCDS-19) | Samuel | **Hecha** | `backend/`, `docker-compose.yml` (Docker sin probar en el equipo de desarrollo) |
| S2-07 Prototipo de 6 pantallas (ADLCDS-20) | Samuel | **Hecha** | Pantallas implementadas; capturas en computadora y teléfono en `Docs/05-Pruebas/evidencias/e2e/` |
| S2-08 React y TypeScript (ADLCDS-21) | Samuel | **Hecha** | `frontend/` |

| Indicador | Valor |
|---|---|
| Cumplimiento del objetivo | Cumplido con un día de atraso (líneas base de requisitos, pruebas y arquitectura) |
| Tareas completadas / comprometidas | 6 / 8 (**75 %**) |
| Tareas trasladadas | 2 (S2-02, S2-03) |
| Desviación del cronograma | +1 día |
| Defectos detectados | 0 |
| Cambios realizados | CC-05, CC-07, CC-10 |
| Problemas encontrados | Docker no disponible en el equipo de desarrollo; tareas de gestión sin avance |
| Acciones de mejora | Probar Docker Compose en otro equipo; asignar S2-02 y S2-03 con fecha |

## Sprint 3 — Accesos e institución (en curso)

**Objetivo.** Acceso por rol, gestión de instituciones y aislamiento entre instituciones. Se adelantó la gestión de
estudiantes (CC-05).

| Tarea | Responsable | Estado |
|---|---|---|
| S3-01 Planificar y refinar HU04 – HU08 (ADLCDS-22) | Wilberth | Parcial (refinamiento hecho) |
| S3-02 Informe de avance y riesgos (ADLCDS-23) | Wilberth | **Hecha** (este informe) |
| S3-03 Casos CA01 – CA06 (ADLCDS-24) | Wilberth | **Hecha** (especificación de casos) |
| S3-04 GitHub Actions (ADLCDS-25) | Wilberth | **Hecha** (`.github/workflows/ci.yml`) |
| S3-05 Datos ficticios (ADLCDS-26) | Wilberth | **Hecha** (`seed_demo`) |
| S3-06 Reglas de datos HU04 – HU08 (ADLCDS-27) | Luis | **Hecha** (RN01 – RN07) |
| S3-07 Autenticación y cierre de sesión (ADLCDS-28) | Luis | **Hecha** |
| S3-08 Usuarios y permisos (ADLCDS-29) | Luis | **Hecha** |
| S3-09 API de instituciones y niveles (ADLCDS-30) | Luis | **Hecha** |
| S3-10 Pruebas de permisos y aislamiento (ADLCDS-31) | Luis | **Hecha** |
| S3-11 Refinar pantallas de asistencia (ADLCDS-32) | Samuel | Pendiente (HU10, Sprint 5) |
| S3-12 Pantalla de inicio de sesión (ADLCDS-33) | Samuel | **Hecha** |
| S3-13 Pantallas de instituciones (ADLCDS-34) | Samuel | **Hecha** |
| S3-14 Pantalla de datos institucionales (ADLCDS-35) | Samuel | **Hecha** |
| S3-15 Integración con API y errores (ADLCDS-36) | Samuel | **Hecha** |
| Adelantadas del Sprint 4: S4-03, S4-04, S4-05, S4-07, S4-11, S4-13 | Varios | **Hechas** |

| Indicador | Valor al corte |
|---|---|
| Tareas completadas / comprometidas | 13 / 15 (**87 %**) + 6 adelantadas del Sprint 4 |
| Historias implementadas y probadas | HU01 – HU07 (28 puntos), pendientes de integrar por PR |
| Defectos detectados | 2 (INC-001 alta, INC-002 baja), ambos corregidos y reprobados |
| Cambios realizados | CC-05, CC-07, CC-08, CC-09 |
| Pruebas | 102 automatizadas aprobadas; 28/28 escenarios cubiertos |
| Problemas encontrados | Sin revisión de PR por pares todavía; sin ejecución en CI con PostgreSQL |
| Acciones de mejora | Abrir los PR con revisión de Luis y Wilberth; Sprint Review grabado |

## Decisiones para el siguiente sprint

1. Integrar el incremento en `main` por PR revisados (MP-03) y cerrar INC-001 e INC-002.
2. Completar las tareas de gestión trasladadas (S1-01 – S1-04, S2-02, S2-03).
3. Realizar las sesiones de consulta y validar los supuestos marcados en S1-11 y en el catálogo.
4. Sprint 4: HU08 (docentes) y HU09 (grupos), con Definition of Ready aplicada.
