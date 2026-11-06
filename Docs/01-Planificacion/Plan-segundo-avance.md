# Plan de trabajo para el segundo entregable — Nexora

| Campo | Valor |
|---|---|
| Fecha de elaboración | 2026-11-04 (miércoles) — v3 |
| Fecha de entrega | 2026-11-07 (sábado), semana 10 del curso |
| Equipo | Samuel (interfaz), Luis (backend), Wilberth (gestión y calidad) |
| Fuentes | Instrucciones del Proyecto Integrador (secciones 3 – 26), backlog de Jira ADLCDS (101 tareas), repositorio GitHub `S4muel-R/Nexora` |
| Normas | ISO/IEC/IEEE 29119-2 y 29119-3 (proceso y documentación de pruebas), ISO/IEC 25010:2023 (modelo de calidad) |

## 1. Qué pide el segundo entregable

Según la sección 22 de las instrucciones, el segundo entregable (semana 10) se enfoca en: **ejecución del proyecto,
verificación, refinamiento, pruebas, defectos, métricas, gestión de cambios, trazabilidad y análisis de causa raíz**.

La regla de evaluación (sección 25) es **evidencia sobre afirmación**: para cada prueba hay que mostrar
*qué se probó → cómo se probó → qué resultado produjo → qué defecto apareció → cómo se corrigió → cómo se verificó
nuevamente*. Por eso el entregable necesita un producto que se ejecute y al menos un ciclo completo de defecto corregido
y reprobado.

### Lista de comprobación del entregable

| # | Criterio | Sección | Qué debe contener como mínimo | Documento / evidencia |
|---|---|---|---|---|
| 1 | Ejecución del proyecto | 4.1, 4.2 | Por sprint: cumplimiento del objetivo, historias completadas y trasladadas, % de cumplimiento, desviaciones del cronograma, defectos, cambios, problemas y acciones de mejora | `01-Planificacion/Informe-ejecucion-sprints.md` + Jira |
| 2 | Ceremonias | 3.2, 5.1, 5.2 | Daily Scrum grabados (qué hice, qué haré, impedimentos, coordinación) y Sprint Review (historias completadas y no completadas, demo, resultados de pruebas, defectos, retroalimentación, decisiones) | Carpeta OneDrive **"Grabaciones del Proyecto"** |
| 3 | Backlog | 6 | Cada historia: ID, descripción "Como… quiero… para…", prioridad, estimación, dependencias, estado, criterios de aceptación | Jira (tipo Historia) + `02-Requisitos/Product-backlog.md` |
| 4 | Verificación de requisitos | 7 | Revisión con lista de chequeo y por pares: ambigüedad, incompletitud, contradicciones, duplicidad, dependencias no identificadas, criterios no verificables, historias grandes, historias sin valor | `02-Requisitos/Verificacion-de-requisitos.md` |
| 5 | Refinamiento | 8 | Evidencia de historias modificadas, divididas, eliminadas, nuevas, cambios de prioridad, criterios agregados, correcciones de ambigüedad e incompletitud | `02-Requisitos/Registro-de-refinamiento.md` |
| 6 | Criterios de aceptación | 9 | **Mínimo 3 escenarios por historia** (exitoso, alternativo, excepción) en formato Dado / Cuando / Entonces | Dentro del backlog |
| 7 | Verificación del código | 3.3, 21 | Ramas, Pull Requests con revisión, historial de integración, participación individual, pipeline CI | GitHub + `05-Pruebas/Registro-de-verificacion.md` |
| 8 | Pruebas | 12 – 15 | Plan de pruebas (objetivos, alcance, tipos, ambientes, datos, herramientas, responsables, criterios de entrada y salida, riesgos, cronograma), pirámide justificada, casos con todos los campos de la sección 15, ejecución **con evidencia** | `05-Pruebas/Plan-de-pruebas.md`, `Especificacion-de-casos.md`, `Registro-de-ejecucion.md`, `Informe-de-estado.md` (29119-3) |
| 9 | Defectos | 16 | Ciclo detección → registro → clasificación → análisis → asignación → corrección → reprueba → cierre; campos: ID, descripción, módulo, pasos, esperado, obtenido, severidad, prioridad, responsable, estado, evidencia, corrección, resultado de reprueba | Jira (tipo Error) + `05-Pruebas/Informes-de-incidente.md` (29119-3) + capturas en `05-Pruebas/evidencias/` |
| 10 | Métricas | 11 | De producto y de proceso/gestión; cada una con nombre, objetivo, fórmula, fuente, frecuencia, responsable, valor esperado e interpretación, **y su valor medido** | `01-Planificacion/Metricas.md` |
| 11 | Gestión de cambios | 18 | Cada cambio: origen, descripción, justificación, impacto, historias afectadas, decisión, responsable, fecha | `01-Planificacion/Gestion-de-cambios.md` |
| 12 | Trazabilidad | 19 | Necesidad → Requisito → Historia → Escenario → Código → Caso de prueba → Resultado → Defecto → Corrección → Reprueba | `02-Requisitos/Matriz-de-trazabilidad.md` |
| 13 | Causa raíz | 17 | Defectos relevantes analizados con 5 porqués, Ishikawa, Pareto u otra técnica justificada | `05-Pruebas/Analisis-causa-raiz.md` |

