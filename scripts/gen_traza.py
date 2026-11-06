"""Genera Docs/02-Requisitos/Matriz-de-trazabilidad.md (v1.1, anexo de correcciones del avance 1)."""

import sys
from pathlib import Path

OUT = Path(sys.argv[1])

AUTH = "`accounts/views.py` · `LoginPage.tsx`"
ROLE = "`core/permissions.py` · `navigation.ts`, `Layout.tsx`"
INST = "`institutions/serializers.py`, `views.py`"
SCOPE = "`core/mixins.py` · `students/views.py`, `institutions/views.py`"
STU = "`students/serializers.py`, `views.py` · `StudentsPage.tsx`"

# RF según la línea base del avance 1: RF01 acceso y permisos · RF02 configuración de plataforma ·
# RF03 datos institucionales · RF04 estudiantes · RF05 docentes · RF06 grupos · RF07 asistencia · RF08 reportes.
# (necesidad, rf, escenario, codigo, casos[, defecto, correccion, reprueba])
ROWS = [
    ("N02", "RF01", "HU01-E1", f"{AUTH} · `core/authentication.py` · `AuthContext.tsx`, `client.ts`", "CP-A01, CP-A27, CP-A28, CP-A29, CP-U02, CP-U06, CP-U08, CP-S01, CP-S17, CP-S19",
     "INC-007 · ADLCDS-117<br>INC-006 · ADLCDS-121", "`9599320` (sesión anterior ignorada)<br>`796cef8` (cookie HttpOnly y CSRF)", "EJ-18 CP-S19<br>EJ-24 CP-A28, CP-A29, CP-U08"),
    ("N02", "RF01", "HU01-E2", "`accounts/models.py` (`normalize_email`)", "CP-A02"),
    ("N02", "RF01", "HU01-E3", AUTH, "CP-A03, CP-U02, CP-S02"),
    ("N02", "RF01", "HU01-E4", "`accounts/views.py`", "CP-A04"),
    ("N02", "RF01", "HU01-E5", AUTH, "CP-A05, CP-U02, CP-S03"),
    ("N02", "RF01", "HU02-E1", "`accounts/views.py` (`logout`) · `AuthContext.tsx`, `client.ts` (`apiLogout`)", "CP-A06, CP-U07, CP-S04, CP-S21",
     "INC-009 · ADLCDS-122", "`f15dec5` (token borrado antes de avisar al servidor)", "EJ-22 CP-U07, CP-S21 · latencia 84/84"),
    ("N02", "RF01", "HU02-E2", "`Layout.tsx`", "CP-U03, CP-S04"),
    ("N02", "RF01", "HU02-E3", "`accounts/views.py` · `client.ts` (`onUnauthorized`)", "CP-A06"),
    ("N02", "RF01", "HU03-E1", ROLE, "CP-U04, CP-S05"),
    ("N02", "RF01", "HU03-E2", ROLE, "CP-A07, CP-U04, CP-S05"),
    ("N02", "RF01", "HU03-E3", ROLE, "CP-A07, CP-U04, CP-S06"),
    ("N04", "RF02", "HU04-E1", f"{INST} · `InstitutionsPage.tsx`", "CP-A08, CP-S07"),
    ("N04", "RF02", "HU04-E2", INST, "CP-A08"),
    ("N04", "RF02", "HU04-E3", INST, "CP-A09, CP-S08"),
    ("N04", "RF02", "HU04-E4", INST, "CP-A10"),
    ("N04", "RF03", "HU05-E1", f"{INST} · `MyInstitutionPage.tsx`", "CP-A11, CP-S09, CP-S20",
     "INC-008 · ADLCDS-123", "`f15dec5` (cargas descartadas ignoradas)", "EJ-22 CP-S20"),
    ("N04", "RF03", "HU05-E2", INST, "CP-A11"),
    ("N04", "RF03", "HU05-E3", INST, "CP-A12"),
    ("N04", "RF03", "HU05-E4", "`institutions/serializers.py` (`validate`)", "CP-A12"),
    ("N03", "RF01 · RNF separación", "HU06-E1", SCOPE, "CP-A13, CP-S10"),
    ("N03", "RF01 · RNF separación", "HU06-E2", SCOPE, "CP-A13, CP-S10"),
    ("N03", "RF01 · RNF separación", "HU06-E3", SCOPE, "CP-A14"),
    ("N03", "RF01 · RNF separación", "HU06-E4", "`institutions/views.py` (`get_queryset`)", "CP-A15"),
    ("N01, N05", "RF04", "HU07-E1", STU, "CP-A16, CP-U05, CP-S11, CP-S18",
     "INC-001 · ADLCDS-103<br>INC-004 · ADLCDS-119", "`356df07` (`is_active` por defecto)<br>`7a36635`, `f15dec5` (nivel preseleccionado; registro habilitado al cargar)",
     "EJ-02 · EJ-22 CP-S11<br>EJ-22 CP-U05, CP-S18 · latencia 84/84"),
    ("N01, N05", "RF04", "HU07-E2", STU, "CP-A17, CP-S14"),
    ("N05", "RF04", "HU07-E3", STU, "CP-A18, CP-S11"),
    ("N01", "RF04", "HU07-E4", f"{STU} · restricción `unique_student_identification_per_institution`", "CP-A19, CP-S12"),
    ("N05", "RF04", "HU07-E5", STU, "CP-A20, CP-A21, CP-S13",
     "INC-002 · ADLCDS-104", "`5418908` (mensajes de fecha)", "EJ-07, EJ-08 · EJ-14 CP-S13"),
]

