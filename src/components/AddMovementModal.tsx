import { useState, type FormEvent } from 'react'
import type { Movement, MovementType } from '../types'
import './AddMovementModal.css'

interface AddMovementModalProps {
  categories: string[]
  onAdd: (movement: Omit<Movement, 'id'>) => void
  onClose: () => void
}

export function AddMovementModal({ categories, onAdd, onClose }: AddMovementModalProps) {
  const [type, setType] = useState<MovementType>('ingreso')
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0] || 'General')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!label.trim() || !amount || parseFloat(amount) <= 0) return

    onAdd({
      type,
      label: label.trim(),
      amount: parseFloat(amount),
      category,
      date,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Nuevo movimiento</h2>
          <button type="button" className="modal__close" onClick={onClose}>
            &times;
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="modal__type-toggle">
            <button
              type="button"
              className={`type-btn type-btn--ingreso ${type === 'ingreso' ? 'type-btn--active' : ''}`}
              onClick={() => setType('ingreso')}
            >
              Ingreso
            </button>
            <button
              type="button"
              className={`type-btn type-btn--egreso ${type === 'egreso' ? 'type-btn--active' : ''}`}
              onClick={() => setType('egreso')}
            >
              Egreso
            </button>
          </div>

          <label className="modal__field">
            <span>Descripcion</span>
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="Ej: Salario, Supermercado..."
              required
            />
          </label>

          <label className="modal__field">
            <span>Monto ($)</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
          </label>

          <label className="modal__field">
            <span>Categoria</span>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="modal__field">
            <span>Fecha</span>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </label>

          <div className="modal__actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
