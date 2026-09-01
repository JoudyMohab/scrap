import { useRef, useState } from 'react'
import type { Category } from '../../types'
import type { DueFilter, FilterState, SortKey, StatusFilter } from '../../lib/filters'
import { useClickOutside } from '../../hooks/useClickOutside'
import { Sticker } from '../stickers/Sticker'

const STATUS_OPTS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'all' },
  { key: 'active', label: 'active' },
  { key: 'completed', label: 'done' },
]

const DUE_OPTS: { key: DueFilter; label: string }[] = [
  { key: 'any', label: 'any date' },
  { key: 'overdue', label: 'overdue' },
  { key: 'today', label: 'today' },
  { key: 'week', label: 'this week' },
  { key: 'none', label: 'no date' },
]

const SORT_OPTS: { key: SortKey; label: string }[] = [
  { key: 'due', label: 'due date' },
  { key: 'importance', label: 'importance' },
  { key: 'effort', label: 'effort' },
  { key: 'created', label: 'created' },
]

interface FilterBarControls {
  status?: boolean
  due?: boolean
  importance?: boolean
}

export function FilterBar({
  filters,
  onChange,
  categories,
  show = { status: true, due: true, importance: true },
}: {
  filters: FilterState
  onChange: (f: FilterState) => void
  categories: Category[]
  show?: FilterBarControls
}) {
  const [catOpen, setCatOpen] = useState(false)
  const catRef = useRef<HTMLDivElement>(null)
  useClickOutside(catRef, () => setCatOpen(false), catOpen)

  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) => onChange({ ...filters, [k]: v })

  const toggleCategory = (id: string) => {
    const next = filters.categoryIds.includes(id)
      ? filters.categoryIds.filter((c) => c !== id)
      : [...filters.categoryIds, id]
    set('categoryIds', next)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pb-1">
      <div className="relative min-w-[160px] flex-1">
        <input
          value={filters.query}
          onChange={(e) => set('query', e.target.value)}
          placeholder="search tasks..."
          className="w-full rounded-full border bg-transparent px-4 py-2 text-sm outline-none"
          style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
        />
      </div>

      <div className="relative" ref={catRef}>
        <button
          onClick={() => setCatOpen((o) => !o)}
          className="rounded-full border px-3 py-2 text-sm"
          style={{
            borderColor: filters.categoryIds.length ? 'var(--accent)' : 'var(--line)',
            color: filters.categoryIds.length ? 'var(--ink)' : 'var(--ink-dim)',
          }}
        >
          category {filters.categoryIds.length ? `(${filters.categoryIds.length})` : ''}
        </button>
        {catOpen && (
          <div
            className="absolute left-0 top-full z-30 mt-1.5 w-56 rounded-lg border p-2"
            style={{ background: 'var(--bg-1)', borderColor: 'var(--line)', boxShadow: 'var(--shadow-pop)' }}
          >
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => toggleCategory(c.id)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-[var(--accent-soft)]"
                style={{ color: 'var(--ink)' }}
              >
                <input type="checkbox" readOnly checked={filters.categoryIds.includes(c.id)} className="accent-current" />
                <Sticker icon={c.icon} hue={c.hue} seed={c.id} size={18} />
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {show.due && (
        <select
          value={filters.due}
          onChange={(e) => set('due', e.target.value as DueFilter)}
          className="rounded-full border bg-transparent px-3 py-2 text-sm outline-none"
          style={{ borderColor: 'var(--line)', color: 'var(--ink-dim)' }}
        >
          {DUE_OPTS.map((o) => (
            <option key={o.key} value={o.key} style={{ color: 'black' }}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      {show.importance && (
        <select
          value={filters.importance}
          onChange={(e) => set('importance', e.target.value as FilterState['importance'])}
          className="rounded-full border bg-transparent px-3 py-2 text-sm outline-none"
          style={{ borderColor: 'var(--line)', color: 'var(--ink-dim)' }}
        >
          <option value="any" style={{ color: 'black' }}>
            any importance
          </option>
          <option value="high" style={{ color: 'black' }}>
            high
          </option>
          <option value="medium" style={{ color: 'black' }}>
            medium
          </option>
          <option value="low" style={{ color: 'black' }}>
            low
          </option>
        </select>
      )}

      <select
        value={filters.sort}
        onChange={(e) => set('sort', e.target.value as SortKey)}
        className="rounded-full border bg-transparent px-3 py-2 text-sm outline-none"
        style={{ borderColor: 'var(--line)', color: 'var(--ink-dim)' }}
      >
        {SORT_OPTS.map((o) => (
          <option key={o.key} value={o.key} style={{ color: 'black' }}>
            sort: {o.label}
          </option>
        ))}
      </select>

      <button
        onClick={() => set('sortDir', filters.sortDir === 'asc' ? 'desc' : 'asc')}
        className="rounded-full border px-2.5 py-2 text-sm"
        style={{ borderColor: 'var(--line)', color: 'var(--ink-dim)' }}
        title="toggle sort direction"
      >
        {filters.sortDir === 'asc' ? '↑' : '↓'}
      </button>

      {show.status && (
      <div className="ml-auto inline-flex rounded-full border p-1" style={{ borderColor: 'var(--line)' }}>
        {STATUS_OPTS.map((o) => (
          <button
            key={o.key}
            onClick={() => set('status', o.key)}
            className="rounded-full px-3 py-1 text-sm capitalize"
            style={{
              background: filters.status === o.key ? 'var(--accent)' : 'transparent',
              color: filters.status === o.key ? 'var(--color-paper)' : 'var(--ink-dim)',
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      )}
    </div>
  )
}
