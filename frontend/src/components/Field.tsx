import type { InputHTMLAttributes } from 'react'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  error?: string
}

/** Campo de formulario con etiqueta y mensaje de error asociado (accesible). */
export function Field({ label, name, error, id, ...input }: FieldProps) {
  const inputId = id ?? `field-${name}`
  const errorId = `${inputId}-error`
  return (
    <div className="field">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...input}
      />
      {error && (
        <span id={errorId} className="field__error">
          {error}
        </span>
      )}
    </div>
  )
}

export function Alert({ kind, children }: { kind: 'error' | 'success'; children: React.ReactNode }) {
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={`alert alert--${kind}`}>
      {children}
    </div>
  )
}
