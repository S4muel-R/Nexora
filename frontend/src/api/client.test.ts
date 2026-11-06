import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiGet, onUnauthorized, parseError, tokenStore } from './client'

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
  afterEach(() => {
    onUnauthorized(null)
    tokenStore.set(null)
  })

  it('un 401 del token vigente cierra la sesión', async () => {
    const handler = vi.fn()
    onUnauthorized(handler)
    tokenStore.set('token-vigente')
    const unauthorized = async () => jsonResponse(401, { error: { code: 'not_authenticated', message: 'Debe iniciar sesión.' } })

    await expect(apiGet('/auth/me/', unauthorized)).rejects.toMatchObject({ status: 401 })
    expect(handler).toHaveBeenCalledOnce()
  })

  it('INC-007: un 401 tardío de un token ya reemplazado no cierra la sesión nueva', async () => {
    const handler = vi.fn()
    onUnauthorized(handler)
    tokenStore.set('token-anterior')
    const lateUnauthorized = async () => {
      tokenStore.set('token-nuevo')
      return jsonResponse(401, { error: { code: 'not_authenticated', message: 'Debe iniciar sesión.' } })
    }

    await expect(apiGet('/auth/me/', lateUnauthorized)).rejects.toMatchObject({ status: 401 })
    expect(handler).not.toHaveBeenCalled()
    expect(tokenStore.get()).toBe('token-nuevo')
  })
})
