import type { Movement } from '../types'
import './MovementRow.css'

interface MovementRowProps {
  movement: Movement
  onClick?: (movement: Movement) => void
  onDelete?: (id: number) => void
}

export function MovementRow({ movement, onClick, onDelete }: MovementRowProps) {
  const { id, type, label, amount, date, category } = movement

  const handleClick = () => {
    if (onClick) onClick(movement)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) onDelete(id)
  }

  return (
    <li
      className={`movement-row movement-row--${type}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div className="movement-row__icon">
        {type === 'ingreso' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        )}
      </div>
      <div className="movement-row__info">
        <p className="movement-row__label">{label}</p>
        <p className="movement-row__meta">
          {new Date(date).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
          <span className="movement-row__category">{category || 'General'}</span>
        </p>
      </div>
      <div className="movement-row__right">
        <strong className={`movement-row__amount movement-row__amount--${type}`}>
          {type === 'ingreso' ? '+' : '-'}${amount.toFixed(2)}
        </strong>
        {onDelete && (
          <button
            type="button"
            className="movement-row__delete"
            onClick={handleDelete}
            aria-label="Eliminar movimiento"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </li>
  )
}
