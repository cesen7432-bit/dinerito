import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import { authApi, ApiError } from '../services/api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  updateUsername: (name: string) => Promise<boolean>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.login(email, password)
          console.log(response)
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          })
          return true
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Error al iniciar sesión'
          set({ isLoading: false, error: message })
          return false
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.register(name, email, password)
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          })
          return true
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Error al registrarse'
          set({ isLoading: false, error: message })
          return false
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await authApi.logout()
        } catch {
          // Ignorar errores de logout
        }
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      updateUsername: async (name: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.updateUsername(name)
          set((state) => ({
            user: state.user ? { ...state.user, name: response.user.name } : null,
            isLoading: false,
          }))
          return true
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Error al actualizar nombre'
          set({ isLoading: false, error: message })
          return false
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'dinerito-auth',
    }
  )
)
