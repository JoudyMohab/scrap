import type { CalendarEvent } from '../../types'
import { formatEventRange } from '../../lib/date'

interface ScheduleAgendaItemProps {
  event: CalendarEvent
  onAddTask?: (event: CalendarEvent) => void
}

export function ScheduleAgendaItem({ event, onAddTask }: ScheduleAgendaItemProps) {
  const timeLabel = event.allDay ? 'all day' : event.start.slice(11, 16)

  return (
    <div className="group flex items-start gap-3 border-b py-3.5 last:border-none" style={{ borderColor: 'var(--line)' }}>
      <div className="w-14 shrink-0 pt-0.5 text-right text-[12.5px] font-medium" style={{ color: 'var(--ink-dim)' }}>
        {timeLabel}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] leading-snug" style={{ color: 'var(--ink)' }}>
          <span className="mr-1.5" aria-hidden>
            📎
          </span>
          {event.title}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px]" style={{ color: 'var(--ink-dim)' }}>
          <span className="inline-block h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: event.color }} />
          <span>{event.calendarName}</span>
          <span>·</span>
          <span>{event.allDay ? 'all day' : formatEventRange(event.start, event.end, event.multiDay)}</span>
          {event.location && (
            <>
              <span>·</span>
              <span className="truncate">{event.location}</span>
            </>
          )}
        </div>
      </div>

      {onAddTask && (
        <button
          type="button"
          onClick={() => onAddTask(event)}
          className="shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
          style={{ borderColor: 'var(--line)', color: 'var(--ink-dim)' }}
        >
          + task
        </button>
      )}
    </div>
  )
}
