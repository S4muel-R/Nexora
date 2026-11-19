# Especificación de casos de prueba — Nexora

| Campo | Valor |
|---|---|
| Código | S3-03 / S4-03 (casos CA01 – CA16 del backlog original) · S7-14 (accesibilidad) · ADLCDS-112 – 116 |
| Responsables | Wilberth (diseño), Luis (API), Samuel (interfaz) |
| Versión | 1.2 |
| Fecha | 2026-11-18 |
| Norma | ISO/IEC/IEEE 29119-3, "Test Case Specification" |
| Plan | [Plan de pruebas](Plan-de-pruebas.md) |

Cada caso documenta los campos de la sección 15 de las instrucciones: ID, historia, objetivo, precondiciones, datos,
pasos, resultado esperado, resultado obtenido, estado, evidencia, responsable y fecha. El resultado obtenido corresponde
a la última ejecución registrada en el [Registro de ejecución](Registro-de-ejecucion.md).

## Resumen

| Nivel | Casos | Pruebas automatizadas | Historias |
|---|---|---|---|
| API e integración (CP-A) | 50 | 111 (pytest) | HU01 – HU12, RN, RNF |
| Unitarias de interfaz (CP-U) | 15 | 50 (Vitest) | HU01 – HU05, HU07 – HU12 |
| Sistema (CP-S) | 34 | 68 (Playwright: 34 × 2 dispositivos), también sobre la versión compilada y con latencia | HU01 – HU12, RNF03, RNF04, WCAG |
| Seguridad (CP-SEG) | 4 | Herramientas de análisis (no se cuentan como pruebas automatizadas) | RNF de seguridad |
| **Total** | **103** | **229** | |

Resultado de la última ejecución: **103 de 103 casos aprobados** (CP-SEG01 con riesgo residual aceptado; CP-SEG04
aprobado tras corregir INC-006; CP-S25, CP-S29 y CP-S10 tras corregir INC-010, INC-011 e INC-012).

Correspondencia con la **línea base del avance 1** (CA01 – CA24): CP-A01 – CP-A30, CP-U01 – CP-U09 y CP-S01 – CP-S21
cubren CA01 – CA08; los casos del tercer incremento (CP-A31 – CP-A50, CP-U10 – CP-U15 y CP-S22 – CP-S34, del
2026-11-18) cubren el periodo lectivo de CA05 y CA09 – CA24 (HU08 – HU12). El detalle bidireccional está en la
[Matriz de trazabilidad](../02-Requisitos/Matriz-de-trazabilidad.md), sección 2.

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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A06 — Cerrar sesión invalida la sesión en el servidor

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E1, E3 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Cerrar sesión invalida la sesión en el servidor |
| Precondiciones | Sesión iniciada. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Cookie de sesión del usuario |
| Pasos | POST `/auth/logout/`; luego GET `/auth/me/` con la cookie anterior |
| Resultado esperado | 204 y la sesión eliminada en el servidor (desde INC-012 la cookie no se vacía); luego 401 "Debe iniciar sesión." |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu02_e1_cerrar_sesion_elimina_la_sesion`<br>`test_hu02_e3_sesion_anterior_ya_no_es_valida` |
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A11 — Actualizar datos y niveles de mi institución

| Campo | Valor |
|---|---|
| Historia / escenario | HU05-E1, E2 |
| Criterio de la línea base (avance 1) | CA05 (niveles; el periodo lectivo está en CP-A31) |
| Objetivo | Actualizar datos y niveles de mi institución |
| Precondiciones | Sesión de `admin@robles.test`. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Teléfono 2222-3333, dirección Heredia; nivel preescolar |
| Pasos | PATCH `/my-institution/` |
| Resultado esperado | 200 y los cambios persisten |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu05_e1_actualizar_datos_de_mi_institucion`<br>`test_hu05_e2_agregar_nivel` |
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
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
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A27 — Una sesión anterior inválida no impide iniciar sesión

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E1 · INC-007 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Una sesión anterior inválida no impide iniciar sesión |
| Precondiciones | Cuenta `admin@robles.test` activa. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Cookie `sessionid` inválida y encabezado `Authorization` de una versión anterior |
| Pasos | POST `/auth/login/`; GET `/auth/me/` |
| Resultado esperado | 200 y la sesión nueva queda activa (antes: 401 "Debe iniciar sesión.") |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_inc_007_sesion_anterior_invalida_no_impide_iniciar_sesion` |
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A28 — Sesión en cookie HttpOnly, SameSite=Lax, con vencimiento por inactividad

| Campo | Valor |
|---|---|
| Historia / escenario | RF01 · INC-006 · avance 1 §7.1 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Sesión en cookie HttpOnly, SameSite=Lax, con vencimiento por inactividad |
| Precondiciones | Cuenta activa. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Correo y contraseña válidos |
| Pasos | POST `/auth/login/`; leer la cookie; GET `/auth/me/` |
| Resultado esperado | Respuesta sin token; cookie `sessionid` HttpOnly y SameSite=Lax con `max-age` de 2 h, renovada en cada petición |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_inc_006_sesion_en_cookie_httponly_samesite`<br>`test_inc_006_sesion_vence_por_inactividad`<br>`test_hu01_e1_inicio_de_sesion_exitoso` |
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A29 — Las escrituras exigen el token CSRF

