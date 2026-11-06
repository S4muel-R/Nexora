import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  apiGet,
  apiLogout,
  apiPost,
  currentSessionEpoch,
  logoutPending,
  newSessionEpoch,
  onUnauthorized,
} from '../api/client'
import type { User } from '../api/types'

interface AuthState {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // La cookie de sesión es HttpOnly: solo la API sabe si hay sesión, así que siempre se consulta al abrir.
  const [loading, setLoading] = useState(true)

  const clearSession = useCallback(() => {
    newSessionEpoch()
    setUser(null)
  }, [])

  useEffect(() => {
    onUnauthorized(clearSession)
    let active = true
    // INC-007: una respuesta de la validación inicial que llega después de iniciar sesión se descarta.
    const epoch = newSessionEpoch()
    const isCurrent = () => active && epoch === currentSessionEpoch()
    const restore = async () => {
      // INC-009: si quedó un cierre de sesión sin confirmar, se completa antes de restaurar nada.
      if (logoutPending.get()) {
        await apiLogout()
        return
      }
      try {
        const current = await apiGet<User>('/auth/me/')
        if (isCurrent()) setUser(current)
      } catch {
        // Sin sesión válida: se muestra el inicio de sesión.
      }
    }
    restore().finally(() => active && setLoading(false))
    return () => {
      active = false
      onUnauthorized(null)
    }
  }, [clearSession])

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiPost<{ user: User }>('/auth/login/', { email, password })
    newSessionEpoch()
    logoutPending.set(false)
    setUser(result.user)
    return result.user
  }, [])

  // INC-009: la interfaz se cierra al instante y la marca de cierre pendiente asegura que el servidor cierre la sesión
  // aunque la página se recargue o se cierre antes de su respuesta.
  const logout = useCallback(async () => {
    logoutPending.set(true)
    clearSession()
    await apiLogout()
  }, [clearSession])

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
