import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Movement, Totals } from '../types'

const INITIAL_MOVEMENTS: Movement[] = [
  { id: 1, type: 'ingreso', label: 'Salario', amount: 1200, date: '2024-12-01', category: 'Salario' },
  { id: 2, type: 'ingreso', label: 'Freelance', amount: 320, date: '2024-12-05', category: 'Otros' },
  { id: 3, type: 'egreso', label: 'Renta', amount: 500, date: '2024-12-02', category: 'Renta' },
  { id: 4, type: 'egreso', label: 'Supermercado', amount: 180, date: '2024-12-06', category: 'Comida' },
]

interface MovementsState {
  movements: Movement[]
  addMovement: (movement: Omit<Movement, 'id'>) => void
  deleteMovement: (id: number) => void
  updateMovement: (id: number, updates: Partial<Movement>) => void
  clearMovements: () => void
}

export const useMovementsStore = create<MovementsState>()(
  persist(
    (set) => ({
      movements: INITIAL_MOVEMENTS,
      addMovement: (movement) => set((state) => ({
        movements: [
          ...state.movements,
          { ...movement, id: Math.max(0, ...state.movements.map(m => m.id)) + 1 },
        ],
      })),
      deleteMovement: (id) => set((state) => ({
        movements: state.movements.filter(m => m.id !== id),
      })),
      updateMovement: (id, updates) => set((state) => ({
        movements: state.movements.map(m => m.id === id ? { ...m, ...updates } : m),
      })),
      clearMovements: () => set({ movements: [] }),
    }),
    {
      name: 'dinerito-movements',
    }
  )
)

// Selector para calcular totales (derivado del estado)
export const useTotals = (): Totals => {
  const movements = useMovementsStore(state => state.movements)
  const ingreso = movements
    .filter(m => m.type === 'ingreso')
    .reduce((sum, m) => sum + m.amount, 0)
  const egreso = movements
    .filter(m => m.type === 'egreso')
    .reduce((sum, m) => sum + m.amount, 0)
  return { ingreso, egreso, balance: ingreso - egreso }
}
