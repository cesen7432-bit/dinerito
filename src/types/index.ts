export type MovementType = 'ingreso' | 'egreso'

export interface Movement {
  id: number
  type: MovementType
  label: string
  amount: number
  date: string
  category?: string
  category_id?: number
}

export interface Totals {
  ingreso: number
  egreso: number
  balance: number
}

export interface User {
  id?: number
  email: string
  name?: string
}

export interface Category {
  id: number
  name: string
  user_id: number
}
