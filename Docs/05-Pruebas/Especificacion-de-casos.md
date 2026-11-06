# Especificación de casos de prueba — Nexora

| Campo | Valor |
|---|---|
| Código | S3-03 / S4-03 (casos CA01 – CA16 del backlog original) |
| Responsables | Wilberth (diseño), Luis (API), Samuel (interfaz) |
| Versión | 1.0 |
| Fecha | 2026-11-04 |
| Norma | ISO/IEC/IEEE 29119-3, "Test Case Specification" |
| Plan | [Plan de pruebas](Plan-de-pruebas.md) |

Cada caso documenta los campos de la sección 15 de las instrucciones: ID, historia, objetivo, precondiciones, datos,
pasos, resultado esperado, resultado obtenido, estado, evidencia, responsable y fecha. El resultado obtenido corresponde
a la última ejecución registrada en el [Registro de ejecución](Registro-de-ejecucion.md).

## Resumen

| Nivel | Casos | Pruebas automatizadas | Historias |
|---|---|---|---|
| API e integración (CP-A) | 25 | 60 (pytest) | HU01 – HU07, RN, RNF |
| Unitarias de interfaz (CP-U) | 4 | 12 (Vitest) | HU01 – HU03, HU07 |
| Sistema (CP-S) | 15 | 30 (Playwright: 15 × 2 dispositivos) | HU01 – HU07 |
| **Total** | **44** | **102** | |

## 1. Casos de API e integración (pytest)

### CP-A01 — Iniciar sesión con credenciales válidas

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E1 |
| Objetivo | Iniciar sesión con credenciales válidas |
| Precondiciones | Cuenta `admin@robles.test` activa. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Correo y contraseña correctos |
| Pasos | POST `/auth/login/` |
| Resultado esperado | 200 con token, rol e institución; sin contraseña en la respuesta |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu01_e1_inicio_de_sesion_exitoso` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A02 — Normalizar el correo al iniciar sesión

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E2 |
| Objetivo | Normalizar el correo al iniciar sesión |
| Precondiciones | Cuenta `admin@robles.test` activa. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `  Admin@Robles.test ` |
| Pasos | POST `/auth/login/` |
| Resultado esperado | 200 |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu01_e2_correo_con_mayusculas_y_espacios` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A03 — Mismo mensaje para contraseña incorrecta y correo inexistente

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E3 |
| Objetivo | Mismo mensaje para contraseña incorrecta y correo inexistente |
| Precondiciones | Cuenta activa. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Contraseña incorrecta; correo inexistente |
| Pasos | POST `/auth/login/` con cada variante |
| Resultado esperado | 400 `invalid_credentials` "Correo o contraseña incorrectos." en ambos casos |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu01_e3_credenciales_invalidas_mismo_mensaje[contrasena-incorrecta]`<br>`test_hu01_e3_credenciales_invalidas_mismo_mensaje[correo-inexistente]` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A04 — Impedir el acceso a cuentas o instituciones desactivadas

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E4 |
| Objetivo | Impedir el acceso a cuentas o instituciones desactivadas |
| Precondiciones | Cuenta o institución con `is_active = false`. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Credenciales correctas |
| Pasos | POST `/auth/login/` |
| Resultado esperado | 403 `account_disabled` |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu01_e4_cuenta_desactivada`<br>`test_hu01_e4_institucion_desactivada_impide_acceso` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A05 — Rechazar campos vacíos

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E5 |
| Objetivo | Rechazar campos vacíos |
| Precondiciones | Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Correo y contraseña vacíos |
| Pasos | POST `/auth/login/` |
| Resultado esperado | 400 con errores en `email` y `password` |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu01_e5_campos_vacios` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A06 — Cerrar sesión invalida el token

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E1, E3 |
| Objetivo | Cerrar sesión invalida el token |
| Precondiciones | Sesión iniciada. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Token del usuario |
| Pasos | POST `/auth/logout/`; luego GET `/auth/me/` con el mismo token |
| Resultado esperado | 204; luego 401 "Debe iniciar sesión." |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu02_e1_cerrar_sesion_elimina_el_token`<br>`test_hu02_e3_token_anterior_ya_no_es_valido` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A07 — Permisos por rol en la API

