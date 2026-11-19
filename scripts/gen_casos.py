"""Genera Docs/05-Pruebas/Especificacion-de-casos.md a partir de la lista de casos."""

import sys
from pathlib import Path

OUT = Path(sys.argv[1])
FECHA = "2026-11-05"
EV_API = "`evidencias/EV_pytest_ejecucion-6_20261105.txt` · artefacto `reportes-backend` de CI (EJ-11)"
PRE_API = "Base de datos de prueba vacía; datos creados por las fixtures de `tests/conftest.py`"

BASE = {
    "CP-A01": "CA01", "CP-A02": "CA01 (variante)", "CP-A07": "CA01 (en la API), CA04", "CP-A08": "CA03",
    "CP-A11": "CA05 (parcial: el periodo lectivo no está implementado)", "CP-A14": "CA02 (parcial: sin grupos todavía)",
    "CP-A15": "CA06", "CP-A16": "CA07", "CP-A17": "CA07", "CP-A18": "CA07", "CP-A19": "CA08",
    "CP-U02": "CA01", "CP-U04": "CA01", "CP-U05": "CA07",
    "CP-S01": "CA01", "CP-S05": "CA01", "CP-S06": "CA02 (pantalla)", "CP-S07": "CA03", "CP-S09": "CA05 (parcial)",
    "CP-S10": "CA02, CA06", "CP-S11": "CA07", "CP-S12": "CA08", "CP-S14": "CA07", "CP-S15": "CA07", "CP-S18": "CA07", "CP-S19": "CA01", "CP-A27": "CA01", "CP-U06": "CA01", "CP-U07": "CA01", "CP-S20": "CA05 (parcial)", "CP-S21": "CA01", "CP-A28": "CA01", "CP-A29": "CA01", "CP-U08": "CA01", "CP-U09": "CA03, CA05, CA07, CA08",
}
BASE.update({
    "CP-A31": "CA05 (periodo lectivo, GAP-01)", "CP-A32": "CA09", "CP-A33": "CA09", "CP-A34": "CA10", "CP-A35": "CA02 (docentes)",
    "CP-A36": "CA11, CA13, CA15", "CP-A37": "CA13", "CP-A38": "CA14", "CP-A39": "CA12", "CP-A40": "CA02, CA16",
    "CP-A41": "CA15, CA17", "CP-A42": "CA18", "CP-A43": "CA19", "CP-A44": "CA20", "CP-A45": "CA21", "CP-A46": "CA22",
    "CP-A47": "CA23", "CP-A48": "CA24",
    "CP-U10": "CA01", "CP-U11": "CA05, CA09, CA10", "CP-U12": "CA11, CA13, CA14, CA16", "CP-U13": "CA17 – CA20",
    "CP-U14": "CA21, CA23, CA24", "CP-U15": "CA01", "CP-S33": "CA01", "CP-S34": "CA01", "CP-A50": "CA01",
    "CP-S22": "CA05", "CP-S23": "CA09", "CP-S24": "CA10", "CP-S25": "CA11, CA12, CA14, CA15",
    "CP-S26": "CA13", "CP-S27": "CA16, CA22", "CP-S28": "CA21, CA22", "CP-S29": "CA15, CA17, CA18", "CP-S30": "CA19, CA20",
    "CP-S31": "CA23, CA24",
})
BASE["CP-A11"] = "CA05 (niveles; el periodo lectivo está en CP-A31)"
BASE["CP-S09"] = "CA05"
BASE["CP-S20"] = "CA05"
SIN_BASE = "— (escenario agregado en el refinamiento)"

# Casos del tercer incremento (HU05-E5, HU08 – HU12): fecha y evidencia propias.
FECHA_3 = "2026-11-18"
EV_API_3 = "`evidencias/EV_pytest_ejecucion-7_20261118.txt` · artefacto `reportes-backend` de CI (PR #12)"
NUEVOS = {f"CP-A{n}" for n in range(31, 51)} | {f"CP-U{n}" for n in range(10, 16)} | {f"CP-S{n}" for n in range(22, 35)}


def base(cid):
    return BASE.get(cid, SIN_BASE)


