# Informe de estado de pruebas — Nexora (entrega final)

| Campo | Valor |
|---|---|
| Norma | ISO/IEC/IEEE 29119-3, "Test Status Report" |
| Periodo | 2026-11-04 – 2026-11-18 |
| Alcance | HU01 – HU12 (RF01 – RF08), seguridad y accesibilidad; tercer incremento en el PR #12 (`be47f1c`) |
| Versión | 1.3 |
| Preparado por | Samuel (con revisión pendiente de Wilberth, líder de pruebas) |

## 1. Avance frente al plan

| Actividad del plan | Estado |
|---|---|
| Plan de pruebas y pirámide | Completo (v1.1) |
| Diseño de casos | Completo: 103 casos (50 de API, 15 unitarios, 34 de sistema, 4 de seguridad), cada uno con su criterio CA de la línea base |
| Datos ficticios de 3 instituciones | Completo, con periodo 2026, docentes y grupos |
| Ejecución automatizada (API, interfaz, sistema) | Completo: **229/229** aprobadas sin reintentos (EJ-27, EJ-28) |
| Versión compilada y robustez con la API lenta | Completo: 68/68 en cada variante (EJ-27) |
| Regresión en CI con PostgreSQL 16 | Completo: 19 ejecuciones en 12 PR; la del PR #12 (44441650355) en verde con 111 + 50 + 68 pruebas y 34 recorridos sobre la versión compilada |
| Seguridad | Completo para la selección de controles: 16/18 cumplen, ninguno incumple; los servicios nuevos tienen pruebas de aislamiento y permisos |
| Accesibilidad | Completo en lo automatizable: 0 violaciones en 22 auditorías; lector de pantalla pendiente (A11Y-03) |
| Exploración | 1 sesión (EXP-01); no hubo sesión exploratoria sobre HU08 – HU12 |
| Aceptación manual (EJ-12) | **Pendiente** — Wilberth, sobre la versión integrada en `main` |
| Validación con usuarios (O5) y pruebas cruzadas | **Pendientes** — dependen de participantes y de la asignación del profesor |

## 2. Resultados

| Indicador | Valor | Criterio de salida | ¿Cumple? |
|---|---|---|---|
| Escenarios con caso ejecutado | 48 / 48 (100 %) | 100 % | Sí |
| Criterios CA01 – CA24 de la línea base | 24 / 24 con casos aprobados por el equipo de desarrollo | 100 % al cierre del proyecto | Sí en pruebas; falta la aceptación (EJ-12) |
| Casos aprobados (última ejecución) | 103 / 103 (100 %) | ≥ 95 % | Sí |
| Pruebas automatizadas aprobadas | 229 / 229 sin reintentos; 68/68 compilada; 68/68 con latencia | — | — |
| Cobertura de código del backend | 95 % (1068 sentencias, 53 sin cubrir) | ≥ 85 % | Sí |
| Cobertura unitaria del frontend | 87,4 % de líneas, 74,6 % de ramas | ≥ 60 % | Sí |
| Defectos sin corregir | 0 de 12 (5 altos, 5 medios, 2 bajos, todos corregidos y reprobados) | 0 críticos o altos | Sí, pendiente de integrar |
| Ejecuciones de CI en verde | 16 / 19 (84,2 %); las 3 rojas por defectos reales | ≥ 90 % | No (las 3 rojas fueron hallazgos reales; las 9 últimas en verde) |
| Violaciones WCAG detectables | 0 en 22 auditorías | 0 | Sí |

## 3. Defectos

| ID | Severidad | Detectado por | Estado |
|---|---|---|---|
| INC-001 · ADLCDS-103 | Alta | Prueba automatizada de API (local y CI con PostgreSQL) | Corregido y reprobado |
| INC-002 · ADLCDS-104 | Baja | Exploración | Corregido y reprobado |
| INC-003 · ADLCDS-118 | Media | `check --deploy` | Corregido y reprobado |
| INC-004 · ADLCDS-119 | Media | CI (prueba intermitente) · reabierto con la API lenta | Corregido y reprobado (2.ª corrección) |
| INC-005 · ADLCDS-120 | Media | `npm audit` | Corregido; riesgo residual aceptado |
| INC-006 · ADLCDS-121 | Media | Revisión de código contra el avance 1 | Corregido y reprobado |
| INC-007 · ADLCDS-117 | Alta | CI (prueba intermitente) | Corregido y reprobado |
| INC-008 · ADLCDS-123 | Baja | CI con `failOnFlakyTests` | Corregido y reprobado |
| INC-009 · ADLCDS-122 | Alta | Suite con la API lenta | Corregido y reprobado |
| INC-010 · ADLCDS-124 | Media | Suite de sistema sobre la versión compilada | Corregido y reprobado |
| INC-011 · ADLCDS-125 | Alta | Suite con la API lenta | Corregido y reprobado |
| INC-012 · ADLCDS-126 | Alta | Suite con la API lenta | Corregido y reprobado (interfaz y API) |

Además se corrigieron 7 fallas de scripts de prueba (ver [Informes de incidente](Informes-de-incidente.md)).

**Lección principal (ACR-03, ACR-05):** siete defectos dependían de la demora o el orden de las respuestas. Las pantallas
nuevas repitieron dos patrones ya corregidos y el cambio de cuenta reveló otro (INC-012); las ejecuciones sobre la versión compilada y con latencia, que antes eran
una acción preventiva, los detectaron antes de integrar.

## 4. Riesgos y bloqueos

| Riesgo | Efecto | Acción |
|---|---|---|
| Ningún PR revisado ni integrado | Las tareas y los defectos no pueden pasar a *Listo*; MP-03 en 0 % | Luis y Wilberth revisan los PR #1 – #12 en orden |
| El tercer incremento lo programó y probó una sola persona | Menor independencia de la verificación | Revisión del PR #12 por Luis (API) y aceptación EJ-12 por Wilberth |
| Supuestos sin validar: asistencia por día (VR-01) y cuentas docentes creadas por la administración (VR-13) | Retrabajo si la institución registra por lección | Validarlos en la evaluación con usuarios (O5) |
| Pantallas nuevas no medidas a 320 px | RNF03 sin evidencia para docentes, grupos, asistencia y reportes | Repetir la revisión asistida de reflujo |

## 5. Próximos pasos

1. Revisión e integración de los PR #1 – #12 con CI en verde; cerrar INC-001 – INC-012 en Jira.
2. Ratificar CC-13 y CC-20 en el Sprint Review.
3. Aceptación manual (EJ-12), pruebas cruzadas y validación con usuarios.
4. Límite de intentos de ingreso y CSP (seguridad); revisión con lector de pantalla (A11Y-03).
