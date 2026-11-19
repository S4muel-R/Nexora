import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { ACCOUNTS, API_URL, DEMO_PASSWORD, evidence, login } from './helpers'

test.describe('HU01 – HU03 Acceso y opciones por rol', () => {
  test('CP-S01 HU01-E1 la administradora inicia sesión y ve su institución', async ({ page }, info) => {
    await login(page, ACCOUNTS.roblesAdmin)

    await expect(page.getByText('Escuela Los Robles').first()).toBeVisible()
    await evidence(page, info, 'CP-S01', 'inicio')
  })

  test('CP-S02 HU01-E3 credenciales inválidas muestran un mensaje genérico', async ({ page }, info) => {
    await page.goto('/ingresar')
    await page.getByLabel('Correo').fill(ACCOUNTS.roblesAdmin)
    await page.getByLabel('Contraseña').fill('incorrecta')
    await page.getByRole('button', { name: 'Ingresar' }).click()

    await expect(page.getByRole('alert')).toHaveText('Correo o contraseña incorrectos.')
    await evidence(page, info, 'CP-S02', 'mensaje')
  })

  test('CP-S03 HU01-E5 campos vacíos se marcan como obligatorios', async ({ page }, info) => {
    await page.goto('/ingresar')
    await page.getByRole('button', { name: 'Ingresar' }).click()

    await expect(page.getByText('Ingrese su correo.')).toBeVisible()
    await expect(page.getByText('Ingrese su contraseña.')).toBeVisible()
    await evidence(page, info, 'CP-S03', 'validacion')
  })

  test('CP-S04 HU02-E1/E2 cerrar sesión y volver atrás pide ingresar', async ({ page }, info) => {
    await login(page, ACCOUNTS.roblesAdmin)
    await page.getByRole('link', { name: 'Estudiantes' }).first().click()
    await page.getByRole('button', { name: 'Cerrar sesión' }).click()
    await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible()

    await page.goBack()
    await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible()
    await evidence(page, info, 'CP-S04', 'sesion-cerrada')
  })

  test('CP-S05 HU03-E1/E2 cada rol ve solo sus opciones', async ({ page }, info) => {
    const menu = page.getByRole('navigation', { name: 'Menú principal' })

    await login(page, ACCOUNTS.roblesAdmin)
    await expect(menu.getByRole('link')).toHaveText([
      'Inicio',
      'Mi institución',
      'Estudiantes',
      'Docentes',
      'Grupos',
      'Asistencia',
      'Reportes',
    ])
    await evidence(page, info, 'CP-S05', 'menu-administrativo')
    await page.getByRole('button', { name: 'Cerrar sesión' }).click()

    await login(page, ACCOUNTS.platform)
    await expect(menu.getByRole('link')).toHaveText(['Inicio', 'Instituciones'])
    await evidence(page, info, 'CP-S05', 'menu-plataforma')
  })

  test('CP-S06 HU03-E3 el docente no entra a la gestión de instituciones', async ({ page }, info) => {
    await login(page, ACCOUNTS.roblesTeacher)
    await page.goto('/instituciones')

    await expect(page.getByText('No tiene permiso para realizar esta acción.')).toBeVisible()
    await evidence(page, info, 'CP-S06', 'acceso-restringido')
  })

  test('CP-S19 HU01-E1 una validación tardía de la sesión anterior no cierra la sesión nueva (reprueba INC-007)', async ({ page }, info) => {
    // Sesión anterior que ya no es válida (por ejemplo, cerrada en otra pestaña) y validación lenta de /auth/me/.
    await page.context().addCookies([
      { name: 'sessionid', value: 'sesion-anterior-invalida', domain: 'localhost', path: '/' },
    ])
    await page.route('**/api/v1/auth/me/', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      await route.continue()
    })

    await login(page, ACCOUNTS.roblesAdmin)
    await page.waitForTimeout(2500)

    await expect(page.getByRole('heading', { name: /^Hola,/ })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible()
    await evidence(page, info, 'CP-S19', 'sesion-conservada')
  })

  test('CP-S21 HU02-E1 cerrar sesión y recargar enseguida no restaura la sesión (reprueba INC-009)', async ({ page }, info) => {
    await login(page, ACCOUNTS.roblesAdmin)
    // El primer aviso de cierre no llega al servidor (se cerró la pestaña o se cayó la red); los siguientes sí.
    let logoutCalls = 0
    await page.route('**/api/v1/auth/logout/', async (route) => {
      if (++logoutCalls === 1) await route.abort()
      else await route.continue()
    })
    await page.getByRole('button', { name: 'Cerrar sesión' }).click()
    await page.reload()

    // Al abrir de nuevo, la aplicación completa el cierre pendiente antes de restaurar la sesión.
    await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible({ timeout: 15_000 })
    // El cierre pendiente se completa en el servidor (no solo en la pantalla), aunque su respuesta tarde.
    await expect
      .poll(async () => (await page.request.get(`${API_URL}/auth/me/`)).status(), { timeout: 15_000 })
      .toBe(401)
    await evidence(page, info, 'CP-S21', 'sesion-cerrada')
  })

  /** Retrasa 2 s la respuesta del cierre de sesión, que trae la cookie de sesión vacía (INC-012). */
  const delayLogoutResponse = (page: Page) =>
    page.route('**/auth/logout/', async (route) => {
      const response = await route.fetch()
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await route.fulfill({ response })
    })

  const expectMonteverdeSession = async (page: Page) => {
    await page.getByRole('link', { name: 'Estudiantes' }).first().click()
    await page.waitForTimeout(2500)
    await page.reload()
    await expect(page.getByRole('table', { name: 'Lista de estudiantes' }).getByText('Calderón Mora, Javier')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible()
  }

  test('CP-S33 HU02-E1 / HU01-E1 un cierre tardío no cierra la sesión iniciada después en la misma página (reprueba INC-012)', async ({ page }, info) => {
    await delayLogoutResponse(page)
    await login(page, ACCOUNTS.roblesAdmin)
    await page.getByRole('button', { name: 'Cerrar sesión' }).click()
    // Sin recargar: se ingresa con otra cuenta mientras el cierre sigue sin respuesta.
    await page.getByLabel('Correo').fill(ACCOUNTS.monteverdeAdmin)
    await page.getByLabel('Contraseña').fill(DEMO_PASSWORD)
    await page.getByRole('button', { name: 'Ingresar' }).click()
    await expect(page.getByRole('heading', { name: /^Hola,/ })).toBeVisible()

    await expectMonteverdeSession(page)
    await evidence(page, info, 'CP-S33', 'sesion-siguiente-conservada')
  })

  test('CP-S34 HU02-E1 / HU01-E1 un cierre tardío no cierra la sesión iniciada después de recargar (reprueba INC-012)', async ({ page }, info) => {
    await delayLogoutResponse(page)
    await login(page, ACCOUNTS.roblesAdmin)
    await page.getByRole('button', { name: 'Cerrar sesión' }).click()
    // `login` abre /ingresar de nuevo: la primera petición de cierre (keepalive) sigue en curso.
    await login(page, ACCOUNTS.monteverdeAdmin)

    await expectMonteverdeSession(page)
    await evidence(page, info, 'CP-S34', 'sesion-siguiente-conservada')
  })
})
