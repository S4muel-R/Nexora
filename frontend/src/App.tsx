import { useEffect, useState } from 'react'
import { ApiError, apiGet } from './api/client'

interface Health {
  status: string
  database: string
}

type State = { kind: 'loading' } | { kind: 'ok'; health: Health } | { kind: 'error'; message: string }

export default function App() {
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    apiGet<Health>('/health/')
      .then((health) => setState({ kind: 'ok', health }))
      .catch((error: unknown) =>
        setState({
          kind: 'error',
          message: error instanceof ApiError ? error.message : 'Ocurrió un error inesperado.',
        }),
      )
  }, [])

  return (
    <main className="shell">
      <h1>Nexora</h1>
      <p>Plataforma de gestión educativa</p>
      <section aria-live="polite" className={`status status--${state.kind}`}>
        {state.kind === 'loading' && 'Verificando el servidor…'}
        {state.kind === 'ok' && `Servidor disponible (base de datos: ${state.health.database})`}
        {state.kind === 'error' && state.message}
      </section>
    </main>
  )
}
