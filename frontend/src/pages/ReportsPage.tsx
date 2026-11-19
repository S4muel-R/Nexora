import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, apiGet, toApiError } from '../api/client'
import { levelLabel, today } from '../api/types'
import type { AttendanceReport, Group, GroupReportRow, Institution, Level, StudentReportRow } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import { Alert, Field } from '../components/Field'
import { usePageTitle } from '../components/usePageTitle'

const NO_RESULTS = 'No hay registros para los filtros seleccionados.'

const percent = (value: number | null) => (value === null ? '—' : `${value.toLocaleString('es-CR')} %`)

/** HU11 (listados, solo personal administrativo) y HU12 (resumen de asistencia; el docente ve solo sus grupos). */
export function ReportsPage() {
  const { user } = useAuth()
  usePageTitle('Reportes')
  const isAdmin = user?.role === 'institution_admin'
  const [groups, setGroups] = useState<Group[]>([])
  const [levels, setLevels] = useState<Level[]>([])

  useEffect(() => {
    let active = true
    apiGet<Group[]>('/groups/').then((data) => active && setGroups(data))
    if (isAdmin) apiGet<Institution>('/my-institution/').then((i) => active && setLevels(i.levels))
    return () => {
      active = false
    }
  }, [isAdmin])

  return (
    <section>
      <h1>Reportes</h1>
      {isAdmin && <Listings groups={groups} levels={levels} />}
      <AttendanceSummary groups={groups} />
    </section>
  )
}

function Listings({ groups, levels }: { groups: Group[]; levels: Level[] }) {
  const [view, setView] = useState<'groups' | 'students'>('groups')
  const [level, setLevel] = useState('')
  const [group, setGroup] = useState('')
  const [groupRows, setGroupRows] = useState<GroupReportRow[] | null>(null)
  const [studentRows, setStudentRows] = useState<StudentReportRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const params = new URLSearchParams()
    if (level) params.set('level', level)
    if (view === 'students' && group) params.set('group', group)
    const query = params.toString() ? `?${params}` : ''
    setError(null)
    const request =
      view === 'groups'
        ? apiGet<GroupReportRow[]>(`/reports/groups/${query}`).then((rows) => active && setGroupRows(rows))
        : apiGet<StudentReportRow[]>(`/reports/students/${query}`).then((rows) => active && setStudentRows(rows))
    request.catch((err) => active && setError(toApiError(err).message))
    return () => {
      active = false
    }
  }, [view, level, group])

  const rows = view === 'groups' ? groupRows : studentRows

  return (
    <article className="card" aria-labelledby="listings-title">
      <h2 id="listings-title">Listados</h2>
      <div className="filters">
        <div className="field">
          <label htmlFor="report-view">Listado</label>
          <select id="report-view" value={view} onChange={(e) => setView(e.target.value as 'groups' | 'students')}>
            <option value="groups">Grupos</option>
            <option value="students">Estudiantes</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="report-level">Nivel</label>
          <select id="report-level" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">Todos</option>
            {levels.map((l) => (
              <option key={l} value={l}>
                {levelLabel(l)}
              </option>
            ))}
          </select>
        </div>
        {view === 'students' && (
          <div className="field">
            <label htmlFor="report-group">Grupo</label>
            <select id="report-group" value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="">Todos</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.code} ({g.period_name})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {error && <Alert kind="error">{error}</Alert>}
      {rows && rows.length === 0 && !error && <p className="empty">{NO_RESULTS}</p>}
      {view === 'groups' && groupRows && groupRows.length > 0 && (
        <table className="table" aria-label="Listado de grupos">
          <thead>
            <tr>
              <th>Grupo</th>
              <th>Nivel</th>
              <th>Periodo</th>
              <th>Docentes</th>
              <th>Estudiantes</th>
            </tr>
          </thead>
          <tbody>
            {groupRows.map((row) => (
              <tr key={row.id}>
                <td data-label="Grupo">{row.code}</td>
                <td data-label="Nivel">{levelLabel(row.level)}</td>
                <td data-label="Periodo">{row.period}</td>
                <td data-label="Docentes">{row.teachers.join(', ') || 'Sin docente'}</td>
                <td data-label="Estudiantes">{row.student_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {view === 'students' && studentRows && studentRows.length > 0 && (
        <table className="table" aria-label="Listado de estudiantes">
          <thead>
            <tr>
              <th>Identificación</th>
              <th>Nombre</th>
              <th>Nivel</th>
              <th>Grupo</th>
            </tr>
          </thead>
          <tbody>
            {studentRows.map((row) => (
              <tr key={row.id}>
                <td data-label="Identificación">{row.identification}</td>
                <td data-label="Nombre">{row.name}</td>
                <td data-label="Nivel">{levelLabel(row.level)}</td>
                <td data-label="Grupo">{row.group ?? 'Sin grupo'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </article>
  )
}

function AttendanceSummary({ groups }: { groups: Group[] }) {
  const [group, setGroup] = useState('')
  const [start, setStart] = useState(() => today().slice(0, 8) + '01')
  const [end, setEnd] = useState(today())
  const [report, setReport] = useState<AttendanceReport | null>(null)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    if (!group && groups.length === 1) setGroup(String(groups[0].id))
  }, [group, groups])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setReport(null)
    if (!group) {
      setError(new ApiError(400, { code: 'validation_error', message: 'Seleccione un grupo.' }))
      return
    }
    try {
      setReport(await apiGet<AttendanceReport>(`/reports/attendance/?group=${group}&start=${start}&end=${end}`))
    } catch (err) {
      setError(toApiError(err))
    }
  }

  return (
    <article className="card" aria-labelledby="summary-title">
      <h2 id="summary-title">Resumen de asistencia</h2>
      <form className="filters" onSubmit={handleSubmit} noValidate aria-label="Filtros del resumen de asistencia">
        <div className="field">
          <label htmlFor="summary-group">Grupo</label>
          <select id="summary-group" value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="">Seleccione…</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.code} ({g.period_name})
              </option>
            ))}
          </select>
        </div>
        <Field label="Desde" name="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        <Field
          label="Hasta"
          name="end"
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          error={error?.fieldError('end')}
        />
        <button type="submit" className="button">
          Consultar
        </button>
      </form>
      {error && <Alert kind="error">{error.fieldError('end') ?? error.message}</Alert>}
      {report && report.dates.length === 0 && <p className="empty">{NO_RESULTS}</p>}
      {report && report.dates.length > 0 && (
        <>
          <p>
            {report.group_code}: {report.dates.length} {report.dates.length === 1 ? 'fecha' : 'fechas'} con asistencia del{' '}
            {report.start} al {report.end}. Asistencia del grupo: <strong>{percent(report.totals.percentage)}</strong> (
            {report.totals.present} presentes, {report.totals.absent} ausentes).
          </p>
          <table className="table" aria-label={`Resumen de asistencia de ${report.group_code}`}>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Presentes</th>
                <th>Ausentes</th>
                <th>Sin registro</th>
                <th>Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {report.students.map((row) => (
                <tr key={row.student}>
                  <td data-label="Estudiante">{row.name}</td>
                  <td data-label="Presentes">{row.present}</td>
                  <td data-label="Ausentes">{row.absent}</td>
                  <td data-label="Sin registro">{row.unrecorded}</td>
                  <td data-label="Asistencia">{percent(row.percentage)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </article>
  )
}
