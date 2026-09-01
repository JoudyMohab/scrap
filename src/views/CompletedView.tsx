import { useMemo, useState } from 'react'
import type { Category, Task } from '../types'
import { DEFAULT_FILTERS, applyFilters, type FilterState } from '../lib/filters'
import { pickEmptyCopy } from '../lib/emptyCopy'
import { FilterBar } from '../components/filters/FilterBar'
import { TaskList } from '../components/tasks/TaskList'

interface CompletedViewProps {
  tasks: Task[]
  categories: Category[]
  categoryById: Map<string, Category>
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, dueDate: string | null) => void
}

export function CompletedView({ tasks, categories, categoryById, onToggle, onEdit, onDelete, onMove }: CompletedViewProps) {
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS, status: 'completed', sort: 'created', sortDir: 'desc' })

  const base = useMemo(() => tasks.filter((t) => t.completed), [tasks])
  const filtered = useMemo(() => applyFilters(base, filters), [base, filters])

  return (
    <div>
      <h1 className="font-display mb-5 text-2xl" style={{ color: 'var(--ink)' }}>
        Completed
      </h1>
      <div className="mb-6">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          categories={categories}
          show={{ status: false, due: false, importance: false }}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="font-hand py-14 text-center text-xl" style={{ color: 'var(--ink-dim)' }}>
          {pickEmptyCopy('completed')}
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
