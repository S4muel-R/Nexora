# Análisis de causa raíz — Nexora

| Campo | Valor |
|---|---|
| Referencia | Instrucciones del Proyecto Integrador, sección 17 |
| Técnicas | 5 porqués, Ishikawa (causa-efecto), Pareto |
| Versión | 1.1 |
| Fecha | 2026-11-05 |
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

**Problema.** Se registraron 9 defectos del producto (INC-001 – INC-009) y 3 fallas de scripts de prueba. Cuatro de
los defectos (INC-004, INC-007, INC-008, INC-009) dependen del orden o la demora de las respuestas: solo aparecieron en
el CI o con la API lenta, y el reintento automático dejó en verde una ejecución de INC-004 y una de INC-007. INC-004 se
reabrió porque su primera corrección no resistió la prueba con latencia.

### Pareto por origen

| Origen | Cantidad | % | % acumulado | Detalle |
|---|---|---|---|---|
| Comportamiento asíncrono no considerado (orden y demora de las respuestas) | 4 | 33,3 % | 33,3 % | INC-004 (formulario usable antes de cargar los niveles), INC-007 (validación tardía de la sesión anterior), INC-008 (carga repetida que sobrescribe lo escrito), INC-009 (token borrado solo al responder el servidor) |
| Seguridad sin revisar en el diseño y la configuración | 3 | 25,0 % | 58,3 % | INC-003 (HTTPS), INC-005 (dependencias), INC-006 (sesión distinta de la aprobada) — ver ACR-04 |
| Scripts de prueba | 3 | 25,0 % | 83,3 % | Limpieza del DOM en Vitest, selector ambiguo en CP-S07, fecha UTC en las capturas |
| Comportamiento del framework no considerado | 2 | 16,7 % | 100 % | INC-001 (booleano ausente en formularios), INC-002 (mensaje de fecha por defecto) |

La categoría principal es el comportamiento asíncrono: un tercio de las fallas y los defectos más difíciles de
detectar. Junto con la del framework (INC-001, INC-002) comparte un mismo tipo de causa: supuestos no verificados
sobre el entorno de ejecución.

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

### 5 porqués — INC-004, INC-007, INC-008 e INC-009 (comportamiento asíncrono)

| # | Pregunta | Respuesta | Evidencia |
|---|---|---|---|
| 1 | ¿Por qué falló el registro (INC-004) y se perdió la sesión (INC-007)? | La interfaz usó datos de un momento anterior: los niveles al pulsar el botón; la respuesta de `/auth/me/` de la sesión anterior | Capturas del CI (`EV_INC-004_falla-CI_*`, `EV_INC-007_falla-CI_*`) |
| 2 | ¿Por qué se usaron datos de un momento anterior? | El código suponía que las respuestas llegan antes de la siguiente acción de la persona y en el orden en que se piden | `StudentsPage.tsx` (`openForm`), `AuthContext.tsx` |
| 3 | ¿Por qué no se vio antes del CI? | En el equipo de desarrollo la API local responde en milisegundos; el ambiente del CI es más lento. Además, las pruebas usan el servidor de desarrollo, donde React monta las pantallas dos veces (INC-008) | Pasan en local (EJ-10), fallan en CI (EJ-11, EJ-17, EJ-20) y con latencia (EJ-21) |
| 4 | ¿Por qué el CI quedó en verde en PR #9 y en la primera ejecución de PR #11? | Playwright reintenta una vez en CI; la segunda vez pasó y el resultado se informó como intermitente sin hacer fallar el flujo | EJ-11, EJ-17 |
| 5 | ¿Por qué se aceptaba una prueba intermitente? | El plan de pruebas no definía qué hacer con ellas: se trataban como ruido del ambiente | Plan de pruebas v1.0 |

**Causa raíz.** Las pruebas de sistema no simulaban respuestas lentas y el CI aceptaba como aprobada una prueba que
fallaba de forma intermitente, de modo que un defecto real se confundió con inestabilidad del ambiente. La primera
corrección de INC-004 se reprobó solo con un retraso fijo en una petición, por eso no detectó el caso de guardar antes
de la carga.

### Acciones

