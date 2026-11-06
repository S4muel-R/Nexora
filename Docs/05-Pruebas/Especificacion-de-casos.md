# Especificación de casos de prueba — Nexora

| Campo | Valor |
|---|---|
| Código | S3-03 / S4-03 (casos CA01 – CA16 del backlog original) · S7-14 (accesibilidad) |
| Responsables | Wilberth (diseño), Luis (API), Samuel (interfaz) |
| Versión | 1.1 |
| Fecha | 2026-11-05 |
| Norma | ISO/IEC/IEEE 29119-3, "Test Case Specification" |
| Plan | [Plan de pruebas](Plan-de-pruebas.md) |

Cada caso documenta los campos de la sección 15 de las instrucciones: ID, historia, objetivo, precondiciones, datos,
pasos, resultado esperado, resultado obtenido, estado, evidencia, responsable y fecha. El resultado obtenido corresponde
a la última ejecución registrada en el [Registro de ejecución](Registro-de-ejecucion.md).

## Resumen

| Nivel | Casos | Pruebas automatizadas | Historias |
|---|---|---|---|
| API e integración (CP-A) | 27 | 63 (pytest) | HU01 – HU07, RN, RNF |
| Unitarias de interfaz (CP-U) | 7 | 16 (Vitest) | HU01 – HU03, HU07 |
| Sistema (CP-S) | 21 | 42 (Playwright: 21 × 2 dispositivos) | HU01 – HU07, RNF03, RNF04, WCAG |
| Seguridad (CP-SEG) | 4 | Herramientas de análisis (no se cuentan como pruebas automatizadas) | RNF de seguridad |
| **Total** | **59** | **121** | |

Resultado de la última ejecución: 58 casos aprobados (CP-SEG01 con riesgo residual aceptado) y **1 fallido
(CP-SEG04 → INC-006, abierto)**.

Correspondencia con la **línea base del avance 1** (CA01 – CA24): este incremento cubre CA01 – CA08 (CA02 y CA05
parcialmente); CA09 – CA24 corresponden a HU08 – HU12 del catálogo, planificadas para los Sprints 4 – 6. El detalle
bidireccional está en la [Matriz de trazabilidad](../02-Requisitos/Matriz-de-trazabilidad.md), sección 2.

## 1. Casos de API e integración (pytest)

### CP-A01 — Iniciar sesión con credenciales válidas

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E1 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Iniciar sesión con credenciales válidas |
| Precondiciones | Cuenta `admin@robles.test` activa. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Correo y contraseña correctos |
| Pasos | POST `/auth/login/` |
| Resultado esperado | 200 con token, rol e institución; sin contraseña en la respuesta |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu01_e1_inicio_de_sesion_exitoso` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A02 — Normalizar el correo al iniciar sesión

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E2 |
| Criterio de la línea base (avance 1) | CA01 (variante) |
| Objetivo | Normalizar el correo al iniciar sesión |
| Precondiciones | Cuenta `admin@robles.test` activa. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `  Admin@Robles.test ` |
| Pasos | POST `/auth/login/` |
| Resultado esperado | 200 |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu01_e2_correo_con_mayusculas_y_espacios` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A03 — Mismo mensaje para contraseña incorrecta y correo inexistente

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E3 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Mismo mensaje para contraseña incorrecta y correo inexistente |
| Precondiciones | Cuenta activa. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Contraseña incorrecta; correo inexistente |
| Pasos | POST `/auth/login/` con cada variante |
| Resultado esperado | 400 `invalid_credentials` "Correo o contraseña incorrectos." en ambos casos |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu01_e3_credenciales_invalidas_mismo_mensaje[contrasena-incorrecta]`<br>`test_hu01_e3_credenciales_invalidas_mismo_mensaje[correo-inexistente]` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A04 — Impedir el acceso a cuentas o instituciones desactivadas

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E4 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Impedir el acceso a cuentas o instituciones desactivadas |
| Precondiciones | Cuenta o institución con `is_active = false`. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Credenciales correctas |
| Pasos | POST `/auth/login/` |
| Resultado esperado | 403 `account_disabled` |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu01_e4_cuenta_desactivada`<br>`test_hu01_e4_institucion_desactivada_impide_acceso` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A05 — Rechazar campos vacíos

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E5 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Rechazar campos vacíos |
| Precondiciones | Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Correo y contraseña vacíos |
| Pasos | POST `/auth/login/` |
| Resultado esperado | 400 con errores en `email` y `password` |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu01_e5_campos_vacios` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A06 — Cerrar sesión invalida el token

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E1, E3 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Cerrar sesión invalida el token |
| Precondiciones | Sesión iniciada. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Token del usuario |
| Pasos | POST `/auth/logout/`; luego GET `/auth/me/` con el mismo token |
| Resultado esperado | 204; luego 401 "Debe iniciar sesión." |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu02_e1_cerrar_sesion_elimina_el_token`<br>`test_hu02_e3_token_anterior_ya_no_es_valido` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A07 — Permisos por rol en la API

