import { create } from 'zustand'
import { statisticsApi, ApiError, type StatsResponse } from '../services/api'

interface StatisticsState {
  dailyStats: StatsResponse | null
  monthlyStats: StatsResponse | null
  yearlyStats: StatsResponse | null
  isLoading: boolean
  error: string | null
  fetchDailyStats: (date?: string) => Promise<void>
  fetchMonthlyStats: (month?: number, year?: number) => Promise<void>
  fetchYearlyStats: (year?: number) => Promise<void>
  clearError: () => void
}

export const useStatisticsStore = create<StatisticsState>()((set) => ({
  dailyStats: null,
  monthlyStats: null,
  yearlyStats: null,
  isLoading: false,
  error: null,

  fetchDailyStats: async (date?: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await statisticsApi.daily(date)
      set({
        dailyStats: response,
        isLoading: false,
      })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al cargar estadísticas diarias'
      set({ isLoading: false, error: message })
    }
  },

  fetchMonthlyStats: async (month?: number, year?: number) => {
    set({ isLoading: true, error: null })
    try {
      const response = await statisticsApi.monthly(month, year)
      set({
        monthlyStats: response,
        isLoading: false,
      })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al cargar estadísticas mensuales'
      set({ isLoading: false, error: message })
    }
  },

  fetchYearlyStats: async (year?: number) => {
    set({ isLoading: true, error: null })
    try {
      const response = await statisticsApi.yearly(year)
      set({
        yearlyStats: response,
        isLoading: false,
      })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al cargar estadísticas anuales'
      set({ isLoading: false, error: message })
    }
  },

  clearError: () => set({ error: null }),
}))
