import { useRef } from 'react'
import { X } from 'lucide-react'
import { useModal } from '../hooks/useModal'

export default function Modal({ title, onClose, children, wide = false }) {
  const ref = useRef(null)
  useModal(ref, onClose)
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={`modal ${wide ? 'modal--wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <button className="modal__close" onClick={onClose} aria-label="Fechar">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  )
}
