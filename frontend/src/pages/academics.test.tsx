import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppRoutes } from '../App'
import type { AttendanceSheet, Group, User } from '../api/types'
import { AuthProvider } from '../auth/AuthContext'

/** Pruebas unitarias de HU05-E5 y HU08 – HU12 con la API simulada. */

const admin: User = {
  id: 1,
  email: 'admin@robles.test',
  first_name: 'Laura',
  last_name: 'Solís',
  role: 'institution_admin',
  institution: { id: 1, name: 'Escuela Los Robles' },
}
const teacher: User = { ...admin, id: 2, email: 'docente@robles.test', first_name: 'Andrés', role: 'teacher' }
const robles = { id: 1, name: 'Escuela Los Robles', levels: ['primaria'], address: '', phone: '', email: '', is_active: true }
const period = { id: 1, name: '2026', start_date: '2026-02-02', end_date: '2026-12-11', is_current: true }
const ana = { id: 7, identification: '1-1', first_name: 'Ana', last_name: 'Mora', level: 'primaria' as const, is_active: true }
const bruno = { ...ana, id: 8, identification: '1-2', first_name: 'Bruno', last_name: 'Quesada' }
const group = (code: string, id: number, students = [ana]): Group => ({
  id,
  code,
  level: 'primaria',
  period: 1,
  period_name: '2026',
  teachers: [{ id: 3, name: 'Andrés Castro' }],
  students,
  student_count: students.length,
})

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const conflict = (message: string) => json(409, { error: { code: 'conflict', message } })
const invalid = (fields: Record<string, string[]>) =>
  json(400, { error: { code: 'validation_error', message: 'Los datos enviados no son válidos.', fields } })

type Handler = (url: string, method: string) => Response | undefined

function api(user: User, handler: Handler) {
  const calls: { url: string; method: string; body: unknown }[] = []
  vi.stubGlobal('fetch', async (url: string, init?: RequestInit) => {
    const method = init?.method ?? 'GET'
    calls.push({ url, method, body: init?.body ? JSON.parse(String(init.body)) : undefined })
    if (url.endsWith('/auth/me/')) return json(200, user)
    if (url.endsWith('/auth/csrf/')) return json(200, {})
    return handler(url, method) ?? json(200, [])
  })
  return calls
}

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MemoryRouter>,
  )

afterEach(() => vi.unstubAllGlobals())

