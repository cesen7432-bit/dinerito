import { useState, useCallback } from 'react'

const DEFAULT_CATEGORIES = ['General', 'Salario', 'Comida', 'Servicios', 'Renta', 'Transporte', 'Entretenimiento', 'Otros']

export function useCategories(initialCategories = DEFAULT_CATEGORIES) {
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [editing, setEditing] = useState<string | null>(null)

  const addCategory = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed || categories.includes(trimmed)) return false
    setCategories(prev => [...prev, trimmed])
    return true
  }, [categories])

  const renameCategory = useCallback((oldName: string, newName: string) => {
    const trimmed = newName.trim()
    if (!trimmed || (trimmed !== oldName && categories.includes(trimmed))) return false
    setCategories(prev => prev.map(c => (c === oldName ? trimmed : c)))
    setEditing(null)
    return true
  }, [categories])

  const deleteCategory = useCallback((name: string) => {
    setCategories(prev => prev.filter(c => c !== name))
  }, [])

  const startEditing = useCallback((name: string) => {
    setEditing(name)
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
