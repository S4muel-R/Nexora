import type { Role } from '../api/types'

export interface NavItem {
  to: string
  label: string
  roles: Role[]
}

/** Opciones del menú por rol (HU03). Las rutas protegidas usan la misma lista. */
export const NAV_ITEMS: NavItem[] = [
  { to: '/instituciones', label: 'Instituciones', roles: ['platform_admin'] },
  { to: '/mi-institucion', label: 'Mi institución', roles: ['institution_admin', 'teacher'] },
  { to: '/estudiantes', label: 'Estudiantes', roles: ['institution_admin', 'teacher'] },
]

export const navFor = (role: Role) => NAV_ITEMS.filter((item) => item.roles.includes(role))

export const ROLE_LABELS: Record<Role, string> = {
  platform_admin: 'Administración de la plataforma',
  institution_admin: 'Personal administrativo',
  teacher: 'Personal docente',
}