# (id, historia, objetivo, precondiciones, datos, pasos, esperado, pruebas automatizadas, obtenido, estado)
API = [
    ("CP-A01", "HU01-E1", "Iniciar sesión con credenciales válidas", "Cuenta `admin@robles.test` activa",
     "Correo y contraseña correctos", "POST `/auth/login/`",
     "200 con token, rol e institución; sin contraseña en la respuesta", ["test_hu01_e1_inicio_de_sesion_exitoso"]),
    ("CP-A02", "HU01-E2", "Normalizar el correo al iniciar sesión", "Cuenta `admin@robles.test` activa",
     "`  Admin@Robles.test `", "POST `/auth/login/`", "200", ["test_hu01_e2_correo_con_mayusculas_y_espacios"]),
    ("CP-A03", "HU01-E3", "Mismo mensaje para contraseña incorrecta y correo inexistente", "Cuenta activa",
     "Contraseña incorrecta; correo inexistente", "POST `/auth/login/` con cada variante",
     "400 `invalid_credentials` \"Correo o contraseña incorrectos.\" en ambos casos",
     ["test_hu01_e3_credenciales_invalidas_mismo_mensaje[contrasena-incorrecta]",
      "test_hu01_e3_credenciales_invalidas_mismo_mensaje[correo-inexistente]"]),
    ("CP-A04", "HU01-E4", "Impedir el acceso a cuentas o instituciones desactivadas", "Cuenta o institución con `is_active = false`",
     "Credenciales correctas", "POST `/auth/login/`", "403 `account_disabled`",
     ["test_hu01_e4_cuenta_desactivada", "test_hu01_e4_institucion_desactivada_impide_acceso"]),
    ("CP-A05", "HU01-E5", "Rechazar campos vacíos", "—", "Correo y contraseña vacíos", "POST `/auth/login/`",
     "400 con errores en `email` y `password`", ["test_hu01_e5_campos_vacios"]),
    ("CP-A06", "HU02-E1, E3", "Cerrar sesión invalida la sesión en el servidor", "Sesión iniciada", "Cookie de sesión del usuario",
     "POST `/auth/logout/`; luego GET `/auth/me/` con la cookie anterior", "204 y la sesión eliminada en el servidor (desde INC-012 la cookie no se vacía); luego 401 \"Debe iniciar sesión.\"",
     ["test_hu02_e1_cerrar_sesion_elimina_la_sesion", "test_hu02_e3_sesion_anterior_ya_no_es_valida"]),
    ("CP-A07", "HU03-E2, E3", "Permisos por rol en la API", "Usuarios de cada rol",
     "Docente, plataforma y administrativo", "Llamar rutas de otro rol",
     "403 para docente en gestión; 403 para plataforma en datos escolares",
     ["test_hu03_e3_docente_no_modifica_la_institucion", "test_hu03_e3_docente_no_accede_a_gestion_de_instituciones",
      "test_hu03_e2_plataforma_no_accede_a_gestion_escolar", "test_hu04_solo_plataforma_registra_instituciones"]),
    ("CP-A08", "HU04-E1, E2", "Registrar institución con su administradora", "Sesión de `platform_admin`",
     "Escuela Los Robles (primaria); Colegio Monteverde (primaria y secundaria)", "POST `/institutions/`",
     "201; institución activa; administradora puede iniciar sesión; niveles ordenados",
     ["test_hu04_e1_registrar_institucion_y_administradora", "test_hu04_e2_institucion_con_varios_niveles"]),
    ("CP-A09", "HU04-E3", "Rechazar nombre duplicado sin distinguir mayúsculas", "Existe Escuela Los Robles",
     "`escuela los robles`", "POST `/institutions/`", "409 y no se crea la cuenta administradora",
     ["test_hu04_e3_nombre_duplicado_sin_distinguir_mayusculas"]),
    ("CP-A10", "HU04-E4", "Validar niveles y correo de la administradora", "Sesión de `platform_admin`",
     "Niveles `[]`, `universidad`, repetidos; correo ya usado", "POST `/institutions/`",
     "400 con el campo señalado; no se crea nada",
     ["test_hu04_e4_niveles_invalidos[levels0]", "test_hu04_e4_niveles_invalidos[levels1]",
      "test_hu04_e4_niveles_invalidos[levels2]", "test_hu04_e4_correo_de_administradora_en_uso"]),
    ("CP-A11", "HU05-E1, E2", "Actualizar datos y niveles de mi institución", "Sesión de `admin@robles.test`",
     "Teléfono 2222-3333, dirección Heredia; nivel preescolar", "PATCH `/my-institution/`",
     "200 y los cambios persisten", ["test_hu05_e1_actualizar_datos_de_mi_institucion", "test_hu05_e2_agregar_nivel"]),
    ("CP-A12", "HU05-E3, E4", "Rechazar datos inválidos y quitar nivel en uso", "Estudiante activo en primaria",
     "Nombre en blanco; correo inválido; quitar primaria", "PATCH `/my-institution/`",
     "400 con el campo señalado; datos sin cambios",
     ["test_hu05_e3_datos_invalidos_no_se_guardan[name-   ]",
      "test_hu05_e3_datos_invalidos_no_se_guardan[email-no-es-correo]",
      "test_hu05_e4_no_quitar_nivel_con_estudiantes_activos"]),
    ("CP-A13", "HU06-E1, E2", "Cada institución lista solo sus estudiantes", "Estudiantes en dos instituciones, uno con identificación repetida",
     "`3-3333-3333` en ambas", "GET `/students/` con cada administradora", "Cada lista contiene solo los suyos",
     ["test_hu06_e1_lista_solo_estudiantes_de_mi_institucion", "test_hu06_e2_misma_identificacion_en_dos_instituciones"]),
    ("CP-A14", "HU06-E3", "Estudiante de otra institución es inaccesible", "Estudiante de Monteverde",
     "Identificador del estudiante ajeno; campo `institution` manipulado",
     "GET, PATCH (editar, desactivar) y POST con institución ajena",
     "404 sin cambios; el POST se asigna a la institución propia",
     ["test_hu06_e3_estudiante_de_otra_institucion_responde_404[consultar]",
      "test_hu06_e3_estudiante_de_otra_institucion_responde_404[editar]",
      "test_hu06_e3_estudiante_de_otra_institucion_responde_404[desactivar]",
      "test_hu06_e3_no_se_puede_crear_en_otra_institucion"]),
    ("CP-A15", "HU06-E4", "Institución ajena es inaccesible", "Dos instituciones", "Identificador de Monteverde",
     "GET y PATCH `/institutions/{id}/` como administradora de Los Robles", "404 sin cambios",
     ["test_hu06_e4_institucion_ajena_responde_404[get]", "test_hu06_e4_institucion_ajena_responde_404[patch]",
      "test_hu06_e4_mi_institucion_devuelve_la_propia"]),
    ("CP-A16", "HU07-E1", "Registrar estudiante activo", "Sesión de `admin@robles.test`",
     "`1-1111-1111`, Ana Mora, 2016-03-14, primaria; formato multipart y JSON", "POST `/students/`",
     "201; estudiante activo de Los Robles",
     ["test_hu07_e1_registrar_estudiante",
      "test_adlcds_103_estudiante_nuevo_queda_activo_en_cualquier_formato[multipart]",
      "test_adlcds_103_estudiante_nuevo_queda_activo_en_cualquier_formato[json]"],
     "Ejecución 1: **falló** (estudiante inactivo) → INC-001 / ADLCDS-103. Reprueba: aprobado", "Aprobado tras reprueba"),
    ("CP-A17", "HU07-E2", "Editar y desactivar estudiante", "Estudiante existente", "Apellido Vargas; `is_active=false`",
     "PATCH `/students/{id}/`; GET con y sin `include_inactive`", "Cambio guardado; desactivados ocultos salvo filtro",
     ["test_hu07_e2_editar_apellido", "test_hu07_e2_desactivados_ocultos_salvo_filtro"]),
    ("CP-A18", "HU07-E3", "Buscar por nombre, apellido o identificación", "Dos estudiantes",
     "`ana`, `MORA`, `1111`", "GET `/students/?search=`", "Solo la coincidencia",
     ["test_hu07_e3_buscar_por_nombre_apellido_o_identificacion[ana]",
      "test_hu07_e3_buscar_por_nombre_apellido_o_identificacion[MORA]",
      "test_hu07_e3_buscar_por_nombre_apellido_o_identificacion[1111]"]),
    ("CP-A19", "HU07-E4", "Rechazar identificación duplicada al registrar y al editar", "Existe `1-1111-1111`",
     "` 1-1111-1111 ` (con espacios)", "POST y PATCH `/students/`", "409 \"Ya existe un estudiante con esa identificación.\"",
     ["test_hu07_e4_identificacion_duplicada", "test_hu07_e4_editar_a_identificacion_existente"]),
    ("CP-A20", "HU07-E5", "Validar fecha de nacimiento y nivel con mensajes claros", "Institución de primaria",
     "Fecha de mañana; fecha vacía, nula, `14/03/2016`; nivel secundaria", "POST `/students/`",
     "400 con mensajes \"La fecha de nacimiento no puede ser futura.\", \"Ingrese una fecha de nacimiento válida.\" y \"El nivel no pertenece a la institución.\"",
     ["test_hu07_e5_fecha_de_nacimiento_futura", "test_adlcds_104_fecha_invalida_con_mensaje_claro[vacia]",
      "test_adlcds_104_fecha_invalida_con_mensaje_claro[nula]",
      "test_adlcds_104_fecha_invalida_con_mensaje_claro[formato]",
      "test_hu07_e5_nivel_que_no_pertenece_a_la_institucion"],
     "Aprobado. Las variantes de fecha vacía se agregaron como regresión de INC-002 / ADLCDS-104", "Aprobado"),
    ("CP-A21", "RN04", "Validar formato de identificación", "—", "`123`, 21 caracteres, `1-111/111`",
     "POST `/students/`", "400 en `identification`",
     ["test_rn04_formato_de_identificacion[123]", "test_rn04_formato_de_identificacion[111111111111111111111]",
      "test_rn04_formato_de_identificacion[1-111/111]"]),
    ("CP-A22", "HU07, RN06", "Docente solo consulta; no existe borrado físico", "Docente y estudiante de Los Robles",
     "—", "GET, POST, PATCH como docente; DELETE como administrativo", "200 / 403 / 403; DELETE 405 y el registro sigue",
     ["test_hu07_docente_consulta_pero_no_modifica", "test_rn06_no_existe_borrado_fisico"]),
    ("CP-A23", "RNF01, RNF02", "Contraseñas con hash y API protegida", "Cuenta creada", "—",
     "Leer el hash guardado; GET a rutas protegidas sin token", "Hash distinto de la contraseña; 401 en todas",
     ["test_rnf01_contrasena_guardada_con_hash", "test_rnf02_api_exige_sesion"]),
    ("CP-A24", "Humo · Estándares §3", "Servicio disponible y formato único de errores", "—", "—",
     "GET y POST `/health/`; error no controlado", "200 ok; 405 con formato estándar; 500 sin traza",
     ["test_health_responde_ok_sin_autenticacion", "test_metodo_no_permitido_usa_formato_estandar_de_error",
      "test_error_no_controlado_devuelve_500_sin_traza"]),
    ("CP-A25", "S3-05", "Datos ficticios de 3 instituciones", "—", "—", "Ejecutar `seed_demo` dos veces",
     "3 instituciones, 1 cuenta de plataforma, identificación repetida en 2 instituciones; sin duplicados",
     ["test_seed_demo_carga_tres_instituciones_y_es_idempotente"]),
    ("CP-A26", "RNF (seguridad) · INC-003", "Configuración segura en un ambiente publicado con HTTPS", "—",
     "`DJANGO_HTTPS=true` y `false`; clave aleatoria; `DEBUG=false`", "Ejecutar `manage.py check --deploy` en cada caso",
     "Con HTTPS: sin W004, W008, W012 ni W016 (solo W021, aceptada). Sin HTTPS: W008 presente",
     ["test_inc_003_ambiente_https_sin_advertencias_de_despliegue", "test_inc_003_sin_https_check_deploy_advierte"]),
    ("CP-A27", "HU01-E1 · INC-007", "Una sesión anterior inválida no impide iniciar sesión", "Cuenta `admin@robles.test` activa",
     "Cookie `sessionid` inválida y encabezado `Authorization` de una versión anterior", "POST `/auth/login/`; GET `/auth/me/`",
     "200 y la sesión nueva queda activa (antes: 401 \"Debe iniciar sesión.\")",
     ["test_inc_007_sesion_anterior_invalida_no_impide_iniciar_sesion"]),
    ("CP-A28", "RF01 · INC-006 · avance 1 §7.1", "Sesión en cookie HttpOnly, SameSite=Lax, con vencimiento por inactividad", "Cuenta activa",
     "Correo y contraseña válidos", "POST `/auth/login/`; leer la cookie; GET `/auth/me/`",
     "Respuesta sin token; cookie `sessionid` HttpOnly y SameSite=Lax con `max-age` de 2 h, renovada en cada petición",
     ["test_inc_006_sesion_en_cookie_httponly_samesite", "test_inc_006_sesion_vence_por_inactividad", "test_hu01_e1_inicio_de_sesion_exitoso"]),
    ("CP-A29", "RF01 · INC-006 · OWASP ASVS V3", "Las escrituras exigen el token CSRF", "Sesión iniciada con verificación CSRF activa",
     "Sin y con `X-CSRFToken`", "GET `/auth/csrf/`; POST `/auth/logout/` sin token y con token",
     "403 sin token; 204 con token; la cookie `csrftoken` es legible por la interfaz (no HttpOnly)",
     ["test_inc_006_escrituras_exigen_token_csrf", "test_inc_006_csrf_entrega_cookie_legible_por_la_interfaz"]),
    ("CP-A30", "Plan de pruebas §5 (robustez)", "Latencia configurable de la API de pruebas", "—", "`NEXORA_LATENCIA_MAX_MS` = 500 y sin definir",
     "Invocar el middleware con rutas de la API y fuera de ella", "Demora entre 0 y 0,5 s solo en `/api/`; sin la variable no hay demora",
     ["test_latencia_aleatoria_solo_en_la_api", "test_sin_variable_no_hay_latencia"]),
    ("CP-A31", "HU05-E5", "Definir el periodo lectivo vigente", "Sesión de `admin@robles.test`; periodo 2025 vigente",
     "2026, del 2026-02-02 al 2026-12-11; fechas invertidas; nombre repetido", "POST `/periods/`; como docente GET y POST",
     "201 y 2026 queda como único vigente; 400 \"La fecha de fin debe ser posterior o igual a la de inicio.\"; 409 por nombre; docente 200 / 403",
     ["test_hu05_e5_definir_periodo_vigente", "test_hu05_e5_fechas_invertidas", "test_hu05_e5_nombre_repetido",
      "test_hu05_e5_docente_consulta_pero_no_crea"]),
    ("CP-A32", "HU08-E1", "Registrar docente con su cuenta", "Sesión de `admin@robles.test`",
     "Laura Solís, `docente1@robles.test`, contraseña inicial; sin contraseña", "POST `/teachers/`; POST `/auth/login/` con la cuenta nueva",
     "201, docente activo con cuenta `teacher` de Los Robles que inicia sesión; sin contraseña: 400 \"La contraseña inicial es obligatoria.\"",
     ["test_hu08_e1_ca09_registrar_docente_con_cuenta", "test_hu08_e1_contrasena_inicial_obligatoria"]),
    ("CP-A33", "HU08-E2", "Docente desactivado no ingresa ni recibe asignaciones", "Docente activo y grupo 4-A",
     "`is_active=false`", "PATCH `/teachers/{id}/`; iniciar sesión; listar; asignar al grupo",
     "Cuenta desactivada: login 403; fuera de la lista; asignación rechazada (400)",
     ["test_hu08_e2_docente_desactivado_no_inicia_sesion_ni_se_asigna"]),
    ("CP-A34", "HU08-E3", "Rechazar correo de docente duplicado", "Existe `docente1@robles.test`", "`DOCENTE1@robles.test`",
     "POST `/teachers/`", "409 \"Ya existe una cuenta con ese correo.\" y no se crea otro docente", ["test_hu08_e3_ca10_correo_duplicado"]),
    ("CP-A35", "HU08 · RN01, RN02", "Solo el personal administrativo gestiona docentes de su institución", "Docente de Los Robles",
     "Docente; administradora de Monteverde", "GET y POST `/teachers/`; GET `/teachers/{id}/` ajeno", "403 para docente; lista vacía y 404 para otra institución",
     ["test_hu08_solo_personal_administrativo", "test_hu08_aislamiento_docentes"]),
    ("CP-A36", "HU09-E1", "Crear grupo y asignar estudiantes y docente", "Periodo 2026; 25 estudiantes y una docente activos",
     "Grupo 4-A de primaria; estudiante inactivo o de otro nivel; periodo de otra institución", "POST `/groups/`, `/groups/{id}/students/`, `/groups/{id}/teachers/`; quitar",
     "201; el grupo muestra 25 estudiantes, su docente y el periodo; inactivos, otro nivel y periodo ajeno: 400",
     ["test_hu09_e1_ca11_ca13_ca15_crear_grupo_y_asignar", "test_hu09_estudiante_inactivo_o_de_otro_nivel",
      "test_hu09_periodo_de_otra_institucion", "test_hu09_quitar_estudiante_y_docente"]),
    ("CP-A37", "HU09-E2", "Trasladar estudiante entre grupos del periodo", "Ana en 4-A; 4-B en el mismo periodo", "Ana, destino 4-B",
     "POST `/groups/{4-A}/transfer/`", "200; Ana deja 4-A y queda en 4-B", ["test_hu09_e2_ca13_trasladar_estudiante"]),
    ("CP-A38", "HU09-E3", "Un estudiante pertenece a un solo grupo por periodo", "Ana en 4-A; estudiante de Monteverde",
     "Ana a 4-B; estudiante ajeno", "POST `/groups/{4-B}/students/`",
     "409 \"El estudiante ya pertenece a un grupo en este periodo.\"; el ajeno 400; 4-B sin cambios",
     ["test_hu09_e3_ca14_estudiante_ya_asignado_en_el_periodo", "test_hu09_e3_ca14_estudiante_de_otra_institucion"]),
    ("CP-A39", "HU09-E4", "Código de grupo único en el periodo", "Existe 4-A en 2026", "`4-a` en 2026; `4-A` en 2027",
     "POST `/groups/`", "409 \"Ya existe un grupo con ese código en este periodo.\"; en otro periodo 201", ["test_hu09_e4_ca12_codigo_repetido_en_el_periodo"]),
    ("CP-A40", "HU10-E5 · RN02", "Docente sin asignación y otra institución no acceden al grupo", "Docente asignada solo a 4-A",
     "Grupo 4-B; administradora de Monteverde", "GET, POST y corrección sobre 4-B; GET y PATCH de grupos ajenos",
     "404 sin datos del grupo; ningún registro cambia",
     ["test_ca16_docente_solo_ve_sus_grupos", "test_hu10_e5_ca16_docente_sin_asignacion", "test_hu09_aislamiento_grupos",
      "test_hu10_aislamiento_asistencia"]),
    ("CP-A41", "HU10-E1", "Registrar la asistencia del grupo en una fecha", "4-A con dos estudiantes y su docente",
     "2026-11-02, presente y ausente; lista incompleta; fecha futura o fuera del periodo; personal administrativo",
     "POST `/attendance/`; GET `/attendance/?group=&date=`",
     "201 y la lista muestra cada estado; 400 \"Marque el estado de todos los estudiantes del grupo.\", \"La fecha no puede ser futura.\" o fuera del periodo; administrativo 403",
     ["test_hu10_e1_ca15_ca17_registrar_asistencia", "test_hu10_e1_debe_marcar_a_todos", "test_hu10_e1_fecha_futura_o_fuera_del_periodo",
      "test_hu10_personal_administrativo_consulta_pero_no_registra"]),
    ("CP-A42", "HU10-E3", "No duplicar la asistencia de una fecha", "Asistencia de 4-A del 2026-11-02 registrada", "Misma fecha",
     "POST `/attendance/`", "409 que indica corregirla; sigue un solo registro", ["test_hu10_e3_ca18_no_duplica_la_asistencia_del_dia"]),
    ("CP-A43", "HU10-E2", "Corregir con historial", "Ana ausente el 2026-11-02", "Presente, motivo \"Llegó tarde\"; mismo estado",
     "POST `/attendance/{id}/correct/`", "200; queda anterior, nuevo, motivo, usuario y fecha; mismo estado 400",
     ["test_hu10_e2_ca19_corregir_conserva_historial", "test_hu10_correccion_con_el_mismo_estado"]),
    ("CP-A44", "HU10-E4", "El motivo de la corrección es obligatorio", "Ana ausente", "Sin motivo, vacío y solo espacios",
     "POST `/attendance/{id}/correct/`", "400 \"El motivo es obligatorio.\"; el estado no cambia",
     ["test_hu10_e4_ca20_motivo_obligatorio[None]", "test_hu10_e4_ca20_motivo_obligatorio[]", "test_hu10_e4_ca20_motivo_obligatorio[   ]"]),
    ("CP-A45", "HU11-E1, E2, E3", "Listados por grupo y estudiante con filtros", "4-A (2 estudiantes, docente) y 4-B; grupo 10-1 de secundaria",
     "Sin filtro; nivel secundaria; nivel sin resultados", "GET `/reports/groups/`, `/reports/students/`",
     "Cada grupo con docente y cantidad; solo secundaria con su grupo; lista vacía",
     ["test_hu11_e1_ca21_listado_por_grupo", "test_hu11_e2_ca21_filtro_por_nivel", "test_hu11_e3_sin_resultados_devuelve_lista_vacia"]),
    ("CP-A46", "HU11-E4", "Docente y otra institución no obtienen listados generales", "Grupos de Los Robles",
     "Docente; administradora de Monteverde", "GET `/reports/groups/` y `/reports/students/`", "403 para docente; listas vacías para la otra institución",
     ["test_hu11_e4_ca22_docente_y_otra_institucion"]),
    ("CP-A47", "HU12-E1, E2", "Resumen de asistencia por estudiante y del grupo", "Asistencia de cinco fechas en 4-A",
     "2026-11-02 a 2026-11-06; fecha sin registro; docente de 4-A y de 4-B", "GET `/reports/attendance/`",
     "Ana 5 presentes (100 %), Luis 2 ausentes (60 %), grupo 80 %; sin registro: `unrecorded`; docente 200 en 4-A y 404 en 4-B",
     ["test_hu12_e1_ca23_resumen_de_cinco_fechas", "test_hu12_e1_estudiante_sin_registro_en_una_fecha", "test_hu12_e2_docente_solo_sus_grupos"]),
    ("CP-A48", "HU12-E3", "Rechazar rango de fechas invertido", "4-A", "Del 2026-11-06 al 2026-11-02", "GET `/reports/attendance/`",
     "400 \"La fecha inicial debe ser anterior o igual a la final.\"", ["test_hu12_e3_ca24_rango_invertido"]),
    ("CP-A49", "S3-05 · HU05-E5, HU08, HU09", "Datos ficticios con periodo, docentes y grupos", "—", "—", "Ejecutar `seed_demo` y `seed_demo --reset`",
     "3 docentes; 4-A con 3 estudiantes y su docente en el periodo vigente; 4-B sin docente",
     ["test_seed_demo_carga_periodo_docentes_y_grupos"]),
    ("CP-A50", "HU02-E1, HU01-E1 · INC-012", "El cierre de una sesión anterior no borra la sesión iniciada después", "Dos sesiones de `admin@robles.test`",
     "Cookie de la sesión anterior", "POST `/auth/logout/` con la sesión anterior; GET `/auth/me/` con la nueva",
     "204 sin cookie de sesión vacía en la respuesta; la sesión nueva sigue activa (200); la sesión cerrada se elimina en el servidor",
     ["test_inc_012_cierre_tardio_no_borra_la_sesion_nueva", "test_hu02_e1_cerrar_sesion_elimina_la_sesion"]),
]

