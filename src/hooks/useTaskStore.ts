import { useCallback, useMemo } from 'react'
import { DEFAULT_CATEGORIES, buildSeedTasks } from '../data/seed'
import { useLocalStorage } from './useLocalStorage'
import type { Category, IconKey, Task } from '../types'

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export type NewTaskInput = Omit<Task, 'id' | 'completed' | 'completedAt' | 'createdAt'>

export function useTaskStore() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tm.tasks', buildSeedTasks)
  const [categories, setCategories] = useLocalStorage<Category[]>('tm.categories', () => DEFAULT_CATEGORIES)

  const addTask = useCallback(
    (input: NewTaskInput) => {
      const task: Task = {
        ...input,
        id: uid('task'),
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
      }
      setTasks((prev) => [task, ...prev])
      return task.id
    },
    [setTasks],
  )

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    },
    [setTasks],
  )

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    },
    [setTasks],
  )

  const toggleComplete = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : null }
            : t,
        ),
      )
    },
    [setTasks],
  )

  const moveTask = useCallback(
    (id: string, dueDate: string | null) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, dueDate } : t)))
    },
    [setTasks],
  )

  const addCategory = useCallback(
    (name: string, icon: IconKey, hue: string) => {
      const cat: Category = { id: uid('cat'), name, icon, hue }
      setCategories((prev) => [...prev, cat])
      return cat.id
    },
    [setCategories],
  )

  const updateCategory = useCallback(
    (id: string, patch: Partial<Category>) => {
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
    },
    [setCategories],
  )

  const deleteCategory = useCallback(
    (id: string) => {
      setCategories((prev) => prev.filter((c) => c.id !== id))
      setTasks((prev) => prev.map((t) => (t.categoryId === id ? { ...t, categoryId: null } : t)))
    },
    [setCategories, setTasks],
  )

  const categoryById = useMemo(() => {
    const map = new Map<string, Category>()
    for (const c of categories) map.set(c.id, c)
    return map
  }, [categories])

  return {
    tasks,
    categories,
    categoryById,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    moveTask,
    addCategory,
    updateCategory,
    deleteCategory,
  }
}

export type TaskStore = ReturnType<typeof useTaskStore>
