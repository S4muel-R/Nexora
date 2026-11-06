# Análisis de causa raíz — Nexora

| Campo | Valor |
|---|---|
| Referencia | Instrucciones del Proyecto Integrador, sección 17 |
| Técnicas | 5 porqués, Ishikawa (causa-efecto), Pareto |
| Versión | 1.0 |
| Fecha | 2026-11-04 |
| Estado | Borrador para validar en la retrospectiva del equipo |

> Las causas se apoyan en evidencia verificable (Jira, Git, registros de ejecución). Las marcadas con **[Validar]** son
> hipótesis sobre el trabajo del equipo y deben confirmarse o corregirse en la retrospectiva.

## ACR-01 — Atraso de los Sprints 1 y 2

**Problema.** Al cierre planificado de los Sprints 1 y 2 (2026-11-03), ninguna de las 20 tareas comprometidas estaba
finalizada en Jira y el repositorio no tenía código (evidencia: consulta de Jira del 2026-11-04; historial de Git).

### 5 porqués

| # | Pregunta | Respuesta | Evidencia |
|---|---|---|---|
| 1 | ¿Por qué no se terminó ninguna tarea a tiempo? | Las tareas del Sprint 2 dependían de líneas base del Sprint 1 que no estaban listas (requisitos, arquitectura) | Dependencias implícitas (VR-08) |
| 2 | ¿Por qué las líneas base del Sprint 1 no estaban listas? | Los Sprints 1 y 2 se ejecutaron en paralelo con las mismas fechas (20/10 – 03/11), sin un punto de corte para las líneas base | Fechas de sprint en Jira |
| 3 | ¿Por qué se planificaron en paralelo? | El calendario se cargó en Jira sin revisarlo; también el Sprint 3 quedó con fechas anteriores al Sprint 1 | J1, J2 |
| 4 | ¿Por qué no se detectó en el seguimiento? | No hubo Daily Scrum registrado ni revisión del tablero a mitad de sprint **[Validar]** | Sin grabaciones en OneDrive al 2026-11-04 |
| 5 | ¿Por qué no hubo seguimiento? | No existía un estándar de gestión con ceremonias y responsables definidos **[Validar]** | Estándares creados el 2026-11-04 |

**Causa raíz.** Planificación de sprints sin verificación (fechas y dependencias) y ausencia de un seguimiento
periódico que detectara el atraso.

### Ishikawa

```
 Personas                          Proceso                          Herramientas
 · Responsables cruzados           · Sprints 1 y 2 en paralelo      · Fechas de sprint sin revisar
   (J3)                            · Sin Daily registrado [Validar] · Tareas sin enlaces de
 · Carga concentrada en un         · Sin definición de "Listo"        dependencia
   integrante [Validar]                                                       │
            ╲                              │                                  ╱
             ╲─────────────────────────────┼─────────────────────────────────╱──►  ATRASO DE LOS
             ╱─────────────────────────────┼─────────────────────────────────╲     SPRINTS 1 Y 2
            ╱                              │                                  ╲
 Requisitos                         Tiempo                           Medición
 · Sin historias ni criterios       · Trabajo de otros cursos        · Sin métricas de avance
   (VR-09)                            [Validar]                        hasta la semana 10
 · Descripciones copiadas (J4)      · Entrega en 3 días
```

### Acciones

| Tipo | Acción | Responsable | Fecha |
|---|---|---|---|
| Correctiva | Replanificar los sprints en Jira (CC-01) y reducir el alcance del incremento (CC-05) | Wilberth | 2026-11-05 |
| Correctiva | Daily Scrum grabado diario hasta el entregable | Todos | 2026-11-05 |
| Preventiva | Revisión del calendario y de las dependencias al planificar cada sprint (lista de verificación de planificación) | Wilberth | Sprint 4 |
| Preventiva | Medir MG-01 y MG-02 a mitad de cada sprint, no solo al cierre | Wilberth | Sprint 4 |

## ACR-02 — Calidad del backlog original

**Problema.** La verificación encontró 14 hallazgos en el backlog original y la propuesta (VR-01 – VR-14).

### Pareto

| Criterio | Hallazgos | % | % acumulado |
|---|---|---|---|
| Información incompleta | 4 | 28,6 % | 28,6 % |
| Ambigüedad | 3 | 21,4 % | 50,0 % |
| Duplicidad | 2 | 14,3 % | 64,3 % |
| Contradicción | 1 | 7,1 % | 71,4 % |
| Dependencias no identificadas | 1 | 7,1 % | 78,6 % |
| Criterios no verificables | 1 | 7,1 % | 85,7 % |
| Historia demasiado grande | 1 | 7,1 % | 92,9 % |
| Sin valor claro | 1 | 7,1 % | 100 % |