### Insumos del primer entregable que el segundo necesita

El segundo entregable se apoya en artefactos de la semana 5. Si alguno no existe o está incompleto, se completa en
esta semana:

| Artefacto | Sección | Estado conocido |
|---|---|---|
| Calendario de las 15 semanas con sprints, objetivos, historias, entregables, pruebas, verificación, validación, reviews e hitos | 4, 4.1 | Las fechas de Jira son inconsistentes (ver J1, J2) |
| Estándares: programación, nomenclatura, errores, base de datos, documentación, gestión, control de versiones, revisiones, seguridad | 10 | No hay documento en el repo |
| Definición de métricas | 11 | No hay documento en el repo |
| Plan de pruebas y pirámide de pruebas | 12, 13 | Tarea S2-04 sin iniciar |

## 2. Situación actual

| Indicador | Valor |
|---|---|
| Tareas en Jira | 101 (Sprints 1 – 8), todas de tipo Tarea |
| Historias de usuario en Jira | 0 (se mencionan HU01 – HU12, pero no existen como historias) |
| Tareas finalizadas | 0 |
| Tareas en curso | 4 (S1-09 a S1-12) |
| Sprints 1 y 2 | Activos, ambos con fin el 2026-11-03 (vencidos) |
| Código en el repositorio | Ninguno; solo `Docs/` con S1-09 a S1-12 |
| Commits por integrante | Samuel 1, Luis 0, Wilberth 0 |

### Problemas detectados en Jira

| # | Problema | Tareas |
|---|---|---|
| J1 | El Sprint 3 tiene fechas 05/10 – 19/10, anteriores a los Sprints 1 y 2 | ADLCDS-22 a 36 |
| J2 | El Sprint 5 (02/11 – 16/11) debería estar en curso y sigue "futuro" | ADLCDS-53 a 65 |
| J3 | Responsable de la descripción distinto del asignado | ADLCDS-17 (dice Wilberth, asignada a Luis); ADLCDS-19, 47 y 61 (dicen Luis, asignadas a Samuel) |
| J4 | Descripción copiada de otra tarea | ADLCDS-12 (copia de S1-10), ADLCDS-16 (copia de S2-04) |
| J5 | Código interno incorrecto | ADLCDS-7 y ADLCDS-9 dicen "S1-01" |
| J6 | Tarea sin descripción | ADLCDS-29 (S3-08 Usuarios y permisos) |
| J7 | Redacción que contradice la intención | ADLCDS-58 dice "duplicar registros"; debería ser "evitar duplicar" |
| J8 | El backlog prevé 24 criterios de aceptación para 12 historias; la sección 9 exige mínimo 3 por historia (36) | ADLCDS-14 |
| J9 | No hay historias de usuario en Jira; la sección 6 exige que el backlog las contenga con sus campos | Todo el backlog |

