export type Role = 'platform_admin' | 'institution_admin' | 'teacher'

export type Level = 'preescolar' | 'primaria' | 'secundaria'

export const LEVELS: { value: Level; label: string }[] = [
  { value: 'preescolar', label: 'Preescolar' },
  { value: 'primaria', label: 'Primaria' },
  { value: 'secundaria', label: 'Secundaria' },
]

export const levelLabel = (level: string) => LEVELS.find((l) => l.value === level)?.label ?? level

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: Role
  institution: { id: number; name: string } | null
}

export interface Institution {
  id: number
  name: string
  levels: Level[]
  address: string
  phone: string
  email: string
  is_active: boolean
}

export interface Student {
  id: number
  identification: string
  first_name: string
  last_name: string
  birth_date: string
  level: Level
  is_active: boolean
}