El 50 % de los hallazgos son de **información incompleta y ambigüedad**.

### 5 porqués (información incompleta y ambigüedad)

| # | Pregunta | Respuesta |
|---|---|---|
| 1 | ¿Por qué hay requisitos incompletos o ambiguos? | Se redactaron como tareas ("API de estudiantes") sin datos, reglas ni resultados esperados |
| 2 | ¿Por qué se redactaron como tareas? | El backlog se armó desde la EDT y el cronograma, no desde historias de usuario |
| 3 | ¿Por qué no desde historias? | Las historias y sus criterios no existían todavía; se pensaban crear en el refinamiento (ADLCDS-14) |
| 4 | ¿Por qué no se crearon antes de planificar los sprints? | No había una regla de "lista para planificar" (Definition of Ready) |

**Causa raíz.** Ausencia de una Definition of Ready: se planificaron tareas antes de definir historias con criterios
verificables.

### Acciones

| Tipo | Acción | Responsable | Fecha |
|---|---|---|---|
| Correctiva | Catálogo con HU01 – HU12, reglas RN01 – RN07 y 44 escenarios (CC-04) | Wilberth / Luis | 2026-11-04 (hecho) |
| Preventiva | Definition of Ready: una historia entra al sprint solo con 3 escenarios, datos definidos y dependencias enlazadas | Wilberth | Sprint 4 |
| Preventiva | Revisión por pares con la lista de chequeo antes de cada planificación (MP-01) | Todos | Cada sprint |

## ACR-03 — Defectos del incremento

**Problema.** Se registraron 2 defectos del producto (INC-001, INC-002) y 2 fallas de scripts de prueba.

### Pareto por origen

| Origen | Cantidad | Detalle |
|---|---|---|
| Comportamiento del framework no considerado | 2 | INC-001 (booleano ausente en formularios), INC-002 (mensaje de fecha por defecto) |
| Configuración de la herramienta de pruebas | 1 | Limpieza del DOM en Vitest |
| Selector ambiguo en el script | 1 | Playwright, CP-S07 |

### 5 porqués — INC-001 (severidad alta)

| # | Pregunta | Respuesta |
|---|---|---|
| 1 | ¿Por qué el estudiante quedaba inactivo? | El serializador recibía `is_active = false` cuando el campo no venía en el formulario |
| 2 | ¿Por qué llegaba `false`? | DRF interpreta un booleano ausente en datos de formulario como `false` |
| 3 | ¿Por qué el campo era editable sin valor por defecto? | Se expuso `is_active` para poder desactivar (HU07-E2) usando el mismo serializador que el registro |
| 4 | ¿Por qué no se detectó al diseñar? | El contrato de API se pensó solo en JSON; no se definieron pruebas con otros formatos |

**Causa raíz.** Un campo de control (`is_active`) se reutilizó en la creación sin definir su valor por defecto ni probar
el comportamiento del framework con formularios.

### 5 porqués — INC-002

| # | Pregunta | Respuesta |
|---|---|---|
| 1 | ¿Por qué apareció un mensaje técnico? | DRF devolvió su mensaje de formato de fecha |
| 2 | ¿Por qué no se reemplazó? | Los estándares pedían mensajes claros, pero no listaban los mensajes por tipo de campo |
| 3 | ¿Por qué no lo detectaron las pruebas automatizadas? | Los casos de error de fecha probaban una fecha futura, no un campo vacío |

**Causa raíz.** Los escenarios de error (HU07-E5) no incluían el caso de campo vacío y el estándar de errores no
definía mensajes por tipo de dato.

### Acciones

| Tipo | Acción | Responsable | Fecha |
|---|---|---|---|
| Correctiva | Correcciones CC-08 y CC-09 con pruebas de regresión | Samuel | 2026-11-04 (hecho) |
| Preventiva | Revisar en cada serializador nuevo los campos booleanos y de fecha (valor por defecto y mensajes); agregarlo a la lista de revisión del PR | Luis | Sprint 4 |
| Preventiva | Incluir el caso "campo vacío" en los escenarios de error al refinar historias | Wilberth | Sprint 4 |
| Preventiva | Usar selectores por rol y ámbito (celda, formulario) en Playwright y configurar `cleanup` en Vitest (hecho) | Samuel | 2026-11-04 |