Estos hallazgos son evidencia real para **verificación de requisitos** (J4 – J9), **gestión de cambios** (J1 – J3) y
**análisis de causa raíz** (atraso de los Sprints 1 y 2).

## 3. Estrategia

1. **Cerrar líneas base mínimas**: historias con 3 escenarios, estándares, métricas definidas, plan de pruebas,
   arquitectura y entornos.
2. **Construir un incremento pequeño y ejecutable**: inicio de sesión, instituciones con aislamiento y, si alcanza,
   registro de estudiantes.
3. **Recorrer el ciclo completo de calidad sobre ese incremento**: casos de prueba, ejecución, defectos en Jira,
   corrección, reprueba, métricas medidas, trazabilidad de punta a punta y causa raíz.
4. **Replanificar formalmente** lo que no entra mediante solicitudes de cambio.
5. **Generar evidencia todos los días**: daily grabado, commits y PRs de cada integrante, Jira al día.

> **Participación individual (secciones 3.3 y 24):** por decisión del equipo, los commits se hacen desde la cuenta de
> Samuel. Para que la participación de Luis y Wilberth quede registrada, **cada PR debe ser revisado y aprobado por
> otro integrante desde su propia cuenta**, y los defectos de Jira se asignan a quien corrige y a quien reprueba.
> Todos deben poder explicar cualquier componente (sección 24).

### 3.1 Normas aplicadas

| Norma | Uso en el proyecto |
|---|---|
| ISO/IEC/IEEE 29119-2 | Proceso de pruebas: planificación → monitoreo y control → diseño e implementación → preparación del ambiente → ejecución → reporte de incidentes → cierre |
| ISO/IEC/IEEE 29119-3 | Estructura de los documentos: **Plan de pruebas**, **Especificación de casos de prueba**, **Registro de ejecución**, **Informe de incidente** (defecto) e **Informe de estado de pruebas** |
| ISO/IEC 25010:2023 | Cada defecto y cada métrica de producto se clasifican por característica: adecuación funcional, eficiencia de desempeño, compatibilidad, capacidad de interacción, fiabilidad, seguridad, mantenibilidad, flexibilidad, protección |

> Confirmar con el docente que la norma esperada es 29119. Si fuera otra, la estructura de los documentos se ajusta sin
> cambiar el contenido.

### 3.2 Evidencias

Cada caso ejecutado y cada defecto lleva evidencia **real** (nunca simulada). Los defectos que se registran son los que
aparecen al probar; no se introducen fallas a propósito.

| Evidencia | Cómo se obtiene | Dónde queda |
|---|---|---|
| Captura de pantalla de la falla y de la reprueba | Playwright (`screenshot` en cada paso clave y automática al fallar) o captura manual (Win + Shift + S) | `Docs/05-Pruebas/evidencias/` y OneDrive |
| Salida de pruebas automatizadas | pytest con reporte JUnit/HTML y cobertura; Playwright con reporte HTML | Artefactos de GitHub Actions + copia en `evidencias/` |
| Corrección | PR que menciona la clave del defecto (`Corrige ADLCDS-xxx`) | GitHub |
| Ejecución en CI | Ejecución de GitHub Actions en verde tras la corrección | Enlace en el informe de incidente |

Nombre de archivos: `EV_<CP|INC>-<id>_<paso|falla|reprueba>_<AAAAMMDD>.png`, por ejemplo
`EV_INC-003_falla_20261106.png`.

## 4. Orden de ejecución

Cada paquete se trabaja en una rama propia y entra a `main` por PR con CI en verde y aprobación de otro integrante.

