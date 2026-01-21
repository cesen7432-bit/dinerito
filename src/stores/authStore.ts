import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string) => set({
        user: { email, name: email.split('@')[0] },
        isAuthenticated: true,
      }),
      logout: () => set({
        user: null,
        isAuthenticated: false,
      }),
    }),
    {
      name: 'dinerito-auth',
    }
  )
)
