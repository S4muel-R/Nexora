import { expect, test } from '@playwright/test'
import { ACCOUNTS, evidence, login, uniqueSuffix } from './helpers'

test.describe('HU06 – HU07 Estudiantes y aislamiento', () => {
  test('CP-S10 HU06-E1/E2 cada institución ve solo sus estudiantes', async ({ page }, info) => {
    const list = page.getByRole('table', { name: 'Lista de estudiantes' })

    await login(page, ACCOUNTS.roblesAdmin)
    await page.getByRole('link', { name: 'Estudiantes' }).first().click()
    await expect(list.getByText('Núñez Brenes, Fabián')).toBeVisible()
    await expect(list.getByText('Calderón Mora, Javier')).toHaveCount(0)
    await evidence(page, info, 'CP-S10', 'robles')
    await page.getByRole('button', { name: 'Cerrar sesión' }).click()

    await login(page, ACCOUNTS.monteverdeAdmin)
    await page.getByRole('link', { name: 'Estudiantes' }).first().click()
    await expect(list.getByText('Calderón Mora, Javier')).toBeVisible()
    await expect(list.getByText('Núñez Brenes, Fabián')).toHaveCount(0)
    await evidence(page, info, 'CP-S10', 'monteverde')
  })

  test('CP-S11 HU07-E1/E3 registrar y buscar un estudiante', async ({ page }, info) => {
    const identification = `E2E-${uniqueSuffix()}`
    const lastName = info.project.name === 'telefono' ? 'Prueba Teléfono' : 'Prueba Computadora'
    await login(page, ACCOUNTS.roblesAdmin)
    await page.getByRole('link', { name: 'Estudiantes' }).first().click()
    await page.getByRole('button', { name: 'Registrar estudiante' }).click()
    const form = page.getByRole('form', { name: 'Registrar estudiante' })
    await form.getByLabel('Identificación').fill(identification)
    await form.getByLabel('Fecha de nacimiento').fill('2016-08-01')
    await form.getByLabel('Nombre').fill('Valeria')
    await form.getByLabel('Apellidos').fill(lastName)
    await form.getByRole('button', { name: 'Guardar' }).click()

    await expect(page.getByRole('status')).toHaveText(`Valeria ${lastName} fue registrado.`)
    await page.getByLabel('Buscar').fill(identification)
    const list = page.getByRole('table', { name: 'Lista de estudiantes' })
    await expect(list.getByText(identification)).toBeVisible()
    await expect(list.getByText('1-1111-1111')).toHaveCount(0)
    await evidence(page, info, 'CP-S11', 'registrado')
  })

  test('CP-S12 HU07-E4 identificación duplicada', async ({ page }, info) => {
    await login(page, ACCOUNTS.roblesAdmin)
    await page.getByRole('link', { name: 'Estudiantes' }).first().click()
    await page.getByRole('button', { name: 'Registrar estudiante' }).click()
    const form = page.getByRole('form', { name: 'Registrar estudiante' })
    await form.getByLabel('Identificación').fill('1-1111-1111')
    await form.getByLabel('Fecha de nacimiento').fill('2016-08-01')
    await form.getByLabel('Nombre').fill('Repetido')
    await form.getByLabel('Apellidos').fill('Duplicado')
    await form.getByRole('button', { name: 'Guardar' }).click()

    await expect(form.getByRole('alert')).toHaveText('Ya existe un estudiante con esa identificación.')
    await evidence(page, info, 'CP-S12', 'duplicado')
  })

  test('CP-S13 HU07-E5 fecha vacía muestra mensaje claro (reprueba ADLCDS-104)', async ({ page }, info) => {
    await login(page, ACCOUNTS.roblesAdmin)
    await page.getByRole('link', { name: 'Estudiantes' }).first().click()
    await page.getByRole('button', { name: 'Registrar estudiante' }).click()
    const form = page.getByRole('form', { name: 'Registrar estudiante' })
    await form.getByRole('button', { name: 'Guardar' }).click()

    await expect(form.getByText('Ingrese una fecha de nacimiento válida.')).toBeVisible()
    await expect(form.getByText(/YYYY-MM-DD/)).toHaveCount(0)
    await evidence(page, info, 'CP-S13', 'mensaje-fecha')
  })

  test('CP-S14 HU07-E2 desactivar y reactivar', async ({ page }, info) => {
    await login(page, ACCOUNTS.roblesAdmin)
    await page.getByRole('link', { name: 'Estudiantes' }).first().click()
    const row = page.getByRole('row').filter({ hasText: '1-1111-1115' })
    await row.getByRole('button', { name: 'Desactivar' }).click()
    await expect(page.getByRole('status')).toContainText('fue desactivado')
    await expect(row).toHaveCount(0)

    await page.getByLabel('Mostrar desactivados').check()
    await expect(row).toContainText('Desactivado')
    await evidence(page, info, 'CP-S14', 'desactivado')
    await row.getByRole('button', { name: 'Reactivar' }).click()
    await expect(page.getByRole('status')).toContainText('fue reactivado')
  })

  test('CP-S15 HU07 el docente consulta sin poder modificar', async ({ page }, info) => {
    await login(page, ACCOUNTS.roblesTeacher)
    await page.getByRole('link', { name: 'Estudiantes' }).first().click()

    await expect(page.getByRole('table', { name: 'Lista de estudiantes' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Registrar estudiante' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Editar' })).toHaveCount(0)
    await evidence(page, info, 'CP-S15', 'docente')
  })

  test('CP-S18 HU07-E1 nivel preseleccionado aunque los niveles carguen tarde (reprueba INC-004)', async ({ page }, info) => {
    await login(page, ACCOUNTS.roblesAdmin)
    // Simula la lentitud observada en CI: la institución responde 1,5 s después de abrir la pantalla.
    await page.route('**/api/v1/my-institution/', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      await route.continue()
    })
    await page.getByRole('link', { name: 'Estudiantes' }).first().click()
    await page.getByRole('button', { name: 'Registrar estudiante' }).click()
    const form = page.getByRole('form', { name: 'Registrar estudiante' })

    await expect(form.getByLabel('Nivel')).toHaveValue('primaria')
    await evidence(page, info, 'CP-S18', 'nivel-preseleccionado')
  })
})
