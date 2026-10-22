# Perfiles de usuario y recorrido organizar–registrar–consultar — Nexora

| Campo | Valor |
|---|---|
| Código | S1-11 |
| EDT | 1.2.2.1 |
| Responsable | Samuel |
| Tiempo estimado | 6 horas |
| Versión | 0.1 (borrador) |
| Fecha | 2026-10-21 |
| Criterio de entrega | Documento con los perfiles de usuario y el recorrido organizar–registrar–consultar. |
| Fuentes | Propuesta preliminar de Nexora; guion de consulta S1-10 |

> **Estado:** borrador elaborado a partir de la propuesta preliminar. Los supuestos marcados con **[Validar]** se
> confirman o ajustan con los resultados de las sesiones de consulta (S1-09) antes de publicar la versión 1.0.

## 1. Resumen de perfiles

| Perfil | Uso | Responsabilidad principal en Nexora | Etapa del recorrido |
|---|---|---|---|
| Personal administrativo | Directo | Gestionar datos de la institución, estudiantes, docentes y grupos; consultar reportes | Organizar y consultar |
| Personal docente | Directo | Consultar sus grupos y registrar la asistencia | Registrar y consultar |
| Administración de la plataforma | Soporte | Configurar el acceso de cada institución | Previa al recorrido |
| Familias o personas encargadas | — | Fuera del alcance de la primera versión; se estudiará después | — |

## 2. Perfiles de usuario

### 2.1 Personal administrativo

| Aspecto | Descripción |
|---|---|
| Quiénes | Dirección, secretaría, coordinación académica u otras personas que gestionan la información general del centro. |
| Nivel educativo | Kínder, escuela o colegio. |
| Objetivo | Mantener actualizada y en un solo lugar la información de la institución para organizar el periodo lectivo y responder consultas. |
| Tareas frecuentes | Registrar los datos básicos del centro y su estructura de grupos o secciones; crear y actualizar registros de estudiantes y docentes; asignar estudiantes y docentes a grupos; consultar listados, distribución por grupos y resúmenes de asistencia. |
| Dificultades actuales | Registros en archivos o medios separados; datos repetidos; tiempo dedicado a comprobar cuál versión está actualizada. |
| Contexto de uso | Oficina, principalmente desde computadora; picos de trabajo al inicio del periodo lectivo **[Validar 1.3, 2.2]**. |
| Expectativas | Formularios simples, búsqueda rápida de estudiantes, listados filtrables y exportables **[Validar 3.5, 5.3, 5.4]**. |
| Permisos en Nexora | Crear, actualizar y consultar institución, grupos, estudiantes y docentes; consultar asistencia y reportes de toda la institución. |

### 2.2 Personal docente

| Aspecto | Descripción |
|---|---|
| Quiénes | Docentes a cargo de uno o varios grupos o secciones. |
| Nivel educativo | Kínder, escuela o colegio; en secundaria puede atender varios grupos por materia **[Validar 2.5]**. |
| Objetivo | Saber qué estudiantes tiene a cargo y registrar la asistencia de forma rápida durante la jornada. |
| Tareas frecuentes | Abrir su grupo; marcar presencia o ausencia por fecha; consultar la composición del grupo y la asistencia registrada. |
| Dificultades actuales | Poco tiempo entre lecciones; listas desactualizadas cuando hay ingresos o traslados **[Validar 2.3, 4.1]**. |
| Contexto de uso | Aula, posiblemente desde teléfono; conexión a internet variable **[Validar 4.5, 7.8]**. |
| Expectativas | Llegar a su grupo en uno o dos pasos y marcar la asistencia con pocos toques; poder corregir un error **[Validar 4.4, 7.3]**. |
| Permisos en Nexora | Consultar únicamente sus grupos y los datos esenciales de sus estudiantes; registrar y corregir la asistencia de sus grupos **[Validar plazo de corrección, 4.4]**. |

