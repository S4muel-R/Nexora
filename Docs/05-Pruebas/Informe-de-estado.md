# Informe de estado de pruebas — Nexora (segundo entregable)

| Campo | Valor |
|---|---|
| Norma | ISO/IEC/IEEE 29119-3, "Test Status Report" |
| Periodo | 2026-11-04 – 2026-11-05 |
| Alcance | Incremento HU01 – HU07, seguridad y accesibilidad del incremento |
| Versión | 1.2 |
| Preparado por | Samuel (con revisión pendiente de Wilberth, líder de pruebas) |

## 1. Avance frente al plan

| Actividad del plan | Estado |
|---|---|
| Plan de pruebas y pirámide | Completo (v1.1: seguridad, accesibilidad, pruebas intermitentes y robustez) |
| Diseño de casos | Completo: 64 casos (30 de API, 9 unitarios, 21 de sistema, 4 de seguridad), cada uno con su criterio CA de la línea base |
| Datos ficticios de 3 instituciones | Completo |
| Ejecución automatizada (API, interfaz, sistema) | Completo: **139/139** aprobadas sin reintentos (EJ-24, EJ-25), también sobre la versión compilada |
| Regresión en CI con PostgreSQL 16 (EJ-11, EJ-17 – EJ-20, EJ-23, EJ-25) | Completo: 17 ejecuciones en 11 PR; desde EJ-25 con auditoría de dependencias y recorridos sobre la versión compilada |
| Robustez con la API lenta (EJ-21, EJ-22, EJ-24) | Completo: 84/84 tras las correcciones; la latencia ya es una opción del repositorio |
| Seguridad (EJ-15, EJ-16, EJ-24) | Completo para la selección de controles: 16/18 cumplen, ninguno incumple ([Revisión de seguridad](Revision-seguridad.md)) |
| Accesibilidad (CP-S16, CP-S17, CP-U09, revisión asistida) | Completo en lo automatizable: 0 violaciones; A11Y-01 y A11Y-02 resueltos; lector de pantalla pendiente ([Revisión de accesibilidad](Revision-accesibilidad.md)) |
| Exploración | 1 sesión (EXP-01) |
| Aceptación manual (EJ-12) | **Pendiente** — Wilberth, sobre la versión integrada en `main` |

## 2. Resultados

| Indicador | Valor | Criterio de salida | ¿Cumple? |
|---|---|---|---|
| Escenarios del incremento con caso ejecutado | 28 / 28 (100 %) | 100 % | Sí |
| Criterios CA01 – CA24 de la línea base aprobados | 6 / 24 aprobados, 2 parciales | 100 % al cierre del proyecto | En curso (CA09 – CA24 en los Sprints 4 – 6) |
| Casos aprobados (última ejecución) | 64 / 64 (100 %) | ≥ 95 % | Sí |
| Pruebas automatizadas aprobadas | 139 / 139, sin reintentos; 42/42 sobre la versión compilada; 84/84 con latencia | — | — |
| Cobertura de código del backend | 95 % (499 sentencias, 26 sin cubrir) | ≥ 85 % | Sí |
| Cobertura unitaria del frontend | 91,6 % de líneas, 79 % de ramas | ≥ 60 % (meta de MQ-04) | Sí |
| Defectos sin corregir | 0 de 9 (3 altos, 4 medios, 2 bajos, todos corregidos y reprobados) | 0 críticos o altos | Sí, pendiente de integrar |
| Ejecuciones de CI en verde | 14 / 17; las 3 rojas por defectos reales; las 6 últimas en verde sin intermitentes | ≥ 90 % | No (las fallas fueron hallazgos) |
| Violaciones WCAG detectables | 0 en 12 auditorías | 0 | Sí |

## 3. Defectos

| ID | Severidad | Detectado por | Estado |
|---|---|---|---|
| INC-001 · ADLCDS-103 | Alta | Prueba automatizada de API (local y CI con PostgreSQL) | Corregido y reprobado |
| INC-002 · ADLCDS-104 | Baja | Exploración | Corregido y reprobado |
| INC-003 · ADLCDS-118 | Media | `check --deploy` | Corregido y reprobado |
| INC-004 · ADLCDS-119 | Media | CI (prueba intermitente) · reabierto con la API lenta | Corregido y reprobado (2.ª corrección) |
| INC-005 · ADLCDS-120 | Media | `npm audit` | Corregido; riesgo residual aceptado |
| INC-006 · ADLCDS-121 | Media | Revisión de código contra el avance 1 | Corregido y reprobado (sesión en cookie HttpOnly con CSRF) |
| INC-007 · ADLCDS-117 | Alta | CI (prueba intermitente) | Corregido y reprobado |
| INC-008 · ADLCDS-123 | Baja | CI con `failOnFlakyTests` | Corregido y reprobado |
| INC-009 · ADLCDS-122 | Alta | Suite con la API lenta | Corregido y reprobado |

Además se corrigieron 3 fallas de scripts de prueba (ver [Informes de incidente](Informes-de-incidente.md)).

**Lección principal (ACR-03):** cuatro defectos dependían de la demora de las respuestas y no aparecían en el equipo
de desarrollo. El reintento automático del CI ocultó dos de ellos. Desde `b403436` una prueba intermitente hace
fallar el CI, y antes de cada entrega se corre la suite contra la API con latencia.

## 4. Riesgos y bloqueos

| Riesgo | Efecto | Acción |
|---|---|---|
| Ningún PR revisado ni integrado | Las tareas y los defectos no pueden pasar a *Listo*; MP-03 en 0 % | Luis y Wilberth revisan los PR #1 – #11 en orden |
| Sin aceptación manual de un integrante distinto de quien programó | Menor independencia de la verificación | Wilberth ejecuta CP-S01 – CP-S21 antes del Sprint Review (EJ-12) |
| Docker Compose no se ha probado (no hay Docker en el equipo de desarrollo) | La demostración podría fallar | Probarlo en otro equipo o usar la ejecución local |

## 5. Próximos pasos

1. Revisión e integración de los PR #1 – #11 con CI en verde; cerrar INC-001 – INC-009 en Jira.
2. Ratificar CC-13 (sesión en cookie) en el Sprint Review.
3. Aceptación manual (EJ-12) y Sprint Review grabado.
4. Implementar GAP-01 (periodo lectivo) antes de HU09; límite de intentos de ingreso y CSP (seguridad); revisión con lector de pantalla (A11Y-03).