PENDING = [
    ("N01, N05", "RF05", "HU08-E1 – E3", "ADLCDS-112", "Sprint 4"),
    ("N06", "RF06", "HU09-E1 – E3", "ADLCDS-113", "Sprint 4"),
    ("N07", "RF07", "HU10-E1 – E4", "ADLCDS-114", "Sprint 5"),
    ("N08", "RF08", "HU11-E1 – E3", "ADLCDS-115", "Sprint 6"),
    ("N08", "RF08", "HU12-E1 – E3", "ADLCDS-116", "Sprint 6"),
]

# Línea base del avance 1: (CA, HU de la línea base, RF, objetivo, riesgos, historia del catálogo y Jira,
#                          escenarios del catálogo, casos, resultado, defectos)
BASELINE = [
    ("CA01", "HU01", "RF01", "O3, O4", "R03", "HU01, HU03 · ADLCDS-105, 107", "HU01-E1, HU03-E1, HU03-E2",
     "CP-A01, CP-A07, CP-A27, CP-U02, CP-U04, CP-U06, CP-U07, CP-S01, CP-S05, CP-S19, CP-S21", "Aprobado tras corregir INC-007 e INC-009", "INC-007, INC-009"),
    ("CA02", "HU01", "RF01", "O3, O4", "R03", "HU03, HU06 · ADLCDS-107, 110", "HU03-E3, HU06-E3 (institución); grupo: HU09, HU10",
     "CP-A07, CP-A14, CP-S06, CP-S10", "Parcial: aprobado entre instituciones; entre grupos se prueba con HU09 – HU10", "INC-006 (corregido)"),
    ("CA03", "HU02", "RF02", "O3, O4", "R03", "HU04 · ADLCDS-108", "HU04-E1, HU04-E2", "CP-A08, CP-S07", "Aprobado", "—"),
    ("CA04", "HU02", "RF02", "O3, O4", "R03", "HU04 · ADLCDS-108", "Permiso exclusivo de la plataforma (RN01)",
     "CP-A07 (`test_hu04_solo_plataforma_registra_instituciones`)", "Aprobado", "—"),
    ("CA05", "HU03", "RF03", "O3, O4", "R05", "HU05 · ADLCDS-109", "HU05-E1, HU05-E2", "CP-A11, CP-S09, CP-S20",
     "Parcial: niveles aprobados; el periodo lectivo no está implementado (GAP-01)", "INC-008"),
    ("CA06", "HU03", "RF03", "O3, O4", "R03", "HU06 · ADLCDS-110", "HU06-E4", "CP-A15, CP-S10", "Aprobado", "—"),
    ("CA07", "HU04", "RF04", "O3, O4", "R05", "HU07 · ADLCDS-111", "HU07-E1, HU07-E2, HU07-E3",
     "CP-A16 – CP-A18, CP-U05, CP-S11, CP-S14, CP-S18", "Aprobado tras corregir INC-001 e INC-004", "INC-001, INC-004"),
    ("CA08", "HU04", "RF04", "O3, O4", "R05", "HU07 · ADLCDS-111", "HU07-E4", "CP-A19, CP-S12", "Aprobado", "—"),
    ("CA09", "HU05", "RF05", "O3, O4", "R05", "HU08 · ADLCDS-112", "HU08-E1", "Por diseñar", "Pendiente (Sprint 4)", "—"),
    ("CA10", "HU05", "RF05", "O3, O4", "R03", "HU08 · ADLCDS-112", "HU08-E3", "Por diseñar", "Pendiente (Sprint 4)", "—"),
    ("CA11", "HU06", "RF06", "O3, O4", "R05", "HU09 · ADLCDS-113", "HU09-E1", "Por diseñar", "Pendiente (Sprint 4)", "—"),
    ("CA12", "HU06", "RF06", "O3, O4", "R05", "HU09 · ADLCDS-113", "**Sin escenario** (GAP-02)", "Por diseñar", "Pendiente (Sprint 4)", "—"),
    ("CA13", "HU07", "RF06", "O3, O4", "R05", "HU09 · ADLCDS-113", "HU09-E1, HU09-E2", "Por diseñar", "Pendiente (Sprint 4)", "—"),
    ("CA14", "HU07", "RF06", "O3, O4", "R03, R05", "HU09 · ADLCDS-113", "HU09-E3", "Por diseñar", "Pendiente (Sprint 4)", "—"),
    ("CA15", "HU08", "RF06", "O3, O4", "R05", "HU09, HU10 · ADLCDS-113, 114", "HU09-E1, HU10-E1", "Por diseñar", "Pendiente (Sprints 4 – 5)", "—"),
    ("CA16", "HU08", "RF06", "O3, O4", "R03", "HU10 · ADLCDS-114", "**Sin escenario** (GAP-03)", "Por diseñar", "Pendiente (Sprint 5)", "—"),
    ("CA17", "HU09", "RF07", "O3, O4", "R05", "HU10 · ADLCDS-114", "HU10-E1", "Por diseñar", "Pendiente (Sprint 5)", "—"),
    ("CA18", "HU09", "RF07", "O3, O4", "R05", "HU10 · ADLCDS-114", "HU10-E3", "Por diseñar", "Pendiente (Sprint 5)", "—"),
    ("CA19", "HU10", "RF07", "O3, O4", "R05", "HU10 · ADLCDS-114", "HU10-E2", "Por diseñar", "Pendiente (Sprint 5)", "—"),
    ("CA20", "HU10", "RF07", "O3, O4", "R03, R05", "HU10 · ADLCDS-114", "HU10-E4", "Por diseñar", "Pendiente (Sprint 5)", "—"),
    ("CA21", "HU11", "RF08", "O3, O4", "R09", "HU11 · ADLCDS-115", "HU11-E1, HU11-E2", "Por diseñar", "Pendiente (Sprint 6)", "—"),
    ("CA22", "HU11", "RF08", "O3, O4", "R03", "HU11 · ADLCDS-115", "**Sin escenario** (GAP-04)", "Por diseñar", "Pendiente (Sprint 6)", "—"),
    ("CA23", "HU12", "RF08", "O3, O4", "R09", "HU12 · ADLCDS-116", "HU12-E1", "Por diseñar", "Pendiente (Sprint 6)", "—"),
    ("CA24", "HU12", "RF08", "O3, O4", "R09", "HU12 · ADLCDS-116", "HU12-E3", "Por diseñar", "Pendiente (Sprint 6)", "—"),
]

