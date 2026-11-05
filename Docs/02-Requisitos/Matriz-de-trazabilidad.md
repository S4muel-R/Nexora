# Matriz de trazabilidad — Nexora

| Campo | Valor |
|---|---|
| Referencia | Instrucciones del Proyecto Integrador, sección 19 |
| Versión | 1.0 |
| Fecha | 2026-11-04 |
| Fuentes | [Catálogo de requisitos](Catalogo-de-requisitos.md) · [Especificación de casos](../05-Pruebas/Especificacion-de-casos.md) · [Registro de ejecución](../05-Pruebas/Registro-de-ejecucion.md) · [Informes de incidente](../05-Pruebas/Informes-de-incidente.md) |

Cadena: **Necesidad → Requisito → Historia → Escenario de aceptación → Código → Caso de prueba → Resultado → Defecto →
Corrección → Reprueba**.

Rutas de código relativas a `backend/` (Python) y `frontend/src/` (TypeScript). Resultado según la última ejecución
(EJ-05, EJ-07, EJ-10).

## 1. Incremento del segundo entregable (HU01 – HU07)

| Necesidad | Requisito | Historia | Escenario | Código | Caso de prueba | Resultado | Defecto | Corrección | Reprueba |
|---|---|---|---|---|---|---|---|---|---|
| N02 | RF01 | HU01 | HU01-E1 | `accounts/views.py` · `LoginPage.tsx` | CP-A01, CP-U02, CP-S01 | Aprobado | — | — | — |
| N02 | RF01 | HU01 | HU01-E2 | `accounts/models.py` (`normalize_email`) | CP-A02 | Aprobado | — | — | — |
| N02 | RF01 | HU01 | HU01-E3 | `accounts/views.py` · `LoginPage.tsx` | CP-A03, CP-U02, CP-S02 | Aprobado | — | — | — |
| N02 | RF01 | HU01 | HU01-E4 | `accounts/views.py` | CP-A04 | Aprobado | — | — | — |
| N02 | RF01 | HU01 | HU01-E5 | `accounts/views.py` · `LoginPage.tsx` | CP-A05, CP-U02, CP-S03 | Aprobado | — | — | — |
| N02 | RF01 | HU02 | HU02-E1 | `accounts/views.py` (`logout`) · `AuthContext.tsx` | CP-A06, CP-S04 | Aprobado | — | — | — |
| N02 | RF01 | HU02 | HU02-E2 | `Layout.tsx` | CP-U03, CP-S04 | Aprobado | — | — | — |
| N02 | RF01 | HU02 | HU02-E3 | `accounts/views.py` · `client.ts` (`onUnauthorized`) | CP-A06 | Aprobado | — | — | — |
| N02 | RF02 | HU03 | HU03-E1 | `core/permissions.py` · `navigation.ts`, `Layout.tsx` | CP-U04, CP-S05 | Aprobado | — | — | — |
| N02 | RF02 | HU03 | HU03-E2 | `core/permissions.py` · `navigation.ts`, `Layout.tsx` | CP-A07, CP-U04, CP-S05 | Aprobado | — | — | — |
| N02 | RF02 | HU03 | HU03-E3 | `core/permissions.py` · `navigation.ts`, `Layout.tsx` | CP-A07, CP-U04, CP-S06 | Aprobado | — | — | — |
| N04 | RF03 | HU04 | HU04-E1 | `institutions/serializers.py`, `views.py` · `InstitutionsPage.tsx` | CP-A08, CP-S07 | Aprobado | — | — | — |
| N04 | RF03 | HU04 | HU04-E2 | `institutions/serializers.py`, `views.py` | CP-A08 | Aprobado | — | — | — |
| N04 | RF03 | HU04 | HU04-E3 | `institutions/serializers.py`, `views.py` | CP-A09, CP-S08 | Aprobado | — | — | — |
| N04 | RF03 | HU04 | HU04-E4 | `institutions/serializers.py`, `views.py` | CP-A10 | Aprobado | — | — | — |
| N04 | RF03 | HU05 | HU05-E1 | `institutions/serializers.py`, `views.py` · `MyInstitutionPage.tsx` | CP-A11, CP-S09 | Aprobado | — | — | — |
| N04 | RF03 | HU05 | HU05-E2 | `institutions/serializers.py`, `views.py` | CP-A11 | Aprobado | — | — | — |
| N04 | RF03 | HU05 | HU05-E3 | `institutions/serializers.py`, `views.py` | CP-A12 | Aprobado | — | — | — |
| N04 | RF03 | HU05 | HU05-E4 | `institutions/serializers.py` (`validate`) | CP-A12 | Aprobado | — | — | — |
| N03 | RF02 | HU06 | HU06-E1 | `core/mixins.py` · `students/views.py`, `institutions/views.py` | CP-A13, CP-S10 | Aprobado | — | — | — |
| N03 | RF02 | HU06 | HU06-E2 | `core/mixins.py` · `students/views.py`, `institutions/views.py` | CP-A13, CP-S10 | Aprobado | — | — | — |
| N03 | RF02 | HU06 | HU06-E3 | `core/mixins.py` · `students/views.py`, `institutions/views.py` | CP-A14 | Aprobado | — | — | — |
| N03 | RF02 | HU06 | HU06-E4 | `institutions/views.py` (`get_queryset`) | CP-A15 | Aprobado | — | — | — |
| N01, N05 | RF04 | HU07 | HU07-E1 | `students/serializers.py`, `views.py` · `StudentsPage.tsx` | CP-A16, CP-S11 | Aprobado | INC-001 · ADLCDS-103 | `356df07` (`is_active` por defecto) | EJ-02 aprobado · EJ-10 CP-S11 aprobado |
| N01, N05 | RF04 | HU07 | HU07-E2 | `students/serializers.py`, `views.py` · `StudentsPage.tsx` | CP-A17, CP-S14 | Aprobado | — | — | — |
| N05 | RF04 | HU07 | HU07-E3 | `students/serializers.py`, `views.py` · `StudentsPage.tsx` | CP-A18, CP-S11 | Aprobado | — | — | — |
| N01 | RF04 | HU07 | HU07-E4 | `students/serializers.py`, `views.py` · `StudentsPage.tsx` · restricción `unique_student_identification_per_institution` | CP-A19, CP-S12 | Aprobado | — | — | — |
| N05 | RF04 | HU07 | HU07-E5 | `students/serializers.py`, `views.py` · `StudentsPage.tsx` | CP-A20, CP-A21, CP-S13 | Aprobado | INC-002 · ADLCDS-104 | `5418908` (mensajes de fecha) | EJ-07, EJ-08 aprobado · EJ-10 CP-S13 aprobado |

