import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppRoutes } from './App'
import type { User } from './api/types'
import { AuthProvider } from './auth/AuthContext'

const users: Record<string, User> = {
  admin: {
    id: 1,
    email: 'admin@robles.test',
    first_name: 'Laura',
    last_name: 'Solís',
    role: 'institution_admin',
    institution: { id: 1, name: 'Escuela Los Robles' },
  },
  teacher: {
    id: 2,
    email: 'docente@robles.test',
    first_name: 'Andrés',
    last_name: 'Castro',
    role: 'teacher',
    institution: { id: 1, name: 'Escuela Los Robles' },
  },
  platform: {
    id: 3,
    email: 'plataforma@nexora.test',
    first_name: 'Equipo',
    last_name: 'Nexora',
    role: 'platform_admin',
    institution: null,
  },
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MemoryRouter>,
  )
}

function loginAs(user: User) {
  localStorage.setItem('nexora.token', 'token-de-prueba')
  vi.stubGlobal('fetch', async (url: string) => {
    if (url.endsWith('/auth/me/')) return json(200, user)
    if (url.includes('/students/')) return json(200, [])
    if (url.endsWith('/my-institution/'))
      return json(200, { id: 1, name: 'Escuela Los Robles', levels: ['primaria'], address: '', phone: '', email: '' })
    return json(200, [])
  })
}

beforeEach(() => localStorage.clear())
afterEach(() => vi.unstubAllGlobals())

describe('HU01 Iniciar sesión', () => {
  it('HU01-E5: marca los campos obligatorios sin llamar a la API', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    renderAt('/ingresar')

    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(screen.getByText('Ingrese su correo.')).toBeInTheDocument()
    expect(screen.getByText('Ingrese su contraseña.')).toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('HU01-E3: muestra el mensaje de credenciales inválidas', async () => {
    vi.stubGlobal('fetch', async () =>
      json(400, { error: { code: 'invalid_credentials', message: 'Correo o contraseña incorrectos.' } }),
    )
    renderAt('/ingresar')

    await userEvent.type(screen.getByLabelText('Correo'), 'admin@robles.test')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'incorrecta')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.')
  })

  it('HU01-E1: al ingresar muestra el inicio con la institución', async () => {
    vi.stubGlobal('fetch', async () => json(200, { token: 'abc', user: users.admin }))
    renderAt('/ingresar')

    await userEvent.type(screen.getByLabelText('Correo'), 'admin@robles.test')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Nexora-Demo-2026')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByRole('heading', { name: 'Hola, Laura' })).toBeInTheDocument()
    expect(localStorage.getItem('nexora.token')).toBe('abc')
  })
})

describe('HU02 Cerrar sesión', () => {
  it('HU02-E2: sin sesión, una dirección interna lleva al inicio de sesión', async () => {
    renderAt('/estudiantes')

    expect(await screen.findByRole('button', { name: 'Ingresar' })).toBeInTheDocument()
  })
})

describe('HU03 Opciones por rol', () => {
  const menuLinks = async () => {
    const nav = await screen.findByRole('navigation', { name: 'Menú principal' })
    return Array.from(nav.querySelectorAll('a')).map((a) => a.textContent)
  }

  it('HU03-E1: el personal administrativo ve Mi institución y Estudiantes', async () => {
    loginAs(users.admin)
    renderAt('/')

    expect(await menuLinks()).toEqual(['Inicio', 'Mi institución', 'Estudiantes'])
  })

  it('HU03-E2: la administración de la plataforma ve solo Instituciones', async () => {
    loginAs(users.platform)
    renderAt('/')

    expect(await menuLinks()).toEqual(['Inicio', 'Instituciones'])
  })

  it('HU03-E3: el docente que abre una pantalla de administración ve acceso restringido', async () => {
    loginAs(users.teacher)
    renderAt('/instituciones')

    expect(await screen.findByText('No tiene permiso para realizar esta acción.')).toBeInTheDocument()
  })

  it('HU07: el docente consulta estudiantes sin botón de registro', async () => {
    loginAs(users.teacher)
    renderAt('/estudiantes')

    expect(await screen.findByRole('heading', { name: 'Estudiantes' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Registrar estudiante' })).not.toBeInTheDocument()
  })
})

describe('HU07 Registrar estudiante', () => {
  it('INC-004: el único nivel se preselecciona aunque los niveles lleguen después de abrir el formulario', async () => {
    let releaseInstitution: () => void = () => {}
    const institutionLoaded = new Promise<void>((resolve) => (releaseInstitution = resolve))
    localStorage.setItem('nexora.token', 'token-de-prueba')
    vi.stubGlobal('fetch', async (url: string) => {
      if (url.endsWith('/auth/me/')) return json(200, users.admin)
      if (url.endsWith('/my-institution/')) {
        await institutionLoaded
        return json(200, { id: 1, name: 'Escuela Los Robles', levels: ['primaria'], address: '', phone: '', email: '' })
      }
      return json(200, [])
    })
    renderAt('/estudiantes')

    await userEvent.click(await screen.findByRole('button', { name: 'Registrar estudiante' }))
    releaseInstitution()

    const level = screen.getByLabelText('Nivel')
    expect(await screen.findByRole('option', { name: 'Primaria' })).toBeInTheDocument()
    await vi.waitFor(() => expect(level).toHaveValue('primaria'))
  })
})
