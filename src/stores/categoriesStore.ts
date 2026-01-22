import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Category } from '../types'
import { categoriesApi, ApiError } from '../services/api'

interface CategoriesState {
  categories: Category[]
  isLoading: boolean
  error: string | null
  fetchCategories: () => Promise<void>
  addCategory: (name: string) => Promise<boolean>
  updateCategory: (id: number, name: string) => Promise<boolean>
  deleteCategory: (id: number) => Promise<boolean>
  clearError: () => void
}

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set) => ({
      categories: [],
      isLoading: false,
      error: null,

      fetchCategories: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await categoriesApi.getAll()
          set({
            categories: response,
            isLoading: false,
          })
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Error al cargar categorías'
          set({ isLoading: false, error: message })
        }
      },

      addCategory: async (name: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await categoriesApi.create(name)
          set((state) => ({
            categories: [...state.categories, response],
            isLoading: false,
          }))
          return true
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Error al crear categoría'
          set({ isLoading: false, error: message })
          return false
        }
      },

      updateCategory: async (id: number, name: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await categoriesApi.update(id, name)
          set((state) => ({
            categories: state.categories.map((c) => (c.id === id ? response : c)),
            isLoading: false,
          }))
          return true
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Error al actualizar categoría'
          set({ isLoading: false, error: message })
          return false
        }
      },

      deleteCategory: async (id: number) => {
        set({ isLoading: true, error: null })
        try {
          await categoriesApi.delete(id)
          set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
            isLoading: false,
          }))
          return true
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Error al eliminar categoría'
          set({ isLoading: false, error: message })
          return false
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'dinerito-categories',
    }
  )
)