| # | Paquete | Contenido | Tareas Jira | Cuándo |
|---|---|---|---|---|
| P1 | Base del repositorio | Estándares (sección 10), estructura `backend/` + `frontend/` + `docker-compose.yml`, GitHub Actions (lint, pruebas, cobertura, artefactos) | ADLCDS-9, 19, 21, 25 | Miércoles |
| P2 | Requisitos | RF01 – RF08, HU01 – HU12 con 3 escenarios, verificación con lista de chequeo, registro de refinamiento, nota de aislamiento | ADLCDS-7, 8, 14, 22, 27 | Miércoles – jueves |
| P3 | Diseño | Arquitectura, modelo de datos, contrato de API, prototipo de 6 pantallas | ADLCDS-18, 20 | Jueves |
| P4 | Backend del incremento | Django + DRF: autenticación, usuarios y permisos, instituciones con aislamiento, estudiantes; pruebas unitarias y de API con pytest | ADLCDS-28, 29, 30, 31, 43 | Jueves – viernes |
| P5 | Frontend del incremento | React + TypeScript: inicio de sesión, datos institucionales, estudiantes; manejo de errores; Playwright de humo con capturas | ADLCDS-33, 35, 36, 49 | Viernes |
| P6 | Pruebas (29119-3) | Plan de pruebas y pirámide, especificación de casos, datos de 3 instituciones ficticias, ejecución, registro de ejecución | ADLCDS-17, 24, 26 | Jueves – viernes |
| P7 | Defectos | Informes de incidente con capturas, registro en Jira, corrección por PR, reprueba, cierre | — | Viernes – sábado |
| P8 | Gestión y análisis | Informe de ejecución por sprint, métricas medidas, gestión de cambios, trazabilidad, causa raíz, informe de estado de pruebas | ADLCDS-23, 38 | Sábado |
| P9 | Entrega | `.docx` de todos los documentos, actualización de Jira, carga en OneDrive | — | Sábado |

### Actividades que solo puede hacer el equipo

| Actividad | Quién | Cuándo |
|---|---|---|
| Agregar a Luis y Wilberth como colaboradores y proteger `main` | Samuel | Hoy |
| Daily Scrum grabado (15 min) | Todos | Jueves, viernes y sábado |
| Revisar y aprobar PRs desde su cuenta | Luis y Wilberth | Cada vez que se abra un PR |
| Revisión por pares de requisitos (firmar la lista de chequeo) | Luis y Wilberth | Jueves |
| Ejecutar manualmente los casos de aceptación y tomar capturas | Wilberth | Viernes |
| Crear la carpeta en OneDrive con "Grabaciones del Proyecto" y compartirla con el docente | Samuel | Hoy |
| Sesiones de consulta con usuarios (S1-05, S1-09) | Luis y Samuel | Cuando haya participantes (CC-06) |
| Sprint Review grabado con demo | Todos | Sábado |

## 4.1 Cronograma por integrante (referencia)

Daily Scrum grabado **todos los días a la misma hora** (15 min, los tres integrantes), guardado en
OneDrive / Grabaciones del Proyecto / `AAAA-MM-DD_Daily.mp4`.

### Miércoles 4 — Organización y requisitos

| Responsable | Trabajo | Tareas Jira |
|---|---|---|
| Samuel | Agregar colaboradores en GitHub y proteger `main`; corregir Jira (J1 – J7) como solicitudes de cambio; cerrar S1-10, S1-12 (carpeta OneDrive con "Grabaciones del Proyecto") | ADLCDS-11, 13, 9 |
| Luis | RF01 – RF08 y nota técnica de aislamiento por institución | ADLCDS-7, 8 |
| Wilberth | Acta constitutiva, matriz de interesados, riesgos R01 – R10, calendario de 15 semanas corregido | ADLCDS-1, 3, 4, 15 |

### Jueves 5 — Historias, verificación de requisitos, diseño y entornos

| Responsable | Trabajo | Tareas Jira |
|---|---|---|
| Wilberth | HU01 – HU12 en Jira con 3 escenarios cada una; verificación de requisitos con lista de chequeo; registro de refinamiento; plan de pruebas y pirámide | ADLCDS-14, 17, 22 |
| Luis | Arquitectura, modelo de datos y contrato de API; Django + PostgreSQL + Docker; estándares de backend y BD | ADLCDS-18, 19 |
| Samuel | Prototipo de 6 pantallas; React + TypeScript; GitHub Actions (lint + pruebas); estándares de frontend, control de versiones y revisiones | ADLCDS-20, 21, 25 |
| Todos | Revisión por pares cruzada: cada uno revisa el documento de otro con la lista de chequeo | — |

### Viernes 6 — Incremento, pruebas y defectos

