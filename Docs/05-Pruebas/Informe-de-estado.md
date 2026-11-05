# Informe de estado de pruebas — Nexora (segundo entregable)

| Campo | Valor |
|---|---|
| Norma | ISO/IEC/IEEE 29119-3, "Test Status Report" |
| Periodo | 2026-11-04 |
| Alcance | Incremento HU01 – HU07 |
| Versión | 1.0 |
| Preparado por | Samuel (con revisión pendiente de Wilberth, líder de pruebas) |

## 1. Avance frente al plan

| Actividad del plan | Estado |
|---|---|
| Plan de pruebas y pirámide | Completo |
| Diseño de casos (44) | Completo |
| Datos ficticios de 3 instituciones | Completo |
| Ejecución automatizada (API, interfaz, sistema) | Completo, 102/102 aprobadas en la última ejecución |
| Exploración | 1 sesión (EXP-01) |
| Aceptación manual (EJ-12) | **Pendiente** — Wilberth |
| Regresión en CI con PostgreSQL (EJ-11) | **Pendiente** — al abrir los Pull Requests |

## 2. Resultados

| Indicador | Valor | Criterio de salida | ¿Cumple? |
|---|---|---|---|
| Escenarios del incremento con caso ejecutado | 28 / 28 (100 %) | 100 % | Sí |
| Casos aprobados (última ejecución) | 44 / 44 (100 %) | ≥ 95 % | Sí |
| Pruebas automatizadas aprobadas | 102 / 102 | — | — |
| Aprobación en la primera ejecución de API | 53 / 54 (98,1 %) | — | — |
| Cobertura de código del backend | 96 % (460 sentencias, 20 sin cubrir) | ≥ 85 % | Sí |
| Cobertura de código del frontend (pruebas unitarias) | 49 % de líneas, 80 % de ramas | No definido | — |
| Defectos críticos o altos abiertos | 0 (INC-001 corregido y reprobado) | 0 | Sí, pendiente de integrar |

La cobertura unitaria del frontend es baja porque las pantallas se prueban sobre todo con Playwright (nivel de sistema),
de acuerdo con la pirámide. Acción: agregar pruebas unitarias de los formularios de estudiantes e instituciones en el
Sprint 4.

## 3. Defectos

| ID | Severidad | Detectado por | Estado |
|---|---|---|---|
| INC-001 · ADLCDS-103 | Alta | Prueba automatizada de API | Corregido y reprobado |
| INC-002 · ADLCDS-104 | Baja | Exploración | Corregido y reprobado |

Además se corrigieron 2 fallas de scripts de prueba (ver [Informes de incidente](Informes-de-incidente.md)).

## 4. Riesgos y bloqueos

| Riesgo | Efecto | Acción |
|---|---|---|
| La suite de API no se ha ejecutado aún contra PostgreSQL | Diferencias entre SQLite y PostgreSQL (por ejemplo, unicidad sin distinguir mayúsculas) | Abrir los PR para que GitHub Actions la ejecute con PostgreSQL 16 |
| Sin aceptación manual de un integrante distinto de quien programó | Menor independencia de la verificación | Wilberth ejecuta CP-S01 – CP-S15 antes del Sprint Review |
| Docker Compose no se ha probado (no hay Docker en el equipo de desarrollo) | La demostración podría fallar | Probarlo en otro equipo o usar la ejecución local |

## 5. Próximos pasos

1. Abrir los Pull Requests en orden y verificar CI en verde (EJ-11); cerrar INC-001 e INC-002.
2. Aceptación manual (EJ-12) y Sprint Review grabado.
3. Pruebas unitarias de formularios del frontend.