describe('HU05-E5 Periodo lectivo', () => {
  it('define el periodo 2026 como vigente', async () => {
    const calls = api(admin, (url, method) => {
      if (url.endsWith('/periods/') && method === 'POST') return json(201, period)
      if (url.endsWith('/my-institution/')) return json(200, robles)
    })
    renderAt('/mi-institucion')

    await userEvent.click(await screen.findByRole('button', { name: 'Definir periodo' }))
    await userEvent.type(screen.getByLabelText('Nombre del periodo'), '2026')
    await userEvent.type(screen.getByLabelText('Inicio'), '2026-02-02')
    await userEvent.type(screen.getByLabelText('Fin'), '2026-12-11')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar periodo' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Periodo lectivo 2026 guardado como vigente.')
    expect(calls.find((c) => c.method === 'POST')?.body).toEqual({
      name: '2026',
      start_date: '2026-02-02',
      end_date: '2026-12-11',
      is_current: true,
    })
  })

  it('el personal docente consulta los periodos sin poder definirlos', async () => {
    api(teacher, (url) => {
      if (url.endsWith('/periods/')) return json(200, [period])
      if (url.endsWith('/my-institution/')) return json(200, robles)
    })
    renderAt('/mi-institucion')

    expect(await screen.findByRole('cell', { name: 'Vigente' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Definir periodo' })).not.toBeInTheDocument()
  })
})

describe('HU08 Docentes', () => {
  it('HU08-E1: registra un docente con su contraseña inicial', async () => {
    const calls = api(admin, (url, method) => {
      if (url.endsWith('/teachers/') && method === 'POST')
        return json(201, { id: 5, first_name: 'Rosa', last_name: 'Vega', email: 'docente1@robles.test', is_active: true })
    })
    renderAt('/docentes')

    await userEvent.click(await screen.findByRole('button', { name: 'Registrar docente' }))
    expect(screen.getByRole('heading', { name: 'Nuevo docente' })).toHaveFocus()
    await userEvent.type(screen.getByLabelText('Nombre'), 'Rosa')
    await userEvent.type(screen.getByLabelText('Apellidos'), 'Vega')
    await userEvent.type(screen.getByLabelText('Correo'), 'docente1@robles.test')
    await userEvent.type(screen.getByLabelText('Contraseña inicial'), 'Clave-segura-2026')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Rosa Vega fue registrado con su cuenta de docente.')
    expect(calls.find((c) => c.method === 'POST')?.body).toMatchObject({ email: 'docente1@robles.test' })
  })

  it('HU08-E3: muestra el error de correo duplicado', async () => {
    api(admin, (_url, method) => (method === 'POST' ? conflict('Ya existe una cuenta con ese correo.') : undefined))
    renderAt('/docentes')

    await userEvent.click(await screen.findByRole('button', { name: 'Registrar docente' }))
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Ya existe una cuenta con ese correo.')
  })

  it('HU08-E2: desactiva un docente', async () => {
    const calls = api(admin, (url, method) => {
      if (method === 'PATCH') return json(200, {})
      if (url.includes('/teachers/'))
        return json(200, [{ id: 5, first_name: 'Rosa', last_name: 'Vega', email: 'r@robles.test', is_active: true }])
    })
    renderAt('/docentes')

    await userEvent.click(await screen.findByRole('button', { name: 'Desactivar' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Rosa Vega fue desactivado.')
    expect(calls.find((c) => c.method === 'PATCH')?.body).toEqual({ is_active: false })
  })
})

describe('HU09 Grupos', () => {
  const groupsApi = (user: User, extra: Handler = () => undefined) =>
    api(user, (url, method) => {
      const result = extra(url, method)
      if (result) return result
      if (url.endsWith('/periods/')) return json(200, [period])
      if (url.endsWith('/my-institution/')) return json(200, robles)
      if (url.includes('/groups/?period=1')) return json(200, [group('4-A', 1), group('4-B', 2, [])])
      if (url.endsWith('/students/')) return json(200, [ana, bruno])
      if (url.endsWith('/teachers/')) return json(200, [])
    })

  it('HU09-E1: crea un grupo en el periodo vigente', async () => {
    const calls = groupsApi(admin, (url, method) =>
      url.endsWith('/groups/') && method === 'POST' ? json(201, group('4-C', 9, [])) : undefined,
    )
    renderAt('/grupos')

    const create = await screen.findByRole('button', { name: 'Crear grupo' })
    await vi.waitFor(() => expect(create).toBeEnabled())
    await userEvent.click(create)
    await userEvent.type(screen.getByLabelText('Código'), '4-C')
    await userEvent.click(within(screen.getByRole('form', { name: 'Crear grupo' })).getByRole('button', { name: 'Guardar' }))

    expect(await screen.findByRole('status')).toHaveTextContent('El grupo 4-C fue creado.')
    expect(calls.find((c) => c.method === 'POST')?.body).toEqual({ code: '4-C', level: 'primaria', period: 1 })
  })

  it('INC-010: crear grupo se habilita al cargar los niveles y el único nivel queda preseleccionado', async () => {
    let release: () => void = () => {}
    const loaded = new Promise<void>((resolve) => (release = resolve))
    const calls = groupsApi(admin, (url, method) => {
      if (url.endsWith('/groups/') && method === 'POST') return json(201, group('4-C', 9, []))
      return undefined
    })
    const base = globalThis.fetch
    vi.stubGlobal('fetch', async (url: string, init?: RequestInit) => {
      if (url.endsWith('/my-institution/')) await loaded
      return base(url, init)
    })
    renderAt('/grupos')

    const create = await screen.findByRole('button', { name: 'Crear grupo' })
    await vi.waitFor(() => expect(screen.getByLabelText('Periodo lectivo')).toHaveValue('1'))
    expect(create).toBeDisabled()
    release()
    await vi.waitFor(() => expect(create).toBeEnabled())
    await userEvent.click(create)
    expect(screen.getByLabelText('Nivel')).toHaveValue('primaria')
    await userEvent.type(screen.getByLabelText('Código'), '4-C')
    await userEvent.click(within(screen.getByRole('form', { name: 'Crear grupo' })).getByRole('button', { name: 'Guardar' }))
    await screen.findByRole('status')
    expect(calls.find((c) => c.method === 'POST')?.body).toMatchObject({ level: 'primaria' })
  })

  it('HU09-E3: muestra que el estudiante ya pertenece a un grupo del periodo', async () => {
    groupsApi(admin, (url, method) =>
      url.endsWith('/groups/2/students/') && method === 'POST'
        ? conflict('El estudiante ya pertenece a un grupo en este periodo.')
        : undefined,
    )
    renderAt('/grupos')

    await userEvent.click(await screen.findByRole('button', { name: 'Ver grupo 4-B' }))
    await userEvent.click(await screen.findByRole('checkbox', { name: /Mora, Ana/ }))
    expect(screen.getByText('(en 4-A)')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Asignar seleccionados' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('El estudiante ya pertenece a un grupo en este periodo.')
  })

  it('HU09-E2: traslada un estudiante de 4-A a 4-B', async () => {
    const calls = groupsApi(admin, (url, method) =>
      url.endsWith('/groups/1/transfer/') && method === 'POST' ? json(200, group('4-A', 1, [])) : undefined,
    )
    renderAt('/grupos')

    await userEvent.click(await screen.findByRole('button', { name: 'Ver grupo 4-A' }))
    await userEvent.selectOptions(screen.getByLabelText('Grupo destino de Ana Mora'), '4-B')
    await userEvent.click(screen.getByRole('button', { name: 'Trasladar a Ana Mora' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Ana Mora fue trasladado a 4-B.')
    expect(calls.find((c) => c.url.endsWith('/transfer/'))?.body).toEqual({ student: 7, target_group: 2 })
  })

  it('CA16: el personal docente consulta sus grupos sin acciones de edición', async () => {
    groupsApi(teacher)
    renderAt('/grupos')

    await userEvent.click(await screen.findByRole('button', { name: 'Ver grupo 4-A' }))
    expect(screen.queryByRole('button', { name: 'Crear grupo' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Asignar seleccionados' })).not.toBeInTheDocument()
  })
})

describe('HU10 Asistencia', () => {
  const dateOf = (url: string) => new URL(url).searchParams.get('date')!
  const sheet = (recorded: boolean): AttendanceSheet => ({
    group: 1,
    group_code: '4-A',
    date: '2026-11-02',
    recorded,
    can_edit: true,
    entries: [
      {
        student: 7,
        name: 'Ana Mora',
        identification: '1-1',
        record: recorded ? 40 : null,
        status: recorded ? 'ausente' : null,
        changes: [],
      },
    ],
  })

  it('HU10-E1: marca la asistencia y la guarda', async () => {
    let saved = false
    const calls = api(teacher, (url, method) => {
      if (url.endsWith('/groups/')) return json(200, [group('4-A', 1)])
      if (url.endsWith('/attendance/') && method === 'POST') {
        saved = true
        return json(201, { recorded: 1 })
      }
      if (url.includes('/attendance/?')) return json(200, { ...sheet(saved), date: dateOf(url) })
    })
    renderAt('/asistencia')

    await userEvent.click(await screen.findByRole('radio', { name: 'Ausente' }))
    await userEvent.click(screen.getByRole('button', { name: 'Guardar asistencia' }))

    expect(await screen.findByRole('status')).toHaveTextContent(/Asistencia de 4-A del \d{4}-\d{2}-\d{2} registrada\./)
    expect(calls.find((c) => c.method === 'POST')?.body).toMatchObject({ entries: [{ student: 7, status: 'ausente' }] })
  })

  it('INC-011: una respuesta tardía de otra fecha no reemplaza la lista de la fecha elegida', async () => {
    let releaseFirst: () => void = () => {}
    const firstDelayed = new Promise<void>((resolve) => (releaseFirst = resolve))
    let sheets = 0
    const calls = api(teacher, (url, method) => {
      if (url.endsWith('/groups/')) return json(200, [group('4-A', 1)])
      if (url.endsWith('/attendance/') && method === 'POST') return json(201, { recorded: 1 })
      if (url.includes('/attendance/?')) {
        const date = new URL(url).searchParams.get('date')!
        return json(200, { ...sheet(false), date })
      }
    })
    const base = globalThis.fetch
    vi.stubGlobal('fetch', async (url: string, init?: RequestInit) => {
      if (url.includes('/attendance/?') && sheets++ === 0) await firstDelayed
      return base(url, init)
    })
    renderAt('/asistencia')

    const dateField = await screen.findByLabelText('Fecha')
    await vi.waitFor(() => expect(sheets).toBe(1))
    await userEvent.clear(dateField)
    await userEvent.type(dateField, '2026-11-02')
    expect(await screen.findByRole('heading', { name: '4-A · 2026-11-02' })).toBeInTheDocument()
    releaseFirst()
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(screen.getByRole('heading', { name: '4-A · 2026-11-02' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Guardar asistencia' }))

    await screen.findByRole('status')
    expect(calls.find((c) => c.method === 'POST')?.body).toMatchObject({ date: '2026-11-02' })
  })

  it('HU10-E3: si la fecha ya tiene asistencia, abre el modo corrección', async () => {
    let calls = 0
    api(teacher, (url, method) => {
      if (url.endsWith('/groups/')) return json(200, [group('4-A', 1)])
      if (method === 'POST') return conflict('La asistencia de esta fecha ya fue registrada.')
      if (url.includes('/attendance/?')) return json(200, { ...sheet(calls++ > 0), date: dateOf(url) })
    })
    renderAt('/asistencia')

    await userEvent.click(await screen.findByRole('button', { name: 'Guardar asistencia' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('ya fue registrada')
    expect(await screen.findByRole('button', { name: 'Corregir la asistencia de Ana Mora' })).toBeInTheDocument()
  })

  it('HU10-E4: la corrección exige el motivo', async () => {
    api(teacher, (url, method) => {
      if (url.endsWith('/groups/')) return json(200, [group('4-A', 1)])
      if (url.endsWith('/correct/') && method === 'POST') return invalid({ reason: ['El motivo es obligatorio.'] })
      if (url.includes('/attendance/?')) return json(200, sheet(true))
    })
    renderAt('/asistencia')

    await userEvent.click(await screen.findByRole('button', { name: 'Corregir la asistencia de Ana Mora' }))
    expect(screen.getByRole('heading', { name: 'Corregir asistencia de Ana Mora' })).toHaveFocus()
    await userEvent.click(screen.getByRole('button', { name: 'Guardar corrección' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('El motivo es obligatorio.')
    expect(screen.getByLabelText('Motivo')).toHaveAttribute('aria-invalid', 'true')
  })

  it('HU10-E2: corrige a presente con motivo', async () => {
    const calls = api(teacher, (url, method) => {
      if (url.endsWith('/groups/')) return json(200, [group('4-A', 1)])
      if (url.endsWith('/correct/') && method === 'POST') return json(200, {})
      if (url.includes('/attendance/?')) return json(200, sheet(true))
    })
    renderAt('/asistencia')

    await userEvent.click(await screen.findByRole('button', { name: 'Corregir la asistencia de Ana Mora' }))
    await userEvent.type(screen.getByLabelText('Motivo'), 'Llegó tarde')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar corrección' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Asistencia de Ana Mora corregida a presente.')
    expect(calls.find((c) => c.url.endsWith('/attendance/40/correct/'))?.body).toEqual({
      status: 'presente',
      reason: 'Llegó tarde',
    })
  })
})

describe('HU11 y HU12 Reportes', () => {
  it('HU11-E3: sin resultados muestra el mensaje en lugar de una tabla vacía', async () => {
    api(admin, (url) => {
      if (url.endsWith('/my-institution/')) return json(200, robles)
      if (url.includes('/reports/groups/')) return json(200, [])
    })
    renderAt('/reportes')

    expect(await screen.findByText('No hay registros para los filtros seleccionados.')).toBeInTheDocument()
    expect(screen.queryByRole('table', { name: 'Listado de grupos' })).not.toBeInTheDocument()
  })

  it('HU11-E1: muestra cada grupo con su docente y cantidad de estudiantes', async () => {
    api(admin, (url) => {
      if (url.endsWith('/my-institution/')) return json(200, robles)
      if (url.includes('/reports/groups/'))
        return json(200, [
          { id: 1, code: '4-A', level: 'primaria', period: '2026', teachers: ['Andrés Castro'], student_count: 3 },
        ])
    })
    renderAt('/reportes')

    const table = await screen.findByRole('table', { name: 'Listado de grupos' })
    expect(within(table).getByRole('cell', { name: 'Andrés Castro' })).toBeInTheDocument()
    expect(within(table).getByRole('cell', { name: '3' })).toBeInTheDocument()
  })

  it('HU12-E1: muestra presentes, ausentes y porcentaje', async () => {
    api(teacher, (url) => {
      if (url.endsWith('/groups/')) return json(200, [group('4-A', 1)])
      if (url.includes('/reports/attendance/'))
        return json(200, {
          group: 1,
          group_code: '4-A',
          start: '2026-11-02',
          end: '2026-11-06',
          dates: ['2026-11-02', '2026-11-03'],
          students: [{ student: 7, name: 'Ana Mora', present: 1, absent: 1, unrecorded: 0, percentage: 50 }],
          totals: { present: 1, absent: 1, percentage: 50 },
        })
    })
    renderAt('/reportes')

    expect(await screen.findByRole('heading', { name: 'Resumen de asistencia' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Listados' })).not.toBeInTheDocument()
    await vi.waitFor(() => expect(screen.getByLabelText('Grupo')).toHaveValue('1'))
    await userEvent.click(screen.getByRole('button', { name: 'Consultar' }))

    const table = await screen.findByRole('table', { name: 'Resumen de asistencia de 4-A' })
    expect(within(table).getAllByRole('cell', { name: '50 %' })).toHaveLength(1)
  })

  it('HU12-E3: muestra el error de rango invertido', async () => {
    api(teacher, (url) => {
      if (url.endsWith('/groups/')) return json(200, [group('4-A', 1)])
      if (url.includes('/reports/attendance/'))
        return invalid({ end: ['La fecha inicial debe ser anterior o igual a la final.'] })
    })
    renderAt('/reportes')

    await vi.waitFor(() => expect(screen.getByLabelText('Grupo')).toHaveValue('1'))
    await userEvent.click(screen.getByRole('button', { name: 'Consultar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('La fecha inicial debe ser anterior o igual a la final.')
  })
})
