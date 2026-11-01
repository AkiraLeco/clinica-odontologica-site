import { useEffect, useRef } from 'react'

// Adiciona a classe "is-visible" quando o elemento entra na viewport.
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible')
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}