| Campo | Valor |
|---|---|
| Historia / escenario | RF01 · INC-006 · OWASP ASVS V3 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Las escrituras exigen el token CSRF |
| Precondiciones | Sesión iniciada con verificación CSRF activa. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Sin y con `X-CSRFToken` |
| Pasos | GET `/auth/csrf/`; POST `/auth/logout/` sin token y con token |
| Resultado esperado | 403 sin token; 204 con token; la cookie `csrftoken` es legible por la interfaz (no HttpOnly) |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_inc_006_escrituras_exigen_token_csrf`<br>`test_inc_006_csrf_entrega_cookie_legible_por_la_interfaz` |
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A30 — Latencia configurable de la API de pruebas

| Campo | Valor |
|---|---|
| Historia / escenario | Plan de pruebas §5 (robustez) |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Latencia configurable de la API de pruebas |
| Precondiciones | Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `NEXORA_LATENCIA_MAX_MS` = 500 y sin definir |
| Pasos | Invocar el middleware con rutas de la API y fuera de ella |
| Resultado esperado | Demora entre 0 y 0,5 s solo en `/api/`; sin la variable no hay demora |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_latencia_aleatoria_solo_en_la_api`<br>`test_sin_variable_no_hay_latencia` |
| Evidencia | `evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11) |
| Responsable | Luis |
| Fecha | 2026-11-05 |

### CP-A31 — Definir el periodo lectivo vigente

| Campo | Valor |
|---|---|
| Historia / escenario | HU05-E5 |
| Criterio de la línea base (avance 1) | CA05 (periodo lectivo, GAP-01) |
| Objetivo | Definir el periodo lectivo vigente |
| Precondiciones | Sesión de `admin@robles.test`; periodo 2025 vigente. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | 2026, del 2026-02-02 al 2026-12-11; fechas invertidas; nombre repetido |
| Pasos | POST `/periods/`; como docente GET y POST |
| Resultado esperado | 201 y 2026 queda como único vigente; 400 "La fecha de fin debe ser posterior o igual a la de inicio."; 409 por nombre; docente 200 / 403 |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu05_e5_definir_periodo_vigente`<br>`test_hu05_e5_fechas_invertidas`<br>`test_hu05_e5_nombre_repetido`<br>`test_hu05_e5_docente_consulta_pero_no_crea` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A32 — Registrar docente con su cuenta

| Campo | Valor |
|---|---|
| Historia / escenario | HU08-E1 |
| Criterio de la línea base (avance 1) | CA09 |
| Objetivo | Registrar docente con su cuenta |
| Precondiciones | Sesión de `admin@robles.test`. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Laura Solís, `docente1@robles.test`, contraseña inicial; sin contraseña |
| Pasos | POST `/teachers/`; POST `/auth/login/` con la cuenta nueva |
| Resultado esperado | 201, docente activo con cuenta `teacher` de Los Robles que inicia sesión; sin contraseña: 400 "La contraseña inicial es obligatoria." |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu08_e1_ca09_registrar_docente_con_cuenta`<br>`test_hu08_e1_contrasena_inicial_obligatoria` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A33 — Docente desactivado no ingresa ni recibe asignaciones

| Campo | Valor |
|---|---|
| Historia / escenario | HU08-E2 |
| Criterio de la línea base (avance 1) | CA09 |
| Objetivo | Docente desactivado no ingresa ni recibe asignaciones |
| Precondiciones | Docente activo y grupo 4-A. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `is_active=false` |
| Pasos | PATCH `/teachers/{id}/`; iniciar sesión; listar; asignar al grupo |
| Resultado esperado | Cuenta desactivada: login 403; fuera de la lista; asignación rechazada (400) |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu08_e2_docente_desactivado_no_inicia_sesion_ni_se_asigna` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A34 — Rechazar correo de docente duplicado

| Campo | Valor |
|---|---|
| Historia / escenario | HU08-E3 |
| Criterio de la línea base (avance 1) | CA10 |
| Objetivo | Rechazar correo de docente duplicado |
| Precondiciones | Existe `docente1@robles.test`. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `DOCENTE1@robles.test` |
| Pasos | POST `/teachers/` |
| Resultado esperado | 409 "Ya existe una cuenta con ese correo." y no se crea otro docente |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu08_e3_ca10_correo_duplicado` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A35 — Solo el personal administrativo gestiona docentes de su institución

| Campo | Valor |
|---|---|
| Historia / escenario | HU08 · RN01, RN02 |
| Criterio de la línea base (avance 1) | CA02 (docentes) |
| Objetivo | Solo el personal administrativo gestiona docentes de su institución |
| Precondiciones | Docente de Los Robles. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Docente; administradora de Monteverde |
| Pasos | GET y POST `/teachers/`; GET `/teachers/{id}/` ajeno |
| Resultado esperado | 403 para docente; lista vacía y 404 para otra institución |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu08_solo_personal_administrativo`<br>`test_hu08_aislamiento_docentes` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A36 — Crear grupo y asignar estudiantes y docente

