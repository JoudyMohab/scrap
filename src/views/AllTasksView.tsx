import { useMemo, useState } from 'react'
import type { Category, Task } from '../types'
import { DEFAULT_FILTERS, applyFilters } from '../lib/filters'
import { pickEmptyCopy } from '../lib/emptyCopy'
import { FilterBar } from '../components/filters/FilterBar'
import { TaskList } from '../components/tasks/TaskList'

interface AllTasksViewProps {
  tasks: Task[]
  categories: Category[]
  categoryById: Map<string, Category>
  initialFilters?: Partial<typeof DEFAULT_FILTERS>
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, dueDate: string | null) => void
}

export function AllTasksView({
  tasks,
  categories,
  categoryById,
  initialFilters,
  onToggle,
  onEdit,
  onDelete,
  onMove,
}: AllTasksViewProps) {
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initialFilters })

  const filtered = useMemo(() => applyFilters(tasks, filters), [tasks, filters])

  return (
    <div>
      <h1 className="font-display mb-5 text-2xl" style={{ color: 'var(--ink)' }}>
        All Tasks
      </h1>
      <div className="mb-6">
        <FilterBar filters={filters} onChange={setFilters} categories={categories} />
      </div>

      {filtered.length === 0 ? (
        <p className="font-hand py-14 text-center text-xl" style={{ color: 'var(--ink-dim)' }}>
          {filters.query ? pickEmptyCopy('search') : pickEmptyCopy('all')}
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
