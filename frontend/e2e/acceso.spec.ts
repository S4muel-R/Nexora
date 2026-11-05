import { expect, test } from '@playwright/test'
import { ACCOUNTS, evidence, login } from './helpers'

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
    await expect(menu.getByRole('link')).toHaveText(['Inicio', 'Mi institución', 'Estudiantes'])
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
})
