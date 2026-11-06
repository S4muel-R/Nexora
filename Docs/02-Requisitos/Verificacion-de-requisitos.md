# Verificación de requisitos — Nexora

| Campo | Valor |
|---|---|
| Referencia | Instrucciones del Proyecto Integrador, sección 7 |
| Versión | 1.0 |
| Fecha | 2026-11-04 |
| Artefactos revisados | Propuesta preliminar; backlog de Jira ADLCDS (101 tareas, revisión del 2026-11-04); [Catálogo de requisitos v1.0](Catalogo-de-requisitos.md) |
| Técnica | Lista de chequeo (sección 1) aplicada a cada artefacto + revisión por pares (sección 4) |

## 1. Lista de chequeo

| Código | Criterio | Pregunta de revisión |
|---|---|---|
| C1 | Ambigüedad | ¿Admite más de una interpretación? ¿Usa términos vagos ("sencillo", "básico", "esencial")? |
| C2 | Información incompleta | ¿Faltan datos, actores, reglas o resultados esperados para implementarlo? |
| C3 | Contradicciones | ¿Contradice a otro requisito, tarea u objetivo? |
| C4 | Duplicidad | ¿Repite el contenido de otro elemento? |
| C5 | Dependencias no identificadas | ¿Depende de otro elemento sin que esté registrado? |
| C6 | Ausencia de criterios verificables | ¿Tiene criterios que permitan decidir si se cumple con una prueba? ¿Al menos 3 escenarios? |
| C7 | Historia demasiado grande | ¿Cabe en un sprint (8 puntos o menos)? ¿Mezcla objetivos distintos? |
| C8 | Historia sin valor claro | ¿Indica quién se beneficia y para qué? |

## 2. Hallazgos sobre el backlog original y la propuesta

| ID | Criterio | Artefacto | Hallazgo | Corrección aplicada en el catálogo v1.0 |
|---|---|---|---|---|
| VR-01 | C1 | Propuesta, "Asistencia" | "Registrar la presencia o ausencia" no indica si es por día o por lección | RF07 y HU10 la definen por grupo y fecha; se valida con la pregunta 4.3 del guion S1-10 |
| VR-02 | C1 | Propuesta, "Reportes básicos"; ADLCDS-71, 72 | "Reportes sencillos" y "resúmenes simples" sin contenido definido | HU11 y HU12 detallan qué muestra cada reporte y sus filtros |
| VR-03 | C2 | Propuesta, "Estudiantes y docentes"; ADLCDS-43 | "Registros esenciales" sin lista de datos ni validaciones | RN04 y RN05 definen campos y validaciones; HU07-E1 y E5 |
| VR-04 | C3 | ADLCDS-58 (S5-06) | Dice "duplicar registros por estudiante, grupo y fecha", contrario a ADLCDS-42, que pide unicidad | HU10-E3: una sola asistencia por grupo y fecha; se corrige la descripción (CC-03) |
| VR-05 | C4 | ADLCDS-12 (S1-11) | La descripción es copia de ADLCDS-11 (S1-10); solo el criterio de entrega corresponde a S1-11 | Se corrige la descripción (CC-03) |
| VR-06 | C4 | ADLCDS-16 (S2-03) | La descripción "Definir pruebas y 3 instituciones" es copia de ADLCDS-17 y no describe las matrices RACI, de comunicaciones y de riesgos | Se corrige la descripción (CC-03) |
| VR-07 | C2 | ADLCDS-29 (S3-08) | "Usuarios y permisos" sin descripción | RF02, RN01 y HU03 definen roles y permisos |
| VR-08 | C5 | Backlog de Jira | Las pantallas (ADLCDS-33 a 36) dependen de las API (ADLCDS-28, 30) y del contrato de ADLCDS-18, sin enlaces de dependencia | Columna "Dependencias" del backlog; enlaces en Jira |
| VR-09 | C6 | ADLCDS-14 (S2-01) | Prevé 24 criterios para 12 historias (2 por historia); la sección 9 exige al menos 3 (exitoso, alternativo, error). Las tareas no tienen criterios | 44 escenarios Dado / Cuando / Entonces, mínimo 3 por historia |
| VR-10 | C7 | ADLCDS-43 y 49 | "Registrar, editar y desactivar estudiantes evitando duplicados" agrupa cuatro operaciones | Se mantiene como HU07 (8 puntos) porque comparte formulario y reglas; queda señalada para la revisión por pares |
| VR-11 | C8 | ADLCDS-19, 21, 25, 41 | Son tareas técnicas (entornos, CI, Playwright) sin valor directo para una persona usuaria | Se mantienen como tareas habilitadoras, no como historias |
| VR-12 | C1 | ADLCDS-8 (S1-07), 31 | "Evitar que una institución consulte información de otra" no define la respuesta esperada | RN02: respuesta 404; HU06-E3 y E4 |
| VR-13 | C2 | Propuesta, "Personas usuarias" | No indica quién crea las cuentas docentes | HU08: las crea el personal administrativo; se valida con la pregunta 6.4 del guion |
| VR-14 | C2 | ADLCDS-56 (S5-04), 99 | Se preparan datos y pruebas de rendimiento sin un requisito de rendimiento que medir | RNF05: listados en menos de 2 s con 120 estudiantes |

Resumen por criterio:

| C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 | Total |
|---|---|---|---|---|---|---|---|---|
| 3 | 4 | 1 | 2 | 1 | 1 | 1 | 1 | 14 |

## 3. Autoverificación del catálogo v1.0

| Historia | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 |
|---|---|---|---|---|---|---|---|---|
| HU01 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (5) | ✔ 3 pts | ✔ |
| HU02 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (3) | ✔ 1 pt | ✔ |
| HU03 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (3) | ✔ 3 pts | ✔ |
| HU04 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (4) | ✔ 5 pts | ✔ |
| HU05 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (4) | ✔ 3 pts | ✔ |
| HU06 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (4) | ✔ 5 pts | ✔ |
| HU07 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (5) | ⚠ 8 pts (VR-10) | ✔ |
| HU08 | ✔ | ⚠ validar VR-13 | ✔ | ✔ | ✔ | ✔ (3) | ✔ 5 pts | ✔ |
| HU09 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (3) | ⚠ 8 pts | ✔ |
| HU10 | ⚠ validar VR-01 | ✔ | ✔ | ✔ | ✔ | ✔ (4) | ⚠ 8 pts | ✔ |
| HU11 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (3) | ✔ 3 pts | ✔ |
| HU12 | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ (3) | ✔ 5 pts | ✔ |

✔ cumple · ⚠ cumple con observación pendiente de validar

## 4. Revisión por pares

Cada integrante revisa el catálogo con la lista de chequeo y registra aquí sus hallazgos. Los hallazgos aceptados se
incorporan en la versión 1.1 del catálogo y en el registro de refinamiento.

| ID | Revisor(a) | Fecha | Historia | Criterio | Hallazgo | Decisión |
|---|---|---|---|---|---|---|
| VR-P01 | | | | | | |
| VR-P02 | | | | | | |

| Revisor(a) | Fecha | Firma / visto bueno |
|---|---|---|
| Luis | | |
| Wilberth | | |
