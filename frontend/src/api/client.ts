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

let unauthorizedHandler: (() => void) | null = null

/**
 * La sesión vive en una cookie HttpOnly que JavaScript no puede leer (avance 1, §7.1; INC-006). La interfaz solo lleva
 * una "época" que cambia en cada inicio o cierre de sesión: una respuesta 401 de una época anterior no cierra la sesión
 * actual (INC-007).
 */
let sessionEpoch = 0
export const newSessionEpoch = () => ++sessionEpoch
export const currentSessionEpoch = () => sessionEpoch

const LOGOUT_PENDING_KEY = 'nexora.cierre-pendiente'

/** INC-009: marca que hay un cierre de sesión por confirmar en el servidor, aunque la página se cierre o recargue. */
export const logoutPending = {
  get: (): boolean => {
    try {
      return localStorage.getItem(LOGOUT_PENDING_KEY) === '1'
    } catch {
      return false
    }
  },
  set: (pending: boolean) => {
    try {
      if (pending) localStorage.setItem(LOGOUT_PENDING_KEY, '1')
      else localStorage.removeItem(LOGOUT_PENDING_KEY)
    } catch {
      // Sin almacenamiento, el cierre depende de que la petición termine.
    }
  },
}

function readCookie(name: string): string | null {
  const match = document.cookie.split('; ').find((item) => item.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null
}

/** Devuelve el token CSRF de la cookie `csrftoken`; si aún no existe, lo pide a la API. */
export async function csrfToken(fetchImpl: typeof fetch = fetch): Promise<string | null> {
  let token = readCookie('csrftoken')
  if (!token) {
    try {
      await fetchImpl(`${API_URL}/auth/csrf/`, { credentials: 'include' })
    } catch {
      return null
    }
    token = readCookie('csrftoken')
  }
  return token
}

/**
 * INC-009: cierra la sesión en el servidor. `keepalive` permite que la petición termine aunque la página se cierre;
 * si aun así no se confirma, la marca de cierre pendiente hace que se repita al volver a abrir la aplicación.
 */
export async function apiLogout(fetchImpl: typeof fetch = fetch): Promise<void> {
  try {
    const token = await csrfToken(fetchImpl)
    const response = await fetchImpl(`${API_URL}/auth/logout/`, {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json', ...(token ? { 'X-CSRFToken': token } : {}) },
      keepalive: true,
    })
    if (response.ok || response.status === 401) logoutPending.set(false)
  } catch {
    // Sin conexión queda la marca de cierre pendiente y se reintenta al abrir la aplicación.
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
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const epoch = sessionEpoch

  let response: Response
  try {
    if (method !== 'GET') {
      const token = await csrfToken(fetchImpl)
      if (token) headers['X-CSRFToken'] = token
    }
    response = await fetchImpl(`${API_URL}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, NETWORK_ERROR)
  }

  if (!response.ok) {
    const error = await parseError(response)
    // INC-007: solo se cierra la sesión si el 401 corresponde a la sesión vigente, no a una anterior ya reemplazada.
    if (response.status === 401 && epoch === sessionEpoch) unauthorizedHandler?.()
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
