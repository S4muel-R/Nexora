import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { apiGet, apiPost, onUnauthorized, tokenStore } from '../api/client'
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

  const clearSession = useCallback(() => {
    tokenStore.set(null)
    setUser(null)
  }, [])

  useEffect(() => {
    onUnauthorized(clearSession)
    if (tokenStore.get()) {
      apiGet<User>('/auth/me/')
        .then(setUser)
        .catch(clearSession)
        .finally(() => setLoading(false))
    }
    return () => onUnauthorized(null)
  }, [clearSession])

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiPost<{ token: string; user: User }>('/auth/login/', { email, password })
    tokenStore.set(result.token)
    setUser(result.user)
    return result.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiPost('/auth/logout/')
    } finally {
      clearSession()
    }
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
