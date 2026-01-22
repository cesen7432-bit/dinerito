import type { Movement } from '../types'
import './ReceiptModal.css'

interface ReceiptModalProps {
  movement: Movement
  onClose: () => void
}

export function ReceiptModal({ movement, onClose }: ReceiptModalProps) {
  const { type, label, amount, date, category } = movement
  const isIngreso = type === 'ingreso'

  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const formattedTime = new Date().toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const receiptNumber = `#${movement.id.toString().padStart(6, '0')}`

  return (
    <div className="receipt-overlay" onClick={onClose}>
      <div className="receipt" onClick={e => e.stopPropagation()}>
        {/* Header con logo */}
        <div className="receipt__header">
          <div className="receipt__logo">$</div>
          <h2 className="receipt__brand">Dinerito</h2>
          <p className="receipt__tagline">Tu dinero, bajo control</p>
        </div>

        {/* Body */}
        <div className="receipt__body">
          {/* Tipo de transaccion */}
          <div className={`receipt__type receipt__type--${type}`}>
            <div className="receipt__type-icon">
              {isIngreso ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              )}
            </div>
            <span>{isIngreso ? 'Ingreso recibido' : 'Pago realizado'}</span>
          </div>

          {/* Monto principal */}
          <div className={`receipt__amount receipt__amount--${type}`}>
            <span className="receipt__amount-sign">{isIngreso ? '+' : '-'}</span>
            <span className="receipt__amount-currency">$</span>
            <span className="receipt__amount-value">{Number(amount).toFixed(2)}</span>
          </div>

          {/* Linea divisoria con circulos */}
          <div className="receipt__divider">
            <span></span>
          </div>

          {/* Detalles */}
          <div className="receipt__details">
            <div className="receipt__detail">
              <span className="receipt__detail-label">Concepto</span>
              <span className="receipt__detail-value">{label}</span>
            </div>
            <div className="receipt__detail">
              <span className="receipt__detail-label">Categoria</span>
              <span className="receipt__detail-value">{category || 'General'}</span>
            </div>
            <div className="receipt__detail">
              <span className="receipt__detail-label">Fecha</span>
              <span className="receipt__detail-value">{formattedDate}</span>
            </div>
            <div className="receipt__detail">
              <span className="receipt__detail-label">No. operacion</span>
              <span className="receipt__detail-value receipt__detail-value--mono">{receiptNumber}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="receipt__footer">
          <div className={`receipt__status receipt__status--${type}`}>
            {isIngreso ? 'ACREDITADO' : 'PROCESADO'}
          </div>
          <p className="receipt__footer-text">Comprobante generado a las</p>
          <p className="receipt__footer-date">{formattedTime} hrs</p>
        </div>

        {/* Boton cerrar */}
        <button className="receipt__close" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  )
}
