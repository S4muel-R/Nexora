import { expect, test } from '@playwright/test'
import { ACCOUNTS, DEMO_PASSWORD, evidence, login, uniqueSuffix } from './helpers'

test.describe('HU04 – HU05 Instituciones', () => {
  test('CP-S07 HU04-E1 la plataforma registra una institución y su administradora entra', async ({
    page,
  }, info) => {
    const suffix = uniqueSuffix()
    const name = `Escuela Prueba ${suffix} ${info.project.name}`
    const adminEmail = `admin.${suffix}.${info.project.name}@prueba.test`

    await login(page, ACCOUNTS.platform)
    await page.getByRole('link', { name: 'Instituciones' }).first().click()
    await page.getByRole('button', { name: 'Registrar institución' }).click()
    const form = page.getByRole('form', { name: 'Registrar institución' })
    await form.locator('[name="name"]').fill(name)
    await form.getByLabel('Primaria').check()
    await form.getByLabel('Teléfono').fill('2222-0000')
    await form.locator('[name="admin.first_name"]').fill('Paula')
    await form.locator('[name="admin.last_name"]').fill('Prueba')
    await form.locator('[name="admin.email"]').fill(adminEmail)
    await form.locator('[name="admin.password"]').fill(DEMO_PASSWORD)
    await evidence(page, info, 'CP-S07', 'formulario')
    await form.getByRole('button', { name: 'Guardar' }).click()

    await expect(page.getByRole('status')).toContainText(`Institución "${name}" registrada`)
    await expect(page.locator('td', { hasText: name })).toBeVisible()
    await evidence(page, info, 'CP-S07', 'registrada')

    await page.getByRole('button', { name: 'Cerrar sesión' }).click()
    await login(page, adminEmail)
    await expect(page.getByText(name).first()).toBeVisible()
  })

  test('CP-S08 HU04-E3 nombre duplicado', async ({ page }, info) => {
    await login(page, ACCOUNTS.platform)
    await page.getByRole('link', { name: 'Instituciones' }).first().click()
    await page.getByRole('button', { name: 'Registrar institución' }).click()
    const form = page.getByRole('form', { name: 'Registrar institución' })
    await form.locator('[name="name"]').fill('escuela los robles')
    await form.getByLabel('Primaria').check()
    await form.locator('[name="admin.first_name"]').fill('Otra')
    await form.locator('[name="admin.last_name"]').fill('Persona')
    await form.locator('[name="admin.email"]').fill(`otra.${uniqueSuffix()}@prueba.test`)
    await form.locator('[name="admin.password"]').fill(DEMO_PASSWORD)
    await form.getByRole('button', { name: 'Guardar' }).click()

    await expect(form.getByRole('alert')).toHaveText('Ya existe una institución con ese nombre.')
    await evidence(page, info, 'CP-S08', 'duplicado')
  })

  test('CP-S09 HU05-E1 la administradora actualiza el teléfono', async ({ page }, info) => {
    const phone = `2222-${uniqueSuffix().slice(-4)}`
    await login(page, ACCOUNTS.roblesAdmin)
    await page.getByRole('link', { name: 'Mi institución' }).first().click()
    await page.getByLabel('Teléfono').fill(phone)
    await page.getByRole('button', { name: 'Guardar cambios' }).click()

    await expect(page.getByRole('status')).toHaveText('Datos actualizados.')
    await page.reload()
    await expect(page.getByLabel('Teléfono')).toHaveValue(phone)
    await evidence(page, info, 'CP-S09', 'actualizado')
  })

  test('CP-S20 HU05-E1 una respuesta repetida de la carga no borra lo que se escribió (reprueba INC-008)', async ({ page }, info) => {
    const phone = `2222-${uniqueSuffix().slice(-4)}`
    await login(page, ACCOUNTS.roblesAdmin)
    // En desarrollo React monta la pantalla dos veces (StrictMode): la segunda carga responde 1,5 s después.
    let loads = 0
    await page.route('**/api/v1/my-institution/', async (route) => {
      if (route.request().method() === 'GET' && ++loads > 1) await new Promise((resolve) => setTimeout(resolve, 1500))
      await route.continue()
    })
    await page.getByRole('link', { name: 'Mi institución' }).first().click()
    await page.getByLabel('Teléfono').fill(phone)
    await page.waitForTimeout(2000)

    await expect(page.getByLabel('Teléfono')).toHaveValue(phone)
    await evidence(page, info, 'CP-S20', 'valor-conservado')
  })
})
