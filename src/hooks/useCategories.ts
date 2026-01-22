

import { useState, useCallback } from 'react'
import type { Category } from '../types'

const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'General', user_id: 0 },
  { name: 'Salario', user_id: 0 },
  { name: 'Comida', user_id: 0 },
  { name: 'Servicios', user_id: 0 },
  { name: 'Renta', user_id: 0 },
  { name: 'Transporte', user_id: 0 },
  { name: 'Entretenimiento', user_id: 0 },
  { name: 'Otros', user_id: 0 },
]


export function useCategories(initialCategories: Category[] = []) {
  const [categories, setCategories] = useState<Category[]>(initialCategories.length ? initialCategories : DEFAULT_CATEGORIES.map((c, idx) => ({ ...c, id: idx + 1 })))
  const [editing, setEditing] = useState<number | null>(null)

  const addCategory = useCallback((name: string, user_id: number) => {
    const trimmed = name.trim()
    if (!trimmed || categories.some((c: Category) => c.name === trimmed && c.user_id === user_id)) return false
    setCategories((prev: Category[]) => [
      ...prev,
      { id: Math.max(0, ...prev.map((c: Category) => c.id)) + 1, name: trimmed, user_id },
    ])
    return true
  }, [categories])

  const renameCategory = useCallback((id: number, newName: string) => {
    const trimmed = newName.trim()
    if (!trimmed || categories.some((c: Category) => c.name === trimmed && c.id !== id)) return false
    setCategories((prev: Category[]) => prev.map((c: Category) => (c.id === id ? { ...c, name: trimmed } : c)))
    setEditing(null)
    return true
  }, [categories])

  const deleteCategory = useCallback((id: number) => {
    setCategories((prev: Category[]) => prev.filter((c: Category) => c.id !== id))
  }, [])

  const startEditing = useCallback((id: number) => {
    setEditing(id)
  }, [])

  const cancelEditing = useCallback(() => {
    setEditing(null)
  }, [])

  return {
    categories,
    editing,
    addCategory,
    renameCategory,
    deleteCategory,
    startEditing,
    cancelEditing,
  }
}
