# Métricas del proyecto — Nexora

| Campo | Valor |
|---|---|
| Referencia | Instrucciones del Proyecto Integrador, sección 11 · Avance 1, sección 5.2 · Anexo de correcciones, sección 6 · ISO/IEC 25010 |
| Versión | 1.2 |
| Fecha de corte | 2026-11-05 |
| Responsable general | Wilberth |

Como pide el anexo, cada indicador registra fórmula, meta, línea base, fuente, fecha de corte, responsable, valor
observado y decisión. **Las metas no son resultados**: el valor observado es el medido al corte, con su fuente.

## 1. Indicadores del avance 1 (anexo, sección 6)

| Indicador | Fórmula | Meta | Línea base | Fuente | Responsable | Valor observado al 2026-11-05 | Decisión |
|---|---|---|---|---|---|---|---|
| Cobertura de requisitos | RF implementados y aceptados ÷ 8 × 100 | 100 % al cierre | 0 aceptados al iniciar | [Matriz de trazabilidad](../02-Requisitos/Matriz-de-trazabilidad.md) · Jira | Wilberth | Implementados y probados: RF01, RF02 y RF04 (**3/8 = 37,5 %**) y RF03 parcial (sin periodo lectivo). **Aceptados: 0/8**: falta integrar en `main` y la aceptación EJ-12 | Integrar los PR y ejecutar EJ-12; agregar el periodo lectivo (GAP-01) |
| Aprobación funcional | casos aprobados ÷ casos ejecutados × 100 | 24/24 obligatorios | Sin ejecuciones certificadas | [Registro de ejecución](../05-Pruebas/Registro-de-ejecucion.md) | Wilberth | **64/64 casos (100 %)**; 139/139 pruebas automatizadas. Frente a la línea base: **6/24 criterios aprobados (25 %)** y 2 parciales | Mantener; CA09 – CA24 dependen de HU08 – HU12 |
| Defectos críticos o altos abiertos | conteo de defectos críticos y altos sin resolver | 0 al cierre | Sin registro validado | Jira (Bug) | Wilberth | **0 sin corregir.** 3 altos (INC-001, INC-007, INC-009) corregidos y reprobados, en *En curso* hasta integrar | Cerrar al integrar los PR #5, #8 y #11 |
| Avance de tareas | tareas terminadas ÷ comprometidas × 100, por sprint | ≥ 80 % por sprint | Backlog de cada sprint | Jira, [backlog exportado](Backlog-Jira.md) | Wilberth | Con entregable en GitHub: Sprint 1 3/12 (25 %), Sprint 2 6/8 (75 %), Sprint 3 13/15 (87 %). En *Listo* en Jira: **0/122** (requiere el PR integrado) | Revisar e integrar los PR para pasar a *Listo* |
| Éxito de recorridos | recorridos sin ayuda ÷ recorridos observados × 100 | 11/12 | Sin evaluación ejecutada | Fichas de observación (O5) | Samuel | **Sin dato**: no se han hecho recorridos con participantes | Sprint 8 (O5) |
| Esfuerzo | horas registradas ÷ horas planificadas × 100 | ≤ 100 % de 450 h | **450 h teóricas** (3 × 10 h × 15 semanas, anexo, sección 3) | Registro semanal de horas | Wilberth | **Sin dato**: el equipo no registra horas | Registro semanal desde el Sprint 4 (Jira, *Log work*) |
| Cumplimiento de hitos | hitos vencidos aceptados a tiempo ÷ hitos vencidos × 100 | ≥ 90 % | Calendario de Jira | Jira | Wilberth | Hitos vencidos al corte: cierre de los Sprints 1 y 2 (2026-11-03). Aceptados a tiempo: **0/2** | Replanificar con CC-01; ver ACR-01 |

El presupuesto de CRC 1.446.500 del avance 1 se conserva como **estimación histórica** de la propuesta de 17 semanas
(anexo, sección 3); no hay gasto ejecutado que medir.

