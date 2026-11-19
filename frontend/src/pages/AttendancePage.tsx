import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, apiGet, apiPost, errorMessage, toApiError } from '../api/client'
import { STATUS_LABELS, today } from '../api/types'
import type { AttendanceSheet, AttendanceStatus, Group } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import { Alert, Field } from '../components/Field'
import { usePageTitle } from '../components/usePageTitle'

type Entry = AttendanceSheet['entries'][number]

/**
 * HU10: el personal docente marca la asistencia de su grupo por fecha y la corrige con motivo. Si la fecha ya tiene
 * asistencia, la lista se abre en modo corrección (HU10-E3). El personal administrativo solo consulta.
 */
export function AttendancePage() {
  const { user } = useAuth()
  usePageTitle('Asistencia')
  const [groups, setGroups] = useState<Group[]>([])
  const [groupId, setGroupId] = useState('')
  const [date, setDate] = useState(today())
  const [sheet, setSheet] = useState<AttendanceSheet | null>(null)
  const [marks, setMarks] = useState<Record<number, AttendanceStatus>>({})
  const [error, setError] = useState<ApiError | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [correcting, setCorrecting] = useState<Entry | null>(null)
  // INC-011: solo la respuesta de la última consulta actualiza la lista; una respuesta tardía de otra fecha se descarta.
  const latest = useRef(0)

  useEffect(() => {
    let active = true
    apiGet<Group[]>('/groups/')
      .then((data) => {
        if (!active) return
        setGroups(data)
        if (data.length === 1) setGroupId(String(data[0].id))
      })
      .catch((err) => active && setError(toApiError(err)))
    return () => {
      active = false
    }
  }, [])

  const load = useCallback(() => {
    if (!groupId || !date) {
      latest.current++
      setSheet(null)
      return Promise.resolve()
    }
    const request = ++latest.current
    return apiGet<AttendanceSheet>(`/attendance/?group=${groupId}&date=${date}`)
      .then((data) => {
        if (request !== latest.current) return
        setSheet(data)
        setMarks(Object.fromEntries(data.entries.map((e) => [e.student, e.status ?? 'presente'])))
      })
      .catch((err) => {
        if (request !== latest.current) return
        setSheet(null)
        setError(toApiError(err))
      })
  }, [groupId, date])

  useEffect(() => {
    setError(null)
    setCorrecting(null)
    load()
  }, [load])

  const handleSave = async (event: FormEvent) => {
    event.preventDefault()
    // INC-011: nunca se guarda una lista que no corresponde al grupo y la fecha seleccionados.
    if (!sheet || sheet.date !== date || String(sheet.group) !== groupId) return
    setError(null)
    setNotice(null)
    try {
      await apiPost('/attendance/', {
        group: sheet.group,
        date: sheet.date,
        entries: sheet.entries.map((e) => ({ student: e.student, status: marks[e.student] })),
      })
      setNotice(`Asistencia de ${sheet.group_code} del ${sheet.date} registrada.`)
      await load()
    } catch (err) {
      const apiError = toApiError(err)
      // HU10-E3: si ya existía, se muestra la asistencia guardada en modo corrección en lugar de duplicarla.
      if (apiError.status === 409) await load()
      setError(apiError)
    }
  }

  const canEdit = user?.role === 'teacher' && sheet?.can_edit

  return (
    <section>
      <h1>Asistencia</h1>
      <div className="filters">
        <div className="field">
          <label htmlFor="attendance-group">Grupo</label>
          <select id="attendance-group" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
            <option value="">Seleccione…</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.code} ({g.period_name})
              </option>
            ))}
          </select>
        </div>
        <Field
          label="Fecha"
          name="attendance-date"
          type="date"
          max={today()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      {groups.length === 0 && !error && <p className="muted">No tiene grupos asignados.</p>}
      {notice && <Alert kind="success">{notice}</Alert>}
      {error && <Alert kind="error">{error.message}</Alert>}

      {sheet && !sheet.recorded && (
        <form className="card form" onSubmit={handleSave} noValidate aria-label="Registrar asistencia">
          <h2>
            {sheet.group_code} · {sheet.date}
          </h2>
          {error?.fieldError('date') && <Alert kind="error">{error.fieldError('date')}</Alert>}
          {error?.fieldError('entries') && <Alert kind="error">{error.fieldError('entries')}</Alert>}
          {sheet.entries.length === 0 && <p className="muted">El grupo no tiene estudiantes.</p>}
          {!canEdit && sheet.entries.length > 0 && (
            <p className="muted">Aún no se ha registrado la asistencia de esta fecha.</p>
          )}
          {canEdit &&
            sheet.entries.map((entry) => (
              <fieldset key={entry.student} className="attendance-row">
                <legend>{entry.name}</legend>
                {(['presente', 'ausente'] as AttendanceStatus[]).map((status) => (
                  <label key={status} className="check">
                    <input
                      type="radio"
                      name={`status-${entry.student}`}
                      value={status}
                      checked={marks[entry.student] === status}
                      onChange={() => setMarks({ ...marks, [entry.student]: status })}
                    />
                    {STATUS_LABELS[status]}
                  </label>
                ))}
              </fieldset>
            ))}
          {canEdit && sheet.entries.length > 0 && (
            <div className="actions">
              <button type="submit" className="button">
                Guardar asistencia
              </button>
            </div>
          )}
        </form>
      )}

      {sheet?.recorded && (
        <>
          <p className="muted">
            Asistencia registrada para {sheet.group_code} el {sheet.date}.
            {canEdit && ' Para cambiar un estado, use Corregir e indique el motivo.'}
          </p>
          <table className="table" aria-label={`Asistencia de ${sheet.group_code} el ${sheet.date}`}>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Estado</th>
                <th>Correcciones</th>
                {canEdit && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {sheet.entries.map((entry) => (
                <tr key={entry.student}>
                  <td data-label="Estudiante">{entry.name}</td>
                  <td data-label="Estado">{entry.status ? STATUS_LABELS[entry.status] : 'Sin registro'}</td>
                  <td data-label="Correcciones">
                    {entry.changes.length === 0
                      ? '—'
                      : entry.changes.map((c) => (
                          <span key={c.changed_at} className="change">
                            {STATUS_LABELS[c.previous_status]} → {STATUS_LABELS[c.new_status]}: {c.reason} ({c.changed_by},{' '}
                            {new Date(c.changed_at).toLocaleString('es-CR')})
                          </span>
                        ))}
                  </td>
                  {canEdit && (
                    <td data-label="Acciones">
                      {entry.record && (
                        <button
                          type="button"
                          className="button button--small"
                          aria-label={`Corregir la asistencia de ${entry.name}`}
                          onClick={() => {
                            setCorrecting(entry)
                            setNotice(null)
                          }}
                        >
                          Corregir
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {correcting && (
        <CorrectionForm
          key={correcting.student}
          entry={correcting}
          onCancel={() => setCorrecting(null)}
          onSaved={async (message) => {
            setCorrecting(null)
            setError(null)
            setNotice(message)
            await load()
          }}
        />
      )}
    </section>
  )
}

interface CorrectionProps {
  entry: Entry
  onCancel: () => void
  onSaved: (message: string) => void
}

/** HU10-E2 y HU10-E4: corrección con motivo obligatorio. */
function CorrectionForm({ entry, onCancel, onSaved }: CorrectionProps) {
  const [status, setStatus] = useState<AttendanceStatus>(entry.status === 'presente' ? 'ausente' : 'presente')
  const [reason, setReason] = useState('')
  const [error, setError] = useState<ApiError | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    try {
      await apiPost(`/attendance/${entry.record}/correct/`, { status, reason })
      onSaved(`Asistencia de ${entry.name} corregida a ${STATUS_LABELS[status].toLowerCase()}.`)
    } catch (err) {
      setError(toApiError(err))
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate aria-label="Corregir asistencia">
      <h2 ref={heading} tabIndex={-1}>
        Corregir asistencia de {entry.name}
      </h2>
      {error && <Alert kind="error">{error.fieldError('reason') ?? error.fieldError('status') ?? errorMessage(error)}</Alert>}
      <p className="muted">Estado actual: {entry.status ? STATUS_LABELS[entry.status] : 'Sin registro'}</p>
      <div className="field">
        <label htmlFor="correction-status">Nuevo estado</label>
        <select
          id="correction-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
        >
          <option value="presente">Presente</option>
          <option value="ausente">Ausente</option>
        </select>
      </div>
      <Field
        label="Motivo"
        name="reason"
        maxLength={255}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        error={error?.fieldError('reason')}
      />
      <div className="actions">
        <button type="submit" className="button">
          Guardar corrección
        </button>
        <button type="button" className="button button--ghost" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
