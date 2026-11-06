import { useEffect } from 'react'

/** A11Y-01 (WCAG 2.4.2): cada pantalla tiene su propio título de pestaña. */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · Nexora`
  }, [title])
}
