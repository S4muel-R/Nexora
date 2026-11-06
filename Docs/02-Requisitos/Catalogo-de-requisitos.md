# Catálogo de requisitos y Product Backlog — Nexora

| Campo | Valor |
|---|---|
| Código | S1-06 / S2-01 |
| EDT | 1.2.1.2 |
| Responsables | Luis (RF), Wilberth (refinamiento) |
| Versión | 1.1 |
| Fecha | 2026-11-05 |
| Criterio de entrega | Catálogo de requisitos RF01 – RF08 con historias de usuario y criterios de aceptación verificables |
| Fuentes | Primer avance corregido y su anexo (línea base: RF01 – RF08, CA01 – CA24), propuesta preliminar, backlog de Jira ADLCDS, guion de consulta S1-10, perfiles S1-11 |
| Verificación | [Verificación de requisitos](Verificacion-de-requisitos.md) · [Registro de refinamiento](Registro-de-refinamiento.md) |

## 1. Necesidades

Necesidades identificadas en la propuesta preliminar. Se validan y amplían con las sesiones de consulta (S1-05, S1-09).

| ID | Necesidad | Origen |
|---|---|---|
| N01 | Reunir en un solo lugar la información de estudiantes, docentes y grupos para no repetir datos ni dudar de cuál versión está actualizada | Propuesta, "Situación que motiva el proyecto" |
| N02 | Que cada persona acceda solo a las opciones e información que corresponden a su responsabilidad | Propuesta, "Acceso y permisos" |
| N03 | Que la información de una institución no sea visible para otra | Propuesta, "Alcance"; tarea S1-07 |
| N04 | Registrar la estructura del centro y adaptarla a kínder, escuela o colegio | Propuesta, "Organización institucional" |
| N05 | Localizar y mantener actualizados los datos esenciales de estudiantes y docentes | Propuesta, "Estudiantes y docentes" |
| N06 | Organizar el trabajo por grupo o sección y saber quién está a cargo | Propuesta, "Grupos" |
| N07 | Dar seguimiento diario a la asistencia por grupo y fecha | Propuesta, "Asistencia" |
| N08 | Consultar listados y resúmenes sencillos sin elaborarlos a mano | Propuesta, "Reportes básicos" |
| N09 | Usar la plataforma desde computadora o teléfono | Propuesta, "Alcance y forma de trabajo" |

## 2. Requisitos funcionales

| ID | Requisito | Necesidad | Historias | Prioridad |
|---|---|---|---|---|
| RF01 | Acceso y permisos: el sistema debe permitir iniciar y cerrar sesión con correo y contraseña y aplicar los permisos de administración de la plataforma, administración institucional y docente, de modo que ningún usuario consulte o modifique datos de otra institución. | N02, N03 | HU01, HU02, HU03, HU06 | Alta |
| RF02 | Configuración de la plataforma: el sistema debe permitir crear y activar instituciones con sus niveles y habilitar la cuenta de su administración institucional. | N04 | HU04 | Alta |
| RF03 | Datos institucionales: el sistema debe permitir mantener los datos esenciales de cada institución, sus niveles y el periodo lectivo de demostración. | N04 | HU05 | Alta |
| RF04 | El sistema debe permitir registrar, consultar, editar y desactivar estudiantes, sin identificaciones duplicadas dentro de una institución. | N01, N05 | HU07 | Alta |
| RF05 | El sistema debe permitir administrar al personal docente y vincular cada docente con su cuenta de usuario. | N01, N05 | HU08 | Media |
| RF06 | El sistema debe permitir crear grupos por nivel y periodo y asignarles estudiantes y docentes. | N06 | HU09 | Media |
| RF07 | El sistema debe permitir registrar la asistencia por grupo y fecha, y corregirla dejando registro del valor anterior, el nuevo, el motivo, el usuario y la fecha. | N07 | HU10 | Media |
| RF08 | El sistema debe permitir consultar listados de estudiantes y grupos, y resúmenes de asistencia con filtros. | N08 | HU11, HU12 | Media |

