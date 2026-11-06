/** Cliente HTTP de la API de Nexora. Convierte el formato estándar de error (Estándares, sección 3). */

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

export interface ApiErrorBody {
  code: string
  message: string
  fields?: Record<string, unknown>
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly fields: Record<string, unknown>

  constructor(status: number, body: ApiErrorBody) {
    super(body.message)
    this.status = status
    this.code = body.code
    this.fields = body.fields ?? {}
  }

  /** Primer mensaje de error de un campo, también para campos anidados como `admin.email`. */
  fieldError(path: string): string | undefined {
    let value: unknown = this.fields
    for (const key of path.split('.')) {
      if (value === null || typeof value !== 'object') return undefined
      value = (value as Record<string, unknown>)[key]
    }
    return Array.isArray(value) && typeof value[0] === 'string' ? value[0] : undefined
  }
}

const NETWORK_ERROR: ApiErrorBody = {
  code: 'network_error',
  message: 'No se pudo conectar con el servidor. Revise su conexión e intente de nuevo.',
}

const TOKEN_KEY = 'nexora.token'
let unauthorizedHandler: (() => void) | null = null

export const tokenStore = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set: (token: string | null) => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token)
      else localStorage.removeItem(TOKEN_KEY)
    } catch {
      // Sin almacenamiento disponible la sesión dura solo mientras la pestaña esté abierta.
    }
  },
}

/**
 * INC-009: avisa al servidor el cierre de sesión con el token indicado. `keepalive` permite que la petición termine
 * aunque la página se cierre o se recargue; la sesión local ya se borró antes de llamarla.
 */
export async function apiLogout(token: string, fetchImpl: typeof fetch = fetch): Promise<void> {
  try {
    await fetchImpl(`${API_URL}/auth/logout/`, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: `Token ${token}` },
      keepalive: true,
    })
  } catch {
    // Sin conexión el token queda en el servidor, pero ya no está en este navegador.
  }
}

/** Se ejecuta cuando la API responde 401: la sesión ya no es válida (HU02-E3). */
export function onUnauthorized(handler: (() => void) | null) {
  unauthorizedHandler = handler
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

type Method = 'GET' | 'POST' | 'PATCH'

export async function apiRequest<T>(
  method: Method,
  path: string,
  body?: unknown,
  fetchImpl: typeof fetch = fetch,
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  const token = tokenStore.get()
  if (token) headers.Authorization = `Token ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let response: Response
  try {
    response = await fetchImpl(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, NETWORK_ERROR)
  }

  if (!response.ok) {
    const error = await parseError(response)
    // INC-007: solo se cierra la sesión si el 401 corresponde al token vigente, no a uno anterior ya reemplazado.
    if (response.status === 401 && token && tokenStore.get() === token) unauthorizedHandler?.()
    throw error
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const apiGet = <T>(path: string, fetchImpl?: typeof fetch) =>
  apiRequest<T>('GET', path, undefined, fetchImpl)
export const apiPost = <T>(path: string, body?: unknown) => apiRequest<T>('POST', path, body)
export const apiPatch = <T>(path: string, body: unknown) => apiRequest<T>('PATCH', path, body)

export function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Ocurrió un error inesperado. Intente de nuevo.'
}
