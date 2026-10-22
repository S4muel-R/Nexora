# Repositorio documental del proyecto Nexora en Microsoft OneDrive

| Campo | Valor |
|---|---|
| Código | S1-12 |
| EDT | 1.1.3.1 |
| Responsable | Samuel |
| Tiempo estimado | 5 horas |
| Versión | 0.1 |
| Fecha | 2026-10-21 |
| Criterio de entrega | Carpeta compartida en OneDrive con acceso habilitado para el docente. |

## 1. Propósito

Centralizar en una carpeta de OneDrive los documentos académicos, administrativos y técnicos del proyecto Nexora, con
permisos de acceso definidos para el equipo y acceso de revisión para el docente responsable del curso.

Este repositorio de GitHub guarda las fuentes de la documentación (Markdown); OneDrive guarda las versiones oficiales
para revisión y entrega (Word/PDF). Ambas estructuras usan las mismas carpetas para que sea fácil ubicar cada documento.

## 2. Estructura de carpetas

```
Nexora/
├── 01-Planificacion     Cronograma, EDT, actas de reunión del equipo, este documento
├── 02-Requisitos        Guion de consulta, actas de sesiones con usuarios, requisitos
├── 03-Diseno            Perfiles de usuario, recorridos, prototipos de interfaz, modelos
├── 04-Desarrollo        Documentación técnica, manuales de instalación y configuración
├── 05-Pruebas           Plan de pruebas, casos de prueba, reportes de defectos
└── 06-Entregables       Versiones finales entregadas al docente (PDF/Word), por sprint
```

Convención de nombres de archivo: `<Código ticket>_<Nombre-del-documento>_v<versión>.<ext>`,
por ejemplo `S1-10_Guion-de-consulta_v1.0.docx`.

## 3. Matriz de permisos

| Rol | Alcance | Permiso en OneDrive | Observaciones |
|---|---|---|---|
| Propietario (responsable del ticket) | Carpeta `Nexora/` completa | Propietario | Administra permisos y enlaces. |
| Integrantes del equipo | Carpeta `Nexora/` completa | Puede editar | Invitación directa por correo institucional, no por enlace público. |
| Docente responsable del curso | Carpeta `Nexora/` completa | Puede ver (o editar, si lo solicita) | Puede dejar comentarios en los documentos. |
| Otras personas | — | Sin acceso | No se generan enlaces "Cualquier persona con el vínculo". |

### Personas con acceso

| Nombre | Correo institucional | Rol | Permiso | Fecha de invitación |
|---|---|---|---|---|
| | | Integrante | Puede editar | |
| | | Integrante | Puede editar | |
| | | Docente | Puede ver | |

## 4. Procedimiento

1. Iniciar sesión en OneDrive con la cuenta institucional.
2. Crear la carpeta principal `Nexora`.
3. Dentro de `Nexora`, crear las seis subcarpetas de la sección 2.
4. Seleccionar `Nexora` → **Compartir** → **Administrar acceso** e invitar a cada integrante por correo con el permiso
   **Puede editar**.
5. Invitar al docente responsable por correo con el permiso definido en la matriz.
6. Confirmar que la configuración del vínculo sea "Personas específicas" y no "Cualquier persona".
7. Copiar el enlace de la carpeta y registrarlo en la sección 6.

## 5. Lista de verificación

- [ ] La carpeta `Nexora` existe en la cuenta institucional.
- [ ] Las seis subcarpetas están creadas con los nombres acordados.
- [ ] Cada integrante del equipo puede abrir la carpeta y crear/editar un archivo de prueba.
- [ ] El docente recibió la invitación y confirmó que puede abrir la carpeta.
- [ ] No existen vínculos públicos ("Cualquier persona") activos.
- [ ] Los entregables del Sprint 1 están cargados en `06-Entregables`.

## 6. Evidencia de entrega

| Elemento | Valor |
|---|---|
| Enlace de la carpeta | |
| Fecha en que se compartió con el docente | |
| Fecha de verificación de acceso | |
| Captura de "Administrar acceso" | _(adjuntar en `01-Planificacion`)_ |