| Campo | Valor |
|---|---|
| Historia / escenario | HU03-E2, E3 |
| Criterio de la línea base (avance 1) | CA01 (en la API), CA04 |
| Objetivo | Permisos por rol en la API |
| Precondiciones | Usuarios de cada rol. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Docente, plataforma y administrativo |
| Pasos | Llamar rutas de otro rol |
| Resultado esperado | 403 para docente en gestión; 403 para plataforma en datos escolares |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu03_e3_docente_no_modifica_la_institucion`<br>`test_hu03_e3_docente_no_accede_a_gestion_de_instituciones`<br>`test_hu03_e2_plataforma_no_accede_a_gestion_escolar`<br>`test_hu04_solo_plataforma_registra_instituciones` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A08 — Registrar institución con su administradora

| Campo | Valor |
|---|---|
| Historia / escenario | HU04-E1, E2 |
| Criterio de la línea base (avance 1) | CA03 |
| Objetivo | Registrar institución con su administradora |
| Precondiciones | Sesión de `platform_admin`. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Escuela Los Robles (primaria); Colegio Monteverde (primaria y secundaria) |
| Pasos | POST `/institutions/` |
| Resultado esperado | 201; institución activa; administradora puede iniciar sesión; niveles ordenados |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu04_e1_registrar_institucion_y_administradora`<br>`test_hu04_e2_institucion_con_varios_niveles` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A09 — Rechazar nombre duplicado sin distinguir mayúsculas

| Campo | Valor |
|---|---|
| Historia / escenario | HU04-E3 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Rechazar nombre duplicado sin distinguir mayúsculas |
| Precondiciones | Existe Escuela Los Robles. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `escuela los robles` |
| Pasos | POST `/institutions/` |
| Resultado esperado | 409 y no se crea la cuenta administradora |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu04_e3_nombre_duplicado_sin_distinguir_mayusculas` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A10 — Validar niveles y correo de la administradora

| Campo | Valor |
|---|---|
| Historia / escenario | HU04-E4 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Validar niveles y correo de la administradora |
| Precondiciones | Sesión de `platform_admin`. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Niveles `[]`, `universidad`, repetidos; correo ya usado |
| Pasos | POST `/institutions/` |
| Resultado esperado | 400 con el campo señalado; no se crea nada |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu04_e4_niveles_invalidos[levels0]`<br>`test_hu04_e4_niveles_invalidos[levels1]`<br>`test_hu04_e4_niveles_invalidos[levels2]`<br>`test_hu04_e4_correo_de_administradora_en_uso` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A11 — Actualizar datos y niveles de mi institución

| Campo | Valor |
|---|---|
| Historia / escenario | HU05-E1, E2 |
| Criterio de la línea base (avance 1) | CA05 (parcial: el periodo lectivo no está implementado) |
| Objetivo | Actualizar datos y niveles de mi institución |
| Precondiciones | Sesión de `admin@robles.test`. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Teléfono 2222-3333, dirección Heredia; nivel preescolar |
| Pasos | PATCH `/my-institution/` |
| Resultado esperado | 200 y los cambios persisten |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu05_e1_actualizar_datos_de_mi_institucion`<br>`test_hu05_e2_agregar_nivel` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A12 — Rechazar datos inválidos y quitar nivel en uso

| Campo | Valor |
|---|---|
| Historia / escenario | HU05-E3, E4 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Rechazar datos inválidos y quitar nivel en uso |
| Precondiciones | Estudiante activo en primaria. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Nombre en blanco; correo inválido; quitar primaria |
| Pasos | PATCH `/my-institution/` |
| Resultado esperado | 400 con el campo señalado; datos sin cambios |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu05_e3_datos_invalidos_no_se_guardan[name-   ]`<br>`test_hu05_e3_datos_invalidos_no_se_guardan[email-no-es-correo]`<br>`test_hu05_e4_no_quitar_nivel_con_estudiantes_activos` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A13 — Cada institución lista solo sus estudiantes

