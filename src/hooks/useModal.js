import { useEffect, useRef } from 'react'

// Modal acessível: fecha com Esc, prende o foco e bloqueia o scroll do body.
export function useModal(ref, onClose) {
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    const prev = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const el = ref.current
    const focusables = () =>
      [...el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
        (n) => !n.disabled,
      )
    focusables()[0]?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') closeRef.current()
      if (e.key === 'Tab') {
        const f = focusables()
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prev?.focus?.()
    }
  }, [ref])
}
