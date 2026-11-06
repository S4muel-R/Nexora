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

const NO_SESSION = { error: { code: 'not_authenticated', message: 'Debe iniciar sesión.' } }

function loginAs(user: User) {
  vi.stubGlobal('fetch', async (url: string) => {
    if (url.endsWith('/auth/me/')) return json(200, user)
    if (url.includes('/students/')) return json(200, [])
    if (url.endsWith('/my-institution/'))
      return json(200, { id: 1, name: 'Escuela Los Robles', levels: ['primaria'], address: '', phone: '', email: '' })
    return json(200, [])
  })
}

beforeEach(() => {
  localStorage.clear()
  // Sin sesión por defecto: la cookie HttpOnly solo la conoce la API.
  vi.stubGlobal('fetch', async (url: string) => (url.endsWith('/auth/me/') ? json(401, NO_SESSION) : json(200, {})))
})
afterEach(() => vi.unstubAllGlobals())

describe('HU01 Iniciar sesión', () => {
  it('HU01-E5: marca los campos obligatorios sin llamar a la API', async () => {
    const fetchSpy = vi.fn(async (url: string) => (url.endsWith('/auth/me/') ? json(401, NO_SESSION) : json(200, {})))
    vi.stubGlobal('fetch', fetchSpy)
    renderAt('/ingresar')

    await userEvent.click(await screen.findByRole('button', { name: 'Ingresar' }))

    expect(screen.getByText('Ingrese su correo.')).toBeInTheDocument()
    expect(screen.getByText('Ingrese su contraseña.')).toBeInTheDocument()
    expect(fetchSpy.mock.calls.some(([url]) => String(url).endsWith('/auth/login/'))).toBe(false)
  })

  it('HU01-E3: muestra el mensaje de credenciales inválidas', async () => {
    vi.stubGlobal('fetch', async (url: string) =>
      url.endsWith('/auth/me/')
        ? json(401, NO_SESSION)
        : json(400, { error: { code: 'invalid_credentials', message: 'Correo o contraseña incorrectos.' } }),
    )
    renderAt('/ingresar')

    await userEvent.type(await screen.findByLabelText('Correo'), 'admin@robles.test')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'incorrecta')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.')
  })

  it('HU01-E1: al ingresar muestra el inicio con la institución', async () => {
    vi.stubGlobal('fetch', async (url: string) =>
      url.endsWith('/auth/me/') ? json(401, NO_SESSION) : json(200, { user: users.admin }),
    )
    renderAt('/ingresar')

    await userEvent.type(await screen.findByLabelText('Correo'), 'admin@robles.test')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Nexora-Demo-2026')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByRole('heading', { name: 'Hola, Laura' })).toBeInTheDocument()
    // INC-006: la credencial queda en la cookie HttpOnly; nada se guarda en el almacenamiento del navegador.
    expect(localStorage.length).toBe(0)
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
  it('INC-004: el registro se habilita al cargar los niveles y el único nivel queda preseleccionado', async () => {
    let releaseInstitution: () => void = () => {}
    const institutionLoaded = new Promise<void>((resolve) => (releaseInstitution = resolve))
    vi.stubGlobal('fetch', async (url: string) => {
      if (url.endsWith('/auth/me/')) return json(200, users.admin)
      if (url.endsWith('/my-institution/')) {
        await institutionLoaded
        return json(200, { id: 1, name: 'Escuela Los Robles', levels: ['primaria'], address: '', phone: '', email: '' })
      }
      return json(200, [])
    })
    renderAt('/estudiantes')

    const register = await screen.findByRole('button', { name: 'Registrar estudiante' })
    expect(register).toBeDisabled()
    releaseInstitution()
    await vi.waitFor(() => expect(register).toBeEnabled())
    await userEvent.click(register)

    expect(screen.getByLabelText('Nivel')).toHaveValue('primaria')
  })
})

describe('HU02 Cerrar sesión en un equipo compartido', () => {
  it('INC-009: la sesión se cierra en la interfaz aunque el servidor no responda, y queda el cierre pendiente', async () => {
    vi.stubGlobal('fetch', (url: string) => {
      if (url.endsWith('/auth/me/')) return Promise.resolve(json(200, users.admin))
      if (url.endsWith('/auth/logout/')) return new Promise<Response>(() => {})
      return Promise.resolve(json(200, []))
    })
    renderAt('/')

    await userEvent.click(await screen.findByRole('button', { name: 'Cerrar sesión' }))

    expect(await screen.findByRole('button', { name: 'Ingresar' })).toBeInTheDocument()
    expect(localStorage.getItem('nexora.cierre-pendiente')).toBe('1')
  })

  it('INC-009: con un cierre pendiente, al abrir la aplicación se cierra la sesión antes de restaurarla', async () => {
    localStorage.setItem('nexora.cierre-pendiente', '1')
    const calls: string[] = []
    vi.stubGlobal('fetch', async (url: string) => {
      calls.push(url)
      if (url.endsWith('/auth/me/')) return json(200, users.admin)
      return new Response(null, { status: 204 })
    })
    renderAt('/')

    expect(await screen.findByRole('button', { name: 'Ingresar' })).toBeInTheDocument()
    expect(calls.some((url) => url.endsWith('/auth/logout/'))).toBe(true)
    expect(calls.some((url) => url.endsWith('/auth/me/'))).toBe(false)
    expect(localStorage.getItem('nexora.cierre-pendiente')).toBeNull()
  })
})
