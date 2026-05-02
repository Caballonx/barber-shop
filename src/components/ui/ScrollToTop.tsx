"use client"

import { useEffect } from "react"

export function ScrollToTop() {
  useEffect(() => {
    // Forzar el scroll al inicio al cargar la página
    window.scrollTo(0, 0)
    
    // También manejar el caso de que el navegador intente restaurar el scroll
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  return null
}