| Campo | Valor |
|---|---|
| Historia / escenario | HU06-E1, E2 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Cada institución lista solo sus estudiantes |
| Precondiciones | Estudiantes en dos instituciones, uno con identificación repetida. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `3-3333-3333` en ambas |
| Pasos | GET `/students/` con cada administradora |
| Resultado esperado | Cada lista contiene solo los suyos |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu06_e1_lista_solo_estudiantes_de_mi_institucion`<br>`test_hu06_e2_misma_identificacion_en_dos_instituciones` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A14 — Estudiante de otra institución es inaccesible

| Campo | Valor |
|---|---|
| Historia / escenario | HU06-E3 |
| Criterio de la línea base (avance 1) | CA02 (parcial: sin grupos todavía) |
| Objetivo | Estudiante de otra institución es inaccesible |
| Precondiciones | Estudiante de Monteverde. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Identificador del estudiante ajeno; campo `institution` manipulado |
| Pasos | GET, PATCH (editar, desactivar) y POST con institución ajena |
| Resultado esperado | 404 sin cambios; el POST se asigna a la institución propia |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu06_e3_estudiante_de_otra_institucion_responde_404[consultar]`<br>`test_hu06_e3_estudiante_de_otra_institucion_responde_404[editar]`<br>`test_hu06_e3_estudiante_de_otra_institucion_responde_404[desactivar]`<br>`test_hu06_e3_no_se_puede_crear_en_otra_institucion` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A15 — Institución ajena es inaccesible

| Campo | Valor |
|---|---|
| Historia / escenario | HU06-E4 |
| Criterio de la línea base (avance 1) | CA06 |
| Objetivo | Institución ajena es inaccesible |
| Precondiciones | Dos instituciones. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Identificador de Monteverde |
| Pasos | GET y PATCH `/institutions/{id}/` como administradora de Los Robles |
| Resultado esperado | 404 sin cambios |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu06_e4_institucion_ajena_responde_404[get]`<br>`test_hu06_e4_institucion_ajena_responde_404[patch]`<br>`test_hu06_e4_mi_institucion_devuelve_la_propia` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A16 — Registrar estudiante activo

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E1 |
| Criterio de la línea base (avance 1) | CA07 |
| Objetivo | Registrar estudiante activo |
| Precondiciones | Sesión de `admin@robles.test`. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `1-1111-1111`, Ana Mora, 2016-03-14, primaria; formato multipart y JSON |
| Pasos | POST `/students/` |
| Resultado esperado | 201; estudiante activo de Los Robles |
| Resultado obtenido | Ejecución 1: **falló** (estudiante inactivo) → INC-001 / ADLCDS-103. Reprueba: aprobado |
| Estado | Aprobado tras reprueba |
| Pruebas automatizadas | `test_hu07_e1_registrar_estudiante`<br>`test_adlcds_103_estudiante_nuevo_queda_activo_en_cualquier_formato[multipart]`<br>`test_adlcds_103_estudiante_nuevo_queda_activo_en_cualquier_formato[json]` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A17 — Editar y desactivar estudiante

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E2 |
| Criterio de la línea base (avance 1) | CA07 |
| Objetivo | Editar y desactivar estudiante |
| Precondiciones | Estudiante existente. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Apellido Vargas; `is_active=false` |
| Pasos | PATCH `/students/{id}/`; GET con y sin `include_inactive` |
| Resultado esperado | Cambio guardado; desactivados ocultos salvo filtro |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu07_e2_editar_apellido`<br>`test_hu07_e2_desactivados_ocultos_salvo_filtro` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A18 — Buscar por nombre, apellido o identificación

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E3 |
| Criterio de la línea base (avance 1) | CA07 |
| Objetivo | Buscar por nombre, apellido o identificación |
| Precondiciones | Dos estudiantes. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `ana`, `MORA`, `1111` |
| Pasos | GET `/students/?search=` |
| Resultado esperado | Solo la coincidencia |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu07_e3_buscar_por_nombre_apellido_o_identificacion[ana]`<br>`test_hu07_e3_buscar_por_nombre_apellido_o_identificacion[MORA]`<br>`test_hu07_e3_buscar_por_nombre_apellido_o_identificacion[1111]` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A19 — Rechazar identificación duplicada al registrar y al editar

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E4 |
| Criterio de la línea base (avance 1) | CA08 |
| Objetivo | Rechazar identificación duplicada al registrar y al editar |
| Precondiciones | Existe `1-1111-1111`. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | ` 1-1111-1111 ` (con espacios) |
| Pasos | POST y PATCH `/students/` |
| Resultado esperado | 409 "Ya existe un estudiante con esa identificación." |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu07_e4_identificacion_duplicada`<br>`test_hu07_e4_editar_a_identificacion_existente` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A20 — Validar fecha de nacimiento y nivel con mensajes claros

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E5 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Validar fecha de nacimiento y nivel con mensajes claros |
| Precondiciones | Institución de primaria. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Fecha de mañana; fecha vacía, nula, `14/03/2016`; nivel secundaria |
| Pasos | POST `/students/` |
| Resultado esperado | 400 con mensajes "La fecha de nacimiento no puede ser futura.", "Ingrese una fecha de nacimiento válida." y "El nivel no pertenece a la institución." |
| Resultado obtenido | Aprobado. Las variantes de fecha vacía se agregaron como regresión de INC-002 / ADLCDS-104 |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu07_e5_fecha_de_nacimiento_futura`<br>`test_adlcds_104_fecha_invalida_con_mensaje_claro[vacia]`<br>`test_adlcds_104_fecha_invalida_con_mensaje_claro[nula]`<br>`test_adlcds_104_fecha_invalida_con_mensaje_claro[formato]`<br>`test_hu07_e5_nivel_que_no_pertenece_a_la_institucion` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A21 — Validar formato de identificación

| Campo | Valor |
|---|---|
| Historia / escenario | RN04 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Validar formato de identificación |
| Precondiciones | Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `123`, 21 caracteres, `1-111/111` |
| Pasos | POST `/students/` |
| Resultado esperado | 400 en `identification` |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_rn04_formato_de_identificacion[123]`<br>`test_rn04_formato_de_identificacion[111111111111111111111]`<br>`test_rn04_formato_de_identificacion[1-111/111]` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A22 — Docente solo consulta; no existe borrado físico

