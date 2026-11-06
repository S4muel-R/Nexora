# Respuesta al anexo de correcciones del avance 1 — Nexora

| Campo | Valor |
|---|---|
| Documento revisado | Primer entregable corregido, "Anexo de correcciones — Avance 1" (revisión del 2026-11-04) |
| Versión | 1.0 |
| Fecha | 2026-11-05 |
| Preparado por | Samuel · revisión pendiente de Luis y Wilberth |

Para cada punto del anexo se indica qué se hizo en el segundo entregable, dónde está la evidencia y qué queda pendiente.
Se mantiene el criterio del anexo: no se declara como hecho nada sin evidencia verificable.

## 1. Repositorio, tablero y evidencias verificables

| Punto del anexo | Respuesta | Evidencia |
|---|---|---|
| Comprobar el acceso y la rama de entrega del repositorio | Repositorio público: https://github.com/S4muel-R/Nexora. Rama de entrega `main`; el incremento está en 11 Pull Requests encadenados (#1 – #11) pendientes de revisión por pares | [Pull requests](https://github.com/S4muel-R/Nexora/pulls) · captura `05-Pruebas/evidencias/ci/EV_EJ-11_pull-requests_20261105.png` |
| URL exacta del tablero | Jira Cloud, proyecto ADLCDS, tablero 2: https://proyectosulacit.atlassian.net/jira/software/projects/ADLCDS/boards/2 (verificada con la API de Jira) | [Backlog exportado](Backlog-Jira.md) |
| Vincular cada evidencia con la tarea ADLCDS y el commit o PR | Cada commit cita su tarea o defecto ADLCDS; cada PR, sus claves; cada incidente, su commit de corrección | [Informes de incidente](../05-Pruebas/Informes-de-incidente.md) · [Registro de ejecución](../05-Pruebas/Registro-de-ejecucion.md) |
| Carpetas de evidencia | `Docs/` con `01-Planificacion`, `02-Requisitos`, `03-Diseno`, `05-Pruebas/evidencias` (subcarpetas `ci`, `e2e`, `seguridad`, `accesibilidad`) | [Índice](../README.md) |
| Acceso de lectura del profesor | El repositorio es público. **Pendiente:** dar acceso al tablero de Jira y a la carpeta de OneDrive (S1-12) | — |

## 2. Gobierno del proyecto y autorizaciones

| Punto del anexo | Respuesta |
|---|---|
| Confirmar formalmente el rol de gerente y la aceptación del equipo | **Pendiente**: registro de decisión del equipo en el Sprint Review. No se simulan firmas |
| Patrocinador y representantes ficticios sin firmas | Se mantiene: los recorridos del escenario Centro Educativo Horizonte y las instituciones de prueba (Escuela Los Robles, Colegio Monteverde, Kínder Arcoíris) son ficticios |

## 3. Coherencia de cronograma y capacidad

| Punto del anexo | Respuesta | Evidencia |
|---|---|---|
| Calendario de Jira como planificación vigente | Adoptado (CC-11). Las fechas de los Sprints 3 – 8 en Jira están desordenadas: replanificación CC-01 pendiente en el tablero | [Gestión de cambios](Gestion-de-cambios.md) · [Backlog exportado](Backlog-Jira.md) |
| Línea base de esfuerzo de 450 h | Adoptada como línea base del indicador de esfuerzo. **Sin dato observado**: el equipo no registra horas; se registran desde el Sprint 4 | [Métricas](Metricas.md), sección 1 |
| Presupuesto como estimación histórica | Registrado así; no hay gasto ejecutado | [Métricas](Metricas.md), sección 1 |
| Reprogramar objetivos, hitos y paquetes de las semanas 16 – 17 | **Pendiente** con CC-01 | — |

## 4. Delimitación del MVP

| Punto del anexo | Respuesta |
|---|---|
| MVP obligatorio | El incremento cubre RF01 (acceso, permisos y aislamiento), RF02 (configuración mínima de instituciones), RF03 parcial (datos y niveles; falta el periodo lectivo, GAP-01) y RF04 (estudiantes). RF05 – RF08 están planificados en los Sprints 4 – 6 |
| Aislamiento obligatorio y no diferido | Implementado y probado entre las 3 instituciones ficticias, en SQLite y PostgreSQL (HU06, CP-A13 – CP-A15, CP-S10; MQ-09 = 100 %) |
| Reducciones del compromiso por solicitud de cambio | La reducción del incremento a HU01 – HU07 está registrada en CC-05; las brechas con la línea base, en CC-16 |

## 5. Trazabilidad bidireccional

