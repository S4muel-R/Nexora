import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { Page, TestInfo } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { ACCOUNTS, DEMO_PASSWORD, evidence, login } from './helpers'

/**
 * Revisión automatizada de accesibilidad (WCAG 2.2 nivel AA como objetivo, Estándares y anexo del avance 1).
 * axe-core detecta solo una parte de los criterios; la revisión manual queda en Docs/05-Pruebas/Revision-accesibilidad.md.
 */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
const REPORT_DIR = '../Docs/05-Pruebas/evidencias/accesibilidad'

async function audit(page: Page, testInfo: TestInfo, screen: string) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
  const summary = {
    pantalla: screen,
    dispositivo: testInfo.project.name,
    url: page.url().replace(/^https?:\/\/[^/]+/, ''),
    reglas_aprobadas: results.passes.length,
    reglas_no_aplicables: results.inapplicable.length,
    revision_manual: results.incomplete.map((r) => r.id),
    violaciones: results.violations.map((v) => ({
      regla: v.id,
      impacto: v.impact,
      criterios: v.tags.filter((t) => t.startsWith('wcag') && /\d/.test(t)),
      descripcion: v.help,
      elementos: v.nodes.map((n) => n.target.join(' ')),
    })),
  }
  mkdirSync(REPORT_DIR, { recursive: true })
  writeFileSync(`${REPORT_DIR}/axe_${screen}_${testInfo.project.name}.json`, JSON.stringify(summary, null, 2))
  expect(summary.violaciones, `Violaciones WCAG en ${screen}`).toEqual([])
}

test.describe('Accesibilidad', () => {
  test('CP-S16 — pantallas sin violaciones WCAG 2.2 AA detectables (axe-core)', async ({ page }, testInfo) => {
    await page.goto('/ingresar')
    await audit(page, testInfo, 'ingresar')

    await login(page, ACCOUNTS.platform)
    await audit(page, testInfo, 'inicio-plataforma')
    await page.goto('/instituciones')
    await expect(page.getByRole('heading', { name: 'Instituciones' })).toBeVisible()
    await audit(page, testInfo, 'instituciones')

    await page.getByRole('button', { name: 'Cerrar sesión' }).click()
    await login(page, ACCOUNTS.roblesAdmin)
    await page.goto('/mi-institucion')
    await expect(page.getByRole('heading', { name: 'Mi institución' })).toBeVisible()
    await audit(page, testInfo, 'mi-institucion')
    await page.goto('/estudiantes')
    await expect(page.getByRole('heading', { name: 'Estudiantes' })).toBeVisible()
    await audit(page, testInfo, 'estudiantes')

    // Formulario con errores de validación visibles (criterios 3.3.1 y 3.3.2).
    await page.getByRole('button', { name: 'Registrar estudiante' }).click()
    await page.getByRole('button', { name: 'Guardar' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    await audit(page, testInfo, 'estudiantes-formulario-errores')
    await evidence(page, testInfo, 'CP-S16', 'formulario-errores')
  })

  test('CP-S17 — inicio de sesión solo con teclado y foco visible', async ({ page }, testInfo) => {
    await page.goto('/ingresar')
    // El formulario aparece cuando termina la validación de la sesión.
    await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible()
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Correo')).toBeFocused()
    const outline = await page.getByLabel('Correo').evaluate((el) => {
      const style = getComputedStyle(el)
      return { outline: style.outlineStyle, width: style.outlineWidth, shadow: style.boxShadow }
    })
    expect(outline.outline !== 'none' || outline.shadow !== 'none', 'El campo enfocado muestra el foco').toBe(true)
    await page.keyboard.type(ACCOUNTS.roblesAdmin)
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Contraseña')).toBeFocused()
    await page.keyboard.type(DEMO_PASSWORD)
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: /^Hola,/ })).toBeVisible()
    await evidence(page, testInfo, 'CP-S17', 'paso')
  })
})
