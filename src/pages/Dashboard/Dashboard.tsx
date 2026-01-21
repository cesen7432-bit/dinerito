import { useMemo, useState } from 'react'
import { useAuthStore, useMovementsStore, useTotals } from '../../stores'
import { useCategories } from '../../hooks/useCategories'
import { Card, StatCard, MovementRow, CategoryChip, AddMovementModal, ReceiptModal, UserMenu } from '../../components'
import type { Movement } from '../../types'
import './Dashboard.css'

export default function Dashboard() {
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const movements = useMovementsStore(state => state.movements)
  const addMovement = useMovementsStore(state => state.addMovement)
  const deleteMovement = useMovementsStore(state => state.deleteMovement)
  const totals = useTotals()
  const { categories, editing, addCategory, renameCategory, startEditing, cancelEditing } = useCategories()

  const [filter, setFilter] = useState<string>('Todas')
  const [editValue, setEditValue] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null)

  const filtered = useMemo(() => {
    if (filter === 'Todas') return movements
    return movements.filter(m => (m.category || 'General') === filter)
  }, [filter, movements])

  const handleAddOrEditCategory = () => {
    const name = editValue.trim()
    if (!name) return

    if (editing) {
      renameCategory(editing, name)
      if (filter === editing) setFilter(name)
    } else {
      addCategory(name)
    }
    setEditValue('')
  }

  const handleStartEdit = (c: string) => {
    startEditing(c)
    setEditValue(c)
  }

  const handleCancelEdit = () => {
    cancelEditing()
    setEditValue('')
  }

  return (
    <main className="page page-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header__left">
          <div className="dashboard-header__logo">$</div>
          <div>
            <h1 className="dashboard-header__title">Dinerito</h1>
            <p className="dashboard-header__subtitle">Tu dinero, bajo control</p>
          </div>
        </div>
        <UserMenu userName={user?.name || 'Usuario'} onLogout={logout} />
      </header>

      <section className="stats">
        <StatCard variant="ingreso" label="Ingresos totales" value={totals.ingreso} />
        <StatCard variant="egreso" label="Egresos totales" value={totals.egreso} />
        <StatCard variant="balance" label="Balance actual" value={totals.balance} />
      </section>

      <Card className="filters">
        <div className="filters__header">
          <h3>Categorias</h3>
          <div className="category-edit">
            <input
              type="text"
              placeholder={editing ? 'Renombrar categoria' : 'Nueva categoria'}
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAddOrEditCategory()
                if (e.key === 'Escape') handleCancelEdit()
              }}
            />
            <button type="button" onClick={handleAddOrEditCategory}>
              {editing ? 'Guardar' : 'Agregar'}
            </button>
            {editing && (
              <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                Cancelar
              </button>
            )}
          </div>
        </div>
        <div className="category-list">
          <CategoryChip
            label="Todas"
            active={filter === 'Todas'}
            onClick={() => setFilter('Todas')}
          />
          {categories.map(c => (
            <CategoryChip
              key={c}
              label={c}
              active={filter === c}
              onClick={() => setFilter(c)}
              onDoubleClick={() => handleStartEdit(c)}
            />
          ))}
        </div>
      </Card>

      <Card className="movements-section">
        <div className="movements-header">
          <div>
            <h3>Historial de movimientos</h3>
            <span className="muted">{filtered.length} movimiento{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          <button className="btn-add" onClick={() => setShowAddModal(true)}>
            + Nuevo
          </button>
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No hay movimientos en esta categoria</p>
          </div>
        ) : (
          <ul className="movements-list">
            {filtered.map(m => (
              <MovementRow
                key={m.id}
                movement={m}
                onClick={setSelectedMovement}
                onDelete={deleteMovement}
              />
            ))}
          </ul>
        )}
      </Card>

      {showAddModal && (
        <AddMovementModal
          categories={categories}
          onAdd={addMovement}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {selectedMovement && (
        <ReceiptModal
          movement={selectedMovement}
          onClose={() => setSelectedMovement(null)}
        />
      )}
    </main>
  )
}
