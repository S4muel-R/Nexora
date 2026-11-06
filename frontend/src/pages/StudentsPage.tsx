import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, apiGet, apiPatch, apiPost, errorMessage } from '../api/client'
import { levelLabel } from '../api/types'
import type { Institution, Level, Student } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import { Alert, Field } from '../components/Field'

interface StudentForm {
  identification: string
  first_name: string
  last_name: string
  birth_date: string
  level: Level | ''
}

const EMPTY: StudentForm = { identification: '', first_name: '', last_name: '', birth_date: '', level: '' }

/** HU07: lista con búsqueda, registro, edición y desactivación de estudiantes. */
export function StudentsPage() {
  const { user } = useAuth()
  const canEdit = user?.role === 'institution_admin'
  const [students, setStudents] = useState<Student[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  // INC-004: el formulario solo se abre cuando los niveles de la institución ya cargaron.
  const [levelsLoaded, setLevelsLoaded] = useState(false)
  const [search, setSearch] = useState('')
  const [includeInactive, setIncludeInactive] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Student | 'new' | null>(null)
  const [form, setForm] = useState<StudentForm>(EMPTY)
  const [formError, setFormError] = useState<ApiError | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const load = useCallback(() => {
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (includeInactive) params.set('include_inactive', 'true')
    const query = params.toString()
    apiGet<Student[]>(`/students/${query ? `?${query}` : ''}`)
      .then((data) => {
        setStudents(data)
        setListError(null)
      })
      .catch((err) => setListError(errorMessage(err)))
  }, [search, includeInactive])

  useEffect(() => {
    const timer = setTimeout(load, 250)
    return () => clearTimeout(timer)
  }, [load])

  useEffect(() => {
    let active = true
    apiGet<Institution>('/my-institution/')
      .then((institution) => active && setLevels(institution.levels))
      .catch(() => active && setLevels([]))
      .finally(() => active && setLevelsLoaded(true))
    return () => {
      active = false
    }
  }, [])

  // INC-004: si el formulario se abrió antes de cargar los niveles, preseleccionar el único nivel al llegar.
  useEffect(() => {
    if (editing === 'new' && levels.length === 1) {
      setForm((current) => (current.level ? current : { ...current, level: levels[0] }))
    }
  }, [editing, levels])

  const openForm = (student: Student | 'new') => {
    setEditing(student)
    setFormError(null)
    setNotice(null)
    setForm(
      student === 'new'
        ? { ...EMPTY, level: levels.length === 1 ? levels[0] : '' }
        : {
            identification: student.identification,
            first_name: student.first_name,
            last_name: student.last_name,
            birth_date: student.birth_date,
            level: student.level,
          },
    )
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    try {
      if (editing === 'new') {
        const created = await apiPost<Student>('/students/', form)
        setNotice(`${created.first_name} ${created.last_name} fue registrado.`)
      } else if (editing) {
        await apiPatch<Student>(`/students/${editing.id}/`, form)
        setNotice('Datos del estudiante actualizados.')
      }
      setEditing(null)
      load()
    } catch (err) {
      setFormError(err instanceof ApiError ? err : new ApiError(0, { code: 'error', message: errorMessage(err) }))
    }
  }

  const toggleActive = async (student: Student) => {
    setNotice(null)
    try {
      await apiPatch<Student>(`/students/${student.id}/`, { is_active: !student.is_active })
      setNotice(
        `${student.first_name} ${student.last_name} fue ${student.is_active ? 'desactivado' : 'reactivado'}.`,
      )
      load()
    } catch (err) {
      setListError(errorMessage(err))
    }
  }

  return (
    <section>
      <div className="page-header">
        <h1>Estudiantes</h1>
        {canEdit && !editing && (
          <button type="button" className="button" onClick={() => openForm('new')} disabled={!levelsLoaded}>
            Registrar estudiante
          </button>
        )}
      </div>
      {notice && <Alert kind="success">{notice}</Alert>}

      {editing && (
        <form
          className="card form"
          onSubmit={handleSubmit}
          noValidate
          aria-label={editing === 'new' ? 'Registrar estudiante' : 'Editar estudiante'}
        >
          <h2>{editing === 'new' ? 'Nuevo estudiante' : 'Editar estudiante'}</h2>
          {formError && <Alert kind="error">{formError.message}</Alert>}
          <div className="grid-2">
            <Field
              label="Identificación"
              name="identification"
              value={form.identification}
              onChange={(e) => setForm({ ...form, identification: e.target.value })}
              error={formError?.fieldError('identification')}
            />
            <Field
              label="Fecha de nacimiento"
              name="birth_date"
              type="date"
              value={form.birth_date}
              onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
              error={formError?.fieldError('birth_date')}
            />
            <Field
              label="Nombre"
              name="first_name"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              error={formError?.fieldError('first_name')}
            />
            <Field
              label="Apellidos"
              name="last_name"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              error={formError?.fieldError('last_name')}
            />
          </div>
          <div className="field">
            <label htmlFor="field-level">Nivel</label>
            <select
              id="field-level"
              name="level"
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
          <div className="actions">
            <button type="submit" className="button">
              Guardar
            </button>
            <button type="button" className="button button--ghost" onClick={() => setEditing(null)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="filters">
        <Field
          label="Buscar"
          name="search"
          type="search"
          placeholder="Nombre, apellido o identificación"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label className="check">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => setIncludeInactive(e.target.checked)}
          />
          Mostrar desactivados
        </label>
      </div>
      {listError && <Alert kind="error">{listError}</Alert>}

      <table className="table" aria-label="Lista de estudiantes">
        <thead>
          <tr>
            <th>Identificación</th>
            <th>Nombre</th>
            <th>Nivel</th>
            <th>Estado</th>
            {canEdit && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className={student.is_active ? undefined : 'row--inactive'}>
              <td data-label="Identificación">{student.identification}</td>
              <td data-label="Nombre">
                {student.last_name}, {student.first_name}
              </td>
              <td data-label="Nivel">{levelLabel(student.level)}</td>
              <td data-label="Estado">{student.is_active ? 'Activo' : 'Desactivado'}</td>
              {canEdit && (
                <td data-label="Acciones" className="row-actions">
                  <button
                    type="button"
                    className="button button--small"
                    onClick={() => openForm(student)}
                    disabled={!levelsLoaded}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="button button--small button--ghost"
                    onClick={() => toggleActive(student)}
                  >
                    {student.is_active ? 'Desactivar' : 'Reactivar'}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {students.length === 0 && !listError && (
        <p className="muted">No hay estudiantes para los filtros seleccionados.</p>
      )}
    </section>
  )
}