UNIT = [
    ("CP-U01", "RNF04", "Traducir errores de la API a mensajes legibles", "—", "Respuestas 400 con campos, 502 HTML, falla de red",
     "Ejecutar `parseError` y `apiGet`", "Mensaje del servidor; mensaje genérico; \"No se pudo conectar con el servidor…\"",
     ["client.test.ts (4 pruebas)"]),
    ("CP-U02", "HU01-E1, E3, E5", "Formulario de inicio de sesión", "API simulada", "Campos vacíos; credenciales inválidas; válidas",
     "Pulsar Ingresar", "Mensajes de campo sin llamar a la API; alerta de credenciales; saludo y token guardado",
     ["App.test.tsx › HU01 (3 pruebas)"]),
    ("CP-U03", "HU02-E2", "Dirección interna sin sesión lleva al inicio de sesión", "Sin token", "`/estudiantes`",
     "Abrir la ruta", "Formulario de inicio de sesión", ["App.test.tsx › HU02-E2"]),
    ("CP-U04", "HU03-E1, E2, E3; HU07", "Menú y acceso por rol en la interfaz", "Sesión simulada por rol", "Administrativo, plataforma, docente",
     "Abrir inicio, `/instituciones`, `/estudiantes`", "Menú correcto por rol; acceso restringido; docente sin botón de registro",
     ["App.test.tsx › HU03 (4 pruebas)"]),
    ("CP-U05", "HU07-E1 · INC-004", "El registro se habilita al cargar los niveles y el único nivel queda preseleccionado",
     "API simulada; `/my-institution/` responde tarde",
     "Institución con un solo nivel (primaria)", "Ver el botón Registrar estudiante; liberar la respuesta; abrir el formulario",
     "Botón deshabilitado mientras carga; luego habilitado y Nivel en \"Primaria\"", ["App.test.tsx › INC-004"]),
    ("CP-U06", "HU02-E3 · INC-007", "Un 401 solo cierra la sesión si corresponde a la sesión vigente", "Manejador de sesión vencida registrado",
     "401 de la sesión vigente; 401 tardío de una sesión ya reemplazada", "Ejecutar `apiGet('/auth/me/')` en cada caso",
     "Se cierra la sesión en el primer caso; en el segundo se conserva la nueva",
     ["client.test.ts › sesión vencida (2 pruebas)"]),
    ("CP-U07", "HU02-E1 · INC-009", "El cierre de sesión es inmediato en la interfaz y se completa en el servidor aunque se recargue",
     "Sesión iniciada; `POST /auth/logout/` sin respuesta; marca de cierre pendiente al abrir", "—",
     "Pulsar Cerrar sesión; abrir la aplicación con la marca pendiente",
     "Pantalla de ingreso y marca pendiente; al abrir, se llama a `/auth/logout/` antes que a `/auth/me/` y se borra la marca",
     ["App.test.tsx › INC-009 (2 pruebas)"]),
    ("CP-U08", "RF01 · INC-006", "La interfaz envía la cookie y el token CSRF, nunca un token propio", "—",
     "Cookie `csrftoken` presente y ausente", "Ejecutar `apiPost('/students/')`",
     "`credentials: include`, encabezado `X-CSRFToken`, sin `Authorization`; si falta la cookie, primero GET `/auth/csrf/`",
     ["client.test.ts › sesión en cookie con CSRF (2 pruebas)"]),
    ("CP-U09", "HU04, HU05, HU07 · A11Y-01, A11Y-02", "Formularios de instituciones, mi institución y estudiantes", "API simulada",
     "Altas, errores de la API, desactivación y búsqueda", "Llenar y enviar cada formulario",
     "Datos enviados a la API, confirmaciones y errores por campo; foco en el formulario al abrirlo; título de pestaña por pantalla",
     ["pages.test.tsx (9 pruebas)"]),
    ("CP-U10", "HU03-E1, E3", "Menú por rol con las opciones de HU08 – HU12", "Sesión simulada por rol", "Administrativo, docente",
     "Abrir inicio y `/docentes`", "Administrativo: siete opciones; docente sin Docentes y con acceso restringido a `/docentes`",
     ["App.test.tsx › HU03 (2 pruebas nuevas; HU03-E1 actualizada)"]),
    ("CP-U11", "HU05-E5, HU08-E1 – E3", "Periodo lectivo y docentes", "API simulada", "Periodo 2026; docente nuevo; correo duplicado",
     "Definir periodo; registrar y desactivar docente", "Datos enviados, confirmaciones y alerta de duplicado; docente consulta periodos sin editarlos",
     ["academics.test.tsx › HU05-E5, HU08 (5 pruebas)"]),
    ("CP-U12", "HU09-E1 – E3 · CA16 · INC-010", "Grupos: crear, asignar y trasladar; nivel preseleccionado aunque cargue tarde",
     "API simulada; `/my-institution/` retrasado", "Grupo 4-C; Ana ya en 4-A; traslado a 4-B; docente",
     "Crear y guardar; asignar; trasladar; abrir como docente",
     "Botón deshabilitado hasta cargar los niveles y nivel preseleccionado; alerta de grupo del periodo; traslado enviado; docente sin edición",
     ["academics.test.tsx › HU09 (5 pruebas)"]),
    ("CP-U13", "HU10-E1 – E4 · INC-011", "Asistencia: registrar, modo corrección y motivo obligatorio; respuesta tardía descartada",
     "API simulada; primera lista retrasada", "Ana ausente; 409; corrección sin y con motivo; cambio de fecha durante la carga",
     "Marcar y guardar; corregir; cambiar la fecha antes de que responda la lista de hoy",
     "Confirmación; modo corrección tras 409; \"El motivo es obligatorio.\" en el campo; se muestra y guarda la fecha elegida",
     ["academics.test.tsx › HU10 (5 pruebas)"]),
    ("CP-U14", "HU11-E1, E3 · HU12-E1, E3", "Reportes: listados y resumen de asistencia", "API simulada", "Listado vacío; grupo con docente; resumen; rango invertido",
     "Abrir Reportes; consultar", "\"No hay registros para los filtros seleccionados.\" sin tabla; filas con docente y cantidad; porcentaje; error de rango; docente sin Listados",
     ["academics.test.tsx › HU11 y HU12 (4 pruebas)"]),
    ("CP-U15", "HU02-E1, HU01-E1 · INC-012", "El inicio de sesión espera a que el servidor confirme el cierre anterior",
     "API simulada; respuesta de `/auth/logout/` retenida", "Cierre como administradora; ingreso como docente",
     "Cerrar sesión; ingresar antes de que responda el cierre; liberar la respuesta",
     "El ingreso se envía solo después de confirmar el cierre; luego se muestra el inicio de la docente",
     ["App.test.tsx › INC-012"]),
]

