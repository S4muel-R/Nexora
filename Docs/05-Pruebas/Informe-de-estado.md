# Informe de estado de pruebas — Nexora (segundo entregable)

| Campo | Valor |
|---|---|
| Norma | ISO/IEC/IEEE 29119-3, "Test Status Report" |
| Periodo | 2026-11-04 – 2026-11-05 |
| Alcance | Incremento HU01 – HU07, seguridad y accesibilidad del incremento |
| Versión | 1.1 |
| Preparado por | Samuel (con revisión pendiente de Wilberth, líder de pruebas) |

## 1. Avance frente al plan

| Actividad del plan | Estado |
|---|---|
| Plan de pruebas y pirámide | Completo (v1.1: seguridad, accesibilidad, pruebas intermitentes y robustez) |
| Diseño de casos | Completo: 59 casos (27 de API, 7 unitarios, 21 de sistema, 4 de seguridad), cada uno con su criterio CA de la línea base |
| Datos ficticios de 3 instituciones | Completo |
| Ejecución automatizada (API, interfaz, sistema) | Completo: **121/121** aprobadas sin reintentos (EJ-22) |
| Regresión en CI con PostgreSQL 16 (EJ-11, EJ-17 – EJ-20, EJ-23) | Completo: 14 ejecuciones en 11 PR |
| Robustez con la API lenta (EJ-21, EJ-22) | Completo: 84/84 tras las correcciones |
| Seguridad (EJ-15, EJ-16) | Completo para la selección de controles: 13/17 cumplen ([Revisión de seguridad](Revision-seguridad.md)) |
| Accesibilidad (CP-S16, CP-S17, revisión asistida) | Completo en lo automatizable: 0 violaciones; revisión manual con lector de pantalla pendiente ([Revisión de accesibilidad](Revision-accesibilidad.md)) |
| Exploración | 1 sesión (EXP-01) |
| Aceptación manual (EJ-12) | **Pendiente** — Wilberth, sobre la versión integrada en `main` |

## 2. Resultados

| Indicador | Valor | Criterio de salida | ¿Cumple? |
|---|---|---|---|
| Escenarios del incremento con caso ejecutado | 28 / 28 (100 %) | 100 % | Sí |
| Criterios CA01 – CA24 de la línea base aprobados | 6 / 24 aprobados, 2 parciales | 100 % al cierre del proyecto | En curso (CA09 – CA24 en los Sprints 4 – 6) |
| Casos aprobados (última ejecución) | 58 / 59 (98,3 %); falla CP-SEG04 (INC-006) | ≥ 95 % | Sí |
| Pruebas automatizadas aprobadas | 121 / 121, sin reintentos | — | — |
| Cobertura de código del backend | 94 % (468 sentencias, 26 sin cubrir) | ≥ 85 % | Sí |
| Cobertura unitaria del frontend | 56,4 % de líneas, 50 % de ramas | ≥ 60 % (meta de MQ-04) | No |
| Defectos críticos o altos sin corregir | 0 (3 altos corregidos y reprobados) | 0 | Sí, pendiente de integrar |
| Ejecuciones de CI en verde | 11 / 14; las 3 rojas por defectos reales; la última (EJ-23) en verde sin intermitentes | ≥ 90 % | No (las fallas fueron hallazgos) |
| Violaciones WCAG detectables | 0 en 12 auditorías | 0 | Sí |

## 3. Defectos

| ID | Severidad | Detectado por | Estado |
|---|---|---|---|
| INC-001 · ADLCDS-103 | Alta | Prueba automatizada de API (local y CI con PostgreSQL) | Corregido y reprobado |
| INC-002 · ADLCDS-104 | Baja | Exploración | Corregido y reprobado |
| INC-003 · ADLCDS-118 | Media | `check --deploy` | Corregido y reprobado |
| INC-004 · ADLCDS-119 | Media | CI (prueba intermitente) · reabierto con la API lenta | Corregido y reprobado (2.ª corrección) |
| INC-005 · ADLCDS-120 | Media | `npm audit` | Corregido; riesgo residual aceptado |
| INC-006 · ADLCDS-121 | Media | Revisión de código contra el avance 1 | **Abierto** (CC-13) |
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
| INC-006 abierto (sesión distinta de la aprobada) | Desviación de la arquitectura del avance 1 | Decisión CC-13 en el Sprint Review |
| Sin aceptación manual de un integrante distinto de quien programó | Menor independencia de la verificación | Wilberth ejecuta CP-S01 – CP-S21 antes del Sprint Review (EJ-12) |
| Las pruebas de sistema usan el servidor de desarrollo | Comportamientos de desarrollo (INC-008) que no existen en la versión compilada, y al revés | Ejecutarlas también sobre `vite build` + `vite preview` (Sprint 4) |
| Docker Compose no se ha probado (no hay Docker en el equipo de desarrollo) | La demostración podría fallar | Probarlo en otro equipo o usar la ejecución local |

## 5. Próximos pasos

1. Revisión e integración de los PR #1 – #11 con CI en verde; cerrar INC-001 – INC-005 e INC-007 – INC-009.
2. Decidir CC-13 (INC-006) y planificar su corrección.
3. Aceptación manual (EJ-12) y Sprint Review grabado.
4. Implementar GAP-01 (periodo lectivo) antes de HU09; pruebas unitarias de los formularios para subir MQ-04.
