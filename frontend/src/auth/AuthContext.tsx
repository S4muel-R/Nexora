import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { apiGet, apiLogout, apiPost, onUnauthorized, tokenStore } from '../api/client'
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
  const [loading, setLoading] = useState(() => tokenStore.get() !== null)
  // INC-007: cada inicio de sesión invalida la validación pendiente de la sesión anterior.
  const sessionVersion = useRef(0)

  const clearSession = useCallback(() => {
    tokenStore.set(null)
    setUser(null)
  }, [])

  useEffect(() => {
    onUnauthorized(clearSession)
    if (tokenStore.get()) {
      const version = sessionVersion.current
      const isCurrent = () => sessionVersion.current === version
      apiGet<User>('/auth/me/')
        .then((current) => isCurrent() && setUser(current))
        .catch(() => isCurrent() && clearSession())
        .finally(() => setLoading(false))
    }
    return () => onUnauthorized(null)
  }, [clearSession])

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiPost<{ token: string; user: User }>('/auth/login/', { email, password })
    sessionVersion.current += 1
    tokenStore.set(result.token)
    setUser(result.user)
    return result.user
  }, [])

  // INC-009: la sesión local se borra antes de avisar al servidor; si la página se cierra o recarga mientras la
  // petición está en curso, el token ya no queda guardado en el navegador.
  const logout = useCallback(async () => {
    const token = tokenStore.get()
    sessionVersion.current += 1
    clearSession()
    if (token) await apiLogout(token)
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
