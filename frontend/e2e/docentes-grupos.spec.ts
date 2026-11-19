import { expect, test } from '@playwright/test'
import { ACCOUNTS, API_URL, DEMO_PASSWORD, evidence, login, logout, openMenu, uniqueSuffix } from './helpers'

test.describe('HU05-E5, HU08 y HU09 Periodo, docentes y grupos', () => {
  test('CP-S22 HU05-E5 definir el periodo lectivo vigente', async ({ page }, info) => {
    const name = `E2E-${uniqueSuffix()}`
    await login(page, ACCOUNTS.arcoirisAdmin)
    await openMenu(page, 'Mi institución')
    const periods = page.getByRole('table', { name: 'Periodos lectivos' })

    // Fechas invertidas: el periodo no se guarda.
    await page.getByRole('button', { name: 'Definir periodo' }).click()
    const form = page.getByRole('form', { name: 'Definir periodo lectivo' })
    await form.getByLabel('Nombre del periodo').fill(name)
    await form.getByLabel('Inicio').fill('2027-12-10')
    await form.getByLabel('Fin').fill('2027-02-01')
    await form.getByRole('button', { name: 'Guardar periodo' }).click()
    await expect(form.getByText('La fecha de fin debe ser posterior o igual a la de inicio.')).toBeVisible()

    await form.getByLabel('Inicio').fill('2027-02-01')
    await form.getByLabel('Fin').fill('2027-12-10')
    await form.getByRole('button', { name: 'Guardar periodo' }).click()
    await expect(page.getByRole('status')).toHaveText(`Periodo lectivo ${name} guardado como vigente.`)
    await expect(periods.getByRole('row', { name: new RegExp(`${name}.*Vigente`) })).toBeVisible()
    await evidence(page, info, 'CP-S22', 'periodo-vigente')

    // Restablece 2026 como vigente para el resto de las pruebas.
    await page.getByRole('button', { name: 'Marcar 2026 como vigente' }).click()
    await expect(page.getByRole('status')).toHaveText('2026 es ahora el periodo vigente.')
  })

  test('CP-S23 HU08-E1/E2 registrar un docente, que ingresa, y desactivarlo', async ({ page }, info) => {
    const email = `docente-${info.project.name}-${uniqueSuffix()}@robles.test`
    await login(page, ACCOUNTS.roblesAdmin)
    await openMenu(page, 'Docentes')
    await page.getByRole('button', { name: 'Registrar docente' }).click()
    const form = page.getByRole('form', { name: 'Registrar docente' })
    await form.getByLabel('Nombre').fill('Marta')
    await form.getByLabel('Apellidos').fill('Prueba E2E')
    await form.getByLabel('Correo').fill(email)
    await form.getByLabel('Contraseña inicial').fill(DEMO_PASSWORD)
    await form.getByRole('button', { name: 'Guardar' }).click()
    await expect(page.getByRole('status')).toHaveText('Marta Prueba E2E fue registrado con su cuenta de docente.')
    const row = page.getByRole('row', { name: new RegExp(email) })
    await expect(row.getByText('Activo')).toBeVisible()
    await evidence(page, info, 'CP-S23', 'registrado')

    await logout(page)
    await login(page, email)
    await expect(page.getByText(/^Personal docente · Escuela Los Robles/)).toBeVisible()
    await logout(page)

    await login(page, ACCOUNTS.roblesAdmin)
    await openMenu(page, 'Docentes')
    await row.getByRole('button', { name: 'Desactivar' }).click()
    await expect(page.getByRole('status')).toHaveText('Marta Prueba E2E fue desactivado.')
    await expect(row).toHaveCount(0)
    await logout(page)

    await page.getByLabel('Correo').fill(email)
    await page.getByLabel('Contraseña').fill(DEMO_PASSWORD)
    await page.getByRole('button', { name: 'Ingresar' }).click()
    await expect(page.getByRole('alert')).toHaveText('Su cuenta está desactivada. Contacte a la administración.')
    await evidence(page, info, 'CP-S23', 'desactivado-sin-acceso')
  })

  test('CP-S24 HU08-E3 correo de docente duplicado', async ({ page }, info) => {
    await login(page, ACCOUNTS.roblesAdmin)
    await openMenu(page, 'Docentes')
    await page.getByRole('button', { name: 'Registrar docente' }).click()
    const form = page.getByRole('form', { name: 'Registrar docente' })
    await form.getByLabel('Nombre').fill('Repetida')
    await form.getByLabel('Apellidos').fill('Duplicada')
    await form.getByLabel('Correo').fill(ACCOUNTS.roblesTeacher)
    await form.getByLabel('Contraseña inicial').fill(DEMO_PASSWORD)
    await form.getByRole('button', { name: 'Guardar' }).click()

    await expect(form.getByRole('alert')).toHaveText('Ya existe una cuenta con ese correo.')
    await evidence(page, info, 'CP-S24', 'duplicado')
  })

  test('CP-S25 HU09-E1/E3/E4 y HU11-E3 crear un grupo, asignarlo y validar duplicados', async ({ page }, info) => {
    const code = `G${uniqueSuffix()}`
    await login(page, ACCOUNTS.roblesAdmin)
    await openMenu(page, 'Grupos')

    // HU09-E4 (CA12): código repetido en el periodo.
    await page.getByRole('button', { name: 'Crear grupo' }).click()
    let form = page.getByRole('form', { name: 'Crear grupo' })
    await form.getByLabel('Código').fill('4-A')
    await form.getByRole('button', { name: 'Guardar' }).click()
    await expect(form.getByRole('alert')).toHaveText('Ya existe un grupo con ese código en este periodo.')
    await evidence(page, info, 'CP-S25', 'codigo-duplicado')
    await form.getByRole('button', { name: 'Cancelar' }).click()

    // HU09-E1 (CA11, CA15): grupo nuevo con su docente.
    await page.getByRole('button', { name: 'Crear grupo' }).click()
    form = page.getByRole('form', { name: 'Crear grupo' })
    await form.getByLabel('Código').fill(code)
    await form.getByRole('button', { name: 'Guardar' }).click()
    await expect(page.getByRole('status').first()).toHaveText(`El grupo ${code} fue creado.`)
    const detail = page.getByRole('article', { name: new RegExp(`Grupo ${code}`) })
    await detail.getByLabel('Asignar docente').selectOption({ label: 'Castro Rojas, Andrés' })
    await detail.getByRole('button', { name: 'Asignar docente' }).click()
    await expect(detail.getByRole('status')).toHaveText('Docente asignado.')
    await expect(detail.getByRole('listitem').filter({ hasText: 'Andrés Castro Rojas' })).toBeVisible()

    // HU09-E3 (CA14): Ana ya está en 4-A.
    await detail.getByRole('checkbox', { name: /Mora Vargas, Ana/ }).check()
    await detail.getByRole('button', { name: 'Asignar seleccionados' }).click()
    await expect(detail.getByRole('alert')).toHaveText('El estudiante ya pertenece a un grupo en este periodo.')
    await evidence(page, info, 'CP-S25', 'grupo-creado')

    // Quita la asignación para que el docente conserve solo 4-A en las demás pruebas.
    await detail.getByRole('button', { name: 'Quitar a Andrés Castro Rojas del grupo' }).click()
    await expect(detail.getByText('Sin docente asignado.')).toBeVisible()

    // HU11-E3: el grupo nuevo no tiene estudiantes.
    await openMenu(page, 'Reportes')
    await page.getByLabel('Listado', { exact: true }).selectOption('students')
    await page.getByLabel('Grupo', { exact: true }).first().selectOption({ label: `${code} (2026)` })
    await expect(page.getByText('No hay registros para los filtros seleccionados.')).toBeVisible()
    await evidence(page, info, 'CP-S25', 'sin-resultados')
  })

  test('CP-S26 HU09-E2 trasladar un estudiante entre 4-A y 4-B', async ({ page }, info) => {
    const student = 'Rodríguez Leiva, Diego'
    await login(page, ACCOUNTS.roblesAdmin)
    await openMenu(page, 'Grupos')
    await page.getByRole('button', { name: 'Ver grupo 4-B' }).click()
    let detail = page.getByRole('article', { name: /Grupo 4-B/ })
    await expect(detail.getByRole('heading', { level: 3, name: /Estudiantes/ })).toBeVisible()
    // Cada proyecto lo traslada desde el grupo donde esté (la base se comparte entre proyectos).
    const [from, to] = (await detail.getByRole('row', { name: new RegExp(student) }).count()) ? ['4-B', '4-A'] : ['4-A', '4-B']
    await page.getByRole('button', { name: `Ver grupo ${from}` }).click()
    detail = page.getByRole('article', { name: new RegExp(`Grupo ${from}`) })
    await detail.getByLabel('Grupo destino de Diego Rodríguez Leiva').selectOption({ label: to })
    await detail.getByRole('button', { name: 'Trasladar a Diego Rodríguez Leiva' }).click()

    await expect(detail.getByRole('status')).toHaveText(`Diego Rodríguez Leiva fue trasladado a ${to}.`)
    await expect(detail.getByRole('row', { name: new RegExp(student) })).toHaveCount(0)
    await page.getByRole('button', { name: `Ver grupo ${to}` }).click()
    await expect(
      page.getByRole('article', { name: new RegExp(`Grupo ${to}`) }).getByRole('row', { name: new RegExp(student) }),
    ).toBeVisible()
    await evidence(page, info, 'CP-S26', 'trasladado')
  })

  test('CP-S27 CA16 y CA22 el docente solo ve sus grupos y no accede a listados', async ({ page, playwright }, info) => {
    // Identificador de 4-B consultado como personal administrativo.
    const admin = await playwright.request.newContext()
    await admin.post(`${API_URL}/auth/login/`, { data: { email: ACCOUNTS.roblesAdmin, password: DEMO_PASSWORD } })
    const groups: { id: number; code: string }[] = await (await admin.get(`${API_URL}/groups/`)).json()
    const groupB = groups.find((g) => g.code === '4-B')!
    await admin.dispose()

    const teacher = await playwright.request.newContext()
    await teacher.post(`${API_URL}/auth/login/`, { data: { email: ACCOUNTS.roblesTeacher, password: DEMO_PASSWORD } })
    expect((await teacher.get(`${API_URL}/groups/${groupB.id}/`)).status()).toBe(404)
    expect((await teacher.get(`${API_URL}/attendance/?group=${groupB.id}&date=2026-11-02`)).status()).toBe(404)
    expect((await teacher.get(`${API_URL}/reports/groups/`)).status()).toBe(403)
    expect((await teacher.get(`${API_URL}/reports/students/`)).status()).toBe(403)
    await teacher.dispose()

    await login(page, ACCOUNTS.roblesTeacher)
    await openMenu(page, 'Grupos')
    const table = page.getByRole('table', { name: 'Lista de grupos' })
    await expect(table.getByText('4-A', { exact: true })).toBeVisible()
    await expect(table.getByText('4-B', { exact: true })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Crear grupo' })).toHaveCount(0)
    await evidence(page, info, 'CP-S27', 'docente-grupos')
    await openMenu(page, 'Reportes')
    await expect(page.getByRole('heading', { name: 'Listados' })).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Resumen de asistencia' })).toBeVisible()
  })

  test('CP-S28 HU11-E1/E2 listados por grupo y por nivel; otra institución no ve los grupos', async ({ page }, info) => {
    await login(page, ACCOUNTS.roblesAdmin)
    await openMenu(page, 'Reportes')
    const groups = page.getByRole('table', { name: 'Listado de grupos' })
    await expect(groups.getByRole('row', { name: /4-A.*Andrés Castro Rojas/ })).toBeVisible()
    await page.getByLabel('Nivel').selectOption('primaria')
    await expect(groups.getByRole('row', { name: /4-B/ })).toBeVisible()
    await page.getByLabel('Listado', { exact: true }).selectOption('students')
    const students = page.getByRole('table', { name: 'Listado de estudiantes' })
    await expect(students.getByRole('row', { name: /Mora Vargas, Ana.*4-A/ })).toBeVisible()
    await evidence(page, info, 'CP-S28', 'listados')
    await logout(page)

    await login(page, ACCOUNTS.monteverdeAdmin)
    await openMenu(page, 'Reportes')
    await expect(groups.getByText('10-1', { exact: true })).toBeVisible()
    await expect(groups.getByText('4-A', { exact: true })).toHaveCount(0)
  })
})