PRE_S = "Servidores levantados con `seed_demo`; perfiles Playwright `computadora` (1280 × 800) y `telefono` (Pixel 7)"
SYSTEM = [
    ("CP-S01", "HU01-E1", "Inicio de sesión de la administradora", "admin@robles.test", "Ingresar correo y contraseña; pulsar Ingresar", "Saludo y nombre de Escuela Los Robles", "inicio"),
    ("CP-S02", "HU01-E3", "Credenciales inválidas", "Contraseña `incorrecta`", "Ingresar datos; pulsar Ingresar", "Alerta \"Correo o contraseña incorrectos.\"", "mensaje"),
    ("CP-S03", "HU01-E5", "Campos obligatorios", "Campos vacíos", "Pulsar Ingresar", "\"Ingrese su correo.\" e \"Ingrese su contraseña.\"", "validacion"),
    ("CP-S04", "HU02-E1, E2", "Cerrar sesión y volver atrás", "admin@robles.test", "Ingresar; abrir Estudiantes; Cerrar sesión; Atrás", "Se muestra el inicio de sesión en ambos pasos", "sesion-cerrada"),
    ("CP-S05", "HU03-E1, E2", "Menú por rol", "admin@robles.test; plataforma@nexora.test", "Ingresar con cada cuenta y leer el menú", "Inicio · Mi institución · Estudiantes · Docentes · Grupos · Asistencia · Reportes / Inicio · Instituciones", "menu-administrativo, menu-plataforma"),
    ("CP-S06", "HU03-E3", "Docente en pantalla de administración", "docente@robles.test", "Ingresar; abrir `/instituciones`", "\"No tiene permiso para realizar esta acción.\"", "acceso-restringido"),
    ("CP-S07", "HU04-E1", "Registrar institución y entrar con su administradora", "Nombre y correo únicos por ejecución", "Llenar formulario; Guardar; cerrar sesión; ingresar con la nueva cuenta", "Confirmación, fila en la tabla y acceso de la nueva administradora", "formulario, registrada"),
    ("CP-S08", "HU04-E3", "Nombre de institución duplicado", "`escuela los robles`", "Llenar formulario; Guardar", "Alerta \"Ya existe una institución con ese nombre.\"", "duplicado"),
    ("CP-S09", "HU05-E1", "Actualizar teléfono de mi institución", "Teléfono 2222-xxxx", "Editar teléfono; Guardar cambios; recargar", "\"Datos actualizados.\" y el valor persiste", "actualizado"),
    ("CP-S10", "HU06-E1, E2", "Aislamiento visible en la lista", "admin@robles.test; admin@monteverde.test", "Abrir Estudiantes con cada cuenta", "Cada lista muestra solo su estudiante con `3-3333-3333`", "robles, monteverde"),
    ("CP-S11", "HU07-E1, E3", "Registrar y buscar estudiante", "Identificación `E2E-xxxxxxxx`", "Registrar; buscar por identificación", "Confirmación y una sola fila coincidente", "registrado"),
    ("CP-S12", "HU07-E4", "Identificación duplicada", "`1-1111-1111`", "Registrar con identificación existente", "Alerta \"Ya existe un estudiante con esa identificación.\"", "duplicado"),
    ("CP-S13", "HU07-E5", "Mensaje claro con fecha vacía (reprueba INC-002)", "Formulario vacío", "Pulsar Guardar", "\"Ingrese una fecha de nacimiento válida.\" sin texto de formato", "mensaje-fecha"),
    ("CP-S14", "HU07-E2", "Desactivar y reactivar", "Estudiante `1-1111-1115`", "Desactivar; mostrar desactivados; Reactivar", "Se oculta, aparece como Desactivado y se reactiva", "desactivado"),
    ("CP-S15", "HU07", "Docente consulta sin modificar", "docente@robles.test", "Abrir Estudiantes", "Lista visible sin botones de registro ni edición", "docente"),
    ("CP-S16", "RNF03, RNF04 · WCAG 2.2 AA", "Pantallas sin violaciones WCAG detectables (axe-core)", "Cuentas de plataforma y de Los Robles", "Abrir ingreso, inicio, instituciones, mi institución, estudiantes y el formulario con errores; ejecutar axe-core en cada estado", "0 violaciones de las reglas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` y `wcag22aa`; informe JSON por pantalla", "formulario-errores"),
    ("CP-S17", "HU01-E1 · WCAG 2.1.1, 2.4.7", "Inicio de sesión solo con teclado y foco visible", "admin@robles.test", "Tab al correo; escribir; Tab a la contraseña; escribir; Enter", "El foco recorre los campos en orden, es visible y se ingresa sin ratón", "paso"),
    ("CP-S18", "HU07-E1 · INC-004", "Nivel preseleccionado aunque los niveles carguen tarde (reprueba INC-004)", "`/my-institution/` retrasado 1,5 s", "Abrir Estudiantes; Registrar estudiante", "El campo Nivel muestra \"Primaria\"", "nivel-preseleccionado"),
    ("CP-S19", "HU01-E1 · INC-007", "Una validación tardía de la sesión anterior no cierra la sesión nueva (reprueba INC-007)", "Token inválido de una sesión anterior en el navegador; `/auth/me/` retrasado 1,5 s", "Ingresar como admin@robles.test; esperar 2,5 s", "Se ingresa y la sesión se conserva (saludo y botón Cerrar sesión visibles)", "sesion-conservada"),
    ("CP-S20", "HU05-E1 · INC-008", "Una carga repetida no borra lo que se escribió (reprueba INC-008)", "Segunda carga de `/my-institution/` retrasada 1,5 s", "Abrir Mi institución; escribir el teléfono; esperar 2 s", "El campo conserva el teléfono escrito", "valor-conservado"),
    ("CP-S21", "HU02-E1 · INC-009", "Un cierre de sesión que no llegó al servidor se completa al volver a abrir (reprueba INC-009)", "El primer `POST /auth/logout/` se aborta", "Ingresar; Cerrar sesión; recargar de inmediato", "Pantalla de ingreso y la API responde 401 en `/auth/me/` (la sesión quedó cerrada en el servidor)", "sesion-cerrada"),
    ("CP-S22", "HU05-E5", "Definir el periodo lectivo vigente", "admin@arcoiris.test; nombre `E2E-xxxxxxxx`; fechas invertidas", "Definir periodo con fin anterior al inicio; corregir; Guardar; volver a marcar 2026", "Error en el campo Fin; luego \"Periodo lectivo … guardado como vigente.\" y la fila Vigente", "periodo-vigente"),
    ("CP-S23", "HU08-E1, E2", "Registrar docente, que ingresa, y desactivarlo", "Correo único por ejecución", "Registrar; ingresar con la cuenta nueva; desactivarla; intentar ingresar", "Confirmación; la cuenta entra como Personal docente; tras desactivar: \"Su cuenta está desactivada. Contacte a la administración.\"", "registrado, desactivado-sin-acceso"),
    ("CP-S24", "HU08-E3", "Correo de docente duplicado", "`docente@robles.test`", "Registrar con correo existente", "Alerta \"Ya existe una cuenta con ese correo.\"", "duplicado"),
    ("CP-S25", "HU09-E1, E3, E4 · HU11-E3 · INC-010", "Crear grupo, asignar docente y validar duplicados", "Código `Gxxxxxxxx`; `4-A`; Ana (en 4-A)", "Crear 4-A repetido; crear grupo nuevo; asignar a Andrés; asignar a Ana; listado de estudiantes del grupo nuevo; quitar a Andrés", "\"Ya existe un grupo con ese código en este periodo.\"; grupo con su docente; \"El estudiante ya pertenece a un grupo en este periodo.\"; \"No hay registros para los filtros seleccionados.\"", "codigo-duplicado, grupo-creado, sin-resultados"),
    ("CP-S26", "HU09-E2", "Trasladar estudiante entre 4-A y 4-B", "Diego Rodríguez Leiva", "Abrir su grupo; elegir destino; Trasladar; abrir el destino", "Confirmación; deja el grupo de origen y aparece en el destino", "trasladado"),
    ("CP-S27", "HU10-E5, HU11-E4, HU12-E2 · CA16, CA22", "El docente solo ve sus grupos y no obtiene listados", "docente@robles.test; 4-B sin asignación", "Consultar la API (grupo, asistencia y listados); abrir Grupos y Reportes", "API 404 / 404 / 403 / 403; solo 4-A en Grupos; Reportes sin Listados", "docente-grupos"),
    ("CP-S28", "HU11-E1, E2 · CA22", "Listados por grupo y nivel; otra institución no ve los grupos", "admin@robles.test; admin@monteverde.test", "Abrir Reportes; filtrar por primaria; listado de estudiantes; repetir con Monteverde", "4-A con Andrés Castro Rojas; Ana en 4-A; Monteverde ve 10-1 y no 4-A", "listados"),
    ("CP-S29", "HU10-E1, E3 · INC-011", "Registrar asistencia y reabrirla en modo corrección", "docente@robles.test; 2026-11-02 (computadora) y 2026-11-03 (teléfono); Bruno ausente", "Elegir 4-A y la fecha; marcar; Guardar; recargar y volver a la fecha", "\"Asistencia de 4-A del … registrada.\" con la fecha elegida; al volver solo se ofrece Corregir", "marcada, modo-correccion"),
    ("CP-S30", "HU10-E2, E4", "Corregir con motivo obligatorio y conservar el historial", "Bruno ausente", "Corregir sin motivo; con \"Llegó tarde\"", "\"El motivo es obligatorio.\"; luego \"Ausente → Presente: Llegó tarde (docente@robles.test, …)\"", "motivo-obligatorio, historial"),
    ("CP-S31", "HU12-E1, E2, E3", "Resumen de asistencia del grupo del docente", "docente@robles.test; noviembre de 2026", "Verificar que 4-B no se ofrece; rango invertido; rango válido", "\"La fecha inicial debe ser anterior o igual a la final.\"; 100 % por estudiante y del grupo", "rango-invertido, resumen"),
    ("CP-S33", "HU02-E1, HU01-E1 · INC-012", "Un cierre tardío no cierra la sesión iniciada después en la misma página", "Respuesta de `/auth/logout/` retrasada 2 s; admin@robles.test y admin@monteverde.test", "Ingresar; Cerrar sesión; ingresar enseguida con otra cuenta sin recargar; abrir Estudiantes; recargar a los 2,5 s", "La segunda sesión sigue activa y muestra a Calderón Mora, Javier", "sesion-siguiente-conservada"),
    ("CP-S34", "HU02-E1, HU01-E1 · INC-012", "Un cierre tardío no cierra la sesión iniciada después de recargar", "Respuesta de `/auth/logout/` retrasada 2 s", "Ingresar; Cerrar sesión; abrir `/ingresar` e ingresar con otra cuenta; abrir Estudiantes; recargar a los 2,5 s", "La segunda sesión sigue activa. Pasa también sin la corrección (ver INC-012): el caso de recarga lo cubre CP-A50", "sesion-siguiente-conservada"),
    ("CP-S32", "RNF03, RNF04 · WCAG 2.2 AA", "Pantallas de HU05-E5 y HU08 – HU12 sin violaciones WCAG detectables", "admin@robles.test; docente@robles.test", "axe-core en docentes con errores, detalle de grupo, reportes, periodos y lista de asistencia", "0 violaciones; informe JSON por pantalla", "asistencia"),
]