La numeración y el contenido de RF01 – RF08 siguen la línea base del avance 1 (sección 2.3), según el anexo de
correcciones (CC-11, VR-15). La versión 1.0 de este catálogo había renumerado RF02 y RF03; la correspondencia es:
RF01 v1.0 + control por rol de RF02 v1.0 → **RF01**; registro de instituciones de RF03 v1.0 → **RF02**; actualización de
datos de RF03 v1.0 → **RF03**. El aislamiento entre instituciones (HU06) forma parte de RF01 y del requisito no
funcional de separación de datos del avance 1.

### 2.1 Correspondencia con la línea base del avance 1

| HU del avance 1 | Criterios | Historias de este catálogo | Jira |
|---|---|---|---|
| HU01 Acceder según el rol | CA01, CA02 | HU01, HU02, HU03, HU06 | ADLCDS-105, 106, 107, 110 |
| HU02 Configurar instituciones y accesos | CA03, CA04 | HU04 | ADLCDS-108 |
| HU03 Definir datos y niveles del centro | CA05, CA06 | HU05, HU06 | ADLCDS-109, 110 |
| HU04 Mantener estudiantes | CA07, CA08 | HU07 | ADLCDS-111 |
| HU05 Mantener docentes | CA09, CA10 | HU08 | ADLCDS-112 |
| HU06 – HU08 Grupos y asignaciones | CA11 – CA16 | HU09 (y HU10 para CA15 – CA16) | ADLCDS-113, 114 |
| HU09 – HU10 Asistencia y corrección | CA17 – CA20 | HU10 | ADLCDS-114 |
| HU11 Listados y grupos | CA21, CA22 | HU11 | ADLCDS-115 |
| HU12 Resumen de asistencia | CA23, CA24 | HU12 | ADLCDS-116 |

El refinamiento dividió y renumeró las historias del avance 1 (REF-01 – REF-17); el cruce escenario por escenario con
CA01 – CA24, en ambos sentidos, está en la [Matriz de trazabilidad](Matriz-de-trazabilidad.md), sección 2.

## 3. Requisitos no funcionales

| ID | Requisito | Característica ISO/IEC 25010 | Verificación |
|---|---|---|---|
| RNF01 | Las contraseñas se almacenan con hash y nunca se devuelven en la API. | Seguridad | Prueba de API |
| RNF02 | Toda ruta de la API, salvo inicio de sesión y estado del servicio, exige sesión válida. | Seguridad | Prueba de API |
| RNF03 | Las pantallas se usan sin desplazamiento horizontal desde 360 px de ancho. | Flexibilidad / Capacidad de interacción | Prueba de interfaz |
| RNF04 | Los mensajes de error se muestran en español claro, sin detalles técnicos. | Capacidad de interacción | Prueba de interfaz y de API |
| RNF05 | Las consultas de listados responden en menos de 2 s con 120 estudiantes por institución. | Eficiencia de desempeño | Prueba de rendimiento (Sprint 8) |

## 4. Reglas de negocio

| ID | Regla |
|---|---|
| RN01 | Roles: `platform_admin` (administración de la plataforma), `institution_admin` (personal administrativo) y `teacher` (personal docente). Todo usuario, salvo `platform_admin`, pertenece a exactamente una institución. |
| RN02 | Un recurso de otra institución se responde como inexistente (HTTP 404), para no revelar su existencia. |
| RN03 | El nombre de la institución es único en la plataforma. Niveles posibles: preescolar, primaria, secundaria; al menos uno. |
| RN04 | La identificación del estudiante es única dentro de su institución; puede repetirse en otra institución. Tiene entre 5 y 20 caracteres alfanuméricos o guiones. |
| RN05 | La fecha de nacimiento no puede ser futura. El nivel del estudiante debe ser uno de los niveles de su institución. |
| RN06 | Estudiantes, docentes y usuarios no se borran: se desactivan. Un usuario desactivado no puede iniciar sesión. |
| RN07 | El mensaje de inicio de sesión fallido es el mismo para correo inexistente y contraseña incorrecta. |

## 5. Product Backlog

Estimación en puntos de historia (escala Fibonacci). Estado al 2026-11-04.

