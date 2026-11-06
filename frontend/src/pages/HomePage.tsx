import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ROLE_LABELS, navFor } from '../auth/navigation'
import { usePageTitle } from '../components/usePageTitle'

export function HomePage() {
  const { user } = useAuth()
  usePageTitle('Inicio')
  if (!user) return null
  return (
    <section>
      <h1>Hola, {user.first_name}</h1>
      <p className="muted">
        {ROLE_LABELS[user.role]}
        {user.institution ? ` · ${user.institution.name}` : ''}
      </p>
      <div className="shortcuts">
        {navFor(user.role).map((item) => (
          <Link key={item.to} to={item.to} className="card shortcut">
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
