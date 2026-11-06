# Gestión de cambios — Nexora

| Campo | Valor |
|---|---|
| Referencia | Instrucciones del Proyecto Integrador, sección 18 |
| Versión | 1.1 |
| Fecha | 2026-11-05 |
| Responsable | Wilberth (aprobación del equipo en el Daily / Sprint Review) |

## 1. Procedimiento

1. **Solicitud**: cualquier integrante registra el cambio en esta tabla con su origen.
2. **Análisis de impacto**: alcance, cronograma, historias afectadas, pruebas y documentación.
3. **Decisión**: el equipo la toma en el Daily Scrum o el Sprint Review (aprobado, rechazado o pospuesto).
4. **Aplicación**: se actualizan Jira, el catálogo de requisitos, los casos de prueba y la matriz de trazabilidad.
5. **Verificación**: quien solicitó el cambio confirma que quedó aplicado.

Los cambios de código siguen además el flujo de ramas y Pull Requests de los [Estándares](Estandares.md), sección 7.

## 2. Registro de cambios

| ID | Fecha | Origen | Descripción | Justificación | Impacto | Historias / tareas afectadas | Decisión | Responsable | Estado |
|---|---|---|---|---|---|---|---|---|---|
| CC-01 | 2026-11-04 | Revisión del backlog (J1, J2) | Replanificar las fechas de los Sprints 3 – 8 en Jira | El Sprint 3 tiene fechas anteriores al Sprint 1 (05/10 – 19/10) y el Sprint 5 debería estar activo | Cronograma: se recorren los sprints a partir del 2026-11-04; sin cambio de alcance | Sprints 3 – 8 | Aprobado | Wilberth | Pendiente en Jira (las fechas de sprint solo se editan desde el tablero) |
| CC-02 | 2026-11-04 | Revisión del backlog (J3) | Asignar ADLCDS-17, 19, 47 y 61 según el responsable de su descripción | Asignado y descripción no coinciden | Sin impacto en alcance; aclara responsabilidades | ADLCDS-17, 19, 47, 61 | Aprobado | Wilberth | Pendiente en Jira |
| CC-03 | 2026-11-04 | Verificación de requisitos (VR-04 – VR-07) | Corregir descripciones copiadas, vacías o contradictorias | Errores de redacción en el backlog | Documentación; evita implementar requisitos equivocados | ADLCDS-7, 9, 12, 16, 29, 58 | Aprobado | Samuel | Aplicado en Jira |
| CC-04 | 2026-11-04 | Verificación de requisitos (VR-09) y sección 6 de las instrucciones | Crear HU01 – HU12 como historias con 3 escenarios mínimo | El backlog no tenía historias y preveía 24 criterios (< 3 por historia) | +20 escenarios; los casos de prueba se diseñan desde los escenarios | Todo el backlog | Aprobado | Wilberth | Aplicado (catálogo v1.0 y Jira) |
| CC-05 | 2026-11-04 | Atraso de los Sprints 1 y 2 | Reducir el incremento del segundo entregable a HU01 – HU07; HU08 – HU12 pasan a los Sprints 4 – 6 | Ninguna tarea terminada al cierre del Sprint 2; tres días hasta la entrega | Alcance del entregable: 28 de 57 puntos. HU07 se adelanta (REF-12) | HU07 – HU12; ADLCDS-43, 49 | Aprobado | Equipo | Aplicado |
| CC-06 | 2026-11-04 | Riesgo de disponibilidad de participantes | Reprogramar las 4 sesiones de consulta (S1-05, S1-09) si no se realizan antes del 2026-11-07 | Requieren personas usuarias reales | Las necesidades N01 – N09 se mantienen como hipótesis de la propuesta hasta validarlas | ADLCDS-6, 10; HU08, HU10 (supuestos) | Aprobado | Samuel y Luis | Abierto |
| CC-07 | 2026-11-04 | Decisión técnica (S1-07) | Aislamiento con esquema compartido e `institution_id` en lugar de esquemas por institución | Portabilidad (SQLite/PostgreSQL), simplicidad y pruebas en CI | Requiere pruebas de aislamiento por recurso (HU06) | HU06, HU07 | Aprobado | Luis | Aplicado |
| CC-08 | 2026-11-04 | Defecto INC-001 | `is_active` con valor por defecto en el serializador de estudiantes | Corrección de ADLCDS-103 | Código de API y una prueba de regresión | HU07 | Aprobado | Samuel | Aplicado (PR #5, pendiente de integrar) |
| CC-09 | 2026-11-04 | Defecto INC-002 | Mensajes propios para errores de fecha | Corrección de ADLCDS-104 (RNF04) | Código de API y pruebas de regresión | HU07 | Aprobado | Samuel | Aplicado (PR #8, pendiente de integrar) |
| CC-10 | 2026-11-04 | Flujo de Jira | El estándar de gestión usa los estados reales del tablero (Por hacer, En curso, Listo) en lugar de "En revisión" y "Finalizada" | El tablero no tiene esos estados | Actualización de los Estándares, sección 6 | — | Aprobado | Samuel | Aplicado |
| CC-11 | 2026-11-05 | Anexo de correcciones del avance 1 | Adoptar el anexo como línea base: numeración RF01 – RF08 del avance 1 en el catálogo y la trazabilidad; criterios CA01 – CA24 como referencia de aceptación; capacidad de **450 h** (3 × 10 h × 15 semanas); presupuesto de CRC 1.446.500 como estimación histórica; Jira como tablero oficial | El catálogo v1.0 había renumerado RF02 y RF03 y no citaba CA01 – CA24, lo que rompía la trazabilidad con el avance 1 | Catálogo v1.1, matriz v1.1, casos v1.1 y métricas v1.1; sin cambio de alcance | HU03 – HU06 (RF); todo el backlog (CA) | Aprobado | Samuel | Aplicado |
| CC-12 | 2026-11-05 | Integración continua | Ejecutar el CI en todos los PR, también los encadenados (antes solo hacia `main`); propagar el cambio con merges y no con rebase | Sin CI en los PR #2 – #10; el permiso automático rechazó el `push --force` | `ci.yml` (`f4e6a01`) y un merge por rama | PR #1 – #10 | Aprobado | Samuel | Aplicado |
| CC-13 | 2026-11-05 | Defecto INC-006 | Corregir la gestión de la sesión para cumplir el avance 1 (§7.1): opción A, `SessionAuthentication` con cookie HttpOnly, `SameSite=Lax` y CSRF; opción B, mantener el token con CSP, vencimiento por inactividad y registro de la desviación | La implementación no cumple la arquitectura aprobada | Opción A: backend (autenticación), cliente de la API, pruebas de HU01 – HU02 y CI; ~1 día. Opción B: menor esfuerzo, deja una desviación documentada | HU01, HU02; ADLCDS-121 | **Pendiente** (decide el equipo en el Sprint Review) | Luis y Samuel | Abierto |
| CC-14 | 2026-11-05 | Defecto INC-005 | vitest y @vitest/coverage-v8 3.2 → 4.1.12; `npm audit fix` | Avisos críticos de seguridad en dependencias de desarrollo | `package.json`, `package-lock.json`; 15/15 pruebas unitarias sin cambios | — | Aprobado | Samuel | Aplicado (`c42730e`, pendiente de integrar) |
| CC-15 | 2026-11-05 | ACR-03 | Una prueba que solo pasa al reintentar hace fallar el CI (`failOnFlakyTests`); lista de revisión de PR con arquitectura aprobada y datos asíncronos | Los reintentos ocultaron INC-004 e INC-007 | `playwright.config.ts`, plantilla de PR (`b403436`) | — | Aprobado | Samuel | Aplicado |
| CC-16 | 2026-11-05 | Verificación contra la línea base (VR-15 – VR-18) | Agregar el periodo lectivo (GAP-01) y los escenarios HU09-E4, HU10-E5 y HU11-E4 (GAP-02 – GAP-04) | CA05, CA12, CA16 y CA22 del avance 1 no estaban cubiertos | Catálogo v1.1; HU05 se amplía en el Sprint 4 | HU05, HU09, HU10, HU11 | Aprobado | Wilberth | Aplicado en el catálogo; implementación en los Sprints 4 – 6 |
| CC-17 | 2026-11-05 | Defectos INC-003, INC-004, INC-007, INC-008, INC-009 | Correcciones con pruebas de regresión y reprueba con la API lenta | Corrección de ADLCDS-117, 118, 119, 122 y 123 | Backend (`settings.py`, vista de inicio de sesión) e interfaz (estudiantes, mi institución, sesión) | HU01, HU02, HU05, HU07 | Aprobado | Samuel | Aplicado (PR #11, pendiente de integrar) |
