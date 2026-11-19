import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { ACCOUNTS, evidence, login, openMenu } from './helpers'

/** Cada proyecto usa su propia fecha porque la base de datos se comparte entre proyectos. */
const dateFor = (project: string) => (project === 'telefono' ? '2026-11-03' : '2026-11-02')

async function openSheet(page: Page, date: string) {
  await openMenu(page, 'Asistencia')
  await page.getByLabel('Grupo').selectOption({ label: '4-A (2026)' })
  await page.getByLabel('Fecha').fill(date)
}

test.describe('HU10 y HU12 Asistencia y resumen', () => {
  test.describe.configure({ mode: 'serial' })

  test('CP-S29 HU10-E1/E3 registrar la asistencia y reabrirla en modo corrección', async ({ page }, info) => {
    const date = dateFor(info.project.name)
    await login(page, ACCOUNTS.roblesTeacher)
    await openSheet(page, date)
    const form = page.getByRole('form', { name: 'Registrar asistencia' })
    await form.getByRole('group', { name: /Bruno Quesada Arias/ }).getByLabel('Ausente').check()
    await evidence(page, info, 'CP-S29', 'marcada')
    await form.getByRole('button', { name: 'Guardar asistencia' }).click()

    await expect(page.getByRole('status')).toHaveText(`Asistencia de 4-A del ${date} registrada.`)
    const table = page.getByRole('table', { name: `Asistencia de 4-A el ${date}` })
    await expect(table.getByRole('row', { name: /Bruno Quesada Arias.*Ausente/ })).toBeVisible()

    // HU10-E3 (CA18): al volver a la misma fecha no se ofrece un registro nuevo, sino la corrección.
    await page.reload()
    await openSheet(page, date)
    await expect(page.getByText(`Asistencia registrada para 4-A el ${date}.`)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Guardar asistencia' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Corregir la asistencia de Bruno Quesada Arias' })).toBeVisible()
    await evidence(page, info, 'CP-S29', 'modo-correccion')
  })

  test('CP-S30 HU10-E2/E4 corregir con motivo obligatorio y conservar el historial', async ({ page }, info) => {
    const date = dateFor(info.project.name)
    await login(page, ACCOUNTS.roblesTeacher)
    await openSheet(page, date)
    await page.getByRole('button', { name: 'Corregir la asistencia de Bruno Quesada Arias' }).click()
    const form = page.getByRole('form', { name: 'Corregir asistencia' })
    await expect(form.getByLabel('Nuevo estado')).toHaveValue('presente')

    await form.getByRole('button', { name: 'Guardar corrección' }).click()
    await expect(form.getByRole('alert')).toHaveText('El motivo es obligatorio.')
    await evidence(page, info, 'CP-S30', 'motivo-obligatorio')

    await form.getByLabel('Motivo').fill('Llegó tarde')
    await form.getByRole('button', { name: 'Guardar corrección' }).click()
    await expect(page.getByRole('status')).toHaveText('Asistencia de Bruno Quesada Arias corregida a presente.')
    const row = page
      .getByRole('table', { name: `Asistencia de 4-A el ${date}` })
      .getByRole('row', { name: /Bruno Quesada Arias/ })
    await expect(row).toContainText('Ausente → Presente: Llegó tarde (docente@robles.test')
    await evidence(page, info, 'CP-S30', 'historial')
  })

  test('CP-S31 HU12-E1/E2/E3 resumen de asistencia del grupo del docente', async ({ page }, info) => {
    await login(page, ACCOUNTS.roblesTeacher)
    await openMenu(page, 'Reportes')
    const filters = page.getByRole('form', { name: 'Filtros del resumen de asistencia' })
    // HU12-E2: el docente solo puede elegir sus grupos.
    await expect(filters.getByLabel('Grupo').locator('option', { hasText: '4-B' })).toHaveCount(0)
    await filters.getByLabel('Grupo').selectOption({ label: '4-A (2026)' })

    // HU12-E3 (CA24): rango invertido.
    await filters.getByLabel('Desde').fill('2026-11-30')
    await filters.getByLabel('Hasta').fill('2026-11-01')
    await filters.getByRole('button', { name: 'Consultar' }).click()
    await expect(page.getByRole('alert')).toHaveText('La fecha inicial debe ser anterior o igual a la final.')
    await evidence(page, info, 'CP-S31', 'rango-invertido')

    await filters.getByLabel('Desde').fill('2026-11-01')
    await filters.getByLabel('Hasta').fill('2026-11-30')
    await filters.getByRole('button', { name: 'Consultar' }).click()
    const table = page.getByRole('table', { name: 'Resumen de asistencia de 4-A' })
    await expect(table.getByRole('row', { name: /Mora Vargas.*100 %/ })).toBeVisible()
    await expect(table.getByRole('row', { name: /Quesada Arias.*100 %/ })).toBeVisible()
    await expect(page.getByText(/Asistencia del grupo: 100 %/)).toBeVisible()
    await evidence(page, info, 'CP-S31', 'resumen')
  })
})
