import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiGet, apiPost, newSessionEpoch, onUnauthorized, parseError } from './client'

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

describe('parseError', () => {
  it('usa el mensaje y los campos del formato estándar', async () => {
    const error = await parseError(
      jsonResponse(400, {
        error: { code: 'validation_error', message: 'Datos inválidos', fields: { email: ['Requerido'] } },
      }),
    )

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(400)
    expect(error.message).toBe('Datos inválidos')
    expect(error.fields.email).toEqual(['Requerido'])
  })

  it('usa un mensaje genérico si la respuesta no es JSON', async () => {
    const error = await parseError(new Response('<html>502</html>', { status: 502 }))

    expect(error.code).toBe('unexpected_response')
  })
})

describe('apiGet', () => {
  it('devuelve los datos cuando la respuesta es correcta', async () => {
    const fetchOk = async () => jsonResponse(200, { status: 'ok' })

    await expect(apiGet('/health/', fetchOk)).resolves.toEqual({ status: 'ok' })
  })

  it('convierte una falla de red en ApiError legible', async () => {
    const fetchFails = async () => {
      throw new TypeError('Failed to fetch')
    }

    await expect(apiGet('/health/', fetchFails)).rejects.toMatchObject({ code: 'network_error', status: 0 })
  })
})

describe('sesión vencida (HU02-E3, INC-007)', () => {
  afterEach(() => onUnauthorized(null))

  const unauthorized = () =>
    jsonResponse(401, { error: { code: 'not_authenticated', message: 'Debe iniciar sesión.' } })

  it('un 401 de la sesión vigente cierra la sesión', async () => {
    const handler = vi.fn()
    onUnauthorized(handler)

    await expect(apiGet('/auth/me/', async () => unauthorized())).rejects.toMatchObject({ status: 401 })
    expect(handler).toHaveBeenCalledOnce()
  })

  it('INC-007: un 401 tardío de una sesión ya reemplazada no cierra la sesión nueva', async () => {
    const handler = vi.fn()
    onUnauthorized(handler)
    const lateUnauthorized = async () => {
      newSessionEpoch() // se inició otra sesión mientras la respuesta estaba en camino
      return unauthorized()
    }

    await expect(apiGet('/auth/me/', lateUnauthorized)).rejects.toMatchObject({ status: 401 })
    expect(handler).not.toHaveBeenCalled()
  })
})

describe('sesión en cookie con CSRF (INC-006)', () => {
  afterEach(() => {
    document.cookie = 'csrftoken=; max-age=0; path=/'
    vi.unstubAllGlobals()
  })

  it('las peticiones envían la cookie y las escrituras el token CSRF', async () => {
    document.cookie = 'csrftoken=abc123; path=/'
    const fetchSpy = vi.fn(async () => jsonResponse(200, {}))
    vi.stubGlobal('fetch', fetchSpy)

    await apiPost('/students/', { first_name: 'Ana' })

    const [, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit]
    expect(init.credentials).toBe('include')
    expect((init.headers as Record<string, string>)['X-CSRFToken']).toBe('abc123')
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined()
  })

  it('si no hay cookie CSRF la pide a la API antes de escribir', async () => {
    const urls: string[] = []
    vi.stubGlobal('fetch', async (url: string) => {
      urls.push(url)
      if (url.endsWith('/auth/csrf/')) document.cookie = 'csrftoken=nuevo; path=/'
      return jsonResponse(200, {})
    })

    await apiPost('/students/', {})

    expect(urls[0]).toMatch(/\/auth\/csrf\/$/)
    expect(urls[1]).toMatch(/\/students\/$/)
  })
})
