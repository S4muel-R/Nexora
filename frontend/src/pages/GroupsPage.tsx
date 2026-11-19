import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, apiDelete, apiGet, apiPost, errorMessage, toApiError } from '../api/client'
import { levelLabel } from '../api/types'
import type { AcademicPeriod, Group, Institution, Level, Student, Teacher } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import { Alert, Field } from '../components/Field'
import { usePageTitle } from '../components/usePageTitle'

interface GroupForm {
  code: string
  level: Level | ''
  period: string
}

/** HU09: grupos por nivel y periodo con sus estudiantes y docentes. El personal docente solo ve sus grupos. */
export function GroupsPage() {
  const { user } = useAuth()
  usePageTitle('Grupos')
  const canEdit = user?.role === 'institution_admin'
  const [periods, setPeriods] = useState<AcademicPeriod[]>([])
  const [period, setPeriod] = useState('')
  const [levels, setLevels] = useState<Level[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<GroupForm>({ code: '', level: '', period: '' })
  const [formError, setFormError] = useState<ApiError | null>(null)
  const [listError, setListError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const formHeading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (creating) formHeading.current?.focus()
  }, [creating])

  useEffect(() => {
    let active = true
    apiGet<AcademicPeriod[]>('/periods/')
      .then((data) => {
        if (!active) return
        setPeriods(data)
        const current = data.find((p) => p.is_current) ?? data[0]
        setPeriod(current ? String(current.id) : '')
      })
      .catch((err) => active && setListError(errorMessage(err)))
    if (canEdit) {
      apiGet<Institution>('/my-institution/')
        .then((institution) => active && setLevels(institution.levels))
        .catch(() => active && setLevels([]))
    }
    return () => {
      active = false
    }
  }, [canEdit])

  const load = useCallback(() => {
    if (!period) {
      setGroups([])
      return
    }
    apiGet<Group[]>(`/groups/?period=${period}`)
      .then((data) => {
        setGroups(data)
        setListError(null)
      })
      .catch((err) => setListError(errorMessage(err)))
  }, [period])

  useEffect(load, [load])

  const openForm = () => {
    setCreating(true)
    setFormError(null)
    setNotice(null)
    setForm({ code: '', level: levels.length === 1 ? levels[0] : '', period })
  }

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    try {
      const created = await apiPost<Group>('/groups/', { ...form, period: Number(form.period) || null })
      setNotice(`El grupo ${created.code} fue creado.`)
      setCreating(false)
      setPeriod(String(created.period))
      setSelected(created.id)
      load()
    } catch (err) {
      setFormError(toApiError(err))
    }
  }

  const group = groups.find((g) => g.id === selected) ?? null

  return (
    <section>
      <div className="page-header">
        <h1>Grupos</h1>
        {canEdit && !creating && (
          <button type="button" className="button" onClick={openForm} disabled={periods.length === 0}>
            Crear grupo
          </button>
        )}
      </div>
      {notice && <Alert kind="success">{notice}</Alert>}
      {canEdit && periods.length === 0 && !listError && (
        <p className="muted">Defina primero un periodo lectivo en Mi institución.</p>
      )}

      {creating && (
        <form className="card form" onSubmit={handleCreate} noValidate aria-label="Crear grupo">
          <h2 ref={formHeading} tabIndex={-1}>
            Nuevo grupo
          </h2>
          {formError && <Alert kind="error">{formError.message}</Alert>}
          <div className="grid-2">
            <Field
              label="Código"
              name="code"
              placeholder="Por ejemplo, 4-A"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              error={formError?.fieldError('code')}
            />
            <div className="field">
              <label htmlFor="field-group-level">Nivel</label>
              <select
                id="field-group-level"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value as Level })}
                aria-invalid={formError?.fieldError('level') ? true : undefined}
              >
                <option value="">Seleccione…</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {levelLabel(level)}
                  </option>
                ))}
              </select>
              {formError?.fieldError('level') && (
                <span className="field__error">{formError.fieldError('level')}</span>
              )}
            </div>
            <div className="field">
              <label htmlFor="field-group-period">Periodo lectivo</label>
              <select
                id="field-group-period"
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
              >
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="actions">
            <button type="submit" className="button">
              Guardar
            </button>
            <button type="button" className="button button--ghost" onClick={() => setCreating(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="filters">
        <div className="field">
          <label htmlFor="filter-period">Periodo lectivo</label>
          <select
            id="filter-period"
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value)
              setSelected(null)
            }}
          >
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.is_current ? ' (vigente)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
      {listError && <Alert kind="error">{listError}</Alert>}

      <table className="table" aria-label="Lista de grupos">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nivel</th>
            <th>Docentes</th>
            <th>Estudiantes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={g.id}>
              <td data-label="Código">{g.code}</td>
              <td data-label="Nivel">{levelLabel(g.level)}</td>
              <td data-label="Docentes">{g.teachers.map((t) => t.name).join(', ') || 'Sin docente'}</td>
              <td data-label="Estudiantes">{g.student_count}</td>
              <td data-label="Acciones">
                <button
                  type="button"
                  className="button button--small"
                  aria-label={`Ver grupo ${g.code}`}
                  aria-pressed={selected === g.id}
                  onClick={() => {
                    setSelected(g.id)
                    setNotice(null)
                  }}
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {groups.length === 0 && !listError && periods.length > 0 && (
        <p className="muted">{canEdit ? 'No hay grupos en este periodo.' : 'No tiene grupos asignados en este periodo.'}</p>
      )}

      {group && (
        <GroupDetail key={group.id} group={group} groups={groups} canEdit={canEdit} onChange={load} />
      )}
    </section>
  )
}

