import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Movement, Totals } from '../types'
import { movementsApi, ApiError, type MovementResponse } from '../services/api'

// Convierte el tipo de la API al tipo local
const mapApiMovement = (m: MovementResponse): Movement => ({
  id: m.id,
  type: m.type === 'income' ? 'ingreso' : 'egreso',
  label: m.title,
  amount: typeof m.amount === 'string' ? parseFloat(m.amount) : m.amount,
  date: m.date,
  category: m.category?.name,
  category_id: m.category_id,
})

// Convierte el tipo local al tipo de la API
const mapToApiType = (type: 'ingreso' | 'egreso'): 'income' | 'expense' =>
  type === 'ingreso' ? 'income' : 'expense'

interface MovementsState {
  movements: Movement[]
  isLoading: boolean
  error: string | null
  fetchMovements: () => Promise<void>
  addMovement: (movement: Omit<Movement, 'id'> & { category_id: number }) => Promise<boolean>
  deleteMovement: (id: number) => Promise<boolean>
  updateMovement: (id: number, updates: Partial<Movement> & { category_id?: number }) => Promise<boolean>
  clearMovements: () => void
  clearError: () => void
}

export const useMovementsStore = create<MovementsState>()(
  persist(
    (set) => ({
      movements: [],
      isLoading: false,
      error: null,

      fetchMovements: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await movementsApi.getAll()
          set({
            movements: response.map(mapApiMovement),
            isLoading: false,
          })
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Error al cargar movimientos'
          set({ isLoading: false, error: message })
        }
      },

      addMovement: async (movement) => {
        set({ isLoading: true, error: null })
        try {
          const response = await movementsApi.create({
            category_id: movement.category_id,
            title: movement.label,
            type: mapToApiType(movement.type),
            amount: movement.amount,
            date: movement.date,
          })
          const newMovement = mapApiMovement(response)
          set((state) => ({
            movements: [...state.movements, newMovement],
            isLoading: false,
          }))
          return true
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Error al crear movimiento'
          set({ isLoading: false, error: message })
          return false
        }
      },

      deleteMovement: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await movementsApi.delete(id)
          set((state) => ({
            movements: state.movements.filter((m) => m.id !== id),
            isLoading: false,
          }))
          return true
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Error al eliminar movimiento'
          set({ isLoading: false, error: message })
          return false
        }
      },

      updateMovement: async (id, updates) => {
        set({ isLoading: true, error: null })
        try {
          const apiUpdates: Record<string, unknown> = {}
          if (updates.label !== undefined) apiUpdates.title = updates.label
          if (updates.type !== undefined) apiUpdates.type = mapToApiType(updates.type)
          if (updates.amount !== undefined) apiUpdates.amount = updates.amount
          if (updates.date !== undefined) apiUpdates.date = updates.date
          if (updates.category_id !== undefined) apiUpdates.category_id = updates.category_id

          const response = await movementsApi.update(id, apiUpdates as Parameters<typeof movementsApi.update>[1])
          const updatedMovement = mapApiMovement(response)
          set((state) => ({
            movements: state.movements.map((m) => (m.id === id ? updatedMovement : m)),
            isLoading: false,
          }))
          return true
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Error al actualizar movimiento'
          set({ isLoading: false, error: message })
          return false
        }
      },

      clearMovements: () => set({ movements: [] }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'dinerito-movements',
    }
  )
)

// Selector para calcular totales (derivado del estado)
export const useTotals = (): Totals => {
  const movements = useMovementsStore((state) => state.movements)
  const ingreso = movements
    .filter((m) => m.type === 'ingreso')
    .reduce((sum, m) => sum + (typeof m.amount === 'string' ? parseFloat(m.amount) : m.amount), 0)
  const egreso = movements
    .filter((m) => m.type === 'egreso')
    .reduce((sum, m) => sum + (typeof m.amount === 'string' ? parseFloat(m.amount) : m.amount), 0)
  return { ingreso, egreso, balance: ingreso - egreso }
}
