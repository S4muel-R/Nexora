import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, apiGet, apiPatch, apiPost, errorMessage, toApiError } from '../api/client'
import type { Teacher } from '../api/types'
import { Alert, Field } from '../components/Field'
import { usePageTitle } from '../components/usePageTitle'

interface TeacherForm {
  first_name: string
  last_name: string
  email: string
  password: string
}

const EMPTY: TeacherForm = { first_name: '', last_name: '', email: '', password: '' }

/** HU08: registro de docentes con su cuenta, edición y desactivación (solo personal administrativo). */
export function TeachersPage() {
  usePageTitle('Docentes')
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [includeInactive, setIncludeInactive] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Teacher | 'new' | null>(null)
  const [form, setForm] = useState<TeacherForm>(EMPTY)
  const [formError, setFormError] = useState<ApiError | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const formHeading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (editing) formHeading.current?.focus()
  }, [editing])

  const load = useCallback(() => {
    apiGet<Teacher[]>(`/teachers/${includeInactive ? '?include_inactive=true' : ''}`)
      .then((data) => {
        setTeachers(data)
        setListError(null)
      })
      .catch((err) => setListError(errorMessage(err)))
  }, [includeInactive])

  useEffect(load, [load])

  const openForm = (teacher: Teacher | 'new') => {
    setEditing(teacher)
    setFormError(null)
    setNotice(null)
    setForm(teacher === 'new' ? EMPTY : { ...teacher, password: '' })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    try {
      if (editing === 'new') {
        const created = await apiPost<Teacher>('/teachers/', form)
        setNotice(`${created.first_name} ${created.last_name} fue registrado con su cuenta de docente.`)
      } else if (editing) {
        const { password, ...data } = form
        await apiPatch<Teacher>(`/teachers/${editing.id}/`, password ? form : data)
        setNotice('Datos del docente actualizados.')
      }
      setEditing(null)
      load()
    } catch (err) {
      setFormError(toApiError(err))
    }
  }

  const toggleActive = async (teacher: Teacher) => {
    setNotice(null)
    try {
      await apiPatch<Teacher>(`/teachers/${teacher.id}/`, { is_active: !teacher.is_active })
      setNotice(
        `${teacher.first_name} ${teacher.last_name} fue ${teacher.is_active ? 'desactivado' : 'reactivado'}.`,
      )
      load()
    } catch (err) {
      setListError(errorMessage(err))
    }
  }

  return (
    <section>
      <div className="page-header">
        <h1>Docentes</h1>
        {!editing && (
          <button type="button" className="button" onClick={() => openForm('new')}>
            Registrar docente
          </button>
        )}
      </div>
      {notice && <Alert kind="success">{notice}</Alert>}

      {editing && (
        <form
          className="card form"
          onSubmit={handleSubmit}
          noValidate
          aria-label={editing === 'new' ? 'Registrar docente' : 'Editar docente'}
        >
          <h2 ref={formHeading} tabIndex={-1}>
            {editing === 'new' ? 'Nuevo docente' : 'Editar docente'}
          </h2>
          {formError && <Alert kind="error">{formError.message}</Alert>}
          <div className="grid-2">
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
            <Field
              label="Correo"
              name="email"
              type="email"
              autoComplete="off"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={formError?.fieldError('email')}
            />
            <Field
              label={editing === 'new' ? 'Contraseña inicial' : 'Nueva contraseña (opcional)'}
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={formError?.fieldError('password')}
            />
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

      <table className="table" aria-label="Lista de docentes">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id} className={teacher.is_active ? undefined : 'row--inactive'}>
              <td data-label="Nombre">
                {teacher.last_name}, {teacher.first_name}
              </td>
              <td data-label="Correo">{teacher.email}</td>
              <td data-label="Estado">{teacher.is_active ? 'Activo' : 'Desactivado'}</td>
              <td data-label="Acciones" className="row-actions">
                <button type="button" className="button button--small" onClick={() => openForm(teacher)}>
                  Editar
                </button>
                <button
                  type="button"
                  className="button button--small button--ghost"
                  onClick={() => toggleActive(teacher)}
                >
                  {teacher.is_active ? 'Desactivar' : 'Reactivar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {teachers.length === 0 && !listError && <p className="muted">No hay docentes registrados.</p>}
    </section>
  )
}