| ID | Historia | RF | Prioridad | Estimación | Dependencias | Sprint | Estado |
|---|---|---|---|---|---|---|---|
| HU01 | Iniciar sesión | RF01 | Alta | 3 | — | 3 | En curso |
| HU02 | Cerrar sesión | RF01 | Alta | 1 | HU01 | 3 | En curso |
| HU03 | Ver solo las opciones de mi rol | RF01 | Alta | 3 | HU01 | 3 | En curso |
| HU04 | Registrar una institución y su administrador | RF02 | Alta | 5 | HU01 | 3 | En curso |
| HU05 | Actualizar los datos de mi institución | RF03 | Alta | 3 | HU04 | 3 | En curso |
| HU06 | Impedir el acceso a datos de otra institución | RF01 | Alta | 5 | HU04 | 3 | En curso |
| HU07 | Gestionar estudiantes sin duplicados | RF04 | Alta | 8 | HU05, HU06 | 3 – 4 | En curso |
| HU08 | Gestionar docentes y sus cuentas | RF05 | Media | 5 | HU06 | 4 | Por hacer |
| HU09 | Crear grupos y asignar estudiantes y docentes | RF06 | Media | 8 | HU07, HU08 | 4 | Por hacer |
| HU10 | Registrar y corregir la asistencia de mi grupo | RF07 | Media | 8 | HU09 | 5 | Por hacer |
| HU11 | Consultar listados de estudiantes y grupos | RF08 | Media | 3 | HU09 | 6 | Por hacer |
| HU12 | Consultar el resumen de asistencia | RF08 | Media | 5 | HU10 | 6 | Por hacer |

Total: 57 puntos. Incremento del segundo entregable: HU01 – HU07 (28 puntos).

## 6. Historias de usuario y escenarios de aceptación

Datos ficticios usados en los escenarios: institución **Escuela Los Robles** (primaria) con la administradora
`admin@robles.test`; institución **Colegio Monteverde** (secundaria) con `admin@monteverde.test`; administración de la
plataforma `plataforma@nexora.test`.

### HU01 — Iniciar sesión
**Como** persona usuaria de una institución, **quiero** ingresar con mi correo y contraseña, **para** usar las funciones
de mi rol.

- **HU01-E1 (exitoso)** — **Dado que** `admin@robles.test` está activa y su contraseña es correcta, **cuando** ingresa
  sus datos y pulsa "Ingresar", **entonces** accede a la pantalla de inicio de su rol y ve el nombre de su institución.
- **HU01-E2 (alternativo)** — **Dado que** la persona escribe el correo con mayúsculas o espacios al inicio o al final
  (`  Admin@Robles.test `), **cuando** ingresa la contraseña correcta, **entonces** el sistema la reconoce e inicia
  sesión.
- **HU01-E3 (error)** — **Dado que** la contraseña es incorrecta o el correo no existe, **cuando** pulsa "Ingresar",
  **entonces** ve "Correo o contraseña incorrectos" sin indicar cuál de los dos falló, y no accede.
- **HU01-E4 (error)** — **Dado que** la cuenta está desactivada, **cuando** ingresa datos correctos, **entonces** ve
  "Su cuenta está desactivada. Contacte a la administración" y no accede.
- **HU01-E5 (error)** — **Dado que** deja vacío el correo o la contraseña, **cuando** pulsa "Ingresar", **entonces** el
  formulario marca el campo como obligatorio y no envía la solicitud.

### HU02 — Cerrar sesión
**Como** persona usuaria, **quiero** cerrar mi sesión, **para** que nadie use mi cuenta en un equipo compartido.

- **HU02-E1 (exitoso)** — **Dado que** tengo una sesión iniciada, **cuando** pulso "Cerrar sesión", **entonces** vuelvo
  a la pantalla de inicio de sesión.
- **HU02-E2 (alternativo)** — **Dado que** cerré sesión, **cuando** uso el botón "Atrás" del navegador o abro una
  dirección interna, **entonces** el sistema me pide iniciar sesión otra vez.
- **HU02-E3 (error)** — **Dado que** mi sesión ya fue cerrada, **cuando** se usa el token anterior para consultar la
  API, **entonces** la API responde 401 "Debe iniciar sesión".

