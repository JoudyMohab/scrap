import { MOODS } from '../../lib/moods'
import type { MoodKey } from '../../types'

export function StatePicker({ selected, onSelect }: { selected: MoodKey | null; onSelect: (m: MoodKey | null) => void }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {MOODS.map((m) => {
        const active = selected === m.key
        return (
          <button
            key={m.key}
            onClick={() => onSelect(active ? null : m.key)}
            className="flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-all active:scale-95"
            style={{
              borderColor: active ? 'var(--accent)' : 'var(--line)',
              background: active ? 'var(--accent-soft)' : 'var(--bg-1)',
              color: active ? 'var(--ink)' : 'var(--ink-dim)',
              boxShadow: active ? 'var(--shadow-pop)' : 'none',
            }}
          >
            <span className="text-base leading-none">{m.emoji}</span>
            <span className="font-medium tracking-wide uppercase text-xs">{m.label}</span>
          </button>
        )
      })}
    </div>
  )
}
