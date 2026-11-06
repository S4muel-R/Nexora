# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: estudiantes.spec.ts >> HU06 – HU07 Estudiantes y aislamiento >> CP-S11 HU07-E1/E3 registrar y buscar un estudiante
- Location: e2e/estudiantes.spec.ts:22:3

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: getByRole('status')
Expected: "Valeria Prueba Teléfono fue registrado."
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" getByRole('status') with timeout 5000ms
  - waiting for getByRole('status')

```

```yaml
- banner:
  - strong: Nexora
  - text: Escuela Los Robles
  - navigation "Menú principal":
    - link "Inicio":
      - /url: /
    - link "Mi institución":
      - /url: /mi-institucion
    - link "Estudiantes":
      - /url: /estudiantes
  - button "Cerrar sesión"
- main:
  - heading "Estudiantes" [level=1]
  - form "Registrar estudiante":
    - heading "Nuevo estudiante" [level=2]
    - alert: Los datos enviados no son válidos.
    - text: Identificación
    - textbox "Identificación": E2E-29483640
    - text: Fecha de nacimiento
    - textbox "Fecha de nacimiento": 2016-08-01
    - text: Nombre
    - textbox "Nombre": Valeria
    - text: Apellidos
    - textbox "Apellidos": Prueba Teléfono
    - text: Nivel
    - combobox "Nivel" [invalid]:
      - option "Seleccione…" [selected]
      - option "Primaria"
    - text: Este campo no puede estar en blanco.
    - button "Guardar"
    - button "Cancelar"
  - text: Buscar
  - searchbox "Buscar"
  - checkbox "Mostrar desactivados"
  - text: Mostrar desactivados
  - table "Lista de estudiantes":
    - rowgroup:
      - row "Identificación 1-1111-1115 Nombre Chaves Umaña, Elena Nivel Primaria Estado Activo Acciones Editar Desactivar":
        - cell "Identificación 1-1111-1115"
        - cell "Nombre Chaves Umaña, Elena"
        - cell "Nivel Primaria"
        - cell "Estado Activo"
        - cell "Acciones Editar Desactivar":
          - text: Acciones
          - button "Editar"
          - button "Desactivar"
      - row "Identificación 1-1111-1113 Nombre Jiménez Soto, Camila Nivel Primaria Estado Activo Acciones Editar Desactivar":
        - cell "Identificación 1-1111-1113"
        - cell "Nombre Jiménez Soto, Camila"
        - cell "Nivel Primaria"
        - cell "Estado Activo"
        - cell "Acciones Editar Desactivar":
          - text: Acciones
          - button "Editar"
          - button "Desactivar"
      - row "Identificación 1-1111-1111 Nombre Mora Vargas, Ana Nivel Primaria Estado Activo Acciones Editar Desactivar":
        - cell "Identificación 1-1111-1111"
        - cell "Nombre Mora Vargas, Ana"
        - cell "Nivel Primaria"
        - cell "Estado Activo"
        - cell "Acciones Editar Desactivar":
          - text: Acciones
          - button "Editar"
          - button "Desactivar"
      - row "Identificación 3-3333-3333 Nombre Núñez Brenes, Fabián Nivel Primaria Estado Activo Acciones Editar Desactivar":
        - cell "Identificación 3-3333-3333"
        - cell "Nombre Núñez Brenes, Fabián"
        - cell "Nivel Primaria"
        - cell "Estado Activo"
        - cell "Acciones Editar Desactivar":
          - text: Acciones
          - button "Editar"
          - button "Desactivar"
      - row "Identificación E2E-29461570 Nombre Prueba Computadora, Valeria Nivel Primaria Estado Activo Acciones Editar Desactivar":
        - cell "Identificación E2E-29461570"
        - cell "Nombre Prueba Computadora, Valeria"
        - cell "Nivel Primaria"
        - cell "Estado Activo"
        - cell "Acciones Editar Desactivar":
          - text: Acciones
          - button "Editar"
          - button "Desactivar"
      - row "Identificación 1-1111-1112 Nombre Quesada Arias, Bruno Nivel Primaria Estado Activo Acciones Editar Desactivar":
        - cell "Identificación 1-1111-1112"
        - cell "Nombre Quesada Arias, Bruno"
        - cell "Nivel Primaria"
        - cell "Estado Activo"
        - cell "Acciones Editar Desactivar":
          - text: Acciones
          - button "Editar"
          - button "Desactivar"
      - row "Identificación 1-1111-1114 Nombre Rodríguez Leiva, Diego Nivel Primaria Estado Activo Acciones Editar Desactivar":
        - cell "Identificación 1-1111-1114"
        - cell "Nombre Rodríguez Leiva, Diego"
        - cell "Nivel Primaria"
        - cell "Estado Activo"
        - cell "Acciones Editar Desactivar":
          - text: Acciones
          - button "Editar"
          - button "Desactivar"
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test'
  2  | import { ACCOUNTS, evidence, login, uniqueSuffix } from './helpers'
  3  | 
  4  | test.describe('HU06 – HU07 Estudiantes y aislamiento', () => {
  5  |   test('CP-S10 HU06-E1/E2 cada institución ve solo sus estudiantes', async ({ page }, info) => {
  6  |     const list = page.getByRole('table', { name: 'Lista de estudiantes' })
  7  | 
  8  |     await login(page, ACCOUNTS.roblesAdmin)
  9  |     await page.getByRole('link', { name: 'Estudiantes' }).first().click()
  10 |     await expect(list.getByText('Núñez Brenes, Fabián')).toBeVisible()
  11 |     await expect(list.getByText('Calderón Mora, Javier')).toHaveCount(0)
  12 |     await evidence(page, info, 'CP-S10', 'robles')
  13 |     await page.getByRole('button', { name: 'Cerrar sesión' }).click()
  14 | 
  15 |     await login(page, ACCOUNTS.monteverdeAdmin)
  16 |     await page.getByRole('link', { name: 'Estudiantes' }).first().click()
  17 |     await expect(list.getByText('Calderón Mora, Javier')).toBeVisible()
  18 |     await expect(list.getByText('Núñez Brenes, Fabián')).toHaveCount(0)
  19 |     await evidence(page, info, 'CP-S10', 'monteverde')
  20 |   })
  21 | 
  22 |   test('CP-S11 HU07-E1/E3 registrar y buscar un estudiante', async ({ page }, info) => {
  23 |     const identification = `E2E-${uniqueSuffix()}`
  24 |     const lastName = info.project.name === 'telefono' ? 'Prueba Teléfono' : 'Prueba Computadora'
  25 |     await login(page, ACCOUNTS.roblesAdmin)
  26 |     await page.getByRole('link', { name: 'Estudiantes' }).first().click()
  27 |     await page.getByRole('button', { name: 'Registrar estudiante' }).click()
  28 |     const form = page.getByRole('form', { name: 'Registrar estudiante' })
  29 |     await form.getByLabel('Identificación').fill(identification)
  30 |     await form.getByLabel('Fecha de nacimiento').fill('2016-08-01')
  31 |     await form.getByLabel('Nombre').fill('Valeria')
  32 |     await form.getByLabel('Apellidos').fill(lastName)
  33 |     await form.getByRole('button', { name: 'Guardar' }).click()
  34 | 
> 35 |     await expect(page.getByRole('status')).toHaveText(`Valeria ${lastName} fue registrado.`)
     |                                            ^ Error: expect(locator).toHaveText(expected) failed
  36 |     await page.getByLabel('Buscar').fill(identification)
  37 |     const list = page.getByRole('table', { name: 'Lista de estudiantes' })
  38 |     await expect(list.getByText(identification)).toBeVisible()
  39 |     await expect(list.getByText('1-1111-1111')).toHaveCount(0)
  40 |     await evidence(page, info, 'CP-S11', 'registrado')
  41 |   })
  42 | 
  43 |   test('CP-S12 HU07-E4 identificación duplicada', async ({ page }, info) => {
  44 |     await login(page, ACCOUNTS.roblesAdmin)
  45 |     await page.getByRole('link', { name: 'Estudiantes' }).first().click()
  46 |     await page.getByRole('button', { name: 'Registrar estudiante' }).click()
  47 |     const form = page.getByRole('form', { name: 'Registrar estudiante' })
  48 |     await form.getByLabel('Identificación').fill('1-1111-1111')
  49 |     await form.getByLabel('Fecha de nacimiento').fill('2016-08-01')
  50 |     await form.getByLabel('Nombre').fill('Repetido')
  51 |     await form.getByLabel('Apellidos').fill('Duplicado')
  52 |     await form.getByRole('button', { name: 'Guardar' }).click()
  53 | 
  54 |     await expect(form.getByRole('alert')).toHaveText('Ya existe un estudiante con esa identificación.')
  55 |     await evidence(page, info, 'CP-S12', 'duplicado')
  56 |   })
  57 | 
  58 |   test('CP-S13 HU07-E5 fecha vacía muestra mensaje claro (reprueba ADLCDS-104)', async ({ page }, info) => {
  59 |     await login(page, ACCOUNTS.roblesAdmin)
  60 |     await page.getByRole('link', { name: 'Estudiantes' }).first().click()
  61 |     await page.getByRole('button', { name: 'Registrar estudiante' }).click()
  62 |     const form = page.getByRole('form', { name: 'Registrar estudiante' })
  63 |     await form.getByRole('button', { name: 'Guardar' }).click()
  64 | 
  65 |     await expect(form.getByText('Ingrese una fecha de nacimiento válida.')).toBeVisible()
  66 |     await expect(form.getByText(/YYYY-MM-DD/)).toHaveCount(0)
  67 |     await evidence(page, info, 'CP-S13', 'mensaje-fecha')
  68 |   })
  69 | 
  70 |   test('CP-S14 HU07-E2 desactivar y reactivar', async ({ page }, info) => {
  71 |     await login(page, ACCOUNTS.roblesAdmin)
  72 |     await page.getByRole('link', { name: 'Estudiantes' }).first().click()
  73 |     const row = page.getByRole('row').filter({ hasText: '1-1111-1115' })
  74 |     await row.getByRole('button', { name: 'Desactivar' }).click()
  75 |     await expect(page.getByRole('status')).toContainText('fue desactivado')
  76 |     await expect(row).toHaveCount(0)
  77 | 
  78 |     await page.getByLabel('Mostrar desactivados').check()
  79 |     await expect(row).toContainText('Desactivado')
  80 |     await evidence(page, info, 'CP-S14', 'desactivado')
  81 |     await row.getByRole('button', { name: 'Reactivar' }).click()
  82 |     await expect(page.getByRole('status')).toContainText('fue reactivado')
  83 |   })
  84 | 
  85 |   test('CP-S15 HU07 el docente consulta sin poder modificar', async ({ page }, info) => {
  86 |     await login(page, ACCOUNTS.roblesTeacher)
  87 |     await page.getByRole('link', { name: 'Estudiantes' }).first().click()
  88 | 
  89 |     await expect(page.getByRole('table', { name: 'Lista de estudiantes' })).toBeVisible()
  90 |     await expect(page.getByRole('button', { name: 'Registrar estudiante' })).toHaveCount(0)
  91 |     await expect(page.getByRole('button', { name: 'Editar' })).toHaveCount(0)
  92 |     await evidence(page, info, 'CP-S15', 'docente')
  93 |   })
  94 | })
  95 | 
```