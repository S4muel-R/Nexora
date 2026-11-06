import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppRoutes } from '../App'
import type { User } from '../api/types'
import { AuthProvider } from '../auth/AuthContext'

/** Pruebas unitarias de los formularios de HU04, HU05 y HU07 con la API simulada (MQ-04). */

const admin: User = {
  id: 1,
  email: 'admin@robles.test',
  first_name: 'Laura',
  last_name: 'Solís',
  role: 'institution_admin',
  institution: { id: 1, name: 'Escuela Los Robles' },
}
const platform: User = {
  id: 3,
  email: 'plataforma@nexora.test',
  first_name: 'Equipo',
  last_name: 'Nexora',
  role: 'platform_admin',
  institution: null,
}
const robles = {
  id: 1,
  name: 'Escuela Los Robles',
  levels: ['primaria'],
  address: 'San José',
  phone: '2222-0000',
  email: 'info@robles.test',
  is_active: true,
}
const ana = {
  id: 7,
  identification: '1-1111-1111',
  first_name: 'Ana',
  last_name: 'Mora',
  birth_date: '2016-03-14',
  level: 'primaria',
  is_active: true,
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

type Handler = (url: string, init?: RequestInit) => Response | undefined

/** Simula la API: `/auth/me/` devuelve el usuario y cada prueba responde el resto. */
function api(user: User, handler: Handler) {
  const calls: { url: string; method: string; body: unknown }[] = []
  vi.stubGlobal('fetch', async (url: string, init?: RequestInit) => {
    calls.push({ url, method: init?.method ?? 'GET', body: init?.body ? JSON.parse(String(init.body)) : undefined })
    if (url.endsWith('/auth/me/')) return json(200, user)
    return handler(url, init) ?? json(200, [])
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

beforeEach(() => localStorage.clear())
afterEach(() => vi.unstubAllGlobals())

describe('HU04 Registrar una institución (plataforma)', () => {
  it('HU04-E1: envía la institución con su administradora y muestra la confirmación', async () => {
    const calls = api(platform, (url, init) => {
      if (url.endsWith('/institutions/') && init?.method === 'POST') return json(201, { ...robles, id: 9 })
      if (url.endsWith('/institutions/')) return json(200, [])
    })
    renderAt('/instituciones')

    await userEvent.click(await screen.findByRole('button', { name: 'Registrar institución' }))
    const form = screen.getByRole('form', { name: 'Registrar institución' })
    await userEvent.type(within(form).getAllByLabelText('Nombre')[0], 'Escuela Los Robles')
    await userEvent.click(within(form).getByLabelText('Primaria'))
    await userEvent.type(within(form).getAllByLabelText('Nombre')[1], 'Laura')
    await userEvent.type(within(form).getByLabelText('Apellidos'), 'Solís')
    await userEvent.type(within(form).getByLabelText('Correo'), 'admin@robles.test')
    await userEvent.type(within(form).getByLabelText('Contraseña inicial'), 'Clave-segura-2026')
    await userEvent.click(within(form).getByRole('button', { name: 'Guardar' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Institución "Escuela Los Robles" registrada.')
    const post = calls.find((call) => call.method === 'POST' && call.url.endsWith('/institutions/'))
    expect(post?.body).toMatchObject({ name: 'Escuela Los Robles', levels: ['primaria'], admin: { email: 'admin@robles.test' } })
  })

  it('HU04-E3: muestra el error de nombre duplicado que devuelve la API', async () => {
    api(platform, (url, init) => {
      if (init?.method === 'POST')
        return json(409, { error: { code: 'conflict', message: 'Ya existe una institución con ese nombre.' } })
      if (url.endsWith('/institutions/')) return json(200, [robles])
    })
    renderAt('/instituciones')

    expect(await screen.findByText('Escuela Los Robles')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Registrar institución' }))
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Ya existe una institución con ese nombre.')
  })
})

describe('HU05 Mi institución', () => {
  it('HU05-E1: guarda el teléfono nuevo y confirma', async () => {
    const calls = api(admin, (url, init) => {
      if (url.endsWith('/my-institution/') && init?.method === 'PATCH') return json(200, { ...robles, phone: '2222-1234' })
      if (url.endsWith('/my-institution/')) return json(200, robles)
    })
    renderAt('/mi-institucion')

    const phone = await screen.findByLabelText('Teléfono')
    await userEvent.clear(phone)
    await userEvent.type(phone, '2222-1234')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Datos actualizados.')
    expect(calls.find((call) => call.method === 'PATCH')?.body).toMatchObject({ phone: '2222-1234' })
  })

  it('HU05-E3: muestra el error del campo que rechaza la API', async () => {
    api(admin, (url, init) => {
      if (init?.method === 'PATCH')
        return json(400, {
          error: { code: 'validation_error', message: 'Los datos enviados no son válidos.', fields: { email: ['Correo inválido.'] } },
        })
      if (url.endsWith('/my-institution/')) return json(200, robles)
    })
    renderAt('/mi-institucion')

    await userEvent.click(await screen.findByRole('button', { name: 'Guardar cambios' }))

    expect(await screen.findByText('Correo inválido.')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo')).toHaveAttribute('aria-invalid', 'true')
  })
})

describe('HU07 Estudiantes', () => {
  const studentsApi = (extra: Handler = () => undefined) =>
    api(admin, (url, init) => {
      const result = extra(url, init)
      if (result) return result
      if (url.endsWith('/my-institution/')) return json(200, robles)
      if (url.includes('/students/')) return json(200, [ana])
    })

  it('HU07-E1: registra un estudiante y confirma; el foco pasa al formulario al abrirlo (A11Y-02)', async () => {
    const calls = studentsApi((_url, init) => {
      if (init?.method === 'POST') return json(201, { ...ana, id: 8, identification: '2-2222-2222', first_name: 'Bruno' })
      return undefined
    })
    renderAt('/estudiantes')

    const register = await screen.findByRole('button', { name: 'Registrar estudiante' })
    await vi.waitFor(() => expect(register).toBeEnabled())
    await userEvent.click(register)
    expect(screen.getByRole('heading', { name: 'Nuevo estudiante' })).toHaveFocus()
    await userEvent.type(screen.getByLabelText('Identificación'), '2-2222-2222')
    await userEvent.type(screen.getByLabelText('Fecha de nacimiento'), '2016-05-01')
    await userEvent.type(screen.getByLabelText('Nombre'), 'Bruno')
    await userEvent.type(screen.getByLabelText('Apellidos'), 'Mora')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Bruno Mora fue registrado.')
    expect(calls.find((call) => call.method === 'POST')?.body).toMatchObject({ identification: '2-2222-2222', level: 'primaria' })
  })

  it('HU07-E4: muestra el error de identificación duplicada', async () => {
    studentsApi((_url, init) =>
      init?.method === 'POST'
        ? json(409, { error: { code: 'conflict', message: 'Ya existe un estudiante con esa identificación.' } })
        : undefined,
    )
    renderAt('/estudiantes')

    const register = await screen.findByRole('button', { name: 'Registrar estudiante' })
    await vi.waitFor(() => expect(register).toBeEnabled())
    await userEvent.click(register)
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Ya existe un estudiante con esa identificación.')
  })

  it('HU07-E2: desactiva un estudiante y confirma', async () => {
    const calls = studentsApi((_url, init) => (init?.method === 'PATCH' ? json(200, { ...ana, is_active: false }) : undefined))
    renderAt('/estudiantes')

    await userEvent.click(await screen.findByRole('button', { name: 'Desactivar' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Ana Mora fue desactivado.')
    expect(calls.find((call) => call.method === 'PATCH')?.body).toEqual({ is_active: false })
  })

  it('HU07-E3: la búsqueda consulta la API con el texto escrito', async () => {
    const calls = studentsApi()
    renderAt('/estudiantes')

    await userEvent.type(await screen.findByLabelText('Buscar'), 'Mora')

    await vi.waitFor(() => expect(calls.some((call) => call.url.includes('search=Mora'))).toBe(true))
  })

  it('A11Y-01: cada pantalla tiene su título de pestaña', async () => {
    studentsApi()
    renderAt('/estudiantes')

    await screen.findByRole('heading', { name: 'Estudiantes' })
    expect(document.title).toBe('Estudiantes · Nexora')
  })
})
