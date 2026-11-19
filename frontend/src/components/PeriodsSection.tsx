import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, apiGet, apiPatch, apiPost, errorMessage, toApiError } from '../api/client'
import type { AcademicPeriod } from '../api/types'
import { Alert, Field } from './Field'

const EMPTY = { name: '', start_date: '', end_date: '', is_current: true }

/** HU05-E5: periodos lectivos de la institución. El personal docente solo los consulta. */
export function PeriodsSection({ canEdit }: { canEdit: boolean }) {
  const [periods, setPeriods] = useState<AcademicPeriod[]>([])
  const [form, setForm] = useState(EMPTY)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const load = useCallback(() => {
    apiGet<AcademicPeriod[]>('/periods/')
      .then(setPeriods)
      .catch((err) => setError(toApiError(err)))
  }, [])

  useEffect(load, [load])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setNotice(null)
    try {
      const saved = await apiPost<AcademicPeriod>('/periods/', form)
      setNotice(`Periodo lectivo ${saved.name} guardado${saved.is_current ? ' como vigente' : ''}.`)
      setForm(EMPTY)
      setOpen(false)
      load()
    } catch (err) {
      setError(toApiError(err))
    }
  }

  const makeCurrent = async (period: AcademicPeriod) => {
    setError(null)
    setNotice(null)
    try {
      await apiPatch(`/periods/${period.id}/`, { is_current: true })
      setNotice(`${period.name} es ahora el periodo vigente.`)
      load()
    } catch (err) {
      setError(new ApiError(0, { code: 'error', message: errorMessage(err) }))
    }
  }

  return (
    <section className="card" aria-labelledby="periods-title">
      <div className="page-header">
        <h2 id="periods-title">Periodos lectivos</h2>
        {canEdit && !open && (
          <button type="button" className="button" onClick={() => setOpen(true)}>
            Definir periodo
          </button>
        )}
      </div>
      {notice && <Alert kind="success">{notice}</Alert>}
      {error && !open && <Alert kind="error">{error.message}</Alert>}

      {open && (
        <form className="form" onSubmit={handleSubmit} noValidate aria-label="Definir periodo lectivo">
          {error && <Alert kind="error">{error.message}</Alert>}
          <Field
            label="Nombre del periodo"
            name="period-name"
            placeholder="Por ejemplo, 2026"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={error?.fieldError('name')}
          />
          <div className="grid-2">
            <Field
              label="Inicio"
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              error={error?.fieldError('start_date')}
            />
            <Field
              label="Fin"
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              error={error?.fieldError('end_date')}
            />
          </div>
          <label className="check">
            <input
              type="checkbox"
              checked={form.is_current}
              onChange={(e) => setForm({ ...form, is_current: e.target.checked })}
            />
            Periodo vigente
          </label>
          <div className="actions">
            <button type="submit" className="button">
              Guardar periodo
            </button>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => {
                setOpen(false)
                setError(null)
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {periods.length === 0 ? (
        <p className="muted">No hay periodos lectivos definidos.</p>
      ) : (
        <table className="table" aria-label="Periodos lectivos">
          <thead>
            <tr>
              <th>Periodo</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => (
              <tr key={period.id}>
                <td data-label="Periodo">{period.name}</td>
                <td data-label="Inicio">{period.start_date}</td>
                <td data-label="Fin">{period.end_date}</td>
                <td data-label="Estado">
                  {period.is_current ? (
                    'Vigente'
                  ) : canEdit ? (
                    <button
                      type="button"
                      className="button button--small button--ghost"
                      aria-label={`Marcar ${period.name} como vigente`}
                      onClick={() => makeCurrent(period)}
                    >
                      Marcar como vigente
                    </button>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