| Campo | Valor |
|---|---|
| Historia / escenario | HU07, RN06 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Docente solo consulta; no existe borrado físico |
| Precondiciones | Docente y estudiante de Los Robles. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | — |
| Pasos | GET, POST, PATCH como docente; DELETE como administrativo |
| Resultado esperado | 200 / 403 / 403; DELETE 405 y el registro sigue |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu07_docente_consulta_pero_no_modifica`<br>`test_rn06_no_existe_borrado_fisico` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A23 — Contraseñas con hash y API protegida

| Campo | Valor |
|---|---|
| Historia / escenario | RNF01, RNF02 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Contraseñas con hash y API protegida |
| Precondiciones | Cuenta creada. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | — |
| Pasos | Leer el hash guardado; GET a rutas protegidas sin token |
| Resultado esperado | Hash distinto de la contraseña; 401 en todas |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_rnf01_contrasena_guardada_con_hash`<br>`test_rnf02_api_exige_sesion` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A24 — Servicio disponible y formato único de errores

| Campo | Valor |
|---|---|
| Historia / escenario | Humo · Estándares §3 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Servicio disponible y formato único de errores |
| Precondiciones | Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | — |
| Pasos | GET y POST `/health/`; error no controlado |
| Resultado esperado | 200 ok; 405 con formato estándar; 500 sin traza |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_health_responde_ok_sin_autenticacion`<br>`test_metodo_no_permitido_usa_formato_estandar_de_error`<br>`test_error_no_controlado_devuelve_500_sin_traza` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A25 — Datos ficticios de 3 instituciones

| Campo | Valor |
|---|---|
| Historia / escenario | S3-05 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Datos ficticios de 3 instituciones |
| Precondiciones | Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | — |
| Pasos | Ejecutar `seed_demo` dos veces |
| Resultado esperado | 3 instituciones, 1 cuenta de plataforma, identificación repetida en 2 instituciones; sin duplicados |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_seed_demo_carga_tres_instituciones_y_es_idempotente` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A26 — Configuración segura en un ambiente publicado con HTTPS

