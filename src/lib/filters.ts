import type { Importance, Task } from './../types'
import { isPast, isToday } from './date'

export type StatusFilter = 'all' | 'active' | 'completed'
export type DueFilter = 'any' | 'overdue' | 'today' | 'week' | 'none'
export type SortKey = 'due' | 'importance' | 'effort' | 'created'

export interface FilterState {
  query: string
  categoryIds: string[] // empty = all
  status: StatusFilter
  due: DueFilter
  importance: Importance | 'any'
  sort: SortKey
  sortDir: 'asc' | 'desc'
}

export const DEFAULT_FILTERS: FilterState = {
  query: '',
  categoryIds: [],
  status: 'all',
  due: 'any',
  importance: 'any',
  sort: 'due',
  sortDir: 'asc',
}

const importanceScore: Record<Importance, number> = { high: 2, medium: 1, low: 0 }

function withinWeek(iso: string): boolean {
  const d = new Date(iso + 'T00:00:00')
  const now = new Date()
  const diff = (d.getTime() - new Date(now.toDateString()).getTime()) / 86400000
  return diff >= 0 && diff <= 7
}

export function applyFilters(tasks: Task[], f: FilterState): Task[] {
  let result = tasks.filter((t) => {
    if (f.status === 'active' && t.completed) return false
    if (f.status === 'completed' && !t.completed) return false

    if (f.categoryIds.length > 0 && (!t.categoryId || !f.categoryIds.includes(t.categoryId))) return false

    if (f.importance !== 'any' && t.importance !== f.importance) return false

    if (f.due !== 'any') {
      if (f.due === 'none' && t.dueDate) return false
      if (f.due === 'overdue' && !(t.dueDate && isPast(t.dueDate))) return false
      if (f.due === 'today' && !(t.dueDate && isToday(t.dueDate))) return false
      if (f.due === 'week' && !(t.dueDate && withinWeek(t.dueDate))) return false
    }

    if (f.query.trim()) {
      const q = f.query.trim().toLowerCase()
      const hay = `${t.title} ${t.description ?? ''}`.toLowerCase()
      if (!hay.includes(q)) return false
    }

    return true
  })

  const dir = f.sortDir === 'asc' ? 1 : -1
  result = result.slice().sort((a, b) => {
    switch (f.sort) {
      case 'importance':
        return (importanceScore[b.importance] - importanceScore[a.importance]) * dir
      case 'effort':
        return (a.effortMinutes - b.effortMinutes) * dir
      case 'created':
        return (a.createdAt.localeCompare(b.createdAt)) * dir
      case 'due':
      default: {
        const ad = a.dueDate ?? '9999-99-99'
        const bd = b.dueDate ?? '9999-99-99'
        return ad.localeCompare(bd) * dir
      }
    }
  })

  return result
}
