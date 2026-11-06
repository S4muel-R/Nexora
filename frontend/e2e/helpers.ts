import { expect } from '@playwright/test'
import type { Page, TestInfo } from '@playwright/test'

/** Contraseña de las cuentas ficticias creadas por `manage.py seed_demo`. */
export const DEMO_PASSWORD = 'Nexora-Demo-2026'

export const API_URL = process.env.E2E_API_URL ?? 'http://localhost:8000/api/v1'

export const ACCOUNTS = {
  platform: 'plataforma@nexora.test',
  roblesAdmin: 'admin@robles.test',
  roblesTeacher: 'docente@robles.test',
  monteverdeAdmin: 'admin@monteverde.test',
} as const

export async function login(page: Page, email: string, password = DEMO_PASSWORD) {
  await page.goto('/ingresar')
  await page.getByLabel('Correo').fill(email)
  await page.getByLabel('Contraseña').fill(password)
  await page.getByRole('button', { name: 'Ingresar' }).click()
  await expect(page.getByRole('heading', { name: /^Hola,/ })).toBeVisible()
}

/** Guarda una captura como evidencia: EV_<caso>_<paso>_<proyecto>_<fecha>.png (Estándares, sección 2). */
export async function evidence(page: Page, testInfo: TestInfo, caseId: string, step: string) {
  // Fecha local (Costa Rica), no UTC: después de las 18:00 la fecha UTC ya es la del día siguiente.
  const date = new Date().toLocaleDateString('en-CA').replaceAll('-', '')
  const path = `../Docs/05-Pruebas/evidencias/e2e/EV_${caseId}_${step}_${testInfo.project.name}_${date}.png`
  await page.screenshot({ path, fullPage: true })
  await testInfo.attach(`${caseId} ${step}`, { path, contentType: 'image/png' })
}

export const uniqueSuffix = () => Date.now().toString().slice(-8)
