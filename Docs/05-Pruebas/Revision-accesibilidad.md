# Revisión de accesibilidad — Nexora

| Campo | Valor |
|---|---|
| Referencia | Avance 1, sección 7.2 (WCAG 2.2 nivel AA como objetivo) y sección 8 (accesibilidad) · Anexo de correcciones, sección 7 |
| Tarea | S7-14 Accesibilidad ([ADLCDS-92](https://proyectosulacit.atlassian.net/browse/ADLCDS-92)), adelantada |
| Alcance | Pantallas del incremento: ingreso, inicio, instituciones, mi institución, estudiantes y formulario de estudiante con errores, en computadora (1280 × 800) y teléfono (Pixel 7) |
| Versión | 1.1 |
| Fecha | 2026-11-05 |
| Responsable | Samuel (ejecución) · revisión manual con tecnología de apoyo: pendiente |

> Como advierte el avance 1, **una revisión parcial no acredita conformidad total con WCAG 2.2 AA**. Las herramientas
> automáticas detectan solo una parte de los criterios; los que requieren juicio humano se marcan como revisión manual
> pendiente.

## 1. Método

| Técnica | Herramienta | Qué cubre | Evidencia |
|---|---|---|---|
| Auditoría automática | axe-core 4.10 con Playwright (`@axe-core/playwright` 4.10.2), reglas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` | Contraste, nombres accesibles, etiquetas, estructura, idioma, tamaño de objetivos, ARIA | CP-S16 · `evidencias/accesibilidad/axe_<pantalla>_<dispositivo>.json` (12 informes) |
| Recorrido con teclado | Playwright (CP-S17) y `scripts/a11y_manual.cjs` | Operación sin ratón, foco visible, orden del foco | CP-S17 · `evidencias/accesibilidad/EV_A11Y-revision-asistida_20261105.txt` |
| Reflujo | `scripts/a11y_manual.cjs` a 320 px de ancho | Sin desplazamiento horizontal | Ídem |
| Anuncio de errores | `scripts/a11y_manual.cjs` | `role="alert"`, `aria-invalid`, `aria-describedby` | Ídem |

## 2. Resultados de axe-core

| Pantalla | Reglas aprobadas | Violaciones (computadora / teléfono) | Revisión manual indicada por axe |
|---|---|---|---|
| Ingreso | 13 | 0 / 0 | — |
| Inicio (plataforma) | 16 | 0 / 0 | — |
| Instituciones | 18 | 0 / 0 | — |
| Mi institución | 19 | 0 / 0 | — |
| Estudiantes | 20 | 0 / 0 | `th-has-data-cells` (tabla que en teléfono se muestra como tarjetas) |
| Formulario de estudiante con errores | 25 | 0 / 0 | — |

## 3. Lista de comprobación WCAG 2.2 AA aplicable

| Criterio | Nombre | Resultado | Cómo se verificó |
|---|---|---|---|
| 1.1.1 | Contenido no textual | Cumple (no hay imágenes con información) | axe |
| 1.3.1 | Información y relaciones | Cumple; revisar a mano la tabla en modo tarjeta | axe (`th-has-data-cells` incompleto) |
| 1.3.5 | Identificar el propósito de la entrada | Cumple: `autocomplete` `username` y `current-password` en el ingreso; `new-password` para la cuenta nueva | Revisión de código |
| 1.4.3 | Contraste mínimo | Cumple | axe (`color-contrast`) |
| 1.4.4 / 1.4.10 | Cambio de tamaño y reflujo | Cumple: sin desplazamiento horizontal a 320 px en las 4 pantallas medidas | Revisión asistida |
| 1.4.11 | Contraste de componentes | Revisión manual pendiente (bordes de campos y foco) | — |
| 2.1.1 | Teclado | Cumple en el ingreso y el formulario de estudiantes | CP-S17 · revisión asistida |
| 2.4.2 | Página titulada | Cumple tras A11Y-01: "Ingresar · Nexora", "Inicio · Nexora", "Mi institución · Nexora", "Estudiantes · Nexora", "Instituciones · Nexora" | Revisión asistida 2 · CP-U09 |
| 2.4.3 | Orden del foco | Cumple: al abrir el formulario el foco pasa a su encabezado (A11Y-02) y sigue Identificación → Fecha → Nombre → Apellidos → Nivel → Guardar | Revisión asistida 2 · CP-U09 |
| 2.4.6 | Encabezados y etiquetas | Cumple | axe |
| 2.4.7 | Foco visible | Cumple en el campo de correo | CP-S17 |
| 2.5.8 | Tamaño del objetivo (mínimo) | Cumple | axe (`target-size`) |
| 3.1.1 | Idioma de la página | Cumple (`lang="es"`) | axe · revisión asistida |
| 3.3.1 | Identificación de errores | Cumple: alerta con `role="alert"` y mensaje por campo | Revisión asistida · CP-S03, CP-S13 |
| 3.3.2 | Etiquetas o instrucciones | Cumple | axe |
| 4.1.2 | Nombre, función, valor | Cumple | axe |
| 4.1.3 | Mensajes de estado | Cumple: confirmaciones con `role="status"`, errores con `role="alert"` | Revisión de código · CP-S11 |

## 4. Hallazgos y acciones

No se registraron defectos de accesibilidad. Las mejoras detectadas se resolvieron así:

| ID | Observación | Criterio | Estado |
|---|---|---|---|
| A11Y-01 | El título de la pestaña era el mismo en todas las pantallas | 2.4.2 | **Resuelto** (commit `61c4593`, `usePageTitle`) |
| A11Y-02 | Al abrir el formulario de estudiante con el teclado, el foco no se movía al formulario | 2.4.3 (mejora) | **Resuelto** (commit `61c4593`; CP-U09 lo verifica) |
| A11Y-03 | Falta una prueba con lector de pantalla (NVDA) y con zoom del 200 % | Varios | Pendiente: sesión manual en el Sprint 7, con la evaluación de uso (O5) |

Evidencia de la revisión asistida tras las mejoras: `evidencias/accesibilidad/EV_A11Y-revision-asistida-2_20261105.txt`.