# Trazabilidad inversa: (defecto, Jira, caso que lo detectó, escenario, historia, RF, CA, objetivo, riesgo, estado)
DEFECTS = [
    ("INC-001", "ADLCDS-103", "CP-A16 (EJ-01; CI #4)", "HU07-E1", "HU07", "RF04", "CA07", "O4", "R05", "Corregido y reprobado"),
    ("INC-002", "ADLCDS-104", "EXP-01 (EJ-06)", "HU07-E5", "HU07", "RF04 · RNF04", "—", "O4, O5", "R10", "Corregido y reprobado"),
    ("INC-003", "ADLCDS-118", "CP-A26 / `check --deploy` (EJ-16)", "—", "—", "RNF seguridad", "—", "O4", "R03", "Corregido y reprobado"),
    ("INC-004", "ADLCDS-119", "CP-S11 (CI #9 intermitente, CI #10)", "HU07-E1", "HU07", "RF04", "CA07", "O4", "R05", "Corregido y reprobado"),
    ("INC-005", "ADLCDS-120", "CP-SEG01 (EJ-15)", "—", "—", "RNF seguridad", "—", "O4", "R08", "Corregido; riesgo residual aceptado"),
    ("INC-007", "ADLCDS-117", "CP-S10 (CI #11 intermitente) · CP-S19", "HU01-E1", "HU01", "RF01", "CA01", "O4", "R03", "Corregido y reprobado"),
    ("INC-008", "ADLCDS-123", "CP-S09 (CI #11 intermitente, EJ-20) · CP-S20", "HU05-E1", "HU05", "RF03", "CA05", "O4", "R05", "Corregido y reprobado"),
    ("INC-009", "ADLCDS-122", "CP-S16 con latencia (EJ-21) · CP-S21", "HU02-E1", "HU02", "RF01", "CA01", "O4", "R03", "Corregido y reprobado"),
    ("INC-006", "ADLCDS-121", "CP-SEG04 (EJ-15)", "HU01, HU02", "HU01, HU02", "RF01 · avance 1 §7.1", "CA01, CA02", "O4", "R03", "Corregido y reprobado (CC-13, opción A)"),
]

