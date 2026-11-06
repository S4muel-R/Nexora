# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: estudiantes.spec.ts >> HU06 – HU07 Estudiantes y aislamiento >> CP-S10 HU06-E1/E2 cada institución ve solo sus estudiantes
- Location: e2e/estudiantes.spec.ts:5:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /^Hola,/ })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: /^Hola,/ }) with timeout 5000ms
  - waiting for getByRole('heading', { name: /^Hola,/ })

```

```yaml
- main:
  - heading "Nexora" [level=1]
  - paragraph: Ingrese con su cuenta institucional.
  - text: Correo
  - textbox "Correo"
  - text: Contraseña
  - textbox "Contraseña"
  - button "Ingresar"
```

# Test source

```ts
  1  | import { expect } from '@playwright/test'
  2  | import type { Page, TestInfo } from '@playwright/test'
  3  | 
  4  | /** Contraseña de las cuentas ficticias creadas por `manage.py seed_demo`. */
  5  | export const DEMO_PASSWORD = 'Nexora-Demo-2026'
  6  | 
  7  | export const ACCOUNTS = {
  8  |   platform: 'plataforma@nexora.test',
  9  |   roblesAdmin: 'admin@robles.test',
  10 |   roblesTeacher: 'docente@robles.test',
  11 |   monteverdeAdmin: 'admin@monteverde.test',
  12 | } as const
  13 | 
  14 | export async function login(page: Page, email: string, password = DEMO_PASSWORD) {
  15 |   await page.goto('/ingresar')
  16 |   await page.getByLabel('Correo').fill(email)
  17 |   await page.getByLabel('Contraseña').fill(password)
  18 |   await page.getByRole('button', { name: 'Ingresar' }).click()
> 19 |   await expect(page.getByRole('heading', { name: /^Hola,/ })).toBeVisible()
     |                                                               ^ Error: expect(locator).toBeVisible() failed
  20 | }
  21 | 
  22 | /** Guarda una captura como evidencia: EV_<caso>_<paso>_<proyecto>_<fecha>.png (Estándares, sección 2). */
  23 | export async function evidence(page: Page, testInfo: TestInfo, caseId: string, step: string) {
  24 |   // Fecha local (Costa Rica), no UTC: después de las 18:00 la fecha UTC ya es la del día siguiente.
  25 |   const date = new Date().toLocaleDateString('en-CA').replaceAll('-', '')
  26 |   const path = `../Docs/05-Pruebas/evidencias/e2e/EV_${caseId}_${step}_${testInfo.project.name}_${date}.png`
  27 |   await page.screenshot({ path, fullPage: true })
  28 |   await testInfo.attach(`${caseId} ${step}`, { path, contentType: 'image/png' })
  29 | }
  30 | 
  31 | export const uniqueSuffix = () => Date.now().toString().slice(-8)
  32 | 
```