| Campo | Valor |
|---|---|
| Historia / escenario | HU03-E2, E3 |
| Objetivo | Permisos por rol en la API |
| Precondiciones | Usuarios de cada rol. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Docente, plataforma y administrativo |
| Pasos | Llamar rutas de otro rol |
| Resultado esperado | 403 para docente en gestión; 403 para plataforma en datos escolares |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu03_e3_docente_no_modifica_la_institucion`<br>`test_hu03_e3_docente_no_accede_a_gestion_de_instituciones`<br>`test_hu03_e2_plataforma_no_accede_a_gestion_escolar`<br>`test_hu04_solo_plataforma_registra_instituciones` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A08 — Registrar institución con su administradora

| Campo | Valor |
|---|---|
| Historia / escenario | HU04-E1, E2 |
| Objetivo | Registrar institución con su administradora |
| Precondiciones | Sesión de `platform_admin`. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Escuela Los Robles (primaria); Colegio Monteverde (primaria y secundaria) |
| Pasos | POST `/institutions/` |
| Resultado esperado | 201; institución activa; administradora puede iniciar sesión; niveles ordenados |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu04_e1_registrar_institucion_y_administradora`<br>`test_hu04_e2_institucion_con_varios_niveles` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A09 — Rechazar nombre duplicado sin distinguir mayúsculas

| Campo | Valor |
|---|---|
| Historia / escenario | HU04-E3 |
| Objetivo | Rechazar nombre duplicado sin distinguir mayúsculas |
| Precondiciones | Existe Escuela Los Robles. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `escuela los robles` |
| Pasos | POST `/institutions/` |
| Resultado esperado | 409 y no se crea la cuenta administradora |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu04_e3_nombre_duplicado_sin_distinguir_mayusculas` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A10 — Validar niveles y correo de la administradora

| Campo | Valor |
|---|---|
| Historia / escenario | HU04-E4 |
| Objetivo | Validar niveles y correo de la administradora |
| Precondiciones | Sesión de `platform_admin`. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Niveles `[]`, `universidad`, repetidos; correo ya usado |
| Pasos | POST `/institutions/` |
| Resultado esperado | 400 con el campo señalado; no se crea nada |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu04_e4_niveles_invalidos[levels0]`<br>`test_hu04_e4_niveles_invalidos[levels1]`<br>`test_hu04_e4_niveles_invalidos[levels2]`<br>`test_hu04_e4_correo_de_administradora_en_uso` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A11 — Actualizar datos y niveles de mi institución

| Campo | Valor |
|---|---|
| Historia / escenario | HU05-E1, E2 |
| Objetivo | Actualizar datos y niveles de mi institución |
| Precondiciones | Sesión de `admin@robles.test`. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Teléfono 2222-3333, dirección Heredia; nivel preescolar |
| Pasos | PATCH `/my-institution/` |
| Resultado esperado | 200 y los cambios persisten |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu05_e1_actualizar_datos_de_mi_institucion`<br>`test_hu05_e2_agregar_nivel` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A12 — Rechazar datos inválidos y quitar nivel en uso

| Campo | Valor |
|---|---|
| Historia / escenario | HU05-E3, E4 |
| Objetivo | Rechazar datos inválidos y quitar nivel en uso |
| Precondiciones | Estudiante activo en primaria. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Nombre en blanco; correo inválido; quitar primaria |
| Pasos | PATCH `/my-institution/` |
| Resultado esperado | 400 con el campo señalado; datos sin cambios |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu05_e3_datos_invalidos_no_se_guardan[name-   ]`<br>`test_hu05_e3_datos_invalidos_no_se_guardan[email-no-es-correo]`<br>`test_hu05_e4_no_quitar_nivel_con_estudiantes_activos` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A13 — Cada institución lista solo sus estudiantes

| Campo | Valor |
|---|---|
| Historia / escenario | HU06-E1, E2 |
| Objetivo | Cada institución lista solo sus estudiantes |
| Precondiciones | Estudiantes en dos instituciones, uno con identificación repetida. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `3-3333-3333` en ambas |
| Pasos | GET `/students/` con cada administradora |
| Resultado esperado | Cada lista contiene solo los suyos |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu06_e1_lista_solo_estudiantes_de_mi_institucion`<br>`test_hu06_e2_misma_identificacion_en_dos_instituciones` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A14 — Estudiante de otra institución es inaccesible

| Campo | Valor |
|---|---|
| Historia / escenario | HU06-E3 |
| Objetivo | Estudiante de otra institución es inaccesible |
| Precondiciones | Estudiante de Monteverde. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Identificador del estudiante ajeno; campo `institution` manipulado |
| Pasos | GET, PATCH (editar, desactivar) y POST con institución ajena |
| Resultado esperado | 404 sin cambios; el POST se asigna a la institución propia |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu06_e3_estudiante_de_otra_institucion_responde_404[consultar]`<br>`test_hu06_e3_estudiante_de_otra_institucion_responde_404[editar]`<br>`test_hu06_e3_estudiante_de_otra_institucion_responde_404[desactivar]`<br>`test_hu06_e3_no_se_puede_crear_en_otra_institucion` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A15 — Institución ajena es inaccesible