lines = ["""# Matriz de trazabilidad — Nexora

| Campo | Valor |
|---|---|
| Referencia | Instrucciones del Proyecto Integrador, sección 19 · Anexo de correcciones del avance 1, sección 5 |
| Versión | 1.1 |
| Fecha | 2026-11-05 |
| Fuentes | [Catálogo de requisitos](Catalogo-de-requisitos.md) · [Especificación de casos](../05-Pruebas/Especificacion-de-casos.md) · [Registro de ejecución](../05-Pruebas/Registro-de-ejecucion.md) · [Informes de incidente](../05-Pruebas/Informes-de-incidente.md) · Jira ADLCDS ([backlog exportado](../01-Planificacion/Backlog-Jira.md)) |

Cadena del anexo: **objetivo SMART ↔ requisito RF ↔ historia / tarea ADLCDS ↔ riesgo ↔ caso de prueba ↔ defecto ↔
resultado / evidencia**. La sección 1 sigue la cadena de las instrucciones del curso (necesidad → requisito → historia →
escenario → código → caso → resultado → defecto → corrección → reprueba); la sección 2 la cruza con los criterios CA01 –
CA24 del avance 1 y la sección 3 recorre la cadena en sentido inverso, desde cada defecto.

Los RF usan la numeración de la línea base del avance 1 (CC-11): RF01 acceso y permisos, RF02 configuración de la
plataforma, RF03 datos institucionales, RF04 estudiantes, RF05 docentes, RF06 grupos, RF07 asistencia, RF08 reportes.
Rutas de código relativas a `backend/` (Python) y `frontend/src/` (TypeScript). Resultados de la última ejecución
(EJ-13 – EJ-25 y CI de los PR #1 – #11).

## 1. Incremento del segundo entregable (HU01 – HU07)

| Necesidad | Requisito | Historia | Escenario | Código | Caso de prueba | Resultado | Defecto | Corrección | Reprueba |
|---|---|---|---|---|---|---|---|---|---|"""]
for row in ROWS:
    need, rf, esc, code, cases = row[:5]
    defect, fix, retest = row[5:8] if len(row) > 5 else ("—", "—", "—")
    hu = esc.split("-")[0]
    lines.append(f"| {need} | {rf} | {hu} | {esc} | {code} | {cases} | Aprobado | {defect} | {fix} | {retest} |")

lines.append("""
## 2. Línea base del avance 1 (CA01 – CA24), en ambos sentidos

Cada fila permite ir del criterio aprobado en el avance 1 a sus pruebas y resultado, y volver desde el caso o el defecto
al criterio. Objetivos y riesgos según el anexo, sección 5, y la matriz de riesgos del avance 1 (R01 – R10).

| CA | HU (avance 1) | RF | Objetivo | Riesgos | Historia del catálogo · Jira | Escenarios del catálogo | Casos | Resultado | Defectos |
|---|---|---|---|---|---|---|---|---|---|""")
for ca, hub, rf, obj, risk, hu, esc, cases, res, defs in BASELINE:
    lines.append(f"| {ca} | {hub} | {rf} | {obj} | {risk} | {hu} | {esc} | {cases} | {res} | {defs} |")