| Campo | Valor |
|---|---|
| Historia / escenario | HU09-E1 |
| Criterio de la línea base (avance 1) | CA11, CA13, CA15 |
| Objetivo | Crear grupo y asignar estudiantes y docente |
| Precondiciones | Periodo 2026; 25 estudiantes y una docente activos. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Grupo 4-A de primaria; estudiante inactivo o de otro nivel; periodo de otra institución |
| Pasos | POST `/groups/`, `/groups/{id}/students/`, `/groups/{id}/teachers/`; quitar |
| Resultado esperado | 201; el grupo muestra 25 estudiantes, su docente y el periodo; inactivos, otro nivel y periodo ajeno: 400 |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu09_e1_ca11_ca13_ca15_crear_grupo_y_asignar`<br>`test_hu09_estudiante_inactivo_o_de_otro_nivel`<br>`test_hu09_periodo_de_otra_institucion`<br>`test_hu09_quitar_estudiante_y_docente` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A37 — Trasladar estudiante entre grupos del periodo

| Campo | Valor |
|---|---|
| Historia / escenario | HU09-E2 |
| Criterio de la línea base (avance 1) | CA13 |
| Objetivo | Trasladar estudiante entre grupos del periodo |
| Precondiciones | Ana en 4-A; 4-B en el mismo periodo. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Ana, destino 4-B |
| Pasos | POST `/groups/{4-A}/transfer/` |
| Resultado esperado | 200; Ana deja 4-A y queda en 4-B |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu09_e2_ca13_trasladar_estudiante` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A38 — Un estudiante pertenece a un solo grupo por periodo

| Campo | Valor |
|---|---|
| Historia / escenario | HU09-E3 |
| Criterio de la línea base (avance 1) | CA14 |
| Objetivo | Un estudiante pertenece a un solo grupo por periodo |
| Precondiciones | Ana en 4-A; estudiante de Monteverde. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Ana a 4-B; estudiante ajeno |
| Pasos | POST `/groups/{4-B}/students/` |
| Resultado esperado | 409 "El estudiante ya pertenece a un grupo en este periodo."; el ajeno 400; 4-B sin cambios |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu09_e3_ca14_estudiante_ya_asignado_en_el_periodo`<br>`test_hu09_e3_ca14_estudiante_de_otra_institucion` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A39 — Código de grupo único en el periodo

| Campo | Valor |
|---|---|
| Historia / escenario | HU09-E4 |
| Criterio de la línea base (avance 1) | CA12 |
| Objetivo | Código de grupo único en el periodo |
| Precondiciones | Existe 4-A en 2026. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `4-a` en 2026; `4-A` en 2027 |
| Pasos | POST `/groups/` |
| Resultado esperado | 409 "Ya existe un grupo con ese código en este periodo."; en otro periodo 201 |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu09_e4_ca12_codigo_repetido_en_el_periodo` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A40 — Docente sin asignación y otra institución no acceden al grupo

| Campo | Valor |
|---|---|
| Historia / escenario | HU10-E5 · RN02 |
| Criterio de la línea base (avance 1) | CA02, CA16 |
| Objetivo | Docente sin asignación y otra institución no acceden al grupo |
| Precondiciones | Docente asignada solo a 4-A. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Grupo 4-B; administradora de Monteverde |
| Pasos | GET, POST y corrección sobre 4-B; GET y PATCH de grupos ajenos |
| Resultado esperado | 404 sin datos del grupo; ningún registro cambia |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_ca16_docente_solo_ve_sus_grupos`<br>`test_hu10_e5_ca16_docente_sin_asignacion`<br>`test_hu09_aislamiento_grupos`<br>`test_hu10_aislamiento_asistencia` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A41 — Registrar la asistencia del grupo en una fecha

| Campo | Valor |
|---|---|
| Historia / escenario | HU10-E1 |
| Criterio de la línea base (avance 1) | CA15, CA17 |
| Objetivo | Registrar la asistencia del grupo en una fecha |
| Precondiciones | 4-A con dos estudiantes y su docente. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | 2026-11-02, presente y ausente; lista incompleta; fecha futura o fuera del periodo; personal administrativo |
| Pasos | POST `/attendance/`; GET `/attendance/?group=&date=` |
| Resultado esperado | 201 y la lista muestra cada estado; 400 "Marque el estado de todos los estudiantes del grupo.", "La fecha no puede ser futura." o fuera del periodo; administrativo 403 |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu10_e1_ca15_ca17_registrar_asistencia`<br>`test_hu10_e1_debe_marcar_a_todos`<br>`test_hu10_e1_fecha_futura_o_fuera_del_periodo`<br>`test_hu10_personal_administrativo_consulta_pero_no_registra` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A42 — No duplicar la asistencia de una fecha

| Campo | Valor |
|---|---|
| Historia / escenario | HU10-E3 |
| Criterio de la línea base (avance 1) | CA18 |
| Objetivo | No duplicar la asistencia de una fecha |
| Precondiciones | Asistencia de 4-A del 2026-11-02 registrada. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Misma fecha |
| Pasos | POST `/attendance/` |
| Resultado esperado | 409 que indica corregirla; sigue un solo registro |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu10_e3_ca18_no_duplica_la_asistencia_del_dia` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A43 — Corregir con historial

| Campo | Valor |
|---|---|
| Historia / escenario | HU10-E2 |
| Criterio de la línea base (avance 1) | CA19 |
| Objetivo | Corregir con historial |
| Precondiciones | Ana ausente el 2026-11-02. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Presente, motivo "Llegó tarde"; mismo estado |
| Pasos | POST `/attendance/{id}/correct/` |
| Resultado esperado | 200; queda anterior, nuevo, motivo, usuario y fecha; mismo estado 400 |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu10_e2_ca19_corregir_conserva_historial`<br>`test_hu10_correccion_con_el_mismo_estado` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A44 — El motivo de la corrección es obligatorio

