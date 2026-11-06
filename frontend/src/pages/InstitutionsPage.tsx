import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, apiGet, apiPost, errorMessage } from '../api/client'
import { levelLabel } from '../api/types'
import type { Institution, Level } from '../api/types'
import { Alert, Field } from '../components/Field'
import { LevelPicker } from '../components/LevelPicker'

const EMPTY_FORM = {
  name: '',
  levels: [] as Level[],
  address: '',
  phone: '',
  email: '',
  admin: { email: '', first_name: '', last_name: '', password: '' },
}

/** HU04: la administración de la plataforma consulta y registra instituciones con su administrador. */
export function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState<ApiError | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(() => {
    apiGet<Institution[]>('/institutions/')
      .then(setInstitutions)
      .catch((err) => setLoadError(errorMessage(err)))
  }, [])

  useEffect(load, [load])

  const setAdmin = (key: keyof typeof EMPTY_FORM.admin, value: string) =>
    setForm({ ...form, admin: { ...form.admin, [key]: value } })

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    setSuccess(null)
    try {
      const created = await apiPost<Institution>('/institutions/', form)
      setSuccess(`Institución "${created.name}" registrada. Su administrador ya puede iniciar sesión.`)
      setForm(EMPTY_FORM)
      setShowForm(false)
      load()
    } catch (err) {
      setFormError(err instanceof ApiError ? err : new ApiError(0, { code: 'error', message: errorMessage(err) }))
    }
  }

  const fieldError = (path: string) => formError?.fieldError(path)

  return (
    <section>
      <div className="page-header">
        <h1>Instituciones</h1>
        {!showForm && (
          <button type="button" className="button" onClick={() => setShowForm(true)}>
            Registrar institución
          </button>
        )}
      </div>
      {success && <Alert kind="success">{success}</Alert>}
      {loadError && <Alert kind="error">{loadError}</Alert>}

      {showForm && (
        <form className="card form" onSubmit={handleSubmit} noValidate aria-label="Registrar institución">
          <h2>Nueva institución</h2>
          {formError && <Alert kind="error">{formError.message}</Alert>}
          <Field
            label="Nombre"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={fieldError('name')}
          />
          <LevelPicker
            value={form.levels}
            onChange={(levels) => setForm({ ...form, levels })}
            error={fieldError('levels')}
          />
          <div className="grid-2">
            <Field
              label="Teléfono"
              name="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              error={fieldError('phone')}
            />
            <Field
              label="Correo de la institución"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={fieldError('email')}
            />
          </div>
          <Field
            label="Dirección"
            name="address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            error={fieldError('address')}
          />
          <h3>Persona administradora</h3>
          <div className="grid-2">
            <Field
              label="Nombre"
              name="admin.first_name"
              value={form.admin.first_name}
              onChange={(e) => setAdmin('first_name', e.target.value)}
              error={fieldError('admin.first_name')}
            />
            <Field
              label="Apellidos"
              name="admin.last_name"
              value={form.admin.last_name}
              onChange={(e) => setAdmin('last_name', e.target.value)}
              error={fieldError('admin.last_name')}
            />
            <Field
              label="Correo"
              name="admin.email"
              type="email"
              value={form.admin.email}
              onChange={(e) => setAdmin('email', e.target.value)}
              error={fieldError('admin.email')}
            />
            <Field
              label="Contraseña inicial"
              name="admin.password"
              type="password"
              autoComplete="new-password"
              value={form.admin.password}
              onChange={(e) => setAdmin('password', e.target.value)}
              error={fieldError('admin.password')}
            />
          </div>
          <div className="actions">
            <button type="submit" className="button">
              Guardar
            </button>
            <button type="button" className="button button--ghost" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Niveles</th>
            <th>Teléfono</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {institutions.map((institution) => (
            <tr key={institution.id}>
              <td data-label="Nombre">{institution.name}</td>
              <td data-label="Niveles">{institution.levels.map(levelLabel).join(', ')}</td>
              <td data-label="Teléfono">{institution.phone || '—'}</td>
              <td data-label="Estado">{institution.is_active ? 'Activa' : 'Inactiva'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {institutions.length === 0 && !loadError && <p className="muted">No hay instituciones registradas.</p>}
    </section>
  )
}