| Campo | Valor |
|---|---|
| Historia / escenario | HU06-E4 |
| Objetivo | Institución ajena es inaccesible |
| Precondiciones | Dos instituciones. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Identificador de Monteverde |
| Pasos | GET y PATCH `/institutions/{id}/` como administradora de Los Robles |
| Resultado esperado | 404 sin cambios |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu06_e4_institucion_ajena_responde_404[get]`<br>`test_hu06_e4_institucion_ajena_responde_404[patch]`<br>`test_hu06_e4_mi_institucion_devuelve_la_propia` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A16 — Registrar estudiante activo

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E1 |
| Objetivo | Registrar estudiante activo |
| Precondiciones | Sesión de `admin@robles.test`. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `1-1111-1111`, Ana Mora, 2016-03-14, primaria; formato multipart y JSON |
| Pasos | POST `/students/` |
| Resultado esperado | 201; estudiante activo de Los Robles |
| Resultado obtenido | Ejecución 1: **falló** (estudiante inactivo) → INC-001 / ADLCDS-103. Reprueba: aprobado |
| Estado | Aprobado tras reprueba |
| Pruebas automatizadas | `test_hu07_e1_registrar_estudiante`<br>`test_adlcds_103_estudiante_nuevo_queda_activo_en_cualquier_formato[multipart]`<br>`test_adlcds_103_estudiante_nuevo_queda_activo_en_cualquier_formato[json]` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A17 — Editar y desactivar estudiante

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E2 |
| Objetivo | Editar y desactivar estudiante |
| Precondiciones | Estudiante existente. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Apellido Vargas; `is_active=false` |
| Pasos | PATCH `/students/{id}/`; GET con y sin `include_inactive` |
| Resultado esperado | Cambio guardado; desactivados ocultos salvo filtro |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu07_e2_editar_apellido`<br>`test_hu07_e2_desactivados_ocultos_salvo_filtro` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A18 — Buscar por nombre, apellido o identificación

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E3 |
| Objetivo | Buscar por nombre, apellido o identificación |
| Precondiciones | Dos estudiantes. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `ana`, `MORA`, `1111` |
| Pasos | GET `/students/?search=` |
| Resultado esperado | Solo la coincidencia |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu07_e3_buscar_por_nombre_apellido_o_identificacion[ana]`<br>`test_hu07_e3_buscar_por_nombre_apellido_o_identificacion[MORA]`<br>`test_hu07_e3_buscar_por_nombre_apellido_o_identificacion[1111]` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A19 — Rechazar identificación duplicada al registrar y al editar

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E4 |
| Objetivo | Rechazar identificación duplicada al registrar y al editar |
| Precondiciones | Existe `1-1111-1111`. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | ` 1-1111-1111 ` (con espacios) |
| Pasos | POST y PATCH `/students/` |
| Resultado esperado | 409 "Ya existe un estudiante con esa identificación." |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu07_e4_identificacion_duplicada`<br>`test_hu07_e4_editar_a_identificacion_existente` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A20 — Validar fecha de nacimiento y nivel con mensajes claros

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E5 |
| Objetivo | Validar fecha de nacimiento y nivel con mensajes claros |
| Precondiciones | Institución de primaria. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | Fecha de mañana; fecha vacía, nula, `14/03/2016`; nivel secundaria |
| Pasos | POST `/students/` |
| Resultado esperado | 400 con mensajes "La fecha de nacimiento no puede ser futura.", "Ingrese una fecha de nacimiento válida." y "El nivel no pertenece a la institución." |
| Resultado obtenido | Aprobado. Las variantes de fecha vacía se agregaron como regresión de INC-002 / ADLCDS-104 |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu07_e5_fecha_de_nacimiento_futura`<br>`test_adlcds_104_fecha_invalida_con_mensaje_claro[vacia]`<br>`test_adlcds_104_fecha_invalida_con_mensaje_claro[nula]`<br>`test_adlcds_104_fecha_invalida_con_mensaje_claro[formato]`<br>`test_hu07_e5_nivel_que_no_pertenece_a_la_institucion` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A21 — Validar formato de identificación

| Campo | Valor |
|---|---|
| Historia / escenario | RN04 |
| Objetivo | Validar formato de identificación |
| Precondiciones | Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | `123`, 21 caracteres, `1-111/111` |
| Pasos | POST `/students/` |
| Resultado esperado | 400 en `identification` |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_rn04_formato_de_identificacion[123]`<br>`test_rn04_formato_de_identificacion[111111111111111111111]`<br>`test_rn04_formato_de_identificacion[1-111/111]` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A22 — Docente solo consulta; no existe borrado físico

