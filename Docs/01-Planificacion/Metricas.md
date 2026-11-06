# Métricas del proyecto — Nexora

| Campo | Valor |
|---|---|
| Referencia | Instrucciones del Proyecto Integrador, sección 11 · ISO/IEC 25010 (características) |
| Versión | 1.0 |
| Fecha de medición | 2026-11-04 |
| Responsable general | Wilberth |

## 1. Definición y medición

Cada métrica indica nombre, objetivo, fórmula, fuente, frecuencia, responsable, valor esperado, valor medido e
interpretación.

### 1.1 Gestión del proyecto

| ID | Nombre | Objetivo | Fórmula | Fuente | Frecuencia | Responsable | Valor esperado | Valor medido | Interpretación |
|---|---|---|---|---|---|---|---|---|---|
| MG-01 | Cumplimiento del sprint | Saber si el equipo entrega lo comprometido | tareas finalizadas ÷ tareas comprometidas × 100 | Jira | Cierre de sprint | Wilberth | ≥ 80 % | Sprint 1: 3/12 = **25 %** (3 parciales) · Sprint 2: 6/8 = **75 %** | Muy por debajo en el Sprint 1; el Sprint 2 se completó con un día de atraso. Ver ACR-01 |
| MG-02 | Desviación del cronograma | Detectar atrasos | fecha real de cierre − fecha planificada (días) | Jira | Cierre de sprint | Wilberth | ≤ 1 día | Sprints 1 y 2: **+1 día** con tareas trasladadas | El trabajo se concentró al final; riesgo de repetirse |
| MG-03 | Velocidad | Planificar sprints con datos | puntos de historias implementadas y probadas | Catálogo de requisitos, Jira | Cierre de sprint | Wilberth | 20 – 30 puntos | **28 puntos** (HU01 – HU07, pendientes de integrar) | Primer valor de referencia; se confirma al integrar en `main` |
| MG-04 | Historias trasladadas | Medir sobrecompromiso | historias no completadas que pasan al siguiente sprint | Jira | Cierre de sprint | Wilberth | 0 – 1 | **5** (HU08 – HU12) por la reducción de alcance CC-05 | Alcance replanificado de forma explícita, no por omisión |

### 1.2 Proceso

| ID | Nombre | Objetivo | Fórmula | Fuente | Frecuencia | Responsable | Valor esperado | Valor medido | Interpretación |
|---|---|---|---|---|---|---|---|---|---|
| MP-01 | Hallazgos de verificación de requisitos | Medir la calidad de los requisitos antes de construir | hallazgos ÷ artefactos revisados | Verificación de requisitos | Por revisión | Wilberth | Descendente en cada revisión | **14 hallazgos** sobre el backlog original (8 criterios) | Línea base; el más frecuente fue información incompleta (4) |
| MP-02 | Cambios de refinamiento | Evidenciar refinamiento continuo | cantidad de cambios por tipo | Registro de refinamiento | Por sprint | Wilberth | ≥ 1 por sprint | **15** (3 nuevas, 3 divididas, 2 de prioridad…) | Refinamiento activo en el Sprint 2 |
| MP-03 | PR revisados | Asegurar revisión por pares | PR con aprobación ÷ PR integrados × 100 | GitHub | Semanal | Samuel | 100 % | **Pendiente** (0 PR abiertos al 2026-11-04) | Se mide al abrir e integrar los PR |
| MP-04 | Ejecuciones de CI en verde | Verificar integración continua | ejecuciones exitosas ÷ ejecuciones × 100 | GitHub Actions | Por PR | Samuel | ≥ 90 % | **Pendiente** | El pipeline se ejecuta con los PR hacia `main` |
| MP-05 | Eficacia de scripts de prueba | Medir fallas atribuibles a los scripts | fallas de script ÷ fallas totales × 100 | Registro de ejecución | Por ejecución | Samuel | ≤ 20 % | 2 de 4 fallas = **50 %** | Alta; se agregó la limpieza del DOM y selectores más específicos. Ver ACR-03 |

### 1.3 Producto