## 2. Historias pendientes (replanificadas por CC-05)

| Necesidad | Requisito | Historia / escenarios | Código | Caso de prueba | Estado |
|---|---|---|---|---|---|
| N01, N05 | RF05 | HU08-E1 – E3 | — | Por diseñar | Planificada para el Sprint 4 |
| N06 | RF06 | HU09-E1 – E3 | — | Por diseñar | Planificada para el Sprint 4 |
| N07 | RF07 | HU10-E1 – E4 | — | Por diseñar | Planificada para el Sprint 5 |
| N08 | RF08 | HU11-E1 – E3 | — | Por diseñar | Planificada para el Sprint 6 |
| N08 | RF08 | HU12-E1 – E3 | — | Por diseñar | Planificada para el Sprint 6 |

## 3. Requisitos no funcionales

| Requisito | Código | Caso de prueba | Resultado |
|---|---|---|---|
| RNF01 Contraseñas con hash | `accounts/models.py` (hash de Django) | CP-A23 | Aprobado |
| RNF02 API protegida | `config/settings.py` (`IsAuthenticated` por defecto) | CP-A23 | Aprobado |
| RNF03 Uso desde 360 px | `index.css` (tablas como tarjetas) | CP-S01 – CP-S15 en perfil teléfono · EXP-01 | Aprobado |
| RNF04 Mensajes claros | `core/exceptions.py` · `client.ts` | CP-A24, CP-U01, CP-S02, CP-S13 | Aprobado tras INC-002 |
| RNF05 Rendimiento | — | Por diseñar (Sprint 8) | Pendiente |

## 4. Cobertura

| Indicador | Valor |
|---|---|
| Escenarios del incremento | 28 |
| Escenarios con al menos un caso ejecutado | 28 (100 %) |
| Escenarios con prueba en la API | 26 |
| Escenarios con prueba de sistema | 18 |
| Defectos trazados a su escenario, corrección y reprueba | 2 de 2 |