| Campo | Valor |
|---|---|
| Historia / escenario | HU07, RN06 |
| Objetivo | Docente solo consulta; no existe borrado físico |
| Precondiciones | Docente y estudiante de Los Robles. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | — |
| Pasos | GET, POST, PATCH como docente; DELETE como administrativo |
| Resultado esperado | 200 / 403 / 403; DELETE 405 y el registro sigue |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_hu07_docente_consulta_pero_no_modifica`<br>`test_rn06_no_existe_borrado_fisico` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A23 — Contraseñas con hash y API protegida

| Campo | Valor |
|---|---|
| Historia / escenario | RNF01, RNF02 |
| Objetivo | Contraseñas con hash y API protegida |
| Precondiciones | Cuenta creada. Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | — |
| Pasos | Leer el hash guardado; GET a rutas protegidas sin token |
| Resultado esperado | Hash distinto de la contraseña; 401 en todas |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_rnf01_contrasena_guardada_con_hash`<br>`test_rnf02_api_exige_sesion` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A24 — Servicio disponible y formato único de errores

| Campo | Valor |
|---|---|
| Historia / escenario | Humo · Estándares §3 |
| Objetivo | Servicio disponible y formato único de errores |
| Precondiciones | Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | — |
| Pasos | GET y POST `/health/`; error no controlado |
| Resultado esperado | 200 ok; 405 con formato estándar; 500 sin traza |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_health_responde_ok_sin_autenticacion`<br>`test_metodo_no_permitido_usa_formato_estandar_de_error`<br>`test_error_no_controlado_devuelve_500_sin_traza` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

### CP-A25 — Datos ficticios de 3 instituciones

| Campo | Valor |
|---|---|
| Historia / escenario | S3-05 |
| Objetivo | Datos ficticios de 3 instituciones |
| Precondiciones | Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py` |
| Datos de prueba | — |
| Pasos | Ejecutar `seed_demo` dos veces |
| Resultado esperado | 3 instituciones, 1 cuenta de plataforma, identificación repetida en 2 instituciones; sin duplicados |
| Resultado obtenido | Coincide con el esperado |
| Estado | Aprobado |
| Pruebas automatizadas | `test_seed_demo_carga_tres_instituciones_y_es_idempotente` |
| Evidencia | `evidencias/EV_pytest_reprueba-INC-001_20261104.txt` · artefacto `reportes-backend` de CI |
| Responsable | Luis |
| Fecha | 2026-11-04 |

## 2. Casos unitarios de interfaz (Vitest)

### CP-U01 — Traducir errores de la API a mensajes legibles

| Campo | Valor |
|---|---|
| Historia / escenario | RNF04 |
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
| Fecha | 2026-11-04 |

### CP-U02 — Formulario de inicio de sesión

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E1, E3, E5 |
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
| Fecha | 2026-11-04 |

### CP-U03 — Dirección interna sin sesión lleva al inicio de sesión

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E2 |
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
| Fecha | 2026-11-04 |

### CP-U04 — Menú y acceso por rol en la interfaz

| Campo | Valor |
|---|---|
| Historia / escenario | HU03-E1, E2, E3; HU07 |
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
| Fecha | 2026-11-04 |

## 3. Casos de sistema (Playwright)