| Campo | Valor |
|---|---|
| Historia / escenario | HU10-E4 |
| Criterio de la línea base (avance 1) | CA20 |
| Objetivo | El motivo de la corrección es obligatorio |
| Precondiciones | Ana ausente. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Sin motivo, vacío y solo espacios |
| Pasos | POST `/attendance/{id}/correct/` |
| Resultado esperado | 400 "El motivo es obligatorio."; el estado no cambia |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu10_e4_ca20_motivo_obligatorio[None]`<br>`test_hu10_e4_ca20_motivo_obligatorio[]`<br>`test_hu10_e4_ca20_motivo_obligatorio[   ]` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A45 — Listados por grupo y estudiante con filtros

| Campo | Valor |
|---|---|
| Historia / escenario | HU11-E1, E2, E3 |
| Criterio de la línea base (avance 1) | CA21 |
| Objetivo | Listados por grupo y estudiante con filtros |
| Precondiciones | 4-A (2 estudiantes, docente) y 4-B; grupo 10-1 de secundaria. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Sin filtro; nivel secundaria; nivel sin resultados |
| Pasos | GET `/reports/groups/`, `/reports/students/` |
| Resultado esperado | Cada grupo con docente y cantidad; solo secundaria con su grupo; lista vacía |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu11_e1_ca21_listado_por_grupo`<br>`test_hu11_e2_ca21_filtro_por_nivel`<br>`test_hu11_e3_sin_resultados_devuelve_lista_vacia` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A46 — Docente y otra institución no obtienen listados generales

| Campo | Valor |
|---|---|
| Historia / escenario | HU11-E4 |
| Criterio de la línea base (avance 1) | CA22 |
| Objetivo | Docente y otra institución no obtienen listados generales |
| Precondiciones | Grupos de Los Robles. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Docente; administradora de Monteverde |
| Pasos | GET `/reports/groups/` y `/reports/students/` |
| Resultado esperado | 403 para docente; listas vacías para la otra institución |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu11_e4_ca22_docente_y_otra_institucion` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A47 — Resumen de asistencia por estudiante y del grupo

| Campo | Valor |
|---|---|
| Historia / escenario | HU12-E1, E2 |
| Criterio de la línea base (avance 1) | CA23 |
| Objetivo | Resumen de asistencia por estudiante y del grupo |
| Precondiciones | Asistencia de cinco fechas en 4-A. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | 2026-11-02 a 2026-11-06; fecha sin registro; docente de 4-A y de 4-B |
| Pasos | GET `/reports/attendance/` |
| Resultado esperado | Ana 5 presentes (100 %), Luis 2 ausentes (60 %), grupo 80 %; sin registro: `unrecorded`; docente 200 en 4-A y 404 en 4-B |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu12_e1_ca23_resumen_de_cinco_fechas`<br>`test_hu12_e1_estudiante_sin_registro_en_una_fecha`<br>`test_hu12_e2_docente_solo_sus_grupos` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A48 — Rechazar rango de fechas invertido

| Campo | Valor |
|---|---|
| Historia / escenario | HU12-E3 |
| Criterio de la línea base (avance 1) | CA24 |
| Objetivo | Rechazar rango de fechas invertido |
| Precondiciones | 4-A. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Del 2026-11-06 al 2026-11-02 |
| Pasos | GET `/reports/attendance/` |
| Resultado esperado | 400 "La fecha inicial debe ser anterior o igual a la final." |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu12_e3_ca24_rango_invertido` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A49 — Datos ficticios con periodo, docentes y grupos

| Campo | Valor |
|---|---|
| Historia / escenario | S3-05 · HU05-E5, HU08, HU09 |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Datos ficticios con periodo, docentes y grupos |
| Precondiciones | Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | — |
| Pasos | Ejecutar `seed_demo` y `seed_demo --reset` |
| Resultado esperado | 3 docentes; 4-A con 3 estudiantes y su docente en el periodo vigente; 4-B sin docente |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_seed_demo_carga_periodo_docentes_y_grupos` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

### CP-A50 — El cierre de una sesión anterior no borra la sesión iniciada después

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E1, HU01-E1 · INC-012 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | El cierre de una sesión anterior no borra la sesión iniciada después |
| Precondiciones | Dos sesiones de `admin@robles.test`. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Cookie de la sesión anterior |
| Pasos | POST `/auth/logout/` con la sesión anterior; GET `/auth/me/` con la nueva |
| Resultado esperado | 204 sin cookie de sesión vacía en la respuesta; la sesión nueva sigue activa (200); la sesión cerrada se elimina en el servidor |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_inc_012_cierre_tardio_no_borra_la_sesion_nueva`<br>`test_hu02_e1_cerrar_sesion_elimina_la_sesion` |
| Evidencia | `evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-18 |

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

