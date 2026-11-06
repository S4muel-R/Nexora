# Backlog de Jira exportado — Nexora

| Campo | Valor |
|---|---|
| Referencia | Anexo de correcciones del avance 1, secciones 1 y 9 ("exportación del backlog vigente") |
| Fuente | Jira Cloud, proyecto ADLCDS, tablero 2: https://proyectosulacit.atlassian.net/jira/software/projects/ADLCDS/boards/2 |
| Fecha de corte | 2026-11-05 |
| Método | Consulta JQL `project = ADLCDS ORDER BY key ASC` mediante la API de Jira, con los cambios de estado registrados después de la consulta; archivo CSV: [Backlog-Jira.csv](Backlog-Jira.csv) |
| Elementos | 122 (101 tareas, 12 historias, 9 defectos) |

> El estado es el del tablero a la fecha de corte. *Listo* exige el PR integrado en `main` (Estándares, sección 6);
> por eso ninguna tarea está en *Listo* aunque su entregable esté en GitHub: los PR #1 – #11 esperan la revisión de
> otro integrante. Las fechas de los sprints son las cargadas en Jira (CC-01 pendiente).

## 1. Resumen por sprint y estado

| Sprint | Por hacer | En curso | Listo | Total |
|---|---|---|---|---|
| Sprint 1 Inicio y Necesidades | 5 | 7 | 0 | 12 |
| Sprint 2 Líneas base y diseño | 2 | 6 | 0 | 8 |
| Sprint 3 Accesos e institucion | 3 | 12 | 0 | 15 |
| Sprint 4 Registros y grupos | 12 | 4 | 0 | 16 |
| Sprint 5 Asistencia y Correcci | 13 | 0 | 0 | 13 |
| Sprint 6 Reportes de interfaz | 13 | 0 | 0 | 13 |
| Sprint 7 arranque de pruebas | 13 | 1 | 0 | 14 |
| Sprint 8 Validación de uso | 10 | 0 | 0 | 10 |
| Sin sprint | 5 | 16 | 0 | 21 |
| **Total** | **76** | **46** | **0** | **122** |

## 2. Elementos