### CP-S01 — Inicio de sesión de la administradora

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E1 |
| Objetivo | Inicio de sesión de la administradora |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | admin@robles.test |
| Pasos | Ingresar correo y contraseña; pulsar Ingresar |
| Resultado esperado | Saludo y nombre de Escuela Los Robles |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S01 |
| Evidencia | `evidencias/e2e/` `EV_CP-S01_inicio_<dispositivo>_20261104.png` |
| Responsable | Samuel |
| Fecha | 2026-11-04 |

### CP-S02 — Credenciales inválidas

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E3 |
| Objetivo | Credenciales inválidas |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Contraseña `incorrecta` |
| Pasos | Ingresar datos; pulsar Ingresar |
| Resultado esperado | Alerta "Correo o contraseña incorrectos." |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S02 |
| Evidencia | `evidencias/e2e/` `EV_CP-S02_mensaje_<dispositivo>_20261104.png` |
| Responsable | Samuel |
| Fecha | 2026-11-04 |

### CP-S03 — Campos obligatorios

| Campo | Valor |
|---|---|
| Historia / escenario | HU01-E5 |
| Objetivo | Campos obligatorios |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Campos vacíos |
| Pasos | Pulsar Ingresar |
| Resultado esperado | "Ingrese su correo." e "Ingrese su contraseña." |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S03 |
| Evidencia | `evidencias/e2e/` `EV_CP-S03_validacion_<dispositivo>_20261104.png` |
| Responsable | Samuel |
| Fecha | 2026-11-04 |

### CP-S04 — Cerrar sesión y volver atrás

| Campo | Valor |
|---|---|
| Historia / escenario | HU02-E1, E2 |
| Objetivo | Cerrar sesión y volver atrás |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | admin@robles.test |
| Pasos | Ingresar; abrir Estudiantes; Cerrar sesión; Atrás |
| Resultado esperado | Se muestra el inicio de sesión en ambos pasos |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S04 |
| Evidencia | `evidencias/e2e/` `EV_CP-S04_sesion-cerrada_<dispositivo>_20261104.png` |
| Responsable | Samuel |
| Fecha | 2026-11-04 |

### CP-S05 — Menú por rol

| Campo | Valor |
|---|---|
| Historia / escenario | HU03-E1, E2 |
| Objetivo | Menú por rol |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | admin@robles.test; plataforma@nexora.test |
| Pasos | Ingresar con cada cuenta y leer el menú |
| Resultado esperado | Inicio · Mi institución · Estudiantes / Inicio · Instituciones |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S05 |
| Evidencia | `evidencias/e2e/` `EV_CP-S05_menu-administrativo_<dispositivo>_20261104.png`, `EV_CP-S05_menu-plataforma_<dispositivo>_20261104.png` |
| Responsable | Samuel |
| Fecha | 2026-11-04 |

### CP-S06 — Docente en pantalla de administración

| Campo | Valor |
|---|---|
| Historia / escenario | HU03-E3 |
| Objetivo | Docente en pantalla de administración |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | docente@robles.test |
| Pasos | Ingresar; abrir `/instituciones` |
| Resultado esperado | "No tiene permiso para realizar esta acción." |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S06 |
| Evidencia | `evidencias/e2e/` `EV_CP-S06_acceso-restringido_<dispositivo>_20261104.png` |
| Responsable | Samuel |
| Fecha | 2026-11-04 |

### CP-S07 — Registrar institución y entrar con su administradora

| Campo | Valor |
|---|---|
| Historia / escenario | HU04-E1 |
| Objetivo | Registrar institución y entrar con su administradora |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Nombre y correo únicos por ejecución |
| Pasos | Llenar formulario; Guardar; cerrar sesión; ingresar con la nueva cuenta |
| Resultado esperado | Confirmación, fila en la tabla y acceso de la nueva administradora |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S07 |
| Evidencia | `evidencias/e2e/` `EV_CP-S07_formulario_<dispositivo>_20261104.png`, `EV_CP-S07_registrada_<dispositivo>_20261104.png` |
| Responsable | Samuel |
| Fecha | 2026-11-04 |

### CP-S08 — Nombre de institución duplicado

| Campo | Valor |
|---|---|
| Historia / escenario | HU04-E3 |
| Objetivo | Nombre de institución duplicado |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | `escuela los robles` |
| Pasos | Llenar formulario; Guardar |
| Resultado esperado | Alerta "Ya existe una institución con ese nombre." |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S08 |
| Evidencia | `evidencias/e2e/` `EV_CP-S08_duplicado_<dispositivo>_20261104.png` |
| Responsable | Samuel |
| Fecha | 2026-11-04 |