| Campo | Valor |
|---|---|
| Historia / escenario | RNF (seguridad) · INC-003 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Configuración segura en un ambiente publicado con HTTPS |
| Precondiciones | Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `DJANGO_HTTPS=true` y `false`; clave aleatoria; `DEBUG=false` |
| Pasos | Ejecutar `manage.py check --deploy` en cada caso |
| Resultado esperado | Con HTTPS: sin W004, W008, W012 ni W016 (solo W021, aceptada). Sin HTTPS: W008 presente |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_inc_003_ambiente_https_sin_advertencias_de_despliegue`<br>`test_inc_003_sin_https_check_deploy_advierte` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A27 — Un token anterior inválido no impide iniciar sesión

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E1 · INC-007 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Un token anterior inválido no impide iniciar sesión |
| Precondiciones | Cuenta `admin@robles.test` activa. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Encabezado `Authorization: Token token-de-una-sesion-anterior` |
| Pasos | POST `/auth/login/` con el encabezado |
| Resultado esperado | 200 con token nuevo (antes: 401 "Debe iniciar sesión.") |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_inc_007_token_anterior_invalido_no_impide_iniciar_sesion` |
| Evidencia | `evidencias/EV_pytest_ejecucion-5_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

## 2. Casos unitarios de interfaz (Vitest)

### CP-U01 — Traducir errores de la API a mensajes legibles

| Campo | Valor |
|---|---|
| Historia / escenario | RNF04 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Traducir errores de la API a mensajes legibles |
| Precondiciones | — |
| Datos de prueba | Respuestas 400 con campos, 502 HTML, falla de red |
| Pasos | Ejecutar `parseError` y `apiGet` |
| Resultado esperado | Mensaje del servidor; mensaje genérico; "No se pudo conectar con el servidor…" |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `client.test.ts (4 pruebas)` |
| Evidencia | Artefacto `reportes-frontend` de CI (`junit.xml`) |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-U02 — Formulario de inicio de sesión

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E1, E3, E5 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Formulario de inicio de sesión |
| Precondiciones | API simulada |
| Datos de prueba | Campos vacíos; credenciales inválidas; válidas |
| Pasos | Pulsar Ingresar |
| Resultado esperado | Mensajes de campo sin llamar a la API; alerta de credenciales; saludo y token guardado |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `App.test.tsx › HU01 (3 pruebas)` |
| Evidencia | Artefacto `reportes-frontend` de CI (`junit.xml`) |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-U03 — Dirección interna sin sesión lleva al inicio de sesión

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E2 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Dirección interna sin sesión lleva al inicio de sesión |
| Precondiciones | Sin token |
| Datos de prueba | `/estudiantes` |
| Pasos | Abrir la ruta |
| Resultado esperado | Formulario de inicio de sesión |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `App.test.tsx › HU02-E2` |
| Evidencia | Artefacto `reportes-frontend` de CI (`junit.xml`) |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-U04 — Menú y acceso por rol en la interfaz

| Campo | Valor |
|---|---|
| Historia / escenario | HU03-E1, E2, E3; HU07 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Menú y acceso por rol en la interfaz |
| Precondiciones | Sesión simulada por rol |
| Datos de prueba | Administrativo, plataforma, docente |
| Pasos | Abrir inicio, `/instituciones`, `/estudiantes` |
| Resultado esperado | Menú correcto por rol; acceso restringido; docente sin botón de registro |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `App.test.tsx › HU03 (4 pruebas)` |
| Evidencia | Artefacto `reportes-frontend` de CI (`junit.xml`) |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-U05 — El registro se habilita al cargar los niveles y el único nivel queda preseleccionado

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E1 · INC-004 |
| Criterio de la línea base (avance 1) | CA07 |
| Objetivo | El registro se habilita al cargar los niveles y el único nivel queda preseleccionado |
| Precondiciones | API simulada; `/my-institution/` responde tarde |
| Datos de prueba | Institución con un solo nivel (primaria) |
| Pasos | Ver el botón Registrar estudiante; liberar la respuesta; abrir el formulario |
| Resultado esperado | Botón deshabilitado mientras carga; luego habilitado y Nivel en "Primaria" |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `App.test.tsx › INC-004` |
| Evidencia | Artefacto `reportes-frontend` de CI (`junit.xml`) |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-U06 — Un 401 solo cierra la sesión si corresponde al token vigente

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E3 · INC-007 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Un 401 solo cierra la sesión si corresponde al token vigente |
| Precondiciones | Manejador de sesión vencida registrado |
| Datos de prueba | 401 con el token vigente; 401 tardío de un token ya reemplazado |
| Pasos | Ejecutar `apiGet('/auth/me/')` en cada caso |
| Resultado esperado | Se cierra la sesión en el primer caso; en el segundo se conserva el token nuevo |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `client.test.ts › sesión vencida (2 pruebas)` |
| Evidencia | Artefacto `reportes-frontend` de CI (`junit.xml`) |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-U07 — El token se borra del navegador aunque el servidor no responda al cierre de sesión

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E1 · INC-009 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | El token se borra del navegador aunque el servidor no responda al cierre de sesión |
| Precondiciones | Sesión iniciada; `POST /auth/logout/` sin respuesta |
| Datos de prueba | — |
| Pasos | Pulsar Cerrar sesión |
| Resultado esperado | `localStorage` sin token y pantalla de ingreso |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `App.test.tsx › INC-009` |
| Evidencia | Artefacto `reportes-frontend` de CI (`junit.xml`) |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

## 3. Casos de sistema (Playwright)

### CP-S01 — Inicio de sesión de la administradora

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E1 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Inicio de sesión de la administradora |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | admin@robles.test |
| Pasos | Ingresar correo y contraseña; pulsar Ingresar |
| Resultado esperado | Saludo y nombre de Escuela Los Robles |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S01 |
| Evidencia | `evidencias/e2e/` `EV_CP-S01_inicio_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S02 — Credenciales inválidas

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E3 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Credenciales inválidas |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Contraseña `incorrecta` |
| Pasos | Ingresar datos; pulsar Ingresar |
| Resultado esperado | Alerta "Correo o contraseña incorrectos." |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S02 |
| Evidencia | `evidencias/e2e/` `EV_CP-S02_mensaje_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S03 — Campos obligatorios

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E5 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Campos obligatorios |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Campos vacíos |
| Pasos | Pulsar Ingresar |
| Resultado esperado | "Ingrese su correo." e "Ingrese su contraseña." |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S03 |
| Evidencia | `evidencias/e2e/` `EV_CP-S03_validacion_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S04 — Cerrar sesión y volver atrás

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E1, E2 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Cerrar sesión y volver atrás |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | admin@robles.test |
| Pasos | Ingresar; abrir Estudiantes; Cerrar sesión; Atrás |
| Resultado esperado | Se muestra el inicio de sesión en ambos pasos |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S04 |
| Evidencia | `evidencias/e2e/` `EV_CP-S04_sesion-cerrada_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S05 — Menú por rol

| Campo | Valor |
|---|---|
| Historia / escenario | HU03-E1, E2 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Menú por rol |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | admin@robles.test; plataforma@nexora.test |
| Pasos | Ingresar con cada cuenta y leer el menú |
| Resultado esperado | Inicio · Mi institución · Estudiantes / Inicio · Instituciones |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S05 |
| Evidencia | `evidencias/e2e/` `EV_CP-S05_menu-administrativo_<dispositivo>_20261105.png`, `EV_CP-S05_menu-plataforma_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S06 — Docente en pantalla de administración