# (id, requisito, objetivo, herramienta y comando, resultado esperado, resultado obtenido, estado, evidencia)
SECURITY = [
    ("CP-SEG01", "RNF de seguridad · OWASP ASVS V14 (configuración)", "Dependencias del frontend sin vulnerabilidades conocidas",
     "`npm audit` y `npm audit --omit=dev`", "0 avisos en producción; 0 críticos o altos en desarrollo",
     "Antes: 2 críticos y 11 moderados, todos de desarrollo (INC-005). Después de vitest 4.1.12: 0 en producción y 7 moderados de minimatch, aceptados",
     "Aprobado con riesgo residual aceptado", "`evidencias/seguridad/EV_SEG-npm-audit_antes_20261105.txt` · `EV_SEG-npm-audit_despues_20261105.txt`"),
    ("CP-SEG02", "RNF de seguridad · OWASP ASVS V14", "Dependencias del backend sin vulnerabilidades conocidas",
     "`pip-audit -r requirements.txt` (pip-audit 2.9.0)", "0 vulnerabilidades", "0 en 10 paquetes", "Aprobado",
     "`evidencias/seguridad/EV_SEG-pip-audit_20261105.txt`"),
    ("CP-SEG03", "RNF de seguridad · OWASP ASVS V13 (secretos)", "Sin secretos reales en el repositorio ni en su historial",
     "`scripts/secret_scan.py` sobre `git log -p --all`", "Solo valores de prueba ficticios",
     "7 coincidencias, todas esperadas: contraseña de las cuentas ficticias, contraseña de pruebas, clave de desarrollo y URL de la base local", "Aprobado",
     "`evidencias/seguridad/EV_SEG-secretos_20261105.txt`"),
    ("CP-SEG04", "Avance 1, sección 7.1 · OWASP ASVS V3 (sesiones)", "La sesión usa cookies HttpOnly y protección CSRF, como fija la arquitectura aprobada",
     "Revisión de `frontend/src/api/client.ts` y `config/settings.py`", "Credencial de sesión no accesible desde JavaScript",
     "Antes: token en `localStorage` (**INC-006**, fallido). Tras `796cef8`: cookie de sesión HttpOnly y SameSite=Lax, `X-CSRFToken` en las escrituras (CP-A28, CP-A29, CP-U08)", "Aprobado tras INC-006",
     "Revisión de código · [Revisión de seguridad](Revision-seguridad.md)"),
]


