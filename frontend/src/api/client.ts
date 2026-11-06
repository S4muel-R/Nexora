/** Cliente HTTP de la API de Nexora. Convierte el formato estándar de error (Estándares, sección 3). */

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

export interface ApiErrorBody {
  code: string
  message: string
  fields?: Record<string, string[]>
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly fields: Record<string, string[]>

  constructor(status: number, body: ApiErrorBody) {
    super(body.message)
    this.status = status
    this.code = body.code
    this.fields = body.fields ?? {}
  }
}

const NETWORK_ERROR: ApiErrorBody = {
  code: 'network_error',
  message: 'No se pudo conectar con el servidor. Revise su conexión e intente de nuevo.',
}

export async function parseError(response: Response): Promise<ApiError> {
  try {
    const data = await response.json()
    if (data?.error?.message) return new ApiError(response.status, data.error)
  } catch {
    // La respuesta no es JSON: se usa el mensaje genérico.
  }
  return new ApiError(response.status, {
    code: 'unexpected_response',
    message: 'Ocurrió un error inesperado. Intente de nuevo.',
  })
}

export async function apiGet<T>(path: string, fetchImpl: typeof fetch = fetch): Promise<T> {
  let response: Response
  try {
    response = await fetchImpl(`${API_URL}${path}`, { headers: { Accept: 'application/json' } })
  } catch {
    throw new ApiError(0, NETWORK_ERROR)
  }
  if (!response.ok) throw await parseError(response)
  return (await response.json()) as T
}