### CP-U06 — Un 401 solo cierra la sesión si corresponde a la sesión vigente

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E3 · INC-007 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Un 401 solo cierra la sesión si corresponde a la sesión vigente |
| Precondiciones | Manejador de sesión vencida registrado |
| Datos de prueba | 401 de la sesión vigente; 401 tardío de una sesión ya reemplazada |
| Pasos | Ejecutar `apiGet('/auth/me/')` en cada caso |
| Resultado esperado | Se cierra la sesión en el primer caso; en el segundo se conserva la nueva |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `client.test.ts › sesión vencida (2 pruebas)` |
| Evidencia | Artefacto `reportes-frontend` de CI (`junit.xml`) |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-U07 — El cierre de sesión es inmediato en la interfaz y se completa en el servidor aunque se recargue

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E1 · INC-009 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | El cierre de sesión es inmediato en la interfaz y se completa en el servidor aunque se recargue |
| Precondiciones | Sesión iniciada; `POST /auth/logout/` sin respuesta; marca de cierre pendiente al abrir |
| Datos de prueba | — |
| Pasos | Pulsar Cerrar sesión; abrir la aplicación con la marca pendiente |
| Resultado esperado | Pantalla de ingreso y marca pendiente; al abrir, se llama a `/auth/logout/` antes que a `/auth/me/` y se borra la marca |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `App.test.tsx › INC-009 (2 pruebas)` |
| Evidencia | Artefacto `reportes-frontend` de CI (`junit.xml`) |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-U08 — La interfaz envía la cookie y el token CSRF, nunca un token propio

| Campo | Valor |
|---|---|
| Historia / escenario | RF01 · INC-006 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | La interfaz envía la cookie y el token CSRF, nunca un token propio |
| Precondiciones | — |
| Datos de prueba | Cookie `csrftoken` presente y ausente |
| Pasos | Ejecutar `apiPost('/students/')` |
| Resultado esperado | `credentials: include`, encabezado `X-CSRFToken`, sin `Authorization`; si falta la cookie, primero GET `/auth/csrf/` |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `client.test.ts › sesión en cookie con CSRF (2 pruebas)` |
| Evidencia | Artefacto `reportes-frontend` de CI (`junit.xml`) |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-U09 — Formularios de instituciones, mi institución y estudiantes

| Campo | Valor |
|---|---|
| Historia / escenario | HU04, HU05, HU07 · A11Y-01, A11Y-02 |
| Criterio de la línea base (avance 1) | CA03, CA05, CA07, CA08 |
| Objetivo | Formularios de instituciones, mi institución y estudiantes |
| Precondiciones | API simulada |
| Datos de prueba | Altas, errores de la API, desactivación y búsqueda |
| Pasos | Llenar y enviar cada formulario |
| Resultado esperado | Datos enviados a la API, confirmaciones y errores por campo; foco en el formulario al abrirlo; título de pestaña por pantalla |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `pages.test.tsx (9 pruebas)` |
| Evidencia | Artefacto `reportes-frontend` de CI (`junit.xml`) |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-U10 — Menú por rol con las opciones de HU08 – HU12

| Campo | Valor |
|---|---|
| Historia / escenario | HU03-E1, E3 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Menú por rol con las opciones de HU08 – HU12 |
| Precondiciones | Sesión simulada por rol |
| Datos de prueba | Administrativo, docente |
| Pasos | Abrir inicio y `/docentes` |
| Resultado esperado | Administrativo: siete opciones; docente sin Docentes y con acceso restringido a `/docentes` |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `App.test.tsx › HU03 (2 pruebas nuevas; HU03-E1 actualizada)` |
| Evidencia | `evidencias/EV_vitest_ejecucion-4_20261118.txt` · artefacto `reportes-frontend` de CI |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-U11 — Periodo lectivo y docentes

| Campo | Valor |
|---|---|
| Historia / escenario | HU05-E5, HU08-E1 – E3 |
| Criterio de la línea base (avance 1) | CA05, CA09, CA10 |
| Objetivo | Periodo lectivo y docentes |
| Precondiciones | API simulada |
| Datos de prueba | Periodo 2026; docente nuevo; correo duplicado |
| Pasos | Definir periodo; registrar y desactivar docente |
| Resultado esperado | Datos enviados, confirmaciones y alerta de duplicado; docente consulta periodos sin editarlos |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `academics.test.tsx › HU05-E5, HU08 (5 pruebas)` |
| Evidencia | `evidencias/EV_vitest_ejecucion-4_20261118.txt` · artefacto `reportes-frontend` de CI |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-U12 — Grupos: crear, asignar y trasladar; nivel preseleccionado aunque cargue tarde

| Campo | Valor |
|---|---|
| Historia / escenario | HU09-E1 – E3 · CA16 · INC-010 |
| Criterio de la línea base (avance 1) | CA11, CA13, CA14, CA16 |
| Objetivo | Grupos: crear, asignar y trasladar; nivel preseleccionado aunque cargue tarde |
| Precondiciones | API simulada; `/my-institution/` retrasado |
| Datos de prueba | Grupo 4-C; Ana ya en 4-A; traslado a 4-B; docente |
| Pasos | Crear y guardar; asignar; trasladar; abrir como docente |
| Resultado esperado | Botón deshabilitado hasta cargar los niveles y nivel preseleccionado; alerta de grupo del periodo; traslado enviado; docente sin edición |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `academics.test.tsx › HU09 (5 pruebas)` |
| Evidencia | `evidencias/EV_vitest_ejecucion-4_20261118.txt` · artefacto `reportes-frontend` de CI |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-U13 — Asistencia: registrar, modo corrección y motivo obligatorio; respuesta tardía descartada