def ficha(rows):
    lines = ["| Campo | Valor |", "|---|---|"]
    lines += [f"| {k} | {v} |" for k, v in rows]
    return "\n".join(lines)


out = []
out.append("""# Especificación de casos de prueba — Nexora

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
""")

out.append("## 1. Casos de API e integración (pytest)\n")
for case in API:
    cid, hu, obj, pre, datos, pasos, esp, tests = case[:8]
    obtenido = case[8] if len(case) > 8 else "Coincide con el esperado"
    estado = case[9] if len(case) > 9 else "Aprobado"
    out.append(f"### {cid} — {obj}\n")
    out.append(ficha([
        ("Historia / escenario", hu),
        ("Criterio de la línea base (avance 1)", base(cid)),
        ("Objetivo", obj),
        ("Precondiciones", f"{pre}. {PRE_API}" if pre != "—" else PRE_API),
        ("Datos de prueba", datos),
        ("Pasos", pasos),
        ("Resultado esperado", esp),
        ("Resultado obtenido", obtenido),
        ("Estado", estado),
        ("Pruebas automatizadas", "<br>".join(f"`{t}`" for t in tests)),
        ("Evidencia", EV_API_3 if cid in NUEVOS else EV_API),
        ("Responsable", "Samuel (revisión pendiente de Luis)" if cid in NUEVOS else "Luis"),
        ("Fecha", FECHA_3 if cid in NUEVOS else FECHA),
    ]))
    out.append("")

