import type { GCalCalendar } from '../../types'

interface CalendarPickerProps {
  calendars: GCalCalendar[]
  selectedIds: string[]
  onToggle: (id: string) => void
}

export function CalendarPicker({ calendars, selectedIds, onToggle }: CalendarPickerProps) {
  if (calendars.length === 0) return null

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {calendars.map((cal) => (
        <label key={cal.id} className="flex cursor-pointer items-center gap-2 text-sm" style={{ color: 'var(--ink)' }}>
          <input
            type="checkbox"
            checked={selectedIds.includes(cal.id)}
            onChange={() => onToggle(cal.id)}
            className="accent-current"
            style={{ accentColor: cal.color }}
          />
          <span className="inline-block h-[8px] w-[8px] rounded-full" style={{ background: cal.color }} />
          {cal.name}
        </label>
      ))}
    </div>
  )
}