interface DetailProps {
  group: Group
  groups: Group[]
  canEdit: boolean
  onChange: () => void
}

/** Composición del grupo (HU09-E1), traslados (HU09-E2) y asignaciones. */
function GroupDetail({ group, groups, canEdit, onChange }: DetailProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [toAdd, setToAdd] = useState<number[]>([])
  const [teacherId, setTeacherId] = useState('')
  const [transfer, setTransfer] = useState<Record<number, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])

  useEffect(() => {
    if (!canEdit) return
    let active = true
    apiGet<Student[]>('/students/').then((data) => active && setStudents(data))
    apiGet<Teacher[]>('/teachers/').then((data) => active && setTeachers(data))
    return () => {
      active = false
    }
  }, [canEdit])

  // Grupo de cada estudiante en el periodo, para indicarlo junto a su nombre (HU09-E3).
  const groupOf = useMemo(() => {
    const map = new Map<number, string>()
    for (const g of groups) for (const s of g.students) map.set(s.id, g.code)
    return map
  }, [groups])

  const candidates = students.filter((s) => s.level === group.level && groupOf.get(s.id) !== group.code)
  const freeTeachers = teachers.filter((t) => !group.teachers.some((assigned) => assigned.id === t.id))
  const targets = groups.filter((g) => g.id !== group.id && g.level === group.level)

  const run = async (action: () => Promise<unknown>, success: string) => {
    setError(null)
    setNotice(null)
    try {
      await action()
      setNotice(success)
      onChange()
      return true
    } catch (err) {
      setError(errorMessage(err))
      return false
    }
  }

  const addStudents = async () => {
    if (toAdd.length === 0) {
      setError('Seleccione al menos un estudiante.')
      return
    }
    const count = toAdd.length
    if (
      await run(
        () => apiPost(`/groups/${group.id}/students/`, { students: toAdd }),
        count === 1 ? 'Se asignó 1 estudiante.' : `Se asignaron ${count} estudiantes.`,
      )
    )
      setToAdd([])
  }

  const addTeacher = async () => {
    if (!teacherId) {
      setError('Seleccione un docente.')
      return
    }
    if (await run(() => apiPost(`/groups/${group.id}/teachers/`, { teachers: [Number(teacherId)] }), 'Docente asignado.'))
      setTeacherId('')
  }

  return (
    <article className="card" aria-labelledby="group-detail-title">
      <h2 id="group-detail-title" ref={heading} tabIndex={-1}>
        Grupo {group.code} · {levelLabel(group.level)} · {group.period_name}
      </h2>
      {error && <Alert kind="error">{error}</Alert>}
      {notice && <Alert kind="success">{notice}</Alert>}

      <h3>Docentes</h3>
      {group.teachers.length === 0 ? (
        <p className="muted">Sin docente asignado.</p>
      ) : (
        <ul className="plain-list">
          {group.teachers.map((t) => (
            <li key={t.id}>
              {t.name}
              {canEdit && (
                <button
                  type="button"
                  className="button button--small button--ghost"
                  aria-label={`Quitar a ${t.name} del grupo`}
                  onClick={() => run(() => apiDelete(`/groups/${group.id}/teachers/${t.id}/`), `${t.name} ya no está asignado.`)}
                >
                  Quitar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {canEdit && (
        <div className="filters">
          <div className="field">
            <label htmlFor="add-teacher">Asignar docente</label>
            <select id="add-teacher" value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
              <option value="">Seleccione…</option>
              {freeTeachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.last_name}, {t.first_name}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="button" onClick={addTeacher}>
            Asignar docente
          </button>
        </div>
      )}

      <h3>Estudiantes ({group.student_count})</h3>
      <table className="table" aria-label={`Estudiantes del grupo ${group.code}`}>
        <thead>
          <tr>
            <th>Identificación</th>
            <th>Nombre</th>
            {canEdit && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {group.students.map((s) => (
            <tr key={s.id}>
              <td data-label="Identificación">{s.identification}</td>
              <td data-label="Nombre">
                {s.last_name}, {s.first_name}
              </td>
              {canEdit && (
                <td data-label="Acciones" className="row-actions">
                  <label className="sr-only" htmlFor={`transfer-${s.id}`}>
                    Grupo destino de {s.first_name} {s.last_name}
                  </label>
                  <select
                    id={`transfer-${s.id}`}
                    value={transfer[s.id] ?? ''}
                    onChange={(e) => setTransfer({ ...transfer, [s.id]: e.target.value })}
                  >
                    <option value="">Trasladar a…</option>
                    {targets.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.code}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="button button--small"
                    disabled={!transfer[s.id]}
                    aria-label={`Trasladar a ${s.first_name} ${s.last_name}`}
                    onClick={() => {
                      const target = groups.find((g) => g.id === Number(transfer[s.id]))
                      run(
                        () =>
                          apiPost(`/groups/${group.id}/transfer/`, {
                            student: s.id,
                            target_group: Number(transfer[s.id]),
                          }),
                        `${s.first_name} ${s.last_name} fue trasladado a ${target?.code ?? 'otro grupo'}.`,
                      )
                    }}
                  >
                    Trasladar
                  </button>
                  <button
                    type="button"
                    className="button button--small button--ghost"
                    aria-label={`Quitar a ${s.first_name} ${s.last_name} del grupo`}
                    onClick={() =>
                      run(
                        () => apiDelete(`/groups/${group.id}/students/${s.id}/`),
                        `${s.first_name} ${s.last_name} ya no está en el grupo.`,
                      )
                    }
                  >
                    Quitar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {group.students.length === 0 && <p className="muted">El grupo no tiene estudiantes.</p>}

      {canEdit && (
        <fieldset className="field">
          <legend>Asignar estudiantes de {levelLabel(group.level).toLowerCase()}</legend>
          {candidates.length === 0 ? (
            <p className="muted">No hay más estudiantes activos de este nivel.</p>
          ) : (
            <div className="checks checks--column">
              {candidates.map((s) => (
                <label key={s.id} className="check">
                  <input
                    type="checkbox"
                    checked={toAdd.includes(s.id)}
                    onChange={(e) =>
                      setToAdd(e.target.checked ? [...toAdd, s.id] : toAdd.filter((id) => id !== s.id))
                    }
                  />
                  {s.last_name}, {s.first_name}
                  {groupOf.has(s.id) && <span className="muted"> (en {groupOf.get(s.id)})</span>}
                </label>
              ))}
            </div>
          )}
          <div className="actions">
            <button type="button" className="button" onClick={addStudents} disabled={candidates.length === 0}>
              Asignar seleccionados
            </button>
          </div>
        </fieldset>
      )}
    </article>
  )
}