### 2.3 Administración de la plataforma

| Aspecto | Descripción |
|---|---|
| Quiénes | Equipo responsable de Nexora. |
| Objetivo | Habilitar cada institución y sus cuentas de acceso. |
| Tareas frecuentes | Registrar una institución; crear la primera cuenta administrativa; activar o desactivar el acceso. |
| Permisos en Nexora | Configurar instituciones y cuentas; no participa en la gestión diaria de datos escolares. |
| Pendiente | Definir si el alta de usuarios docentes la hace este perfil o el personal administrativo **[Validar 6.4]**. |

## 3. Matriz de acceso por perfil

C = crear · M = modificar · V = consultar · — = sin acceso

| Función | Administrativo | Docente | Administración de la plataforma |
|---|---|---|---|
| Acceso y cuentas de usuario | V **[Validar 6.4]** | — | C · M · V |
| Datos de la institución | C · M · V | — | V |
| Grupos o secciones | C · M · V | V (solo propios) | — |
| Estudiantes | C · M · V | V (solo de sus grupos) | — |
| Docentes | C · M · V | V (su propio registro) | — |
| Asignación a grupos | C · M · V | V (solo propios) | — |
| Asistencia | V **[Validar corrección, 4.4]** | C · M · V (solo propios) | — |
| Reportes básicos | V (toda la institución) | V (solo sus grupos) **[Validar 5.5]** | — |

## 4. Recorrido organizar–registrar–consultar

Basado en el ejemplo de uso de la propuesta: al inicio del periodo lectivo una persona autorizada registra los grupos y
asigna docentes y estudiantes; durante la jornada cada docente marca la asistencia; después la administración consulta
un resumen por sección o una lista actualizada.

```
 [0] Habilitar institución ──► [1] ORGANIZAR ──► [2] REGISTRAR ──► [3] CONSULTAR
  Admin. plataforma             Administrativo     Docente            Administrativo / Docente
                                (inicio de periodo)(cada jornada)     (cuando se necesita)
```

### 4.0 Preparación (una vez por institución)

| Paso | Actor | Acción | Pantalla | Resultado |
|---|---|---|---|---|
| P1 | Administración de la plataforma | Registra la institución y su nivel educativo | Instituciones | Institución activa |
| P2 | Administración de la plataforma | Crea la cuenta del personal administrativo | Usuarios | Personal administrativo puede ingresar |

### 4.1 Organizar (inicio del periodo lectivo)

| Paso | Actor | Acción | Pantalla | Datos | Resultado |
|---|---|---|---|---|---|
| O1 | Administrativo | Ingresa con su cuenta | Inicio de sesión → Panel administrativo | Usuario, contraseña | Ve solo las opciones de su función |
| O2 | Administrativo | Completa los datos básicos del centro y su estructura (niveles, grados, secciones) | Institución | Nombre, nivel, estructura de grupos | Estructura adaptada a kínder, escuela o colegio |
| O3 | Administrativo | Crea los grupos o secciones del periodo | Grupos | Nombre, nivel/grado, periodo | Grupos disponibles |
| O4 | Administrativo | Registra o actualiza estudiantes y docentes | Estudiantes / Docentes | Datos esenciales **[Validar 3.1, 3.2]** | Registros únicos, sin duplicar |
| O5 | Administrativo | Asigna docentes y estudiantes a cada grupo | Detalle de grupo | Grupo, docente(s), estudiantes | Cada grupo tiene su composición |
| O6 | Administrativo | Revisa la composición de los grupos | Detalle de grupo / Reporte de distribución | — | Organización confirmada |

**Excepciones:** traslado de un estudiante entre grupos, ingreso o retiro durante el año, cambio de docente
**[Validar 2.3]**.

### 4.2 Registrar (durante la jornada)

