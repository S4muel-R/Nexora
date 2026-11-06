# Plan de pruebas — Nexora

| Campo | Valor |
|---|---|
| Código | S2-04 |
| Responsable | Wilberth |
| Versión | 1.0 |
| Fecha | 2026-11-04 |
| Norma | ISO/IEC/IEEE 29119-3, "Test Plan" (estructura) · ISO/IEC/IEEE 29119-2 (proceso) |
| Criterio de entrega | Plan de pruebas y 3 instituciones ficticias definidas |
| Relacionados | [Especificación de casos](Especificacion-de-casos.md) · [Registro de ejecución](Registro-de-ejecucion.md) · [Informes de incidente](Informes-de-incidente.md) · [Informe de estado](Informe-de-estado.md) |

## 1. Contexto y objetivos

Nexora es una plataforma web de gestión educativa (propuesta preliminar). Este plan cubre el **incremento del segundo
entregable**: historias HU01 – HU07 (RF01 – RF04), más los requisitos no funcionales RNF01 – RNF04.

Objetivos:

1. Verificar que cada escenario de aceptación del incremento se cumple (¿construimos correctamente el producto?).
2. Comprobar el aislamiento de información entre instituciones, el riesgo más alto del producto.
3. Detectar defectos temprano, registrarlos con evidencia, corregirlos y reprobarlos.
4. Producir métricas de pruebas para el seguimiento del proyecto.

## 2. Alcance

| Dentro del alcance | Fuera del alcance (este entregable) |
|---|---|
| Inicio y cierre de sesión (HU01, HU02) | Docentes, grupos, asistencia y reportes (HU08 – HU12), por CC-05 |
| Opciones y permisos por rol (HU03) | Pruebas de rendimiento (RNF05), Sprint 8 |
| Instituciones: registro y actualización (HU04, HU05) | Pruebas cruzadas con otro equipo (sección 20 de las instrucciones), entrega final |
| Aislamiento por institución (HU06) | Validación con personas usuarias reales (Sprint 8) |
| Estudiantes: registro, búsqueda, edición y desactivación (HU07) | Navegadores distintos de Chromium |
| Mensajes de error y uso en teléfono (RNF03, RNF04) | |

## 3. Riesgos de producto que orientan las pruebas

| ID | Riesgo | Probabilidad | Impacto | Respuesta en pruebas |
|---|---|---|---|---|
| RP1 | Una institución consulta o modifica datos de otra | Media | Muy alto | Pruebas de seguridad de API para cada operación (HU06); prioridad máxima |
| RP2 | Estudiantes duplicados por identificación | Media | Alto | Pruebas de API y de sistema de duplicados (HU07-E4) |
| RP3 | Un rol accede a funciones que no le corresponden | Media | Alto | Pruebas de permisos en API y en interfaz (HU03) |
| RP4 | Mensajes de error técnicos o confusos | Alta | Medio | Pruebas de interfaz y exploratorias (RNF04) |
| RP5 | Pantallas inutilizables en teléfono | Media | Medio | Recorridos de sistema en un perfil de teléfono (RNF03) |

## 4. Estrategia: pirámide de pruebas

```
                ▲  Aceptación manual / exploratoria     pocas · recorridos de usuario y hallazgos no previstos
               ▲▲  Sistema (Playwright)                 15 casos × 2 dispositivos
             ▲▲▲▲  Unitarias de interfaz (Vitest)       12 · validaciones, mensajes, menú por rol
       ▲▲▲▲▲▲▲▲▲▲  API e integración (pytest + BD)      60 · reglas de negocio, permisos, aislamiento
```

**Justificación.** Las reglas que más riesgo concentran (aislamiento, permisos, duplicados, validaciones) viven en el
backend, así que la base de la pirámide son pruebas de API con base de datos real: son rápidas (menos de 2 s en total),
deterministas y prueban cada regla de forma aislada. La interfaz agrega su propia lógica (validación de campos, menú por
rol, traducción de errores), cubierta con pruebas unitarias. Las pruebas de sistema son más lentas y frágiles, por lo que
se limitan a los recorridos principales de cada historia y se ejecutan en computadora y teléfono. La exploración manual
busca lo que los scripts no prevén.

## 5. Niveles y tipos de prueba