| Campo | Valor |
|---|---|
| Historia / escenario | HU03-E3 |
| Criterio de la línea base (avance 1) | CA02 (pantalla) |
| Objetivo | Docente en pantalla de administración |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | docente@robles.test |
| Pasos | Ingresar; abrir `/instituciones` |
| Resultado esperado | "No tiene permiso para realizar esta acción." |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S06 |
| Evidencia | `evidencias/e2e/` `EV_CP-S06_acceso-restringido_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S07 — Registrar institución y entrar con su administradora

| Campo | Valor |
|---|---|
| Historia / escenario | HU04-E1 |
| Criterio de la línea base (avance 1) | CA03 |
| Objetivo | Registrar institución y entrar con su administradora |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Nombre y correo únicos por ejecución |
| Pasos | Llenar formulario; Guardar; cerrar sesión; ingresar con la nueva cuenta |
| Resultado esperado | Confirmación, fila en la tabla y acceso de la nueva administradora |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S07 |
| Evidencia | `evidencias/e2e/` `EV_CP-S07_formulario_<dispositivo>_20261105.png`, `EV_CP-S07_registrada_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S08 — Nombre de institución duplicado

| Campo | Valor |
|---|---|
| Historia / escenario | HU04-E3 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Nombre de institución duplicado |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | `escuela los robles` |
| Pasos | Llenar formulario; Guardar |
| Resultado esperado | Alerta "Ya existe una institución con ese nombre." |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S08 |
| Evidencia | `evidencias/e2e/` `EV_CP-S08_duplicado_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S09 — Actualizar teléfono de mi institución

| Campo | Valor |
|---|---|
| Historia / escenario | HU05-E1 |
| Criterio de la línea base (avance 1) | CA05 (parcial) |
| Objetivo | Actualizar teléfono de mi institución |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Teléfono 2222-xxxx |
| Pasos | Editar teléfono; Guardar cambios; recargar |
| Resultado esperado | "Datos actualizados." y el valor persiste |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S09 |
| Evidencia | `evidencias/e2e/` `EV_CP-S09_actualizado_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S10 — Aislamiento visible en la lista

