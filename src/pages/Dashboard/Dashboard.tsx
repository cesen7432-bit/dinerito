import { useEffect, useMemo, useState } from 'react'
import { useAuthStore, useMovementsStore, useTotals, useCategoriesStore } from '../../stores'
import { Card, StatCard, MovementRow, CategoryChip, AddMovementModal, ReceiptModal, UserMenu } from '../../components'
import { tokenManager } from '../../services/api'
import type { Movement, Category } from '../../types'
import './Dashboard.css'

export default function Dashboard() {
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)

  const movements = useMovementsStore(state => state.movements)
  const fetchMovements = useMovementsStore(state => state.fetchMovements)
  const addMovement = useMovementsStore(state => state.addMovement)
  const deleteMovement = useMovementsStore(state => state.deleteMovement)
  const movementsLoading = useMovementsStore(state => state.isLoading)
  const totals = useTotals()

  const categories = useCategoriesStore(state => state.categories)
  const fetchCategories = useCategoriesStore(state => state.fetchCategories)
  const addCategory = useCategoriesStore(state => state.addCategory)
  const updateCategory = useCategoriesStore(state => state.updateCategory)
  const categoriesLoading = useCategoriesStore(state => state.isLoading)

  const [filter, setFilter] = useState<number | 'Todas'>('Todas')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editValue, setEditValue] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null)

  useEffect(() => {
    // Solo hacer fetch si hay token disponible
    const token = tokenManager.getToken()
    console.log('[Dashboard] Checking token on mount:', token ? 'EXISTS' : 'NO TOKEN')
    if (token) {
      fetchCategories()
      fetchMovements()
    }
  }, [fetchCategories, fetchMovements])

  // Recargar datos cuando el usuario cambie (después del login)
  useEffect(() => {
    if (user) {
      const token = tokenManager.getToken()
      console.log('[Dashboard] User changed, token:', token ? 'EXISTS' : 'NO TOKEN')
      if (token) {
        fetchCategories()
        fetchMovements()
      }
    }
  }, [user, fetchCategories, fetchMovements])

  const filtered = useMemo(() => {
    if (filter === 'Todas') return movements
    return movements.filter(m => m.category_id === filter)
  }, [filter, movements])

  const categoryNames = useMemo(() => {
    return categories.map(c => c.name)
  }, [categories])

  const handleAddOrEditCategory = async () => {
    const name = editValue.trim()
    if (!name) return

    if (editingCategory) {
      await updateCategory(editingCategory.id, name)
      setEditingCategory(null)
    } else {
      await addCategory(name)
    }
    setEditValue('')
  }

  const handleStartEdit = (category: Category) => {
    setEditingCategory(category)
    setEditValue(category.name)
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
    setEditValue('')
  }

  const handleAddMovement = async (movement: Omit<Movement, 'id'> & { category_id: number }) => {
    await addMovement(movement)
  }

  const handleDeleteMovement = async (id: number) => {
    await deleteMovement(id)
  }

  const getCategoryIdByName = (name: string): number => {
    const category = categories.find(c => c.name === name)
    return category?.id || categories[0]?.id || 0
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
              placeholder={editingCategory ? 'Renombrar categoria' : 'Nueva categoria'}
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAddOrEditCategory()
                if (e.key === 'Escape') handleCancelEdit()
              }}
              disabled={categoriesLoading}
            />
            <button type="button" onClick={handleAddOrEditCategory} disabled={categoriesLoading}>
              {editingCategory ? 'Guardar' : 'Agregar'}
            </button>
            {editingCategory && (
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
              key={c.id}
              label={c.name}
              active={filter === c.id}
              onClick={() => setFilter(c.id)}
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
        {movementsLoading ? (
          <div className="loading-state">
            <p>Cargando movimientos...</p>
          </div>
        ) : filtered.length === 0 ? (
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
                onDelete={handleDeleteMovement}
              />
            ))}
          </ul>
        )}
      </Card>

      {showAddModal && (
        <AddMovementModal
          categories={categoryNames}
          onAdd={(movement) => {
            const categoryId = getCategoryIdByName(movement.category || categoryNames[0])
            handleAddMovement({ ...movement, category_id: categoryId })
          }}
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