| Campo | Valor |
|---|---|
| Historia / escenario | HU10-E1 – E4 · INC-011 |
| Criterio de la línea base (avance 1) | CA17 – CA20 |
| Objetivo | Asistencia: registrar, modo corrección y motivo obligatorio; respuesta tardía descartada |
| Precondiciones | API simulada; primera lista retrasada |
| Datos de prueba | Ana ausente; 409; corrección sin y con motivo; cambio de fecha durante la carga |
| Pasos | Marcar y guardar; corregir; cambiar la fecha antes de que responda la lista de hoy |
| Resultado esperado | Confirmación; modo corrección tras 409; "El motivo es obligatorio." en el campo; se muestra y guarda la fecha elegida |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `academics.test.tsx › HU10 (5 pruebas)` |
| Evidencia | `evidencias/EV_vitest_ejecucion-4_20261118.txt` · artefacto `reportes-frontend` de CI |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-U14 — Reportes: listados y resumen de asistencia

| Campo | Valor |
|---|---|
| Historia / escenario | HU11-E1, E3 · HU12-E1, E3 |
| Criterio de la línea base (avance 1) | CA21, CA23, CA24 |
| Objetivo | Reportes: listados y resumen de asistencia |
| Precondiciones | API simulada |
| Datos de prueba | Listado vacío; grupo con docente; resumen; rango invertido |
| Pasos | Abrir Reportes; consultar |
| Resultado esperado | "No hay registros para los filtros seleccionados." sin tabla; filas con docente y cantidad; porcentaje; error de rango; docente sin Listados |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `academics.test.tsx › HU11 y HU12 (4 pruebas)` |
| Evidencia | `evidencias/EV_vitest_ejecucion-4_20261118.txt` · artefacto `reportes-frontend` de CI |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-U15 — El inicio de sesión espera a que el servidor confirme el cierre anterior

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E1, HU01-E1 · INC-012 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | El inicio de sesión espera a que el servidor confirme el cierre anterior |
| Precondiciones | API simulada; respuesta de `/auth/logout/` retenida |
| Datos de prueba | Cierre como administradora; ingreso como docente |
| Pasos | Cerrar sesión; ingresar antes de que responda el cierre; liberar la respuesta |
| Resultado esperado | El ingreso se envía solo después de confirmar el cierre; luego se muestra el inicio de la docente |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `App.test.tsx › INC-012` |
| Evidencia | `evidencias/EV_vitest_ejecucion-4_20261118.txt` · artefacto `reportes-frontend` de CI |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

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
| Resultado esperado | Inicio · Mi institución · Estudiantes · Docentes · Grupos · Asistencia · Reportes / Inicio · Instituciones |
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
| Criterio de la línea base (avance 1) | CA05 |
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
| Criterio de la línea base (avance 1) | CA05 |
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

### CP-S21 — Un cierre de sesión que no llegó al servidor se completa al volver a abrir (reprueba INC-009)

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E1 · INC-009 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Un cierre de sesión que no llegó al servidor se completa al volver a abrir (reprueba INC-009) |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | El primer `POST /auth/logout/` se aborta |
| Pasos | Ingresar; Cerrar sesión; recargar de inmediato |
| Resultado esperado | Pantalla de ingreso y la API responde 401 en `/auth/me/` (la sesión quedó cerrada en el servidor) |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S21 |
| Evidencia | `evidencias/e2e/` `EV_CP-S21_sesion-cerrada_<dispositivo>_20261105.png` |
| Responsable | Samuel |
| Fecha | 2026-11-05 |

### CP-S22 — Definir el periodo lectivo vigente

| Campo | Valor |
|---|---|
| Historia / escenario | HU05-E5 |
| Criterio de la línea base (avance 1) | CA05 |
| Objetivo | Definir el periodo lectivo vigente |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | admin@arcoiris.test; nombre `E2E-xxxxxxxx`; fechas invertidas |
| Pasos | Definir periodo con fin anterior al inicio; corregir; Guardar; volver a marcar 2026 |
| Resultado esperado | Error en el campo Fin; luego "Periodo lectivo … guardado como vigente." y la fila Vigente |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S22 |
| Evidencia | `evidencias/e2e/` `EV_CP-S22_periodo-vigente_<dispositivo>_20261118.png` |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-S23 — Registrar docente, que ingresa, y desactivarlo

| Campo | Valor |
|---|---|
| Historia / escenario | HU08-E1, E2 |
| Criterio de la línea base (avance 1) | CA09 |
| Objetivo | Registrar docente, que ingresa, y desactivarlo |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Correo único por ejecución |
| Pasos | Registrar; ingresar con la cuenta nueva; desactivarla; intentar ingresar |
| Resultado esperado | Confirmación; la cuenta entra como Personal docente; tras desactivar: "Su cuenta está desactivada. Contacte a la administración." |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S23 |
| Evidencia | `evidencias/e2e/` `EV_CP-S23_registrado_<dispositivo>_20261118.png`, `EV_CP-S23_desactivado-sin-acceso_<dispositivo>_20261118.png` |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-S24 — Correo de docente duplicado

