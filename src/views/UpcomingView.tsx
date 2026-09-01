import { useMemo, useState } from 'react'
import type { Category, Task } from '../types'
import { addDays, isFuture, todayISO } from '../lib/date'
import { DEFAULT_FILTERS, applyFilters, type FilterState } from '../lib/filters'
import { pickEmptyCopy } from '../lib/emptyCopy'
import { FilterBar } from '../components/filters/FilterBar'
import { TaskList } from '../components/tasks/TaskList'
import { SectionLabel } from '../components/ui/Primitives'

interface UpcomingViewProps {
  tasks: Task[]
  categories: Category[]
  categoryById: Map<string, Category>
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, dueDate: string | null) => void
}

export function UpcomingView({ tasks, categories, categoryById, onToggle, onEdit, onDelete, onMove }: UpcomingViewProps) {
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS, status: 'active' })

  const base = useMemo(() => tasks.filter((t) => !t.completed && t.dueDate && isFuture(t.dueDate)), [tasks])
  const filtered = useMemo(() => applyFilters(base, filters), [base, filters])

  const tomorrow = addDays(todayISO(), 1)
  const weekEnd = addDays(todayISO(), 7)

  const groups = useMemo(() => {
    const g = { tomorrow: [] as Task[], week: [] as Task[], later: [] as Task[] }
    for (const t of filtered) {
      if (t.dueDate === tomorrow) g.tomorrow.push(t)
      else if (t.dueDate! <= weekEnd) g.week.push(t)
      else g.later.push(t)
    }
    return g
  }, [filtered, tomorrow, weekEnd])

  return (
    <div>
      <h1 className="font-display mb-5 text-2xl" style={{ color: 'var(--ink)' }}>
        Upcoming
      </h1>
      <div className="mb-6">
        <FilterBar filters={filters} onChange={setFilters} categories={categories} show={{ status: false, due: false }} />
      </div>

      {filtered.length === 0 ? (
        <p className="font-hand py-14 text-center text-xl" style={{ color: 'var(--ink-dim)' }}>
          {pickEmptyCopy('upcoming')}
        </p>
      ) : (
        <div className="space-y-8">
          {groups.tomorrow.length > 0 && (
            <div>
              <SectionLabel dim>TOMORROW</SectionLabel>
              <TaskList
                tasks={groups.tomorrow}
                categoryById={categoryById}
                emptyText=""
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
              />
            </div>
          )}
          {groups.week.length > 0 && (
            <div>
              <SectionLabel dim>THIS WEEK</SectionLabel>
              <TaskList
                tasks={groups.week}
                categoryById={categoryById}
                emptyText=""
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
              />
            </div>
          )}
          {groups.later.length > 0 && (
            <div>
              <SectionLabel dim>LATER</SectionLabel>
              <TaskList
                tasks={groups.later}
                categoryById={categoryById}
                emptyText=""
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
