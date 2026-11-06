# Documentación del proyecto Nexora

Fuentes en Markdown de los documentos del proyecto. Las versiones oficiales en Word/PDF se publican en el repositorio
documental de OneDrive (ver S1-12), que usa la misma estructura de carpetas.

| Carpeta | Contenido |
|---|---|
| `01-Planificacion` | Planificación del proyecto y gestión documental |
| `02-Requisitos` | Levantamiento de necesidades con usuarios |
| `03-Diseno` | Perfiles de usuario, recorridos y diseño de interfaz |
| `04-Desarrollo` | Documentación técnica |
| `05-Pruebas` | Plan y resultados de pruebas |
| `06-Entregables` | Versiones finales (`.docx` / `.pdf`) entregadas al docente |

## Segundo entregable

Empezar por la [respuesta al anexo de correcciones del avance 1](01-Planificacion/Respuesta-anexo-avance-1.md): indica
dónde quedó atendido cada punto de la corrección.

| Criterio (sección 22) | Documento |
|---|---|
| Correcciones del avance 1 | [Respuesta al anexo de correcciones](01-Planificacion/Respuesta-anexo-avance-1.md) |
| Plan de trabajo | [Plan del segundo entregable](01-Planificacion/Plan-segundo-avance.md) |
| Ejecución del proyecto | [Informe de ejecución de los sprints](01-Planificacion/Informe-ejecucion-sprints.md) |
| Estándares | [Estándares del proyecto](01-Planificacion/Estandares.md) |
| Backlog y requisitos | [Catálogo de requisitos y Product Backlog](02-Requisitos/Catalogo-de-requisitos.md) · [Backlog de Jira exportado](01-Planificacion/Backlog-Jira.md) ([CSV](01-Planificacion/Backlog-Jira.csv)) |
| Verificación de requisitos | [Verificación de requisitos](02-Requisitos/Verificacion-de-requisitos.md) |
| Refinamiento | [Registro de refinamiento](02-Requisitos/Registro-de-refinamiento.md) |
| Diseño | [Arquitectura, datos y API](03-Diseno/Arquitectura-datos-API.md) |
| Pruebas (ISO/IEC/IEEE 29119-3) | [Plan de pruebas](05-Pruebas/Plan-de-pruebas.md) · [Especificación de casos](05-Pruebas/Especificacion-de-casos.md) · [Registro de ejecución](05-Pruebas/Registro-de-ejecucion.md) · [Informe de estado](05-Pruebas/Informe-de-estado.md) |
| Seguridad y accesibilidad | [Revisión de seguridad](05-Pruebas/Revision-seguridad.md) (OWASP ASVS) · [Revisión de accesibilidad](05-Pruebas/Revision-accesibilidad.md) (WCAG 2.2 AA) |
| Defectos | [Informes de incidente](05-Pruebas/Informes-de-incidente.md) · Jira ADLCDS-103, 104 y 117 – 123 |
| Evidencias | [`05-Pruebas/evidencias/`](05-Pruebas/evidencias): salidas de pruebas, capturas de fallas y reprueba, `ci/` (GitHub Actions), `e2e/` (Playwright), `seguridad/`, `accesibilidad/` |
| Integración continua | [Pull requests #1 – #11](https://github.com/S4muel-R/Nexora/pulls) · [GitHub Actions](https://github.com/S4muel-R/Nexora/actions) |
| Métricas | [Métricas](01-Planificacion/Metricas.md) |
| Gestión de cambios | [Gestión de cambios](01-Planificacion/Gestion-de-cambios.md) |
| Trazabilidad | [Matriz de trazabilidad](02-Requisitos/Matriz-de-trazabilidad.md) |
| Causa raíz | [Análisis de causa raíz](05-Pruebas/Analisis-causa-raiz.md) |

## Sprint 1

| Código | EDT | Documento | Estado |
|---|---|---|---|
| S1-12 | 1.1.3.1 | [Repositorio documental en OneDrive](01-Planificacion/S1-12_Repositorio-OneDrive.md) | Documentado; pendiente crear y compartir la carpeta en OneDrive |
| S1-10 | 1.2.1.1 | [Guion de consulta](02-Requisitos/S1-10_Guion-de-consulta.md) | v1.0 listo para las sesiones |
| S1-09 | 1.2.1.1 | [Actas de las sesiones de consulta](02-Requisitos/S1-09_Sesiones-de-consulta/) | Plantillas listas; pendiente realizar las 4 sesiones |
| S1-11 | 1.2.2.1 | [Perfiles de usuario y recorrido organizar–registrar–consultar](03-Diseno/S1-11_Perfiles-y-recorrido.md) | Borrador v0.1; se valida con S1-09 |

Las versiones `.docx` de estos documentos (y de la plantilla de acta) están en `06-Entregables/Sprint-1/`, listas para
subir a OneDrive. Si se modifica un `.md`, hay que regenerar su `.docx`.
