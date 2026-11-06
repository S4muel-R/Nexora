import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

afterEach(() => vi.unstubAllGlobals())

describe('App', () => {
  it('muestra el estado del servidor cuando responde', async () => {
    vi.stubGlobal('fetch', async () => new Response(JSON.stringify({ status: 'ok', database: 'postgresql' })))

    render(<App />)

    expect(await screen.findByText(/Servidor disponible/)).toBeInTheDocument()
  })

  it('muestra un mensaje claro cuando el servidor no responde', async () => {
    vi.stubGlobal('fetch', async () => {
      throw new TypeError('Failed to fetch')
    })

    render(<App />)

    expect(await screen.findByText(/No se pudo conectar con el servidor/)).toBeInTheDocument()
  })
})