| Campo | Valor |
|---|---|
| Historia / escenario | HU06-E1, E2 |
| Criterio de la línea base (avance 1) | CA02, CA06 |
| Objetivo | Aislamiento visible en la lista |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | admin@robles.test; admin@monteverde.test |
| Pasos | Abrir Estudiantes con cada cuenta |
| Resultado esperado | Cada lista muestra solo su estudiante con `3-3333-3333` |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S10 |
| Evidencia | `evidencias/e2e/` `EV_CP-S10_robles_<dispositivo>_20261105.png`, `EV_CP-S10_monteverde_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S11 — Registrar y buscar estudiante

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E1, E3 |
| Criterio de la línea base (avance 1) | CA07 |
| Objetivo | Registrar y buscar estudiante |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Identificación `E2E-xxxxxxxx` |
| Pasos | Registrar; buscar por identificación |
| Resultado esperado | Confirmación y una sola fila coincidente |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S11 |
| Evidencia | `evidencias/e2e/` `EV_CP-S11_registrado_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S12 — Identificación duplicada

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E4 |
| Criterio de la línea base (avance 1) | CA08 |
| Objetivo | Identificación duplicada |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | `1-1111-1111` |
| Pasos | Registrar con identificación existente |
| Resultado esperado | Alerta "Ya existe un estudiante con esa identificación." |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S12 |
| Evidencia | `evidencias/e2e/` `EV_CP-S12_duplicado_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S13 — Mensaje claro con fecha vacía (reprueba INC-002)

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E5 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Mensaje claro con fecha vacía (reprueba INC-002) |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Formulario vacío |
| Pasos | Pulsar Guardar |
| Resultado esperado | "Ingrese una fecha de nacimiento válida." sin texto de formato |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S13 |
| Evidencia | `evidencias/e2e/` `EV_CP-S13_mensaje-fecha_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S14 — Desactivar y reactivar

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E2 |
| Criterio de la línea base (avance 1) | CA07 |
| Objetivo | Desactivar y reactivar |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Estudiante `1-1111-1115` |
| Pasos | Desactivar; mostrar desactivados; Reactivar |
| Resultado esperado | Se oculta, aparece como Desactivado y se reactiva |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S14 |
| Evidencia | `evidencias/e2e/` `EV_CP-S14_desactivado_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S15 — Docente consulta sin modificar

| Campo | Valor |
|---|---|
| Historia / escenario | HU07 |
| Criterio de la línea base (avance 1) | CA07 |
| Objetivo | Docente consulta sin modificar |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | docente@robles.test |
| Pasos | Abrir Estudiantes |
| Resultado esperado | Lista visible sin botones de registro ni edición |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S15 |
| Evidencia | `evidencias/e2e/` `EV_CP-S15_docente_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S16 — Pantallas sin violaciones WCAG detectables (axe-core)

| Campo | Valor |
|---|---|
| Historia / escenario | RNF03, RNF04 · WCAG 2.2 AA |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Pantallas sin violaciones WCAG detectables (axe-core) |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Cuentas de plataforma y de Los Robles |
| Pasos | Abrir ingreso, inicio, instituciones, mi institución, estudiantes y el formulario con errores; ejecutar axe-core en cada estado |
| Resultado esperado | 0 violaciones de las reglas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` y `wcag22aa`; informe JSON por pantalla |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S16 |
| Evidencia | `evidencias/e2e/` `EV_CP-S16_formulario-errores_<dispositivo>_20261105.png` · informes `evidencias/accesibilidad/axe_<pantalla>_<dispositivo>.json` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S17 — Inicio de sesión solo con teclado y foco visible

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E1 · WCAG 2.1.1, 2.4.7 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Inicio de sesión solo con teclado y foco visible |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | admin@robles.test |
| Pasos | Tab al correo; escribir; Tab a la contraseña; escribir; Enter |
| Resultado esperado | El foco recorre los campos en orden, es visible y se ingresa sin ratón |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S17 |
| Evidencia | `evidencias/e2e/` `EV_CP-S17_paso_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S18 — Nivel preseleccionado aunque los niveles carguen tarde (reprueba INC-004)

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E1 · INC-004 |
| Criterio de la línea base (avance 1) | CA07 |
| Objetivo | Nivel preseleccionado aunque los niveles carguen tarde (reprueba INC-004) |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | `/my-institution/` retrasado 1,5 s |
| Pasos | Abrir Estudiantes; Registrar estudiante |
| Resultado esperado | El campo Nivel muestra "Primaria" |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S18 |
| Evidencia | `evidencias/e2e/` `EV_CP-S18_nivel-preseleccionado_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S19 — Una validación tardía de la sesión anterior no cierra la sesión nueva (reprueba INC-007)

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E1 · INC-007 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Una validación tardía de la sesión anterior no cierra la sesión nueva (reprueba INC-007) |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Token inválido de una sesión anterior en el navegador; `/auth/me/` retrasado 1,5 s |
| Pasos | Ingresar como admin@robles.test; esperar 2,5 s |
| Resultado esperado | Se ingresa y la sesión se conserva (saludo y botón Cerrar sesión visibles) |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S19 |
| Evidencia | `evidencias/e2e/` `EV_CP-S19_sesion-conservada_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S20 — Una carga repetida no borra lo que se escribió (reprueba INC-008)

| Campo | Valor |
|---|---|
| Historia / escenario | HU05-E1 · INC-008 |
| Criterio de la línea base (avance 1) | CA05 (parcial) |
| Objetivo | Una carga repetida no borra lo que se escribió (reprueba INC-008) |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Segunda carga de `/my-institution/` retrasada 1,5 s |
| Pasos | Abrir Mi institución; escribir el teléfono; esperar 2 s |
| Resultado esperado | El campo conserva el teléfono escrito |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S20 |
| Evidencia | `evidencias/e2e/` `EV_CP-S20_valor-conservado_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S21 — Cerrar sesión y recargar enseguida no restaura la sesión (reprueba INC-009)

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E1 · INC-009 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Cerrar sesión y recargar enseguida no restaura la sesión (reprueba INC-009) |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | `/auth/logout/` retrasado 3 s |
| Pasos | Ingresar; Cerrar sesión; recargar de inmediato |
| Resultado esperado | Pantalla de ingreso y sin token en el navegador |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S21 |
| Evidencia | `evidencias/e2e/` `EV_CP-S21_sesion-cerrada_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