approved = sum(1 for b in BASELINE if b[8].startswith("Aprobado"))
partial = sum(1 for b in BASELINE if b[8].startswith("Parcial"))
lines.append(f"""
**Resultado frente a la línea base:** {approved} de 24 criterios aprobados, {partial} parciales y
{24 - approved - partial} pendientes (HU08 – HU12, Sprints 4 – 6).

**Brechas encontradas al cruzar la línea base con el catálogo** (verificación, 2026-11-05):

| ID | Brecha | Acción |
|---|---|---|
| GAP-01 | CA05 pide un periodo lectivo de demostración; el catálogo y el modelo de datos no lo incluyen | Agregar el periodo a HU05 y al modelo de institución antes de HU09 (los grupos dependen del periodo) — REF-16 |
| GAP-02 | CA12 (código de grupo duplicado en el mismo periodo) no tiene escenario en HU09 | Agregar HU09-E4 — REF-17 |
| GAP-03 | CA16 (docente sin asignación no consulta ni registra asistencia del grupo) no tiene escenario | Agregar HU10-E5 — REF-17 |
| GAP-04 | CA22 (usuario ajeno o docente no obtiene listados generales) no tiene escenario | Agregar HU11-E4 — REF-17 |

## 3. Trazabilidad inversa (defecto → requisito → objetivo)

| Defecto | Jira | Detectado por | Escenario | Historia | Requisito | CA | Objetivo | Riesgo materializado | Estado |
|---|---|---|---|---|---|---|---|---|---|""")
for d in DEFECTS:
    lines.append("| " + " | ".join(d) + " |")

lines.append("""
## 4. Historias pendientes (replanificadas por CC-05)

| Necesidad | Requisito | Historia / escenarios | Jira | Código | Caso de prueba | Estado |
|---|---|---|---|---|---|---|""")
for need, rf, esc, jira, sprint in PENDING:
    lines.append(f"| {need} | {rf} | {esc} | {jira} | — | Por diseñar | Planificada para el {sprint} |")

lines.append(f"""
## 5. Requisitos no funcionales, seguridad y accesibilidad

| Requisito | Código | Caso de prueba | Resultado |
|---|---|---|---|
| RNF01 Contraseñas con hash | `accounts/models.py` (hash de Django) | CP-A23 | Aprobado |
| RNF02 API protegida | `config/settings.py` (`IsAuthenticated` por defecto) | CP-A23 | Aprobado |
| RNF03 Uso desde 360 px | `index.css` (tablas como tarjetas) | CP-S01 – CP-S18 en perfil teléfono · EXP-01 | Aprobado |
| RNF04 Mensajes claros | `core/exceptions.py` · `client.ts` | CP-A24, CP-U01, CP-S02, CP-S13 | Aprobado tras INC-002 |
| RNF05 Rendimiento | — | Por diseñar (Sprint 8) | Pendiente |
| Separación de datos por institución (avance 1, RNF) | `core/mixins.py` | CP-A13 – CP-A15, CP-S10 | Aprobado |
| Permisos comprobados en el servidor (avance 1, RNF) | `core/permissions.py` | CP-A07, CP-A22 | Aprobado |
| Sesión con cookie HttpOnly y CSRF (avance 1, §7.1) | `core/authentication.py`, `config/settings.py` · `client.ts` | CP-SEG04, CP-A28, CP-A29, CP-U08 | Aprobado tras INC-006 |
| Configuración HTTPS para un ambiente publicado | `config/settings.py` (`DJANGO_HTTPS`) | CP-A26 | Aprobado tras INC-003 |
| Dependencias sin vulnerabilidades conocidas | `package.json`, `requirements.txt` | CP-SEG01, CP-SEG02 | Aprobado (riesgo residual INC-005) |
| Sin secretos en el repositorio | Todo el historial de git | CP-SEG03 | Aprobado |
| WCAG 2.2 AA (objetivo del avance 1) | Pantallas del incremento | CP-S16, CP-S17 · [Revisión de accesibilidad](../05-Pruebas/Revision-accesibilidad.md) | Aprobado en lo automatizable; revisión manual parcial |

## 6. Cobertura

| Indicador | Valor |
|---|---|
| Escenarios del incremento | {len(ROWS)} |
| Escenarios con al menos un caso ejecutado | {len(ROWS)} (100 %) |
| Escenarios con prueba en la API | {sum(1 for r in ROWS if "CP-A" in r[4])} |
| Escenarios con prueba de sistema | {sum(1 for r in ROWS if "CP-S" in r[4])} |
| Criterios de la línea base (CA01 – CA24) aprobados | {approved} de 24 ({approved * 100 // 24} %); {partial} parciales |
| Criterios de la línea base con escenario en el catálogo | 21 de 24 (GAP-02 – GAP-04) |
| Defectos trazados a su escenario o requisito, corrección y reprueba | 9 de 9 |
""")
OUT.write_text("\n".join(lines), encoding="utf-8")
print("ok", len(ROWS), approved, partial)
