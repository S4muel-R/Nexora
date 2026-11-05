# Gestión de cambios — Nexora

| Campo | Valor |
|---|---|
| Referencia | Instrucciones del Proyecto Integrador, sección 18 |
| Versión | 1.0 |
| Fecha | 2026-11-04 |
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
| CC-08 | 2026-11-04 | Defecto INC-001 | `is_active` con valor por defecto en el serializador de estudiantes | Corrección de ADLCDS-103 | Código de API y una prueba de regresión | HU07 | Aprobado | Samuel | Aplicado (pendiente de integrar) |
| CC-09 | 2026-11-04 | Defecto INC-002 | Mensajes propios para errores de fecha | Corrección de ADLCDS-104 (RNF04) | Código de API y pruebas de regresión | HU07 | Aprobado | Samuel | Aplicado (pendiente de integrar) |
| CC-10 | 2026-11-04 | Flujo de Jira | El estándar de gestión usa los estados reales del tablero (Por hacer, En curso, Listo) en lugar de "En revisión" y "Finalizada" | El tablero no tiene esos estados | Actualización de los Estándares, sección 6 | — | Aprobado | Samuel | Aplicado |