| Nivel / tipo | Qué cubre | Herramienta | Automatizada |
|---|---|---|---|
| Unitaria (backend) | Manejador de errores, utilidades | pytest | Sí |
| API / integración | Cada escenario de HU01 – HU07 contra la API con base de datos | pytest + pytest-django + DRF APIClient | Sí |
| Seguridad | Aislamiento (HU06), permisos por rol (HU03), sesión obligatoria (RNF02), hash de contraseñas (RNF01) | pytest | Sí |
| Unitaria (interfaz) | Validaciones, mensajes de error, menú por rol | Vitest + Testing Library | Sí |
| Sistema / funcional | Recorridos completos en el navegador | Playwright | Sí |
| Compatibilidad / usabilidad | Perfil de teléfono (Pixel 7) y computadora (1280 × 800) | Playwright | Sí |
| Humo | Estado del servicio y conexión a la base de datos | pytest + endpoint `/health/` | Sí |
| Regresión | Toda la suite en cada Pull Request | GitHub Actions | Sí |
| Exploratoria | Sesiones guiadas por charter sobre formularios y mensajes | Manual, navegador | No |

## 6. Ambientes

| Ambiente | Uso | Base de datos |
|---|---|---|
| Local | Desarrollo y exploración | SQLite (`config.settings_test`) |
| CI (GitHub Actions) | Regresión en cada PR | PostgreSQL 16 (API) · SQLite (sistema) |
| Docker Compose | Demostración del incremento | PostgreSQL 16 |

## 7. Datos de prueba

Datos **ficticios** cargados con `python manage.py seed_demo` (tarea S3-05):

| Institución | Nivel | Cuentas | Estudiantes |
|---|---|---|---|
| Escuela Los Robles | Primaria | `admin@robles.test`, `docente@robles.test` | 6 |
| Colegio Monteverde | Secundaria | `admin@monteverde.test`, `docente@monteverde.test` | 4 |
| Kínder Arcoíris | Preescolar | `admin@arcoiris.test`, `docente@arcoiris.test` | 2 |

Además: `plataforma@nexora.test` (administración de la plataforma). La identificación `3-3333-3333` existe a propósito en
Los Robles y en Monteverde para probar HU06-E2. Las pruebas de API crean sus propios datos en cada caso.

## 8. Criterios de entrada y salida

| Criterios de entrada | Criterios de salida |
|---|---|
| Historia con escenarios Dado / Cuando / Entonces verificados | 100 % de los escenarios del incremento con al menos un caso ejecutado |
| Código integrado en una rama con CI configurado | ≥ 95 % de casos aprobados |
| Datos ficticios cargados | Cero defectos críticos o altos abiertos |
| Ambiente local o de CI disponible | Cobertura de código del backend ≥ 85 % |
| | Defectos corregidos con reprueba y evidencia |

## 9. Gestión de defectos

Ciclo: **detección → registro → clasificación → análisis → asignación → corrección → reprueba → cierre** (sección 16
de las instrucciones). Cada defecto se registra en Jira como *Bug* y en [Informes de incidente](Informes-de-incidente.md)
con severidad, prioridad, característica ISO/IEC 25010, evidencia de la falla y de la reprueba. La corrección entra por un
Pull Request que referencia la clave de Jira e incluye una prueba de regresión.

| Severidad | Criterio |
|---|---|
| Crítica | Expone datos de otra institución, impide iniciar sesión o pierde información |
| Alta | Una función principal no cumple su escenario de aceptación |
| Media | Falla con alternativa disponible |
| Baja | Problema de presentación o de mensaje que no impide la tarea |

## 10. Responsables

| Rol | Persona | Responsabilidad |
|---|---|---|
| Líder de pruebas | Wilberth | Plan, casos de aceptación, ejecución manual, métricas |
| Pruebas de API | Luis | Pruebas pytest, aislamiento, corrección de defectos del backend |
| Pruebas de interfaz | Samuel | Vitest, Playwright, exploración, corrección de defectos de interfaz |

## 11. Cronograma

| Fecha | Actividad |
|---|---|
| 2026-11-04 | Plan y diseño de casos; primera ejecución automatizada; exploración de estudiantes |
| 2026-11-05 | Ejecución manual de aceptación por Wilberth; revisión por pares de casos |
| 2026-11-06 | Regresión completa en CI; corrección y reprueba de defectos abiertos |
| 2026-11-07 | Informe de estado y métricas para el segundo entregable |

## 12. Historial de versiones

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 2026-11-04 | Versión inicial. |