| Clave | Tipo | Resumen | Estado | Responsable | Prioridad | Sprint |
|---|---|---|---|---|---|---|
| [ADLCDS-1](https://proyectosulacit.atlassian.net/browse/ADLCDS-1) | Tarea | S1-01 - Redactar Acta Constitutiva | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 1 Inicio y Necesidades |
| [ADLCDS-3](https://proyectosulacit.atlassian.net/browse/ADLCDS-3) | Tarea | S1-02 - Registro de interesados y representantes | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 1 Inicio y Necesidades |
| [ADLCDS-4](https://proyectosulacit.atlassian.net/browse/ADLCDS-4) | Tarea | S1-03- Registro inicial de riesgos y plan de comunicación preliminar | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 1 Inicio y Necesidades |
| [ADLCDS-5](https://proyectosulacit.atlassian.net/browse/ADLCDS-5) | Tarea | S1-04 Informe de necesidades y selección de propuesta | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 1 Inicio y Necesidades |
| [ADLCDS-6](https://proyectosulacit.atlassian.net/browse/ADLCDS-6) | Tarea | S1-05- Participar en 4 sesiones de consulta (lado técnico) y tomar notas | Por hacer | Luis Lobo Zeledon | Media | Sprint 1 Inicio y Necesidades |
| [ADLCDS-7](https://proyectosulacit.atlassian.net/browse/ADLCDS-7) | Tarea | S1-06- Borrar de RF01-RF08 con criterios de aceptación | En curso | Luis Lobo Zeledon | Media | Sprint 1 Inicio y Necesidades |
| [ADLCDS-8](https://proyectosulacit.atlassian.net/browse/ADLCDS-8) | Tarea | S1-07- Estudio técnico sobre aislamiento por institución Django/DRF | En curso | Luis Lobo Zeledon | Media | Sprint 1 Inicio y Necesidades |
| [ADLCDS-9](https://proyectosulacit.atlassian.net/browse/ADLCDS-9) | Tarea | S1-08- Crear repositorio GitHub y GitHub Project (backlog) | En curso | Luis Lobo Zeledon | Media | Sprint 1 Inicio y Necesidades |
| [ADLCDS-10](https://proyectosulacit.atlassian.net/browse/ADLCDS-10) | Tarea | S1-09- Participar en 4 sesiones de consulta (lado interfaz) y tomar notas | En curso | Samuel Ramirez Perez | Media | Sprint 1 Inicio y Necesidades |
| [ADLCDS-11](https://proyectosulacit.atlassian.net/browse/ADLCDS-11) | Tarea | S1-10 - Guin consulta para administración de docentes | En curso | Samuel Ramirez Perez | Media | Sprint 1 Inicio y Necesidades |
| [ADLCDS-12](https://proyectosulacit.atlassian.net/browse/ADLCDS-12) | Tarea | S1-11 - Perfiles de usuario y recorrido organizar-registrar-consultar | En curso | Samuel Ramirez Perez | Media | Sprint 1 Inicio y Necesidades |
| [ADLCDS-13](https://proyectosulacit.atlassian.net/browse/ADLCDS-13) | Tarea | S1-12 - Crear repositorio documental en OneDrive y dar acceso al docente | En curso | Samuel Ramirez Perez | Media | Sprint 1 Inicio y Necesidades |
| [ADLCDS-14](https://proyectosulacit.atlassian.net/browse/ADLCDS-14) | Tarea | S2-01 Refinar requisitos | En curso | Wilberth Rodriguez Bejarano | Media | Sprint 2 Líneas base y diseño |
| [ADLCDS-15](https://proyectosulacit.atlassian.net/browse/ADLCDS-15) | Tarea | S2-02 Plan de alcance, cronograma y presupuesto | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 2 Líneas base y diseño |
| [ADLCDS-16](https://proyectosulacit.atlassian.net/browse/ADLCDS-16) | Tarea | S2-03 Matrices RACI, comunicaciones y riesgos | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 2 Líneas base y diseño |
| [ADLCDS-17](https://proyectosulacit.atlassian.net/browse/ADLCDS-17) | Tarea | S2-04 Plan de pruebas e instituciones ficticias | En curso | Luis Lobo Zeledon | Media | Sprint 2 Líneas base y diseño |
| [ADLCDS-18](https://proyectosulacit.atlassian.net/browse/ADLCDS-18) | Tarea | S2-05 Arquitectura, datos y API | En curso | Luis Lobo Zeledon | Media | Sprint 2 Líneas base y diseño |
| [ADLCDS-19](https://proyectosulacit.atlassian.net/browse/ADLCDS-19) | Tarea | S2-06 Django, PostgreSQL y Docker | En curso | Samuel Ramirez Perez | Media | Sprint 2 Líneas base y diseño |
| [ADLCDS-20](https://proyectosulacit.atlassian.net/browse/ADLCDS-20) | Tarea | S2-07 Prototipo de 6 pantallas | En curso | Samuel Ramirez Perez | Media | Sprint 2 Líneas base y diseño |
| [ADLCDS-21](https://proyectosulacit.atlassian.net/browse/ADLCDS-21) | Tarea | S2-08 React y TypeScript | En curso | Samuel Ramirez Perez | Media | Sprint 2 Líneas base y diseño |
| [ADLCDS-22](https://proyectosulacit.atlassian.net/browse/ADLCDS-22) | Tarea | S3-01- Planificar sprint y refinar HU04-HU08 | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 3 Accesos e institucion |
| [ADLCDS-23](https://proyectosulacit.atlassian.net/browse/ADLCDS-23) | Tarea | S3-02- Informe de avance y riesgos | En curso | Wilberth Rodriguez Bejarano | Media | Sprint 3 Accesos e institucion |
| [ADLCDS-24](https://proyectosulacit.atlassian.net/browse/ADLCDS-24) | Tarea | S3-03- Casos prueba CA01-CA06 | En curso | Wilberth Rodriguez Bejarano | Media | Sprint 3 Accesos e institucion |
| [ADLCDS-25](https://proyectosulacit.atlassian.net/browse/ADLCDS-25) | Tarea | S3-04- Configurar GitHub Actions | En curso | Wilberth Rodriguez Bejarano | Media | Sprint 3 Accesos e institucion |
| [ADLCDS-26](https://proyectosulacit.atlassian.net/browse/ADLCDS-26) | Tarea | S3-05- Crear datos ficticios | En curso | Wilberth Rodriguez Bejarano | Media | Sprint 3 Accesos e institucion |
| [ADLCDS-27](https://proyectosulacit.atlassian.net/browse/ADLCDS-27) | Tarea | S3-06- Refinar reglas de datos HU04-HU08 | En curso | Luis Lobo Zeledon | Media | Sprint 3 Accesos e institucion |
| [ADLCDS-28](https://proyectosulacit.atlassian.net/browse/ADLCDS-28) | Tarea | S3-07- Autenticación y cierre de sesión | En curso | Luis Lobo Zeledon | Media | Sprint 3 Accesos e institucion |
| [ADLCDS-29](https://proyectosulacit.atlassian.net/browse/ADLCDS-29) | Tarea | S3-08- Usuarios y permisos | En curso | Luis Lobo Zeledon | Media | Sprint 3 Accesos e institucion |
| [ADLCDS-30](https://proyectosulacit.atlassian.net/browse/ADLCDS-30) | Tarea | S3-09- API de instituciones y niveles | En curso | Luis Lobo Zeledon | Media | Sprint 3 Accesos e institucion |
| [ADLCDS-31](https://proyectosulacit.atlassian.net/browse/ADLCDS-31) | Tarea | S3-10- Pruebas de permisos y aislamiento | En curso | Luis Lobo Zeledon | Media | Sprint 3 Accesos e institucion |
| [ADLCDS-32](https://proyectosulacit.atlassian.net/browse/ADLCDS-32) | Tarea | S3-11- Refinar pantallas de asistencia | Por hacer | Samuel Ramirez Perez | Media | Sprint 3 Accesos e institucion |
| [ADLCDS-33](https://proyectosulacit.atlassian.net/browse/ADLCDS-33) | Tarea | S3-12- Pantalla de inicio de sesión | En curso | Samuel Ramirez Perez | Media | Sprint 3 Accesos e institucion |
| [ADLCDS-34](https://proyectosulacit.atlassian.net/browse/ADLCDS-34) | Tarea | S3-13- Pantallas de instituciones y administradores | Por hacer | Samuel Ramirez Perez | Media | Sprint 3 Accesos e institucion |
| [ADLCDS-35](https://proyectosulacit.atlassian.net/browse/ADLCDS-35) | Tarea | S3-14- Pantalla de datos institucionales | En curso | Samuel Ramirez Perez | Media | Sprint 3 Accesos e institucion |
| [ADLCDS-36](https://proyectosulacit.atlassian.net/browse/ADLCDS-36) | Tarea | S3-15- Integración con API y errores | En curso | Samuel Ramirez Perez | Media | Sprint 3 Accesos e institucion |
| [ADLCDS-37](https://proyectosulacit.atlassian.net/browse/ADLCDS-37) | Tarea | S4-01 Refinar HU09-HU10 | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 4 Registros y grupos |
| [ADLCDS-38](https://proyectosulacit.atlassian.net/browse/ADLCDS-38) | Tarea | S4-02- Informe de avance y retrospectiva | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 4 Registros y grupos |
| [ADLCDS-39](https://proyectosulacit.atlassian.net/browse/ADLCDS-39) | Tarea | S4-03- Casos de pruebas CA07-CA16 | En curso | Wilberth Rodriguez Bejarano | Media | Sprint 4 Registros y grupos |
| [ADLCDS-40](https://proyectosulacit.atlassian.net/browse/ADLCDS-40) | Tarea | S4-04- Datos ficticios de instituciones | En curso | Wilberth Rodriguez Bejarano | Media | Sprint 4 Registros y grupos |
| [ADLCDS-41](https://proyectosulacit.atlassian.net/browse/ADLCDS-41) | Tarea | S4-05- Configurar Playwright | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 4 Registros y grupos |
| [ADLCDS-42](https://proyectosulacit.atlassian.net/browse/ADLCDS-42) | Tarea | S4-06- Refinar reglas de asistencia | Por hacer | Luis Lobo Zeledon | Media | Sprint 4 Registros y grupos |
| [ADLCDS-43](https://proyectosulacit.atlassian.net/browse/ADLCDS-43) | Tarea | S4-07- API de estudiantes | Por hacer | Luis Lobo Zeledon | Media | Sprint 4 Registros y grupos |
| [ADLCDS-44](https://proyectosulacit.atlassian.net/browse/ADLCDS-44) | Tarea | S4-08- API de docentes | Por hacer | Luis Lobo Zeledon | Media | Sprint 4 Registros y grupos |
| [ADLCDS-45](https://proyectosulacit.atlassian.net/browse/ADLCDS-45) | Tarea | S4-09- API de grupos | Por hacer | Luis Lobo Zeledon | Media | Sprint 4 Registros y grupos |
| [ADLCDS-46](https://proyectosulacit.atlassian.net/browse/ADLCDS-46) | Tarea | S4-10- API de asignaciones | Por hacer | Luis Lobo Zeledon | Media | Sprint 4 Registros y grupos |
| [ADLCDS-47](https://proyectosulacit.atlassian.net/browse/ADLCDS-47) | Tarea | S4-11- Pruebas con pytest | En curso | Samuel Ramirez Perez | Media | Sprint 4 Registros y grupos |
| [ADLCDS-48](https://proyectosulacit.atlassian.net/browse/ADLCDS-48) | Tarea | S4-12- Ajustar pantallas de asistencia | Por hacer | Samuel Ramirez Perez | Media | Sprint 4 Registros y grupos |
| [ADLCDS-49](https://proyectosulacit.atlassian.net/browse/ADLCDS-49) | Tarea | S4-13- Pantalla de estudiantes | En curso | Samuel Ramirez Perez | Media | Sprint 4 Registros y grupos |
| [ADLCDS-50](https://proyectosulacit.atlassian.net/browse/ADLCDS-50) | Tarea | S4-14- Pantallas de docentes | Por hacer | Samuel Ramirez Perez | Media | Sprint 4 Registros y grupos |
| [ADLCDS-51](https://proyectosulacit.atlassian.net/browse/ADLCDS-51) | Tarea | S4-15- Pantallas de grupos y asignaciones | Por hacer | Samuel Ramirez Perez | Media | Sprint 4 Registros y grupos |
| [ADLCDS-52](https://proyectosulacit.atlassian.net/browse/ADLCDS-52) | Tarea | S4-16- Integración y validación | Por hacer | Samuel Ramirez Perez | Media | Sprint 4 Registros y grupos |
| [ADLCDS-53](https://proyectosulacit.atlassian.net/browse/ADLCDS-53) | Tarea | S5-01- Refinar HU11-HU12 | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 5 Asistencia y Correcci |
| [ADLCDS-54](https://proyectosulacit.atlassian.net/browse/ADLCDS-54) | Tarea | S5-02- Informe de avance y retrospectiva | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 5 Asistencia y Correcci |
| [ADLCDS-55](https://proyectosulacit.atlassian.net/browse/ADLCDS-55) | Tarea | S5-03- Casos de prueba CA17-CA20 | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 5 Asistencia y Correcci |
| [ADLCDS-56](https://proyectosulacit.atlassian.net/browse/ADLCDS-56) | Tarea | S5-04- Ampliar datos ficticios | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 5 Asistencia y Correcci |
| [ADLCDS-57](https://proyectosulacit.atlassian.net/browse/ADLCDS-57) | Tarea | S5-05- Refinar criterios de reportes | Por hacer | Luis Lobo Zeledon | Media | Sprint 5 Asistencia y Correcci |
| [ADLCDS-58](https://proyectosulacit.atlassian.net/browse/ADLCDS-58) | Tarea | S5-06 Modelo de asistencia | Por hacer | Luis Lobo Zeledon | Media | Sprint 5 Asistencia y Correcci |
| [ADLCDS-59](https://proyectosulacit.atlassian.net/browse/ADLCDS-59) | Tarea | S5-07- API de asistencia | Por hacer | Luis Lobo Zeledon | Media | Sprint 5 Asistencia y Correcci |
| [ADLCDS-60](https://proyectosulacit.atlassian.net/browse/ADLCDS-60) | Tarea | S5-08- API de correcciones | Por hacer | Luis Lobo Zeledon | Media | Sprint 5 Asistencia y Correcci |
| [ADLCDS-61](https://proyectosulacit.atlassian.net/browse/ADLCDS-61) | Tarea | S5-09- Pruebas con pytest | Por hacer | Samuel Ramirez Perez | Media | Sprint 5 Asistencia y Correcci |
| [ADLCDS-62](https://proyectosulacit.atlassian.net/browse/ADLCDS-62) | Tarea | S5-10- Ajustar prototipo de reportes | Por hacer | Samuel Ramirez Perez | Media | Sprint 5 Asistencia y Correcci |
| [ADLCDS-63](https://proyectosulacit.atlassian.net/browse/ADLCDS-63) | Tarea | S5-11- Pantalla de asistencia | Por hacer | Samuel Ramirez Perez | Media | Sprint 5 Asistencia y Correcci |
| [ADLCDS-64](https://proyectosulacit.atlassian.net/browse/ADLCDS-64) | Tarea | S5-12- Pantalla de Correcciones | Por hacer | Samuel Ramirez Perez | Media | Sprint 5 Asistencia y Correcci |
| [ADLCDS-65](https://proyectosulacit.atlassian.net/browse/ADLCDS-65) | Tarea | S5-13- Integración y errores | Por hacer | Samuel Ramirez Perez | Media | Sprint 5 Asistencia y Correcci |
| [ADLCDS-66](https://proyectosulacit.atlassian.net/browse/ADLCDS-66) | Tarea | S6-01- Pruebas de regresión | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 6 Reportes de interfaz |
| [ADLCDS-67](https://proyectosulacit.atlassian.net/browse/ADLCDS-67) | Tarea | S6-02- Informe y retrospectiva | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 6 Reportes de interfaz |
| [ADLCDS-68](https://proyectosulacit.atlassian.net/browse/ADLCDS-68) | Tarea | S6-03- Casos CA21-CA24 | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 6 Reportes de interfaz |
| [ADLCDS-69](https://proyectosulacit.atlassian.net/browse/ADLCDS-69) | Tarea | S6-04- Automatizar pruebas | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 6 Reportes de interfaz |
| [ADLCDS-70](https://proyectosulacit.atlassian.net/browse/ADLCDS-70) | Tarea | S6-05 Ajustar API | Por hacer | Luis Lobo Zeledon | Media | Sprint 6 Reportes de interfaz |
| [ADLCDS-71](https://proyectosulacit.atlassian.net/browse/ADLCDS-71) | Tarea | S6-06- API de listados | Por hacer | Luis Lobo Zeledon | Media | Sprint 6 Reportes de interfaz |
| [ADLCDS-72](https://proyectosulacit.atlassian.net/browse/ADLCDS-72) | Tarea | S6-07- API de asistencia | Por hacer | Luis Lobo Zeledon | Media | Sprint 6 Reportes de interfaz |
| [ADLCDS-73](https://proyectosulacit.atlassian.net/browse/ADLCDS-73) | Tarea | S6-08- Optimizar consultas | Por hacer | Luis Lobo Zeledon | Media | Sprint 6 Reportes de interfaz |
| [ADLCDS-74](https://proyectosulacit.atlassian.net/browse/ADLCDS-74) | Tarea | S6-09- Pruebas pytest | Por hacer | Luis Lobo Zeledon | Media | Sprint 6 Reportes de interfaz |
| [ADLCDS-75](https://proyectosulacit.atlassian.net/browse/ADLCDS-75) | Tarea | S6-10- Ajustar diseños | Por hacer | Samuel Ramirez Perez | Media | Sprint 6 Reportes de interfaz |
| [ADLCDS-76](https://proyectosulacit.atlassian.net/browse/ADLCDS-76) | Tarea | S6-11- Pantallas de reportes | Por hacer | Samuel Ramirez Perez | Media | Sprint 6 Reportes de interfaz |
| [ADLCDS-77](https://proyectosulacit.atlassian.net/browse/ADLCDS-77) | Tarea | S6-12- Filtros y errores | Por hacer | Samuel Ramirez Perez | Media | Sprint 6 Reportes de interfaz |
| [ADLCDS-78](https://proyectosulacit.atlassian.net/browse/ADLCDS-78) | Tarea | S6-13- Revisión de asistencia | Por hacer | Samuel Ramirez Perez | Media | Sprint 6 Reportes de interfaz |
| [ADLCDS-79](https://proyectosulacit.atlassian.net/browse/ADLCDS-79) | Tarea | S7-01- Criterios de Prueba | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 7 arranque de pruebas |
| [ADLCDS-80](https://proyectosulacit.atlassian.net/browse/ADLCDS-80) | Tarea | S7-02- Informe y demo | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 7 arranque de pruebas |
| [ADLCDS-81](https://proyectosulacit.atlassian.net/browse/ADLCDS-81) | Tarea | S7-03- Pruebas CA01-CA24 | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 7 arranque de pruebas |
| [ADLCDS-82](https://proyectosulacit.atlassian.net/browse/ADLCDS-82) | Tarea | S7-04- Revisar Código | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 7 arranque de pruebas |
| [ADLCDS-83](https://proyectosulacit.atlassian.net/browse/ADLCDS-83) | Tarea | S7-05- Ajustar API | Por hacer | Luis Lobo Zeledon | Media | Sprint 7 arranque de pruebas |
| [ADLCDS-84](https://proyectosulacit.atlassian.net/browse/ADLCDS-84) | Tarea | S7-06- Integrar módulos | Por hacer | Luis Lobo Zeledon | Media | Sprint 7 arranque de pruebas |
| [ADLCDS-85](https://proyectosulacit.atlassian.net/browse/ADLCDS-85) | Tarea | S7-07- Docker y respaldos | Por hacer | Luis Lobo Zeledon | Media | Sprint 7 arranque de pruebas |
| [ADLCDS-86](https://proyectosulacit.atlassian.net/browse/ADLCDS-86) | Tarea | S7-08- Versión integrada | Por hacer | Luis Lobo Zeledon | Media | Sprint 7 arranque de pruebas |
| [ADLCDS-87](https://proyectosulacit.atlassian.net/browse/ADLCDS-87) | Tarea | S7-09- Pruebas de aislamiento | Por hacer | Luis Lobo Zeledon | Media | Sprint 7 arranque de pruebas |
| [ADLCDS-88](https://proyectosulacit.atlassian.net/browse/ADLCDS-88) | Tarea | S7-10- A justar interfaz | Por hacer | Samuel Ramirez Perez | Media | Sprint 7 arranque de pruebas |
| [ADLCDS-89](https://proyectosulacit.atlassian.net/browse/ADLCDS-89) | Tarea | S7-11- Integrar pantallas | Por hacer | Samuel Ramirez Perez | Media | Sprint 7 arranque de pruebas |
| [ADLCDS-90](https://proyectosulacit.atlassian.net/browse/ADLCDS-90) | Tarea | S7-12- Corregir errores | Por hacer | Samuel Ramirez Perez | Media | Sprint 7 arranque de pruebas |
| [ADLCDS-91](https://proyectosulacit.atlassian.net/browse/ADLCDS-91) | Tarea | S7-13- Demo Funcional | Por hacer | Samuel Ramirez Perez | Media | Sprint 7 arranque de pruebas |
| [ADLCDS-92](https://proyectosulacit.atlassian.net/browse/ADLCDS-92) | Tarea | S7-14- Accesibilidad | En curso | Samuel Ramirez Perez | Media | Sprint 7 arranque de pruebas |
| [ADLCDS-93](https://proyectosulacit.atlassian.net/browse/ADLCDS-93) | Tarea | S8-01- Refinar correcciones | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 8 Validación de uso |
| [ADLCDS-94](https://proyectosulacit.atlassian.net/browse/ADLCDS-94) | Tarea | S8-02- Informe y retrospectiva | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 8 Validación de uso |
| [ADLCDS-95](https://proyectosulacit.atlassian.net/browse/ADLCDS-95) | Tarea | S8-03- Ejecutar 24 pruebas | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 8 Validación de uso |
| [ADLCDS-96](https://proyectosulacit.atlassian.net/browse/ADLCDS-96) | Tarea | S8-04- Corregir automatización | Por hacer | Wilberth Rodriguez Bejarano | Media | Sprint 8 Validación de uso |
| [ADLCDS-97](https://proyectosulacit.atlassian.net/browse/ADLCDS-97) | Tarea | S8-05- Refinar API | Por hacer | Luis Lobo Zeledon | Media | Sprint 8 Validación de uso |
| [ADLCDS-98](https://proyectosulacit.atlassian.net/browse/ADLCDS-98) | Tarea | S8-06- Corregir errores del servidor | Por hacer | Luis Lobo Zeledon | Media | Sprint 8 Validación de uso |
| [ADLCDS-99](https://proyectosulacit.atlassian.net/browse/ADLCDS-99) | Tarea | S8-07- Pruebas de rendimiento | Por hacer | Luis Lobo Zeledon | Media | Sprint 8 Validación de uso |
| [ADLCDS-100](https://proyectosulacit.atlassian.net/browse/ADLCDS-100) | Tarea | S8-08- Ajustar diseño | Por hacer | Samuel Ramirez Perez | Media | Sprint 8 Validación de uso |
| [ADLCDS-101](https://proyectosulacit.atlassian.net/browse/ADLCDS-101) | Tarea | S8-09- Corregir interfaz | Por hacer | Samuel Ramirez Perez | Media | Sprint 8 Validación de uso |
| [ADLCDS-102](https://proyectosulacit.atlassian.net/browse/ADLCDS-102) | Tarea | S8-10 Evaluar experiencia de uso | Por hacer | Samuel Ramirez Perez | Media | Sprint 8 Validación de uso |
| [ADLCDS-103](https://proyectosulacit.atlassian.net/browse/ADLCDS-103) | Defecto | INC-001 Estudiante registrado queda inactivo cuando los datos se envían como formulario | En curso | Samuel Ramirez Perez | Alta | Sin sprint |
| [ADLCDS-104](https://proyectosulacit.atlassian.net/browse/ADLCDS-104) | Defecto | INC-002 Mensaje técnico al dejar vacía la fecha de nacimiento del estudiante | En curso | Samuel Ramirez Perez | Media | Sin sprint |
| [ADLCDS-105](https://proyectosulacit.atlassian.net/browse/ADLCDS-105) | Historia | HU01 Iniciar sesión | En curso | Sin asignar | Alta | Sin sprint |
| [ADLCDS-106](https://proyectosulacit.atlassian.net/browse/ADLCDS-106) | Historia | HU02 Cerrar sesión | En curso | Sin asignar | Alta | Sin sprint |
| [ADLCDS-107](https://proyectosulacit.atlassian.net/browse/ADLCDS-107) | Historia | HU03 Ver solo las opciones de mi rol | En curso | Sin asignar | Alta | Sin sprint |
| [ADLCDS-108](https://proyectosulacit.atlassian.net/browse/ADLCDS-108) | Historia | HU04 Registrar una institución y su administrador | En curso | Sin asignar | Alta | Sin sprint |
| [ADLCDS-109](https://proyectosulacit.atlassian.net/browse/ADLCDS-109) | Historia | HU05 Actualizar los datos de mi institución | En curso | Sin asignar | Alta | Sin sprint |
| [ADLCDS-110](https://proyectosulacit.atlassian.net/browse/ADLCDS-110) | Historia | HU06 Impedir el acceso a datos de otra institución | En curso | Sin asignar | Máxima | Sin sprint |
| [ADLCDS-111](https://proyectosulacit.atlassian.net/browse/ADLCDS-111) | Historia | HU07 Gestionar estudiantes sin duplicados | En curso | Sin asignar | Alta | Sin sprint |
| [ADLCDS-112](https://proyectosulacit.atlassian.net/browse/ADLCDS-112) | Historia | HU08 Gestionar docentes y sus cuentas | Por hacer | Sin asignar | Media | Sin sprint |
| [ADLCDS-113](https://proyectosulacit.atlassian.net/browse/ADLCDS-113) | Historia | HU09 Crear grupos y asignar estudiantes y docentes | Por hacer | Sin asignar | Media | Sin sprint |
| [ADLCDS-114](https://proyectosulacit.atlassian.net/browse/ADLCDS-114) | Historia | HU10 Registrar y corregir la asistencia de mi grupo | Por hacer | Sin asignar | Media | Sin sprint |
| [ADLCDS-115](https://proyectosulacit.atlassian.net/browse/ADLCDS-115) | Historia | HU11 Consultar listados de estudiantes y grupos | Por hacer | Sin asignar | Media | Sin sprint |
| [ADLCDS-116](https://proyectosulacit.atlassian.net/browse/ADLCDS-116) | Historia | HU12 Consultar el resumen de asistencia | Por hacer | Sin asignar | Media | Sin sprint |
| [ADLCDS-117](https://proyectosulacit.atlassian.net/browse/ADLCDS-117) | Defecto | INC-007 Una sesión anterior inválida impide o cierra el nuevo inicio de sesión | En curso | Samuel Ramirez Perez | Alta | Sin sprint |
| [ADLCDS-118](https://proyectosulacit.atlassian.net/browse/ADLCDS-118) | Defecto | INC-003 Sin configuración HTTPS para un ambiente publicado | En curso | Samuel Ramirez Perez | Media | Sin sprint |
| [ADLCDS-119](https://proyectosulacit.atlassian.net/browse/ADLCDS-119) | Defecto | INC-004 El nivel no se preselecciona si el formulario de estudiante se abre antes de cargar los niveles | En curso | Samuel Ramirez Perez | Alta | Sin sprint |
| [ADLCDS-120](https://proyectosulacit.atlassian.net/browse/ADLCDS-120) | Defecto | INC-005 Dependencias de desarrollo del frontend con avisos de seguridad críticos | En curso | Samuel Ramirez Perez | Media | Sin sprint |
| [ADLCDS-121](https://proyectosulacit.atlassian.net/browse/ADLCDS-121) | Defecto | INC-006 La sesión usa un token en localStorage en lugar de cookie HttpOnly con CSRF (desviación del avance 1) | En curso | Luis Lobo Zeledon | Alta | Sin sprint |
| [ADLCDS-122](https://proyectosulacit.atlassian.net/browse/ADLCDS-122) | Defecto | INC-009 Cerrar sesión y recargar enseguida restaura la sesión (el token no se borra hasta que responde el servidor) | En curso | Samuel Ramirez Perez | Alta | Sin sprint |
| [ADLCDS-123](https://proyectosulacit.atlassian.net/browse/ADLCDS-123) | Defecto | INC-008 Una carga repetida de Mi institución sobrescribe lo que se está escribiendo | En curso | Samuel Ramirez Perez | Media | Sin sprint |
