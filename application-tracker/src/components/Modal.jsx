import { useEffect } from 'react'

export default function Modal({ title, onClose, children, size = 'default' }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className={`modal ${size === 'narrow' ? 'narrow' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </header>
        {children}
      </div>
    </div>
  )
}
