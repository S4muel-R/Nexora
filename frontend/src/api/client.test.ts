import { describe, expect, it } from 'vitest'
import { ApiError, apiGet, parseError } from './client'

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