| Tipo | Acción | Responsable | Fecha |
|---|---|---|---|
| Correctiva | Correcciones CC-08 y CC-09 con pruebas de regresión | Samuel | 2026-11-04 (hecho) |
| Correctiva | Correcciones de INC-004 e INC-007 con reprueba que retrasa las respuestas (CP-S18, CP-S19) y pruebas unitarias y de API | Samuel | 2026-11-05 (hecho) |
| Preventiva | Una prueba que solo pasa al reintentar hace fallar el CI (`failOnFlakyTests`, commit `b403436`) y se analiza como posible defecto (Plan de pruebas, sección 9) | Samuel | 2026-11-05 (hecho) |
| Preventiva | Cada pantalla nueva incluye un caso de sistema con la API retrasada (`page.route`) para los datos que carga al abrir | Samuel | Sprint 4 |
| Preventiva | Antes de cada entrega, ejecutar la suite de sistema contra la API con latencia aleatoria y sin reintentos (EJ-21, EJ-22); llevar el middleware de latencia al repositorio como opción de prueba | Samuel | Sprint 4 |
| Preventiva | Ejecutar las pruebas de sistema también sobre la versión compilada (`vite build` + `vite preview`), que es la que se entrega | Wilberth | Sprint 4 |
| Correctiva | Correcciones de INC-008, INC-009 y la reapertura de INC-004 (commit `f15dec5`) | Samuel | 2026-11-05 (hecho) |
| Preventiva | Revisar en cada serializador nuevo los campos booleanos y de fecha (valor por defecto y mensajes), y en cada pantalla los datos asíncronos; agregado a la lista de revisión del PR (commit `b403436`) | Luis y Samuel | 2026-11-05 (hecho) |
| Preventiva | Incluir el caso "campo vacío" en los escenarios de error al refinar historias | Wilberth | Sprint 4 |
| Preventiva | Selectores por rol y ámbito en Playwright, `cleanup` en Vitest y fecha local en las evidencias | Samuel | 2026-11-05 (hecho) |

## ACR-04 — Hallazgos de seguridad y desviación de la arquitectura aprobada

**Problema.** La primera revisión de seguridad (EJ-15, EJ-16) encontró tres defectos: configuración HTTPS ausente
(INC-003), dependencias de desarrollo con avisos críticos (INC-005) y una sesión implementada con token en
`localStorage` en lugar de la cookie HttpOnly con CSRF aprobada en el avance 1 (INC-006).

### Ishikawa

```
 Proceso                                  Herramientas                        Requisitos
 · Revisión de seguridad solo al final    · Sin auditoría de dependencias     · OWASP ASVS citado en el avance 1
   del incremento                           en el CI                            sin lista de controles
 · Diseño del Sprint 2 no contrastado     · Sin `check --deploy` en el CI     · RNF de seguridad generales
   con el avance 1 (sección 7.1)                                                ("comprobar permisos")
            ╲                                    │                                   ╱
             ╲───────────────────────────────────┼──────────────────────────────────╱──►  HALLAZGOS DE
             ╱───────────────────────────────────┼──────────────────────────────────╲     SEGURIDAD
            ╱                                    │                                   ╲
 Personas                                 Medición
 · API e interfaz diseñadas por           · Sin métrica de vulnerabilidades
   separado, sin revisión cruzada           ni de controles verificados
   [Validar]
```

### 5 porqués — INC-006

| # | Pregunta | Respuesta |
|---|---|---|
| 1 | ¿Por qué la sesión usa un token en `localStorage`? | El contrato de API (Sprint 2) eligió `TokenAuthentication` de DRF |
| 2 | ¿Por qué no se detectó que contradecía el avance 1? | El diseño no se revisó contra la sección 7.1 del avance 1 y la decisión no pasó por la gestión de cambios |
| 3 | ¿Por qué no se revisó? | La verificación de requisitos (VR) cubrió el backlog, pero no el diseño técnico contra la línea base |
| 4 | ¿Por qué no había esa revisión? | La lista de revisión de PR no pedía comparar con la arquitectura aprobada |

**Causa raíz.** Las decisiones técnicas del Sprint 2 no se verificaron contra la arquitectura aprobada ni se
registraron como cambios, y la seguridad se revisó por primera vez después de implementar.

### Acciones

| Tipo | Acción | Responsable | Fecha |
|---|---|---|---|
| Correctiva | INC-003 e INC-005 corregidos (commits `e867548`, `c42730e`) | Samuel | 2026-11-05 (hecho) |
| Correctiva | Decidir la corrección de INC-006 (CC-13) | Equipo | Sprint Review |
| Preventiva | Agregar al CI `npm audit --omit=dev`, `pip-audit` y `check --deploy` con `DJANGO_HTTPS=true` | Wilberth | Sprint 4 |
| Preventiva | Lista de revisión de PR: respetar la arquitectura aprobada o registrar la desviación (commit `b403436`) | Samuel | 2026-11-05 (hecho) |
| Preventiva | Matriz de controles OWASP ASVS de la [Revisión de seguridad](Revision-seguridad.md), revisada en cada sprint | Luis | Cada sprint |