### HU03 — Ver solo las opciones de mi rol
**Como** persona usuaria, **quiero** ver únicamente las opciones de mi función, **para** no confundirme con opciones
que no me corresponden.

- **HU03-E1 (exitoso)** — **Dado que** inicié sesión como `institution_admin`, **cuando** veo el menú, **entonces**
  aparecen "Mi institución" y "Estudiantes" y no aparece "Instituciones".
- **HU03-E2 (alternativo)** — **Dado que** inicié sesión como `platform_admin`, **cuando** veo el menú, **entonces**
  aparece "Instituciones" y no aparecen opciones de gestión escolar.
- **HU03-E3 (error)** — **Dado que** soy `teacher`, **cuando** intento abrir directamente la dirección de una pantalla
  de administración o llamar su API, **entonces** veo "No tiene permiso para realizar esta acción" (403).

### HU04 — Registrar una institución y su administrador
**Como** administración de la plataforma, **quiero** registrar una institución con sus niveles y su persona
administradora, **para** habilitar su uso de Nexora.

- **HU04-E1 (exitoso)** — **Dado que** inicié sesión como `platform_admin`, **cuando** registro "Escuela Los Robles"
  con nivel primaria y la administradora `admin@robles.test`, **entonces** la institución queda activa y la
  administradora puede iniciar sesión.
- **HU04-E2 (alternativo)** — **Dado que** registro "Colegio Monteverde" con los niveles primaria y secundaria,
  **cuando** guardo, **entonces** la institución queda con ambos niveles.
- **HU04-E3 (error)** — **Dado que** ya existe "Escuela Los Robles", **cuando** intento registrar otra con el mismo
  nombre, **entonces** veo "Ya existe una institución con ese nombre" (409).
- **HU04-E4 (error)** — **Dado que** no selecciono ningún nivel o el correo de la administradora ya está en uso,
  **cuando** guardo, **entonces** el campo correspondiente muestra el error y no se crea nada.

### HU05 — Actualizar los datos de mi institución
**Como** personal administrativo, **quiero** consultar y actualizar los datos de mi institución, **para** mantener la
información correcta.

- **HU05-E1 (exitoso)** — **Dado que** soy `admin@robles.test`, **cuando** cambio el teléfono y la dirección y guardo,
  **entonces** veo "Datos actualizados" y los cambios se mantienen al recargar.
- **HU05-E2 (alternativo)** — **Dado que** agrego el nivel preescolar, **cuando** guardo, **entonces** la institución
  queda con preescolar y primaria.
- **HU05-E3 (error)** — **Dado que** dejo el nombre vacío o el correo con formato inválido, **cuando** guardo,
  **entonces** veo el error en el campo y los datos no cambian.
- **HU05-E4 (error)** — **Dado que** quito un nivel que tiene estudiantes activos, **cuando** guardo, **entonces** veo
  "No se puede quitar un nivel con estudiantes activos".
- **HU05-E5 (exitoso, REF-16)** — **Dado que** soy `admin@robles.test`, **cuando** defino el periodo lectivo "2026" del
  2026-02-02 al 2026-12-11 y guardo, **entonces** queda como periodo vigente y los grupos se crean en él. *Pendiente de
  implementar (Sprint 4, GAP-01).*

### HU06 — Impedir el acceso a datos de otra institución
**Como** institución, **quiero** que nadie de otra institución vea ni cambie nuestros datos, **para** proteger la
información de nuestros estudiantes.

- **HU06-E1 (exitoso)** — **Dado que** soy `admin@robles.test`, **cuando** consulto la lista de estudiantes,
  **entonces** solo aparecen estudiantes de Escuela Los Robles.
- **HU06-E2 (alternativo)** — **Dado que** existe un estudiante con la misma identificación en ambas instituciones,
  **cuando** cada administradora lo consulta, **entonces** cada una ve solo el suyo.
- **HU06-E3 (error)** — **Dado que** soy `admin@robles.test` y conozco el identificador de un estudiante de Colegio
  Monteverde, **cuando** intento consultarlo, editarlo o desactivarlo por la API, **entonces** recibo 404 y el registro
  no cambia.
- **HU06-E4 (error)** — **Dado que** soy `admin@robles.test`, **cuando** intento consultar o actualizar los datos de
  Colegio Monteverde, **entonces** recibo 404.