| Paso | Actor | Acción | Pantalla | Datos | Resultado |
|---|---|---|---|---|---|
| R1 | Docente | Ingresa con su cuenta | Inicio de sesión → Mis grupos | Usuario, contraseña | Ve únicamente sus grupos |
| R2 | Docente | Abre el grupo que atiende | Mis grupos → Grupo | — | Lista de estudiantes del grupo |
| R3 | Docente | Marca presencia o ausencia de cada estudiante para la fecha | Registro de asistencia | Fecha, grupo, estado por estudiante **[Validar estados 4.2; por día o lección 4.3]** | Asistencia en borrador |
| R4 | Docente | Guarda el registro | Registro de asistencia | — | Confirmación de guardado; asistencia disponible para consulta |
| R5 | Docente | Corrige un registro si se equivocó | Registro de asistencia | Estado corregido | Registro actualizado **[Validar quién y hasta cuándo, 4.4]** |

**Excepciones:** grupo sin estudiantes asignados, falta de conexión durante el registro **[Validar 4.5]**.

### 4.3 Consultar (cuando se necesita)

| Paso | Actor | Acción | Pantalla | Filtros | Resultado |
|---|---|---|---|---|---|
| C1 | Administrativo / Docente | Busca un estudiante | Estudiantes / Grupo | Nombre, identificación, grupo **[Validar 3.5]** | Datos esenciales del estudiante |
| C2 | Administrativo | Consulta el listado de estudiantes | Reportes → Listado de estudiantes | Nivel, grupo | Lista actualizada |
| C3 | Administrativo | Consulta la distribución por grupos | Reportes → Distribución por grupos | Nivel, periodo | Cantidad de estudiantes y docentes por grupo |
| C4 | Administrativo / Docente | Consulta el resumen de asistencia | Reportes → Resumen de asistencia | Fecha o rango, grupo | Presentes, ausentes y porcentaje por sección **[Validar formato 7.9]** |
| C5 | Administrativo | Exporta o imprime un reporte | Reportes | — | Archivo o impresión **[Validar 5.4]** |

## 5. Pantallas preliminares que se derivan del recorrido

| Pantalla | Perfil | Pasos |
|---|---|---|
| Inicio de sesión | Todos | O1, R1 |
| Panel administrativo | Administrativo | O1 |
| Institución | Administrativo | O2 |
| Grupos y detalle de grupo | Administrativo | O3, O5, O6 |
| Estudiantes | Administrativo (docente solo consulta) | O4, C1 |
| Docentes | Administrativo | O4 |
| Mis grupos | Docente | R1, R2 |
| Registro de asistencia | Docente | R3 – R5 |
| Reportes | Administrativo / Docente | C2 – C5 |
| Instituciones y usuarios | Administración de la plataforma | P1, P2 |

## 6. Supuestos por validar en las sesiones (S1-09)

| # | Supuesto | Pregunta del guion |
|---|---|---|
| 1 | El grupo o sección es el punto de partida para organizar el trabajo en los tres niveles | 2.1, 2.5 |
| 2 | Una sola persona administrativa organiza los grupos al inicio del periodo | 2.2 |
| 3 | La asistencia se registra una vez por día y grupo | 4.3 |
| 4 | Los estados presente y ausente son suficientes en la primera versión | 4.2 |
| 5 | El personal docente registra la asistencia desde el teléfono | 4.5, 7.8 |
| 6 | El personal administrativo da de alta a los docentes | 6.4 |
| 7 | El resumen de asistencia por sección es el reporte más necesario | 5.1, 5.5, 8.1 |

## 7. Fuera del alcance de la primera versión

Calificaciones, expedientes completos, comunicación con familias, cobros, integraciones con sistemas externos y uso con
datos reales de estudiantes. Las pruebas del prototipo se harán con información ficticia.

## 8. Historial de versiones

| Versión | Fecha | Cambio |
|---|---|---|
| 0.1 | 2026-10-21 | Borrador basado en la propuesta preliminar y el guion S1-10. |
