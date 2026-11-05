# Registro de refinamiento del backlog — Nexora

| Campo | Valor |
|---|---|
| Referencia | Instrucciones del Proyecto Integrador, sección 8 |
| Versión | 1.0 |
| Fecha | 2026-11-04 |
| Backlog | [Catálogo de requisitos](Catalogo-de-requisitos.md) y Jira ADLCDS |

Tipos de cambio: **Nueva**, **Modificada**, **Dividida**, **Eliminada**, **Prioridad**, **Criterios agregados**,
**Ambigüedad corregida**, **Incompletitud corregida**.

| ID | Fecha | Tipo | Elemento | Antes | Después | Motivo |
|---|---|---|---|---|---|---|
| REF-01 | 2026-11-04 | Nueva | HU01 – HU12 | El backlog de Jira solo tenía tareas; las historias se mencionaban (HU04 – HU12) pero no existían | 12 historias con formato "Como… quiero… para…", prioridad, estimación, dependencias y estado | VR-09; sección 6 de las instrucciones |
| REF-02 | 2026-11-04 | Dividida | Autenticación (ADLCDS-28) | Una tarea para inicio y cierre de sesión | HU01 Iniciar sesión y HU02 Cerrar sesión | Objetivos y escenarios distintos; HU02 es pequeña y se entrega por separado |
| REF-03 | 2026-11-04 | Dividida | Instituciones (ADLCDS-30, 34, 35) | Una API para registrar, consultar y actualizar instituciones | HU04 (administración de la plataforma) y HU05 (personal administrativo) | Actores y permisos diferentes |
| REF-04 | 2026-11-04 | Dividida | Reportes (ADLCDS-71, 72, 76) | "Mostrar listado y resúmenes" | HU11 Listados y HU12 Resumen de asistencia | Datos, filtros y dependencias distintos (HU12 depende de HU10) |
| REF-05 | 2026-11-04 | Nueva | HU06 Aislamiento | El aislamiento aparecía solo como estudio técnico (ADLCDS-8) y pruebas (ADLCDS-31, 87) | Historia propia con 4 escenarios verificables | Es el riesgo principal de seguridad (N03) y necesita criterios de aceptación |
| REF-06 | 2026-11-04 | Criterios agregados | HU01 – HU12 | 24 criterios previstos (ADLCDS-14) | 44 escenarios: 12 exitosos, 13 alternativos, 19 de error | Mínimo de 3 por historia (sección 9) |
| REF-07 | 2026-11-04 | Ambigüedad corregida | RF07 / HU10 | "Registrar presencia o ausencia" | Por grupo y fecha, estados presente y ausente | VR-01 |
| REF-08 | 2026-11-04 | Ambigüedad corregida | RF02 / HU06 | "Evitar que una institución consulte información de otra" | Respuesta 404 sin revelar la existencia del recurso (RN02) | VR-12 |
| REF-09 | 2026-11-04 | Incompletitud corregida | RF04 / HU07 | "Registros esenciales" | Identificación, nombre, apellidos, fecha de nacimiento, nivel; reglas RN04 y RN05 | VR-03 |
| REF-10 | 2026-11-04 | Incompletitud corregida | RF02 / HU03 | ADLCDS-29 sin descripción | Tres roles (RN01) y opciones visibles por rol | VR-07 |
| REF-11 | 2026-11-04 | Modificada | ADLCDS-58 | "Duplicar registros por estudiante, grupo y fecha" | "Evitar registros duplicados por estudiante, grupo y fecha" | VR-04 (contradicción) |
| REF-12 | 2026-11-04 | Prioridad | HU07 Estudiantes | Sprint 4, después de grupos y docentes | Alta; adelantada al incremento del segundo entregable | Es la base de grupos, asistencia y reportes; CC-05 |
| REF-13 | 2026-11-04 | Prioridad | HU08 Docentes | Sprint 4 junto con estudiantes | Media; se mantiene en Sprint 4 | Reducción del alcance del incremento (CC-05) |
| REF-14 | 2026-11-04 | Eliminada | Consulta de asistencia por familias | La propuesta menciona la participación futura de familias o personas encargadas | Fuera del alcance de la primera versión | La propuesta la pospone hasta definir las funciones centrales |
| REF-15 | 2026-11-04 | Nueva | RNF05 Rendimiento | ADLCDS-56 y 99 preparan pruebas de rendimiento sin requisito | Listados en menos de 2 s con 120 estudiantes | VR-14 |

## Resumen

| Tipo | Cantidad |
|---|---|
| Nueva | 3 |
| Dividida | 3 |
| Modificada | 1 |
| Eliminada | 1 |
| Prioridad | 2 |
| Criterios agregados | 1 (20 escenarios más que lo previsto) |
| Ambigüedad corregida | 2 |
| Incompletitud corregida | 2 |
| **Total** | **15** |