out.append("## 2. Casos unitarios de interfaz (Vitest)\n")
for cid, hu, obj, pre, datos, pasos, esp, tests in UNIT:
    out.append(f"### {cid} — {obj}\n")
    out.append(ficha([
        ("Historia / escenario", hu), ("Criterio de la línea base (avance 1)", base(cid)), ("Objetivo", obj),
        ("Precondiciones", pre), ("Datos de prueba", datos),
        ("Pasos", pasos), ("Resultado esperado", esp), ("Resultado obtenido", "Coincide con el esperado"),
        ("Estado", "Aprobado"), ("Pruebas automatizadas", "<br>".join(f"`{t}`" for t in tests)),
        ("Evidencia", "`evidencias/EV_vitest_ejecucion-4_20261118.txt` · artefacto `reportes-frontend` de CI" if cid in NUEVOS else "Artefacto `reportes-frontend` de CI (`junit.xml`)"), ("Responsable", "Samuel"), ("Fecha", FECHA_3 if cid in NUEVOS else FECHA),
    ]))
    out.append("")

out.append("## 3. Casos de sistema (Playwright)\n")
for cid, hu, obj, datos, pasos, esp, shots in SYSTEM:
    day = "20261118" if cid in NUEVOS else "20261105"
    files = ", ".join(f"`EV_{cid}_{s.strip()}_<dispositivo>_{day}.png`" for s in shots.split(","))
    if cid in ("CP-S16", "CP-S32"):
        files += " · informes `evidencias/accesibilidad/axe_<pantalla>_<dispositivo>.json`"
    out.append(f"### {cid} — {obj}\n")
    out.append(ficha([
        ("Historia / escenario", hu), ("Criterio de la línea base (avance 1)", base(cid)), ("Objetivo", obj),
        ("Precondiciones", PRE_S), ("Datos de prueba", datos),
        ("Pasos", pasos), ("Resultado esperado", esp),
        ("Resultado obtenido", "Coincide con el esperado en computadora y teléfono"), ("Estado", "Aprobado"),
        ("Prueba automatizada", f"`frontend/e2e/*.spec.ts` › {cid}"),
        ("Evidencia", f"`evidencias/e2e/` {files}"), ("Responsable", "Samuel"), ("Fecha", FECHA_3 if cid in NUEVOS else FECHA),
    ]))
    out.append("")