## 4. Casos de seguridad (revisión estática y de configuración)

### CP-SEG01 — Dependencias del frontend sin vulnerabilidades conocidas

| Campo | Valor |
|---|---|
| Requisito | RNF de seguridad · OWASP ASVS V14 (configuración) |
| Criterio de la línea base (avance 1) | Avance 1, secciones 2.3 (requisitos no funcionales) y 7.2 (OWASP ASVS 5.0) |
| Objetivo | Dependencias del frontend sin vulnerabilidades conocidas |
| Herramienta y comando | `npm audit` y `npm audit --omit=dev` |
| Resultado esperado | 0 avisos en producción; 0 críticos o altos en desarrollo |
| Resultado obtenido | Antes: 2 críticos y 11 moderados, todos de desarrollo (INC-005). Después de vitest 4.1.12: 0 en producción y 7 moderados de minimatch, aceptados |
| Estado | Aprobado con riesgo residual aceptado |
| Evidencia | `evidencias/seguridad/EV_SEG-npm-audit_antes_20261105.txt` · `EV_SEG-npm-audit_despues_20261105.txt` |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-05 |

### CP-SEG02 — Dependencias del backend sin vulnerabilidades conocidas

| Campo | Valor |
|---|---|
| Requisito | RNF de seguridad · OWASP ASVS V14 |
| Criterio de la línea base (avance 1) | Avance 1, secciones 2.3 (requisitos no funcionales) y 7.2 (OWASP ASVS 5.0) |
| Objetivo | Dependencias del backend sin vulnerabilidades conocidas |
| Herramienta y comando | `pip-audit -r requirements.txt` (pip-audit 2.9.0) |
| Resultado esperado | 0 vulnerabilidades |
| Resultado obtenido | 0 en 10 paquetes |
| Estado | Aprobado |
| Evidencia | `evidencias/seguridad/EV_SEG-pip-audit_20261105.txt` |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-05 |

### CP-SEG03 — Sin secretos reales en el repositorio ni en su historial

| Campo | Valor |
|---|---|
| Requisito | RNF de seguridad · OWASP ASVS V13 (secretos) |
| Criterio de la línea base (avance 1) | Avance 1, secciones 2.3 (requisitos no funcionales) y 7.2 (OWASP ASVS 5.0) |
| Objetivo | Sin secretos reales en el repositorio ni en su historial |
| Herramienta y comando | `scripts/secret_scan.py` sobre `git log -p --all` |
| Resultado esperado | Solo valores de prueba ficticios |
| Resultado obtenido | 7 coincidencias, todas esperadas: contraseña de las cuentas ficticias, contraseña de pruebas, clave de desarrollo y URL de la base local |
| Estado | Aprobado |
| Evidencia | `evidencias/seguridad/EV_SEG-secretos_20261105.txt` |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-05 |

### CP-SEG04 — La sesión usa cookies HttpOnly y protección CSRF, como fija la arquitectura aprobada

| Campo | Valor |
|---|---|
| Requisito | Avance 1, sección 7.1 · OWASP ASVS V3 (sesiones) |
| Criterio de la línea base (avance 1) | Avance 1, secciones 2.3 (requisitos no funcionales) y 7.2 (OWASP ASVS 5.0) |
| Objetivo | La sesión usa cookies HttpOnly y protección CSRF, como fija la arquitectura aprobada |
| Herramienta y comando | Revisión de `frontend/src/api/client.ts` y `config/settings.py` |
| Resultado esperado | Credencial de sesión no accesible desde JavaScript |
| Resultado obtenido | El token se guarda en `localStorage` y se envía como `Authorization: Token` → **INC-006** |
| Estado | Fallido |
| Evidencia | Revisión de código · [Revisión de seguridad](Revision-seguridad.md) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-05 |

## 5. Historial de versiones

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 2026-11-04 | Versión inicial: 44 casos para HU01 – HU07. |
| 1.1 | 2026-11-05 | Anexo de correcciones del avance 1: cada caso indica su criterio CA01 – CA24 de la línea base. Nuevos CP-A26, CP-A27, CP-U05 – CP-U07, CP-S16 – CP-S21 y CP-SEG01 – CP-SEG04 (seguridad, accesibilidad e INC-003 – INC-009). Evidencias de las ejecuciones EJ-14 – EJ-22. |