| Punto del anexo | Respuesta | Evidencia |
|---|---|---|
| Cadena objetivo ↔ RF ↔ historia / tarea ADLCDS ↔ riesgo ↔ caso ↔ defecto ↔ resultado | Matriz v1.1: sección 1 (incremento), sección 2 (CA01 – CA24 en ambos sentidos, con objetivo, riesgo, historia, Jira, casos, resultado y defecto) y sección 3 (desde cada defecto hasta el requisito, el objetivo y el riesgo) | [Matriz de trazabilidad](../02-Requisitos/Matriz-de-trazabilidad.md) |
| Identificadores reales del tablero y del repositorio | Historias ADLCDS-105 – 116, defectos ADLCDS-103, 104 y 117 – 123, tareas ADLCDS-1 – 102, commits y PR reales | Ídem |
| Coherencia con la numeración del avance 1 | Corregido: el catálogo v1.0 había renumerado RF02 y RF03 (VR-15). El catálogo v1.1 vuelve a RF01 – RF08 del avance 1 y relaciona cada historia con CA01 – CA24 | [Catálogo v1.1](../02-Requisitos/Catalogo-de-requisitos.md), secciones 2 y 2.1 |
| Hallazgos del cruce con la línea base | Cuatro brechas: periodo lectivo (CA05) y criterios sin escenario (CA12, CA16, CA22). Se agregaron los escenarios y se planificó el periodo | VR-15 – VR-18 · REF-16, REF-17 · CC-16 |

## 6. Indicadores: fórmula, línea base, fuente y evidencia

Los seis indicadores del anexo están medidos con fecha de corte, responsable, fuente, valor observado y decisión en
[Métricas](Metricas.md), sección 1. Resumen al 2026-11-05:

| Indicador | Valor observado |
|---|---|
| Cobertura de requisitos | 3/8 RF implementados y probados (+ RF03 parcial); 0/8 aceptados |
| Aprobación funcional | 58/59 casos (98,3 %); 6/24 criterios de la línea base aprobados y 2 parciales |
| Defectos críticos o altos abiertos | 0 sin corregir; 3 altos corregidos pendientes de integrar |
| Avance de tareas | Sprint 3: 13/15 con entregable; 0 en *Listo* en Jira hasta integrar los PR |
| Éxito de recorridos | Sin dato (evaluación O5 no ejecutada) |
| Esfuerzo | Sin dato (no hay registro de horas); línea base 450 h |

## 7. Pruebas automatizadas, CI/CD, seguridad y accesibilidad

| Componente | Evidencia mínima pedida | Dónde está |
|---|---|---|
| Pruebas de servidor | Suite pytest, resultados, salida del comando y commit | 63 pruebas, 94 % de cobertura · `05-Pruebas/evidencias/EV_pytest_*` · [Registro de ejecución](../05-Pruebas/Registro-de-ejecucion.md) |
| Pruebas de interfaz | Playwright para inicio de sesión, permisos, grupos y asistencia; informe de ejecución | 21 casos × 2 dispositivos (inicio de sesión, permisos, instituciones, estudiantes, accesibilidad) · `EV_playwright_*` · informe HTML en el artefacto `evidencias-e2e` de cada CI. **Grupos y asistencia: pendientes** con HU09 – HU10 |
| Integración continua | Workflow, ejecución visible, fecha, commit, estado y registro de fallos | `.github/workflows/ci.yml` · 14 ejecuciones en los PR #1 – #11 con enlace, commit y resultado (Registro, sección 2) · capturas en `05-Pruebas/evidencias/ci/` · registro de fallos: `EV_INC-001_falla-CI_20261105.txt`, `EV_INC-004_falla-CI_*`, `EV_INC-007_falla-CI_*` |
| Seguridad | Acceso no autorizado, aislamiento, revisión de secretos y dependencias; hallazgos y correcciones | [Revisión de seguridad](../05-Pruebas/Revision-seguridad.md): 13/17 controles cumplen; hallazgos INC-003, INC-005, INC-006 (abierto), INC-007, INC-009 |
| Accesibilidad | Lista WCAG 2.2 AA aplicable, teclado, contraste, etiquetas y resultados | [Revisión de accesibilidad](../05-Pruebas/Revision-accesibilidad.md): 0 violaciones en 12 auditorías; lista de comprobación por criterio; revisión con lector de pantalla pendiente |

## 8. Revisión editorial y pendientes

| Punto del anexo | Respuesta |
|---|---|
| Referencia a GitHub Projects | Los documentos de este entregable usan Jira como tablero (Estándares, sección 6) |
| Marcadores provisionales, nombres y firmas | No se completan con datos inventados |

## 9. Registro reservado para la siguiente entrega

| Elemento del anexo | Estado en este entregable |
|---|---|
| Exportación del backlog vigente | **Hecho**: [Backlog-Jira.md](Backlog-Jira.md) y [Backlog-Jira.csv](Backlog-Jira.csv) (120 elementos) |
| Matriz de trazabilidad con IDs reales | **Hecho**: matriz v1.1 |
| Registros de defectos y resultados | **Hecho**: 9 incidentes con evidencia de falla y reprueba, registrados en Jira |
| Indicadores con datos observados | **Hecho** (2 sin dato, declarados como tales) |
| Capturas y logs de CI/CD | **Hecho**: `05-Pruebas/evidencias/ci/` y registros de fallo |
| Ejecución automatizada | **Hecho**: 121 pruebas, más 84 con latencia |
| Revisión de seguridad y accesibilidad | **Hecho** para la selección de controles; manual con lector de pantalla pendiente |
| Evaluación con usuarios | **Pendiente** (O5, Sprint 8) |
| Actas de aceptación | **Pendiente**: aceptación manual EJ-12 y acta del Sprint Review |