| Campo | Valor |
|---|---|
| Historia / escenario | HU08-E3 |
| Criterio de la línea base (avance 1) | CA10 |
| Objetivo | Correo de docente duplicado |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | `docente@robles.test` |
| Pasos | Registrar con correo existente |
| Resultado esperado | Alerta "Ya existe una cuenta con ese correo." |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S24 |
| Evidencia | `evidencias/e2e/` `EV_CP-S24_duplicado_<dispositivo>_20261118.png` |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-S25 — Crear grupo, asignar docente y validar duplicados

| Campo | Valor |
|---|---|
| Historia / escenario | HU09-E1, E3, E4 · HU11-E3 · INC-010 |
| Criterio de la línea base (avance 1) | CA11, CA12, CA14, CA15 |
| Objetivo | Crear grupo, asignar docente y validar duplicados |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Código `Gxxxxxxxx`; `4-A`; Ana (en 4-A) |
| Pasos | Crear 4-A repetido; crear grupo nuevo; asignar a Andrés; asignar a Ana; listado de estudiantes del grupo nuevo; quitar a Andrés |
| Resultado esperado | "Ya existe un grupo con ese código en este periodo."; grupo con su docente; "El estudiante ya pertenece a un grupo en este periodo."; "No hay registros para los filtros seleccionados." |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S25 |
| Evidencia | `evidencias/e2e/` `EV_CP-S25_codigo-duplicado_<dispositivo>_20261118.png`, `EV_CP-S25_grupo-creado_<dispositivo>_20261118.png`, `EV_CP-S25_sin-resultados_<dispositivo>_20261118.png` |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-S26 — Trasladar estudiante entre 4-A y 4-B

| Campo | Valor |
|---|---|
| Historia / escenario | HU09-E2 |
| Criterio de la línea base (avance 1) | CA13 |
| Objetivo | Trasladar estudiante entre 4-A y 4-B |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Diego Rodríguez Leiva |
| Pasos | Abrir su grupo; elegir destino; Trasladar; abrir el destino |
| Resultado esperado | Confirmación; deja el grupo de origen y aparece en el destino |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S26 |
| Evidencia | `evidencias/e2e/` `EV_CP-S26_trasladado_<dispositivo>_20261118.png` |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-S27 — El docente solo ve sus grupos y no obtiene listados

| Campo | Valor |
|---|---|
| Historia / escenario | HU10-E5, HU11-E4, HU12-E2 · CA16, CA22 |
| Criterio de la línea base (avance 1) | CA16, CA22 |
| Objetivo | El docente solo ve sus grupos y no obtiene listados |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | docente@robles.test; 4-B sin asignación |
| Pasos | Consultar la API (grupo, asistencia y listados); abrir Grupos y Reportes |
| Resultado esperado | API 404 / 404 / 403 / 403; solo 4-A en Grupos; Reportes sin Listados |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S27 |
| Evidencia | `evidencias/e2e/` `EV_CP-S27_docente-grupos_<dispositivo>_20261118.png` |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-S28 — Listados por grupo y nivel; otra institución no ve los grupos

| Campo | Valor |
|---|---|
| Historia / escenario | HU11-E1, E2 · CA22 |
| Criterio de la línea base (avance 1) | CA21, CA22 |
| Objetivo | Listados por grupo y nivel; otra institución no ve los grupos |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | admin@robles.test; admin@monteverde.test |
| Pasos | Abrir Reportes; filtrar por primaria; listado de estudiantes; repetir con Monteverde |
| Resultado esperado | 4-A con Andrés Castro Rojas; Ana en 4-A; Monteverde ve 10-1 y no 4-A |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S28 |
| Evidencia | `evidencias/e2e/` `EV_CP-S28_listados_<dispositivo>_20261118.png` |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-S29 — Registrar asistencia y reabrirla en modo corrección

| Campo | Valor |
|---|---|
| Historia / escenario | HU10-E1, E3 · INC-011 |
| Criterio de la línea base (avance 1) | CA15, CA17, CA18 |
| Objetivo | Registrar asistencia y reabrirla en modo corrección |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | docente@robles.test; 2026-11-02 (computadora) y 2026-11-03 (teléfono); Bruno ausente |
| Pasos | Elegir 4-A y la fecha; marcar; Guardar; recargar y volver a la fecha |
| Resultado esperado | "Asistencia de 4-A del … registrada." con la fecha elegida; al volver solo se ofrece Corregir |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S29 |
| Evidencia | `evidencias/e2e/` `EV_CP-S29_marcada_<dispositivo>_20261118.png`, `EV_CP-S29_modo-correccion_<dispositivo>_20261118.png` |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-S30 — Corregir con motivo obligatorio y conservar el historial

