import { useMemo } from 'react'
import type { CalendarEvent } from '../types'
import type { GoogleCalendarStore } from '../hooks/useGoogleCalendar'
import { addDays, todayISO } from '../lib/date'
import { pickEmptyCopy } from '../lib/emptyCopy'
import { ConnectCalendarCard } from '../components/calendar/ConnectCalendarCard'
import { CalendarPicker } from '../components/calendar/CalendarPicker'
import { ScheduleList } from '../components/calendar/ScheduleList'
import { SectionLabel } from '../components/ui/Primitives'

interface ScheduleViewProps {
  calendar: GoogleCalendarStore
  onAddTaskFromEvent: (event: CalendarEvent) => void
}

function groupKey(event: CalendarEvent): 'today' | 'tomorrow' | 'upcoming' {
  const startDay = event.start.slice(0, 10)
  if (startDay <= todayISO()) return 'today'
  if (startDay === addDays(todayISO(), 1)) return 'tomorrow'
  return 'upcoming'
}

export function ScheduleView({ calendar, onAddTaskFromEvent }: ScheduleViewProps) {
  const groups = useMemo(() => {
    const sorted = [...calendar.events].sort((a, b) => a.start.localeCompare(b.start))
    const g = { today: [] as CalendarEvent[], tomorrow: [] as CalendarEvent[], upcoming: [] as CalendarEvent[] }
    for (const e of sorted) g[groupKey(e)].push(e)
    return g
  }, [calendar.events])

  const connected = calendar.status === 'connected'

  return (
    <div>
      <h1 className="font-display mb-1 text-2xl" style={{ color: 'var(--ink)' }}>
        📎 Schedule
      </h1>
      <p className="font-hand mb-5 text-lg" style={{ color: 'var(--ink-dim)' }}>
        things already happening
      </p>

      <ConnectCalendarCard
        status={calendar.status}
        error={calendar.error}
        lastSyncedAt={calendar.lastSyncedAt}
        onConnect={calendar.connect}
        onDisconnect={calendar.disconnect}
        onSync={calendar.sync}
      />

      {connected && calendar.calendars.length > 0 && (
        <div className="mt-5 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
          <CalendarPicker calendars={calendar.calendars} selectedIds={calendar.selectedCalendarIds} onToggle={calendar.toggleCalendar} />
        </div>
      )}

      {connected && (
        <div className="mt-8 space-y-8">
          <div>
            <SectionLabel>TODAY</SectionLabel>
            <ScheduleList events={groups.today} emptyText={pickEmptyCopy('scheduleToday')} onAddTask={onAddTaskFromEvent} />
          </div>
          <div>
            <SectionLabel dim>TOMORROW</SectionLabel>
            <ScheduleList events={groups.tomorrow} emptyText={pickEmptyCopy('scheduleUpcoming')} onAddTask={onAddTaskFromEvent} />
          </div>
          <div>
            <SectionLabel dim>UPCOMING</SectionLabel>
            <ScheduleList events={groups.upcoming} emptyText={pickEmptyCopy('scheduleUpcoming')} onAddTask={onAddTaskFromEvent} />
          </div>
        </div>
      )}
    </div>
  )
}