| Responsable | Trabajo | Tareas Jira |
|---|---|---|
| Luis | Autenticación, usuarios y permisos, API de instituciones (y estudiantes si alcanza); pruebas pytest de aislamiento | ADLCDS-28, 29, 30, 31, 43 |
| Samuel | Pantallas de inicio de sesión y datos institucionales (y estudiantes si alcanza); integración con API y manejo de errores | ADLCDS-33, 35, 36, 49 |
| Wilberth | Casos de prueba de las historias del incremento; datos ficticios de 3 instituciones; ejecución; registro de defectos en Jira | ADLCDS-24, 26 |
| Todos | Cada PR revisado y aprobado por otro integrante antes de integrarse | — |

### Sábado 7 (mañana) — Corrección, reprueba, análisis y entrega

| Responsable | Trabajo |
|---|---|
| Luis y Samuel | Corregir defectos en su módulo, con PR que referencie el defecto |
| Wilberth | Reprobar y cerrar defectos; métricas medidas; informe de ejecución de sprints |
| Samuel | Matriz de trazabilidad completa; análisis de causa raíz (5 porqués + Ishikawa + Pareto) |
| Todos | **Sprint Review grabado** con demo del incremento; subir documentos `.docx` a OneDrive |

## 5. Detalle de entregables

### 5.1 Ejecución del proyecto e informe por sprint
Para los Sprints 1, 2 y 3: objetivo y si se cumplió, historias completadas, historias trasladadas, % de cumplimiento
(completadas / comprometidas), desviación en días, defectos, cambios, problemas y acciones de mejora.

### 5.2 Backlog, verificación y refinamiento
- HU01 – HU12 en Jira como **Historia**, con prioridad, estimación en puntos, dependencias (enlaces de Jira), estado y
  3 escenarios Dado / Cuando / Entonces.
- Lista de chequeo con los 8 criterios de la sección 7, aplicada a cada historia: hallazgo, historia, criterio
  incumplido, corrección.
- Registro de refinamiento: fecha, historia, tipo de cambio (modificada, dividida, prioridad, eliminada, nueva,
  criterio agregado, ambigüedad corregida, incompletitud corregida), antes / después, motivo.

### 5.3 Estándares
Un documento corto por área de la sección 10. Los de control de versiones y revisiones definen el flujo:
rama `tipo/CLAVE-descripcion` (por ejemplo `feature/ADLCDS-33-login`), commits `tipo: mensaje`, PR con 1 aprobación,
CI en verde.

### 5.4 Pruebas
- **Pirámide** (justificación): muchas pruebas unitarias y de API con pytest (reglas de negocio y aislamiento por
  institución, el mayor riesgo); menos pruebas de interfaz; pocas pruebas de sistema y aceptación manuales sobre el
  recorrido organizar–registrar–consultar.
- **Tipos para este entregable**: unitarias, API, integración, funcionales, humo, seguridad (aislamiento y permisos) y
  regresión tras cada corrección.
- **Casos** con los 12 campos de la sección 15; cada caso referencia una historia y un escenario.
- **Documentos según 29119-3**: Plan de pruebas, Especificación de casos de prueba, Registro de ejecución (fecha,
  ambiente, versión/commit, caso, resultado, evidencia) e Informe de estado de pruebas.

### 5.5 Defectos (Informe de incidente, 29119-3)
- Registrados en Jira como **Error** y en `Informes-de-incidente.md` con los campos de la sección 16, más la
  característica de calidad ISO/IEC 25010 afectada, el caso de prueba y la historia relacionados.
- Severidad (crítica, alta, media, baja) y prioridad (alta, media, baja) por separado.
- Evidencia obligatoria: captura de la falla y captura de la reprueba; cuando aplique, salida de la prueba
  automatizada.
- Cada corrección en un PR que mencione la clave del defecto; la reprueba queda como comentario en Jira con la captura.

### 5.6 Métricas (definidas y medidas)