### HU07 — Gestionar estudiantes sin duplicados
**Como** personal administrativo, **quiero** registrar, consultar, editar y desactivar estudiantes, **para** mantener
un registro único y actualizado.

- **HU07-E1 (exitoso)** — **Dado que** soy `admin@robles.test`, **cuando** registro a un estudiante con
  identificación `1-1111-1111`, nombre, apellidos, fecha de nacimiento y nivel primaria, **entonces** aparece en la
  lista como activo.
- **HU07-E2 (alternativo)** — **Dado que** el estudiante existe, **cuando** edito su apellido o lo desactivo,
  **entonces** el cambio se refleja en la lista; los desactivados se ocultan por defecto y se pueden mostrar con un filtro.
- **HU07-E3 (alternativo)** — **Dado que** hay varios estudiantes, **cuando** busco por nombre, apellido o
  identificación, **entonces** la lista muestra solo las coincidencias.
- **HU07-E4 (error)** — **Dado que** ya existe `1-1111-1111` en Escuela Los Robles, **cuando** intento registrar otro
  estudiante con esa identificación, **entonces** veo "Ya existe un estudiante con esa identificación" (409).
- **HU07-E5 (error)** — **Dado que** la fecha de nacimiento es futura o el nivel no pertenece a la institución,
  **cuando** guardo, **entonces** veo el error en el campo y no se registra.

### HU08 — Gestionar docentes y sus cuentas
**Como** personal administrativo, **quiero** registrar docentes y crearles su cuenta, **para** que puedan consultar sus
grupos.

- **HU08-E1 (exitoso)** — **Dado que** registro a un docente con nombre y correo `docente1@robles.test`, **cuando**
  guardo, **entonces** queda activo con una cuenta de rol `teacher` en mi institución.
- **HU08-E2 (alternativo)** — **Dado que** desactivo a un docente, **cuando** intenta iniciar sesión, **entonces** no
  puede acceder y deja de aparecer en las asignaciones nuevas.
- **HU08-E3 (error)** — **Dado que** el correo ya pertenece a otra cuenta, **cuando** guardo, **entonces** veo "Ya
  existe una cuenta con ese correo".

### HU09 — Crear grupos y asignar estudiantes y docentes
**Como** personal administrativo, **quiero** crear grupos por nivel y periodo y asignarles estudiantes y docentes,
**para** organizar el periodo lectivo.

- **HU09-E1 (exitoso)** — **Dado que** existen estudiantes y docentes activos, **cuando** creo el grupo "4-A" de
  primaria para 2026 y le asigno 25 estudiantes y una docente, **entonces** el grupo muestra su composición.
- **HU09-E2 (alternativo)** — **Dado que** un estudiante se traslada, **cuando** lo muevo de "4-A" a "4-B",
  **entonces** deja de estar en "4-A" y aparece en "4-B".
- **HU09-E3 (error)** — **Dado que** el estudiante ya pertenece a un grupo del mismo periodo, **cuando** intento
  asignarlo a otro sin trasladarlo, **entonces** veo "El estudiante ya pertenece a un grupo en este periodo".
- **HU09-E4 (error, REF-17)** — **Dado que** existe el grupo "4-A" en el periodo 2026, **cuando** intento crear otro
  "4-A" en el mismo periodo, **entonces** veo "Ya existe un grupo con ese código en este periodo" (CA12).

### HU10 — Registrar y corregir la asistencia de mi grupo
**Como** docente, **quiero** marcar la asistencia de mi grupo por fecha y corregirla si me equivoco, **para** llevar un
registro confiable.

- **HU10-E1 (exitoso)** — **Dado que** abro mi grupo "4-A" para hoy, **cuando** marco presente o ausente a cada
  estudiante y guardo, **entonces** veo la confirmación y el registro queda para esa fecha.
- **HU10-E2 (alternativo)** — **Dado que** marqué ausente a un estudiante que llegó tarde, **cuando** corrijo a
  presente indicando el motivo, **entonces** queda el valor anterior, el nuevo, el motivo, mi usuario y la fecha.
