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

/** HU05-E5: periodo lectivo; solo uno es el vigente. */
export interface AcademicPeriod {
  id: number
  name: string
  start_date: string
  end_date: string
  is_current: boolean
}

/** HU08: docente con su cuenta de rol docente. */
export interface Teacher {
  id: number
  first_name: string
  last_name: string
  email: string
  is_active: boolean
}

export interface PersonSummary {
  id: number
  name: string
}

/** HU09: grupo de un nivel en un periodo. */
export interface Group {
  id: number
  code: string
  level: Level
  period: number
  period_name: string
  teachers: PersonSummary[]
  students: Pick<Student, 'id' | 'identification' | 'first_name' | 'last_name' | 'level' | 'is_active'>[]
  student_count: number
}

export type AttendanceStatus = 'presente' | 'ausente'

export interface AttendanceChange {
  previous_status: AttendanceStatus
  new_status: AttendanceStatus
  reason: string
  changed_by: string
  changed_at: string
}

/** HU10: lista de asistencia de un grupo en una fecha. */
export interface AttendanceSheet {
  group: number
  group_code: string
  date: string
  recorded: boolean
  can_edit: boolean
  entries: {
    student: number
    name: string
    identification: string
    record: number | null
    status: AttendanceStatus | null
    changes: AttendanceChange[]
  }[]
}

export interface GroupReportRow {
  id: number
  code: string
  level: Level
  period: string
  teachers: string[]
  student_count: number
}

export interface StudentReportRow {
  id: number
  identification: string
  name: string
  level: Level
  group: string | null
}

/** HU12: resumen de asistencia por estudiante y del grupo. */
export interface AttendanceReport {
  group: number
  group_code: string
  start: string
  end: string
  dates: string[]
  students: {
    student: number
    name: string
    present: number
    absent: number
    unrecorded: number
    percentage: number | null
  }[]
  totals: { present: number; absent: number; percentage: number | null }
}

export const STATUS_LABELS: Record<AttendanceStatus, string> = { presente: 'Presente', ausente: 'Ausente' }

/** Fecha local en formato AAAA-MM-DD (no UTC), para los campos de fecha. */
export const today = () => {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}