| Tipo | Métrica | Fórmula |
|---|---|---|
| Gestión | % de cumplimiento del sprint | historias completadas / comprometidas × 100 |
| Gestión | Desviación del cronograma | fecha real de cierre − fecha planificada (días) |
| Gestión | Velocidad | puntos completados por sprint |
| Proceso | PRs revisados | PRs con aprobación / PRs integrados × 100 |
| Proceso | Hallazgos de verificación de requisitos | hallazgos por historia revisada |
| Producto | Tasa de aprobación de pruebas | casos aprobados / ejecutados × 100 |
| Producto | Cobertura de requisitos | escenarios con caso ejecutado / escenarios del incremento × 100 |
| Producto | Cobertura de código (backend) | reportado por `pytest --cov` |
| Producto | Densidad de defectos | defectos / historias implementadas |
| Producto | Eficiencia de corrección | defectos cerrados tras reprueba / defectos registrados × 100 |

Cada una se documenta además con objetivo, fuente, frecuencia, responsable, valor esperado e interpretación.

### 5.7 Gestión de cambios

| ID | Origen | Cambio | Historias / tareas afectadas |
|---|---|---|---|
| CC-01 | J1, J2 | Replanificación del calendario de sprints | Sprints 3 – 8 |
| CC-02 | J3 | Reasignación según el responsable real | ADLCDS-17, 19, 47, 61 |
| CC-03 | J4 – J7 | Corrección de descripciones del backlog | ADLCDS-7, 9, 12, 16, 29, 58 |
| CC-04 | J8, J9 | Creación de HU01 – HU12 con 3 escenarios cada una | Backlog completo |
| CC-05 | Estrategia | Reducción del alcance del incremento a acceso, institución y estudiantes | Sprints 3 – 4 |
| CC-06 | Riesgo | Reprogramación de las 4 sesiones de consulta (S1-09) si no se realizan antes del sábado | ADLCDS-6, 10 |

Cada uno con justificación, impacto (alcance, tiempo, pruebas), decisión, responsable y fecha.

### 5.8 Trazabilidad
Matriz con las 10 columnas de la sección 19. La columna **Necesidad** sale de la propuesta y de las sesiones de
consulta (S1-05, S1-09); **Código** referencia el PR o archivo; **Corrección** y **Reprueba** referencian el defecto
en Jira.

### 5.9 Análisis de causa raíz
1. **Atraso de los Sprints 1 y 2** (ninguna tarea finalizada al cierre): 5 porqués + Ishikawa.
2. **Calidad del backlog** (J1 – J9): Ishikawa (personas, proceso, herramientas, requisitos, tiempo).
3. **Defectos del viernes**: Pareto por módulo o tipo, y 5 porqués para los 2 de mayor severidad.

Cada análisis termina con acciones correctivas y preventivas, con responsable y fecha.

## 6. Fuera de este entregable

Se replanifican con CC-01 y CC-05: grupos y asignaciones, asistencia y correcciones, reportes, Playwright, versión
integrada v0.9, pruebas de rendimiento, validación de uso, pruebas cruzadas (sección 20) y lecciones aprendidas
(entrega final, semana 15).

## 7. Riesgos para la entrega

| Riesgo | Mitigación |
|---|---|
| No se logra el incremento completo para el viernes | Priorizar inicio de sesión + instituciones con aislamiento; estudiantes como objetivo extendido |
| No hay defecto corregido y reprobado para mostrar el ciclo completo | Ejecutar casos negativos (permisos, aislamiento, validaciones) desde el viernes temprano |
| Faltan grabaciones de dailies | Fijar hora diaria desde hoy; grabar aunque sea virtual |
| Participación desigual en GitHub | Cada integrante sube su propio trabajo por PR |
| Las 4 sesiones de consulta no se realizan | CC-06 y presentar el guion y las plantillas como evidencia de preparación |
| Dependencia del frontend respecto de la API | Contrato de API el jueves; datos simulados hasta que la API esté lista |

## 8. Nota sobre la rúbrica

El PDF de instrucciones se cortó en la página 15: de la rúbrica (sección 26) solo se ven los dos primeros criterios
(Problema, objetivos y alcance — 5 %; Calendario, Sprints y seguimiento — 8 %). Conviene revisar en el aula virtual los
criterios y pesos restantes.
