import type { ReactNode } from 'react'
import type { Category, ViewKey } from '../../types'
import { Sticker } from '../stickers/Sticker'
import { DeskDecor } from './DeskDecor'

const NAV: { key: ViewKey; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'completed', label: 'Completed' },
  { key: 'all', label: 'All Tasks' },
]

const SunIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <circle cx="10" cy="10" r="3.4" />
    <path
      strokeLinecap="round"
      d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4M15.3 15.3l-1.4-1.4M6.1 6.1 4.7 4.7"
    />
  </svg>
)
const MoonIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <path d="M16 12.5A6.5 6.5 0 0 1 7.5 4 6.5 6.5 0 1 0 16 12.5Z" strokeLinejoin="round" />
  </svg>
)
const TagIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <path d="M10.5 3.5h4c1 0 1.5.5 1.5 1.5v4c0 .5-.2 1-.5 1.3l-7 7c-.6.6-1.5.6-2 0l-4-4c-.6-.5-.6-1.4 0-2l7-7c.3-.3.8-.5 1-.8Z" strokeLinejoin="round" />
    <circle cx="13" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>
)
const PlusIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M10 4v12M4 10h12" strokeLinecap="round" />
  </svg>
)

interface AppShellProps {
  active: ViewKey
  onNavigate: (v: ViewKey) => void
  counts: Record<ViewKey, number>
  categories: Category[]
  categoryCounts: Map<string, number>
  onFilterCategory: (id: string) => void
  onAddTask: () => void
  onManageCategories: () => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
  children: ReactNode
}

export function AppShell({
  active,
  onNavigate,
  counts,
  categories,
  categoryCounts,
  onFilterCategory,
  onAddTask,
  onManageCategories,
  theme,
  onToggleTheme,
  children,
}: AppShellProps) {
  return (
    <div className="relative min-h-screen md:flex" style={{ background: 'var(--bg-0)' }}>
      <div className="grain" />

      {/* desktop sidebar */}
      <aside
        className="relative z-10 hidden w-64 shrink-0 flex-col border-r px-5 py-6 md:sticky md:top-0 md:flex md:h-screen md:overflow-y-auto"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="mb-8 flex items-center gap-2">
          <span
            className="font-display -rotate-2 rounded-sm border px-2 py-0.5 text-xl italic"
            style={{ borderColor: 'var(--line-strong)', color: 'var(--ink)' }}
          >
            scraps.
          </span>
        </div>

        <button
          onClick={onAddTask}
          className="mb-7 flex items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-medium transition-transform active:scale-95"
          style={{ background: 'var(--accent)', color: 'var(--color-paper)' }}
        >
          <PlusIcon /> new task
        </button>

        <nav className="space-y-0.5">
          {NAV.map((n) => {
            const on = active === n.key
            return (
              <button
                key={n.key}
                onClick={() => onNavigate(n.key)}
                className="flex w-full items-center justify-between border-l-2 px-3 py-2 text-left text-sm transition-colors"
                style={{
                  borderColor: on ? 'var(--accent)' : 'transparent',
                  color: on ? 'var(--ink)' : 'var(--ink-dim)',
                  fontWeight: on ? 600 : 400,
                }}
              >
                {n.label}
                <span className="text-xs" style={{ color: 'var(--ink-dim)' }}>
                  {counts[n.key] > 0 ? counts[n.key] : ''}
                </span>
              </button>
            )
          })}
        </nav>

        <div className="mt-8 border-t pt-5" style={{ borderColor: 'var(--line)' }}>
          <p className="mb-2.5 px-3 text-xs tracking-[0.2em]" style={{ color: 'var(--ink-dim)' }}>
            CATEGORIES
          </p>
          <div className="space-y-0.5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => onFilterCategory(c.id)}
                className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm hover:bg-[var(--line)]/30"
                style={{ color: 'var(--ink-dim)' }}
              >
                <Sticker icon={c.icon} hue={c.hue} seed={c.id} size={20} />
                <span className="truncate">{c.name}</span>
                <span className="ml-auto text-xs">{categoryCounts.get(c.id) || ''}</span>
              </button>
            ))}
            <button
              onClick={onManageCategories}
              className="mt-1 w-full rounded-md px-3 py-1.5 text-left text-xs"
              style={{ color: 'var(--ink-dim)' }}
            >
              manage categories…
            </button>
          </div>
        </div>

        <button
          onClick={onToggleTheme}
          className="mt-auto flex items-center gap-2 self-start rounded-full border px-3 py-1.5 text-xs"
          style={{ borderColor: 'var(--line)', color: 'var(--ink-dim)' }}
        >
          {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
          {theme === 'dark' ? 'dark' : 'light'} mode
        </button>
      </aside>

      {/* mobile top nav */}
      <div
        className="sticky top-0 z-20 flex items-center gap-1 overflow-x-auto border-b px-3 py-2.5 md:hidden"
        style={{ background: 'var(--bg-0)', borderColor: 'var(--line)' }}
      >
        <span className="font-display -rotate-2 mr-2 shrink-0 text-lg italic" style={{ color: 'var(--ink)' }}>
          scraps.
        </span>
        {NAV.map((n) => {
          const on = active === n.key
          return (
            <button
              key={n.key}
              onClick={() => onNavigate(n.key)}
              className="shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm"
              style={{
                background: on ? 'var(--accent-soft)' : 'transparent',
                color: on ? 'var(--ink)' : 'var(--ink-dim)',
                fontWeight: on ? 600 : 400,
              }}
            >
              {n.label}
            </button>
          )
        })}
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <button onClick={onManageCategories} className="p-1.5 text-xs" style={{ color: 'var(--ink-dim)' }} title="manage categories">
            <TagIcon />
          </button>
          <button onClick={onToggleTheme} className="p-1.5" style={{ color: 'var(--ink-dim)' }}>
            {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </div>

      <main className="relative z-10 flex-1 px-4 pb-28 pt-8 sm:px-8 md:px-10 md:pb-16 xl:px-16">
        <DeskDecor />
        <div className="max-w-2xl">{children}</div>
      </main>

      <button
        onClick={onAddTask}
        className="fixed bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full shadow-lg md:hidden"
        style={{ background: 'var(--accent)', color: 'var(--color-paper)', boxShadow: 'var(--shadow-pop)' }}
      >
        <span className="text-2xl leading-none">+</span>
      </button>
    </div>
  )
}