| Campo | Valor |
|---|---|
| Historia / escenario | HU10-E2, E4 |
| Criterio de la línea base (avance 1) | CA19, CA20 |
| Objetivo | Corregir con motivo obligatorio y conservar el historial |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Bruno ausente |
| Pasos | Corregir sin motivo; con "Llegó tarde" |
| Resultado esperado | "El motivo es obligatorio."; luego "Ausente → Presente: Llegó tarde (docente@robles.test, …)" |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S30 |
| Evidencia | `evidencias/e2e/` `EV_CP-S30_motivo-obligatorio_<dispositivo>_20261118.png`, `EV_CP-S30_historial_<dispositivo>_20261118.png` |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-S31 — Resumen de asistencia del grupo del docente

| Campo | Valor |
|---|---|
| Historia / escenario | HU12-E1, E2, E3 |
| Criterio de la línea base (avance 1) | CA23, CA24 |
| Objetivo | Resumen de asistencia del grupo del docente |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | docente@robles.test; noviembre de 2026 |
| Pasos | Verificar que 4-B no se ofrece; rango invertido; rango válido |
| Resultado esperado | "La fecha inicial debe ser anterior o igual a la final."; 100 % por estudiante y del grupo |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S31 |
| Evidencia | `evidencias/e2e/` `EV_CP-S31_rango-invertido_<dispositivo>_20261118.png`, `EV_CP-S31_resumen_<dispositivo>_20261118.png` |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-S33 — Un cierre tardío no cierra la sesión iniciada después en la misma página

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E1, HU01-E1 · INC-012 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Un cierre tardío no cierra la sesión iniciada después en la misma página |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Respuesta de `/auth/logout/` retrasada 2 s; admin@robles.test y admin@monteverde.test |
| Pasos | Ingresar; Cerrar sesión; ingresar enseguida con otra cuenta sin recargar; abrir Estudiantes; recargar a los 2,5 s |
| Resultado esperado | La segunda sesión sigue activa y muestra a Calderón Mora, Javier |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S33 |
| Evidencia | `evidencias/e2e/` `EV_CP-S33_sesion-siguiente-conservada_<dispositivo>_20261118.png` |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-S34 — Un cierre tardío no cierra la sesión iniciada después de recargar

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E1, HU01-E1 · INC-012 |
| Criterio de la línea base (avance 1) | CA01 |
| Objetivo | Un cierre tardío no cierra la sesión iniciada después de recargar |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Respuesta de `/auth/logout/` retrasada 2 s |
| Pasos | Ingresar; Cerrar sesión; abrir `/ingresar` e ingresar con otra cuenta; abrir Estudiantes; recargar a los 2,5 s |
| Resultado esperado | La segunda sesión sigue activa. Pasa también sin la corrección (ver INC-012): el caso de recarga lo cubre CP-A50 |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S34 |
| Evidencia | `evidencias/e2e/` `EV_CP-S34_sesion-siguiente-conservada_<dispositivo>_20261118.png` |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

### CP-S32 — Pantallas de HU05-E5 y HU08 – HU12 sin violaciones WCAG detectables

| Campo | Valor |
|---|---|
| Historia / escenario | RNF03, RNF04 · WCAG 2.2 AA |
| Criterio de la línea base (avance 1) | — (escenario agregado en el refinamiento) |
| Objetivo | Pantallas de HU05-E5 y HU08 – HU12 sin violaciones WCAG detectables |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | admin@robles.test; docente@robles.test |
| Pasos | axe-core en docentes con errores, detalle de grupo, reportes, periodos y lista de asistencia |
| Resultado esperado | 0 violaciones; informe JSON por pantalla |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S32 |
| Evidencia | `evidencias/e2e/` `EV_CP-S32_asistencia_<dispositivo>_20261118.png` · informes `evidencias/accesibilidad/axe_<pantalla>_<dispositivo>.json` |
| Responsable | Samuel |
| Fecha | 2026-11-18 |

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
| Resultado obtenido | Antes: token en `localStorage` (**INC-006**, fallido). Tras `796cef8`: cookie de sesión HttpOnly y SameSite=Lax, `X-CSRFToken` en las escrituras (CP-A28, CP-A29, CP-U08) |
| Estado | Aprobado tras INC-006 |
| Evidencia | Revisión de código · [Revisión de seguridad](Revision-seguridad.md) |
| Responsable | Samuel (revisión pendiente de Luis) |
| Fecha | 2026-11-05 |

## 5. Historial de versiones

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 2026-11-04 | Versión inicial: 44 casos para HU01 – HU07. |
| 1.1 | 2026-11-05 | Anexo de correcciones del avance 1: cada caso indica su criterio CA01 – CA24 de la línea base. Nuevos CP-A26 – CP-A30, CP-U05 – CP-U09, CP-S16 – CP-S21 y CP-SEG01 – CP-SEG04 (seguridad, accesibilidad, robustez e INC-003 – INC-009). Sesión en cookie HttpOnly (INC-006). Evidencias de las ejecuciones EJ-14 – EJ-25. |
| 1.2 | 2026-11-18 | Tercer incremento (HU05-E5, HU08 – HU12, ADLCDS-112 – 116): CP-A31 – CP-A50, CP-U10 – CP-U15 y CP-S22 – CP-S34; cubren CA09 – CA24. Reprueba de INC-010, INC-011 e INC-012. Ejecuciones EJ-26 – EJ-28. |
