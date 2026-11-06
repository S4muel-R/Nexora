import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, apiGet, apiPatch, errorMessage } from '../api/client'
import type { Institution } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import { Alert, Field } from '../components/Field'
import { LevelPicker } from '../components/LevelPicker'
import { usePageTitle } from '../components/usePageTitle'

/** HU05: el personal administrativo consulta y actualiza los datos de su institución; el docente solo consulta. */
export function MyInstitutionPage() {
  const { user } = useAuth()
  usePageTitle('Mi institución')
  const canEdit = user?.role === 'institution_admin'
  const [institution, setInstitution] = useState<Institution | null>(null)
  const [form, setForm] = useState<Institution | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // INC-008: una respuesta de una carga ya descartada no sobrescribe lo que la persona está editando.
    let active = true
    apiGet<Institution>('/my-institution/')
      .then((data) => {
        if (!active) return
        setInstitution(data)
        setForm(data)
      })
      .catch((err) => active && setLoadError(errorMessage(err)))
    return () => {
      active = false
    }
  }, [])

  if (loadError) return <Alert kind="error">{loadError}</Alert>
  if (!form || !institution) return <p className="page-status">Cargando…</p>

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)
    try {
      const { name, levels, address, phone, email } = form
      const saved = await apiPatch<Institution>('/my-institution/', { name, levels, address, phone, email })
      setInstitution(saved)
      setForm(saved)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof ApiError ? err : new ApiError(0, { code: 'error', message: errorMessage(err) }))
    }
  }

  return (
    <section>
      <h1>Mi institución</h1>
      <form className="card form" onSubmit={handleSubmit} noValidate aria-label="Datos de la institución">
        {success && <Alert kind="success">Datos actualizados.</Alert>}
        {error && <Alert kind="error">{error.message}</Alert>}
        <Field
          label="Nombre"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={error?.fieldError('name')}
          readOnly={!canEdit}
        />
        <LevelPicker
          value={form.levels}
          onChange={(levels) => setForm({ ...form, levels })}
          error={error?.fieldError('levels')}
          disabled={!canEdit}
        />
        <div className="grid-2">
          <Field
            label="Teléfono"
            name="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            error={error?.fieldError('phone')}
            readOnly={!canEdit}
          />
          <Field
            label="Correo"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={error?.fieldError('email')}
            readOnly={!canEdit}
          />
        </div>
        <Field
          label="Dirección"
          name="address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          error={error?.fieldError('address')}
          readOnly={!canEdit}
        />
        {canEdit && (
          <div className="actions">
            <button type="submit" className="button">
              Guardar cambios
            </button>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => {
                setForm(institution)
                setError(null)
              }}
            >
              Descartar
            </button>
          </div>
        )}
      </form>
    </section>
  )
}
