import { useMemo, useState } from 'react'
import type { Category, Task } from '../types'
import { isPast } from '../lib/date'
import { DEFAULT_FILTERS, applyFilters, type FilterState } from '../lib/filters'
import { pickEmptyCopy } from '../lib/emptyCopy'
import { FilterBar } from '../components/filters/FilterBar'
import { TaskList } from '../components/tasks/TaskList'

interface OverdueViewProps {
  tasks: Task[]
  categories: Category[]
  categoryById: Map<string, Category>
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, dueDate: string | null) => void
}

export function OverdueView({ tasks, categories, categoryById, onToggle, onEdit, onDelete, onMove }: OverdueViewProps) {
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS, status: 'active' })

  const base = useMemo(() => tasks.filter((t) => !t.completed && t.dueDate && isPast(t.dueDate)), [tasks])
  const filtered = useMemo(() => applyFilters(base, filters), [base, filters])

  return (
    <div>
      <h1 className="font-display mb-1 text-2xl" style={{ color: 'var(--ink)' }}>
        Overdue
      </h1>
      <p className="font-hand mb-5 text-lg" style={{ color: 'var(--accent)' }}>
        these ones got away — no big deal
      </p>
      <div className="mb-6">
        <FilterBar filters={filters} onChange={setFilters} categories={categories} show={{ status: false, due: false }} />
      </div>

      {filtered.length === 0 ? (
        <p className="font-hand py-14 text-center text-xl" style={{ color: 'var(--ink-dim)' }}>
          {pickEmptyCopy('overdue')}
        </p>
      ) : (
        <TaskList
          tasks={filtered}
          categoryById={categoryById}
          emptyText=""
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
        />
      )}
    </div>
  )
}