out.append("## 4. Casos de seguridad (revisión estática y de configuración)\n")
for cid, req, obj, tool, esp, got, estado, ev in SECURITY:
    out.append(f"### {cid} — {obj}\n")
    out.append(ficha([
        ("Requisito", req), ("Criterio de la línea base (avance 1)", "Avance 1, secciones 2.3 (requisitos no funcionales) y 7.2 (OWASP ASVS 5.0)"),
        ("Objetivo", obj), ("Herramienta y comando", tool), ("Resultado esperado", esp), ("Resultado obtenido", got),
        ("Estado", estado), ("Evidencia", ev), ("Responsable", "Samuel (revisión pendiente de Luis)"), ("Fecha", FECHA),
    ]))
    out.append("")

out.append("""## 5. Historial de versiones

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 2026-11-04 | Versión inicial: 44 casos para HU01 – HU07. |
| 1.1 | 2026-11-05 | Anexo de correcciones del avance 1: cada caso indica su criterio CA01 – CA24 de la línea base. Nuevos CP-A26 – CP-A30, CP-U05 – CP-U09, CP-S16 – CP-S21 y CP-SEG01 – CP-SEG04 (seguridad, accesibilidad, robustez e INC-003 – INC-009). Sesión en cookie HttpOnly (INC-006). Evidencias de las ejecuciones EJ-14 – EJ-25. |
| 1.2 | 2026-11-18 | Tercer incremento (HU05-E5, HU08 – HU12, ADLCDS-112 – 116): CP-A31 – CP-A50, CP-U10 – CP-U15 y CP-S22 – CP-S34; cubren CA09 – CA24. Reprueba de INC-010, INC-011 e INC-012. Ejecuciones EJ-26 – EJ-28. |
""")
OUT.write_text("\n".join(out), encoding="utf-8")
print("ok", len(API), len(UNIT), len(SYSTEM), sum(len(c[7]) for c in API))
