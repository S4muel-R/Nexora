import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import type { Role } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import { NAV_ITEMS, ROLE_LABELS, navFor } from '../auth/navigation'

/** Marco de las pantallas con sesión: encabezado, menú por rol (HU03) y cierre de sesión (HU02). */
export function Layout() {
  const { user, loading, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (loading) return <p className="page-status">Cargando…</p>
  if (!user) return <Navigate to="/ingresar" replace state={{ from: location.pathname }} />

  const handleLogout = async () => {
    await logout()
    navigate('/ingresar', { replace: true })
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <strong>Nexora</strong>
          <span className="brand__context">{user.institution?.name ?? ROLE_LABELS[user.role]}</span>
        </div>
        <nav aria-label="Menú principal" className="menu">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          {navFor(user.role).map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="session">
          <span className="session__user">
            {user.first_name} · {ROLE_LABELS[user.role]}
          </span>
          <button type="button" className="button button--ghost" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

/** Restringe una ruta a los roles que la tienen en el menú (HU03-E3). */
export function RequireRole({ path, children }: { path: string; children: React.ReactNode }) {
  const { user } = useAuth()
  const roles: Role[] = NAV_ITEMS.find((item) => item.to === path)?.roles ?? []
  if (!user || !roles.includes(user.role)) {
    return (
      <section className="card" role="alert">
        <h1>Acceso restringido</h1>
        <p>No tiene permiso para realizar esta acción.</p>
      </section>
    )
  }
  return <>{children}</>
}
