export type MovementType = 'ingreso' | 'egreso'

export interface Movement {
  id: number
  type: MovementType
  label: string
  amount: number
  date: string
  category?: string
}

export interface Totals {
  ingreso: number
  egreso: number
  balance: number
}

export interface User {
  email: string
  name?: string
}