- **HU10-E3 (error)** — **Dado que** ya existe la asistencia de "4-A" para esa fecha, **cuando** intento registrarla de
  nuevo, **entonces** el sistema la abre en modo corrección en lugar de duplicarla.
- **HU10-E4 (error)** — **Dado que** intento corregir sin escribir el motivo, **cuando** guardo, **entonces** veo "El
  motivo es obligatorio".
- **HU10-E5 (error, REF-17)** — **Dado que** soy docente sin asignación a "4-B", **cuando** intento consultar su lista o
  guardar su asistencia, **entonces** la API rechaza la operación y no muestra datos del grupo (CA16).

### HU11 — Consultar listados de estudiantes y grupos
**Como** personal administrativo, **quiero** consultar listados de estudiantes y la distribución por grupos, **para**
responder consultas sin preparar listas a mano.

- **HU11-E1 (exitoso)** — **Dado que** hay grupos con estudiantes, **cuando** abro el listado por grupo, **entonces**
  veo cada grupo con su docente y su cantidad de estudiantes.
- **HU11-E2 (alternativo)** — **Dado que** filtro por nivel secundaria, **cuando** aplico el filtro, **entonces** solo
  aparecen grupos y estudiantes de ese nivel.
- **HU11-E3 (error)** — **Dado que** no hay resultados para el filtro, **cuando** lo aplico, **entonces** veo "No hay
  registros para los filtros seleccionados" en lugar de una tabla vacía.
- **HU11-E4 (error, REF-17)** — **Dado que** soy docente o pertenezco a otra institución, **cuando** solicito el listado
  general de estudiantes y grupos, **entonces** la API lo rechaza sin mostrar información restringida (CA22).

### HU12 — Consultar el resumen de asistencia
**Como** personal administrativo, **quiero** ver un resumen de asistencia por grupo y rango de fechas, **para** dar
seguimiento a las ausencias.

- **HU12-E1 (exitoso)** — **Dado que** "4-A" tiene asistencia de cinco fechas, **cuando** consulto el resumen de esas
  fechas, **entonces** veo presentes, ausentes y porcentaje de asistencia por estudiante y del grupo.
- **HU12-E2 (alternativo)** — **Dado que** soy docente de "4-A", **cuando** consulto el resumen, **entonces** veo solo
  mis grupos.
- **HU12-E3 (error)** — **Dado que** la fecha inicial es posterior a la final, **cuando** consulto, **entonces** veo
  "La fecha inicial debe ser anterior o igual a la final".

## 7. Resumen de escenarios

| Historia | Escenarios | Exitosos | Alternativos | Error |
|---|---|---|---|---|
| HU01 | 5 | 1 | 1 | 3 |
| HU02 | 3 | 1 | 1 | 1 |
| HU03 | 3 | 1 | 1 | 1 |
| HU04 | 4 | 1 | 1 | 2 |
| HU05 | 5 | 2 | 1 | 2 |
| HU06 | 4 | 1 | 1 | 2 |
| HU07 | 5 | 1 | 2 | 2 |
| HU08 | 3 | 1 | 1 | 1 |
| HU09 | 4 | 1 | 1 | 2 |
| HU10 | 5 | 1 | 1 | 3 |
| HU11 | 4 | 1 | 1 | 2 |
| HU12 | 3 | 1 | 1 | 1 |
| **Total** | **48** | 13 | 13 | 22 |

Todas las historias cumplen el mínimo de tres escenarios (exitoso, alternativo y de error) de la sección 9 de las
instrucciones.

## 8. Historial de versiones

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 2026-11-04 | Primera redacción de RF01 – RF08 y HU01 – HU12. Incorpora las correcciones de la verificación del backlog original (VR-01 a VR-14). Pendiente: revisión por pares (VR-P). |
| 1.1 | 2026-11-05 | Anexo de correcciones del avance 1: RF01 – RF03 vuelven a la numeración de la línea base (CC-11, VR-15); correspondencia con HU01 – HU12 y CA01 – CA24 del avance 1 (sección 2.1); nuevos escenarios HU05-E5, HU09-E4, HU10-E5 y HU11-E4 (REF-16, REF-17). Total: 48 escenarios. |