| ID | Nombre | Característica ISO/IEC 25010 | Objetivo | Fórmula | Fuente | Frecuencia | Responsable | Valor esperado | Valor medido | Interpretación |
|---|---|---|---|---|---|---|---|---|---|---|
| MQ-01 | Tasa de aprobación de pruebas | Adecuación funcional | Medir el cumplimiento de los escenarios | casos aprobados ÷ ejecutados × 100 | Registro de ejecución | Por ejecución | Wilberth | ≥ 95 % | **100 %** (44/44); primera ejecución de API 98,1 % | El incremento cumple los escenarios probados |
| MQ-02 | Cobertura de requisitos | Adecuación funcional | Asegurar que cada escenario se prueba | escenarios con caso ejecutado ÷ escenarios del incremento × 100 | Matriz de trazabilidad | Por sprint | Wilberth | 100 % | **100 %** (28/28) | Ningún escenario del incremento quedó sin prueba |
| MQ-03 | Cobertura de código del backend | Mantenibilidad | Medir cuánto código ejercitan las pruebas | sentencias ejecutadas ÷ sentencias × 100 | `pytest --cov` | Por PR | Luis | ≥ 85 % | **96 %** | Alta; lo no cubierto es configuración y ramas defensivas |
| MQ-04 | Cobertura unitaria del frontend | Mantenibilidad | Medir pruebas rápidas de la interfaz | líneas ejecutadas ÷ líneas × 100 | `npm run coverage` | Por PR | Samuel | ≥ 60 % | **49 %** líneas · 80 % ramas | Bajo; las pantallas se prueban con Playwright. Acción en el Sprint 4 |
| MQ-05 | Densidad de defectos | Adecuación funcional | Comparar calidad entre incrementos | defectos ÷ historias implementadas | Jira | Por sprint | Wilberth | ≤ 0,5 | 2 ÷ 7 = **0,29** | Dentro de lo esperado |
| MQ-06 | Defectos por severidad | Todas | Priorizar correcciones | conteo por severidad | Jira | Semanal | Wilberth | 0 críticos | Crítica 0 · Alta 1 · Media 0 · Baja 1 | Sin defectos críticos |
| MQ-07 | Eficiencia de corrección | Adecuación funcional | Asegurar que los defectos se corrigen y reprueban | defectos reprobados ÷ registrados × 100 | Jira | Semanal | Wilberth | 100 % antes de cada entrega | **100 %** reprobados (2/2); 0 % cerrados hasta integrar | Ciclo completo salvo el cierre por integración |
| MQ-08 | Tiempo medio de corrección | Fiabilidad del proceso | Medir la rapidez de respuesta | Σ (fecha de reprueba − fecha de registro) ÷ defectos | Jira | Semanal | Wilberth | ≤ 2 días | **< 1 día** (ambos el 2026-11-04) | Corrección inmediata al estar el equipo trabajando en el módulo |
| MQ-09 | Aislamiento por institución | Seguridad | Verificar que no hay fugas entre instituciones | pruebas de aislamiento aprobadas ÷ pruebas de aislamiento | pytest (HU06) | Por PR | Luis | 100 % | **100 %** (9/9) | Ninguna operación permite ver o cambiar datos de otra institución |
| MQ-10 | Uso en teléfono sin desplazamiento horizontal | Flexibilidad / Capacidad de interacción | Verificar RNF03 | pantallas sin desplazamiento horizontal ÷ pantallas | Playwright (perfil Pixel 7), EXP-01 | Por sprint | Samuel | 100 % | **100 %** de las pantallas recorridas | Cumple RNF03 en el incremento |

## 2. Resumen gráfico (Pareto de hallazgos de verificación por criterio)

```
Información incompleta   ████████████ 4
Ambigüedad               █████████    3
Duplicidad               ██████       2
Contradicción            ███          1
Dependencias             ███          1
Criterios no verificables ███         1
Historia grande          ███          1
Sin valor claro          ███          1
```

Los dos primeros criterios concentran el 50 % de los hallazgos: la mejora de mayor impacto es completar la definición de
datos y términos antes de estimar (ver ACR-02).