## 2. Gestión del proyecto

| ID | Nombre | Fórmula | Fuente | Responsable | Valor esperado | Valor medido | Interpretación |
|---|---|---|---|---|---|---|---|
| MG-01 | Cumplimiento del sprint | tareas finalizadas ÷ comprometidas × 100 | Jira | Wilberth | ≥ 80 % | Sprint 1 **25 %** · Sprint 2 **75 %** · Sprint 3 **87 %** (al corte) | Mejora sostenida tras la replanificación (ACR-01) |
| MG-02 | Desviación del cronograma | fecha real − fecha planificada (días) | Jira | Wilberth | ≤ 1 día | Sprints 1 y 2: **+1 día** con tareas trasladadas | El trabajo se concentró al final |
| MG-03 | Velocidad | puntos de historias implementadas y probadas | Catálogo, Jira | Wilberth | 20 – 30 | **28 puntos** (HU01 – HU07) | Primer valor de referencia |
| MG-04 | Historias trasladadas | historias no completadas que pasan al siguiente sprint | Jira | Wilberth | 0 – 1 | **5** (HU08 – HU12) por CC-05 | Alcance replanificado de forma explícita |

## 3. Proceso

| ID | Nombre | Fórmula | Fuente | Responsable | Valor esperado | Valor medido | Interpretación |
|---|---|---|---|---|---|---|---|
| MP-01 | Hallazgos de verificación | hallazgos ÷ artefactos revisados | Verificación de requisitos | Wilberth | Descendente | **14** en el backlog original · **4** más al cruzar con la línea base (VR-15 – VR-18) | Las brechas nuevas son de cobertura de la línea base, no de redacción |
| MP-02 | Cambios de refinamiento | cambios por tipo | Registro de refinamiento | Wilberth | ≥ 1 por sprint | **17** (REF-01 – REF-17) | Refinamiento activo |
| MP-03 | PR revisados | PR con aprobación ÷ PR integrados × 100 | GitHub | Samuel | 100 % | **0 integrados**; 11 abiertos sin aprobación | Se mide al integrar; requiere que Luis y Wilberth revisen |
| MP-04 | Ejecuciones de CI en verde | ejecuciones exitosas ÷ ejecuciones × 100 | GitHub Actions | Samuel | ≥ 90 % | **14/17 = 82,4 %** (rojas: PR #4, #10 y #11 ejecución 3, todas por defectos reales); las 6 últimas en verde | Las fallas fueron hallazgos, no ruido del CI |
| MP-05 | Eficacia de los scripts de prueba | fallas de script ÷ fallas totales × 100 | Registro de ejecución | Samuel | ≤ 20 % | 3 de 12 = **25 %** | Mejoró (antes 50 %); queda por encima de la meta |
| MP-06 | Verdes con prueba intermitente | ejecuciones en verde con una prueba que pasó al reintentar ÷ ejecuciones en verde | GitHub Actions | Samuel | 0 | **2/14** (PR #9 y #11 ejecución 1: INC-004 e INC-007 ocultos); 0 desde `b403436` | Desde `b403436` una prueba intermitente hace fallar el CI |
| MP-07 | Reaperturas | defectos reabiertos ÷ defectos corregidos × 100 | Jira | Wilberth | 0 % | 1 de 9 = **11,1 %** (INC-004) | La reprueba con latencia detectó la corrección incompleta de INC-004 (EJ-21) y la primera versión de INC-006 antes de integrarla (EJ-24) |

## 4. Producto

| ID | Nombre | Característica ISO/IEC 25010 | Fórmula | Fuente | Responsable | Valor esperado | Valor medido | Interpretación |
|---|---|---|---|---|---|---|---|---|
| MQ-01 | Tasa de aprobación de pruebas | Adecuación funcional | aprobadas ÷ ejecutadas × 100 | Registro de ejecución | Wilberth | ≥ 95 % | **100 %** (139/139, EJ-24 y EJ-25); 64/64 casos | El incremento cumple los escenarios probados |
| MQ-02 | Cobertura de escenarios | Adecuación funcional | escenarios con caso ejecutado ÷ escenarios × 100 | Matriz de trazabilidad | Wilberth | 100 % | Incremento **28/28 (100 %)** · línea base con escenario en el catálogo **21/24** | Brechas GAP-02 – GAP-04 |
| MQ-03 | Cobertura de código del backend | Mantenibilidad | sentencias ejecutadas ÷ sentencias × 100 | `pytest --cov` | Luis | ≥ 85 % | **95 %** (499 sentencias, 26 sin cubrir) | Lo no cubierto es la configuración HTTPS (se prueba en subproceso) y ramas defensivas |
| MQ-04 | Cobertura unitaria del frontend | Mantenibilidad | líneas ejecutadas ÷ líneas × 100 | `npm run coverage` | Samuel | ≥ 60 % | **91,6 %** líneas · 79 % ramas (antes 49 % y 56 %) | Cumple con las pruebas de formularios (CP-U09) y de sesión (CP-U07, CP-U08) |
| MQ-05 | Densidad de defectos | Adecuación funcional | defectos ÷ historias implementadas | Jira | Wilberth | ≤ 0,5 | 9 ÷ 7 = **1,29** | Por encima: 3 provienen de la primera revisión de seguridad y 4 de las pruebas de robustez |
| MQ-06 | Defectos por severidad | Todas | conteo por severidad | Jira | Wilberth | 0 críticos | Crítica 0 · **Alta 3** · Media 4 · Baja 2 | Sin críticos; los 9 están corregidos |
| MQ-07 | Eficiencia de corrección | Adecuación funcional | defectos reprobados ÷ registrados × 100 | Jira | Wilberth | 100 % antes de cada entrega | **9/9 = 100 %**; 0 cerrados hasta integrar | Ciclo completo salvo el cierre por integración |
| MQ-08 | Tiempo medio de corrección | Fiabilidad del proceso | Σ (reprueba − registro) ÷ defectos | Jira | Wilberth | ≤ 2 días | **< 1 día** para los 9 | Corrección el mismo día de la detección |
| MQ-09 | Aislamiento por institución | Seguridad | pruebas de aislamiento aprobadas ÷ pruebas | pytest (HU06) | Luis | 100 % | **100 %** en SQLite y PostgreSQL | Ninguna fuga entre las 3 instituciones |
| MQ-10 | Uso en teléfono | Flexibilidad | pantallas sin desplazamiento horizontal ÷ pantallas | Playwright (Pixel 7), revisión asistida a 320 px | Samuel | 100 % | **100 %** (4 pantallas a 320 px) | Cumple RNF03 |
| MQ-11 | Violaciones de accesibilidad detectables | Capacidad de interacción | violaciones axe-core WCAG 2.2 AA | CP-S16 | Samuel | 0 | **0** en 12 auditorías (6 estados × 2 dispositivos); A11Y-01 y A11Y-02 resueltos | La revisión con lector de pantalla sigue pendiente (A11Y-03) |
| MQ-12 | Vulnerabilidades de dependencias | Seguridad | avisos críticos o altos | `npm audit`, `pip-audit` | Samuel | 0 | **0** (antes 2 críticos de desarrollo) · 7 moderados aceptados | INC-005 |
| MQ-13 | Controles de seguridad verificados | Seguridad | controles que cumplen ÷ controles seleccionados | [Revisión de seguridad](../05-Pruebas/Revision-seguridad.md) | Luis | 100 % | **16/18 = 88,9 %** (0 incumplen, 2 pendientes) | Límite de intentos de ingreso y CSP en el backlog |

## 5. Pareto de defectos y fallas por origen (ACR-03)

```
Asincronía (orden y demora)       ████████████████ 4   33,3 %
Seguridad sin revisar             ████████████     3   58,3 % acumulado
Scripts de prueba                 ████████████     3   83,3 %
Comportamiento del framework      ████████         2  100,0 %
```