### CP-S09 — Actualizar teléfono de mi institución

| Campo | Valor |
|---|---|
| Historia / escenario | HU05-E1 |
| Objetivo | Actualizar teléfono de mi institución |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Teléfono 2222-xxxx |
| Pasos | Editar teléfono; Guardar cambios; recargar |
| Resultado esperado | "Datos actualizados." y el valor persiste |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S09 |
| Evidencia | `evidencias/e2e/` `EV_CP-S09_actualizado_<dispositivo>_20261104.png` |
| Responsable | Samuel |
| Fecha | 2026-11-04 |

### CP-S10 — Aislamiento visible en la lista

| Campo | Valor |
|---|---|
| Historia / escenario | HU06-E1, E2 |
| Objetivo | Aislamiento visible en la lista |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | admin@robles.test; admin@monteverde.test |
| Pasos | Abrir Estudiantes con cada cuenta |
| Resultado esperado | Cada lista muestra solo su estudiante con `3-3333-3333` |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S10 |
| Evidencia | `evidencias/e2e/` `EV_CP-S10_robles_<dispositivo>_20261104.png`, `EV_CP-S10_monteverde_<dispositivo>_20261104.png` |
| Responsable | Samuel |
| Fecha | 2026-11-04 |

### CP-S11 — Registrar y buscar estudiante

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E1, E3 |
| Objetivo | Registrar y buscar estudiante |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Identificación `E2E-xxxxxxxx` |
| Pasos | Registrar; buscar por identificación |
| Resultado esperado | Confirmación y una sola fila coincidente |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S11 |
| Evidencia | `evidencias/e2e/` `EV_CP-S11_registrado_<dispositivo>_20261104.png` |
| Responsable | Samuel |
| Fecha | 2026-11-04 |

### CP-S12 — Identificación duplicada

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E4 |
| Objetivo | Identificación duplicada |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | `1-1111-1111` |
| Pasos | Registrar con identificación existente |
| Resultado esperado | Alerta "Ya existe un estudiante con esa identificación." |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S12 |
| Evidencia | `evidencias/e2e/` `EV_CP-S12_duplicado_<dispositivo>_20261104.png` |
| Responsable | Samuel |
| Fecha | 2026-11-04 |

### CP-S13 — Mensaje claro con fecha vacía (reprueba INC-002)

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E5 |
| Objetivo | Mensaje claro con fecha vacía (reprueba INC-002) |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Formulario vacío |
| Pasos | Pulsar Guardar |
| Resultado esperado | "Ingrese una fecha de nacimiento válida." sin texto de formato |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S13 |
| Evidencia | `evidencias/e2e/` `EV_CP-S13_mensaje-fecha_<dispositivo>_20261104.png` |
| Responsable | Samuel |
| Fecha | 2026-11-04 |

### CP-S14 — Desactivar y reactivar

| Campo | Valor |
|---|---|
| Historia / escenario | HU07-E2 |
| Objetivo | Desactivar y reactivar |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | Estudiante `1-1111-1115` |
| Pasos | Desactivar; mostrar desactivados; Reactivar |
| Resultado esperado | Se oculta, aparece como Desactivado y se reactiva |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S14 |
| Evidencia | `evidencias/e2e/` `EV_CP-S14_desactivado_<dispositivo>_20261104.png` |
| Responsable | Samuel |
| Fecha | 2026-11-04 |

### CP-S15 — Docente consulta sin modificar

| Campo | Valor |
|---|---|
| Historia / escenario | HU07 |
| Objetivo | Docente consulta sin modificar |
| Precondiciones | Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7) |
| Datos de prueba | docente@robles.test |
| Pasos | Abrir Estudiantes |
| Resultado esperado | Lista visible sin botones de registro ni edición |
| Resultado obtenido | Coincide con el esperado en computadora y teléfono |
| Estado | Aprobado |
| Prueba automatizada | `frontend/e2e/*.spec.ts` › CP-S15 |
| Evidencia | `evidencias/e2e/` `EV_CP-S15_docente_<dispositivo>_20261104.png` |
| Responsable | Samuel |
| Fecha | 2026-11-04 |

## 4. Historial de versiones

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 2026-11-04 | Versión inicial: 44 casos para HU01 – HU07. |
