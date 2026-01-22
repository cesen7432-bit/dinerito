const API_URL = 'http://172.20.1.124:8000/api'
const TOKEN_KEY = 'dinerito-token'

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}

// Token management
export const tokenManager = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
}

class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}, requiresAuth = true): Promise<T> {
  const requestHeaders: Record<string, string> = { ...headers }

  // Add Authorization header if token exists and auth is required
  if (requiresAuth) {
    const token = tokenManager.getToken()
    console.log('[API] Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN')
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...requestHeaders, ...options.headers },
  })

  if (response.status === 204) return true as T
  if (response.status === 401) {
    tokenManager.clearToken()
    throw new ApiError(401, 'No autenticado')
  }
  if (response.status === 403) throw new ApiError(403, 'No autorizado')
  if (response.status === 422) {
    const data = await response.json()
    throw new ApiError(422, data.message || 'Error de validación')
  }
  if (!response.ok) {
    throw new ApiError(response.status, 'Error en la petición')
  }

  return response.json()
}

// ============ Auth ============

export interface LoginResponse {
  user: {
    id: number
    name: string
    email: string
  }
  token: string
}

export interface RegisterResponse {
  user: {
    id: number
    name: string
    email: string
  }
  token: string
}

export const authApi = {
  register: async (name: string, email: string, password: string) => {
    const response = await request<RegisterResponse>('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation: password }),
    }, false)
    console.log('[API] Register response token:', response.token)
    tokenManager.setToken(response.token)
    console.log('[API] Token saved, verifying:', tokenManager.getToken())
    return response
  },

  login: async (email: string, password: string) => {
    const response = await request<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false)
    console.log('[API] Login response token:', response.token)
    tokenManager.setToken(response.token)
    console.log('[API] Token saved, verifying:', tokenManager.getToken())
    return response
  },

  logout: async () => {
    try {
      await request<boolean>('/logout', { method: 'POST' })
    } finally {
      tokenManager.clearToken()
    }
    return true
  },

  updateUsername: (name: string) =>
    request<{ user: { name: string } }>('/user/username', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),
}

// ============ Categories ============

export interface Category {
  id: number
  name: string
  user_id: number
}


export const categoriesApi = {
  getAll: (user_id?: number) =>
    request<Category[]>(user_id ? `/categories?user_id=${user_id}` : '/categories'),

  getById: (id: number) =>
    request<Category>(`/categories/${id}`),

  create: (name: string) =>
    request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  update: (id: number, name: string) =>
    request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),

  delete: (id: number) =>
    request<boolean>(`/categories/${id}`, { method: 'DELETE' }),
}

// ============ Movements ============

export interface MovementData {
  category_id: number
  title: string
  type: 'income' | 'expense'
  amount: number
  date: string
}

export interface MovementResponse {
  id: number
  user_id: number
  category_id: number
  title: string
  type: 'income' | 'expense'
  amount: number
  date: string
  category: Category
}

export const movementsApi = {
  getAll: () =>
    request<MovementResponse[]>('/movements'),

  getById: (id: number) =>
    request<MovementResponse>(`/movements/${id}`),

  create: (data: MovementData) =>
    request<MovementResponse>('/movements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<MovementData>) =>
    request<MovementResponse>(`/movements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<boolean>(`/movements/${id}`, { method: 'DELETE' }),
}

// ============ Statistics ============

export interface StatsResponse {
  income: number
  expense: number
  balance: number
  movements: MovementResponse[]
}

export const statisticsApi = {
  daily: (date?: string) =>
    request<StatsResponse>(`/statistics/daily${date ? `?date=${date}` : ''}`),

  monthly: (month?: number, year?: number) => {
    const params = new URLSearchParams()
    if (month) params.append('month', month.toString())
    if (year) params.append('year', year.toString())
    const query = params.toString()
    return request<StatsResponse>(`/statistics/monthly${query ? `?${query}` : ''}`)
  },

  yearly: (year?: number) =>
    request<StatsResponse>(`/statistics/yearly${year ? `?year=${year}` : ''}`),
}

// Export all APIs
export const api = {
  auth: authApi,
  categories: categoriesApi,
  movements: movementsApi,
  statistics: statisticsApi,
}

export { ApiError }
