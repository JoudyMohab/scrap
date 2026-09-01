import { useMemo, useState } from 'react'
import type { CalendarEvent, Category, MoodKey, Task } from '../types'
import type { GoogleCalendarStore } from '../hooks/useGoogleCalendar'
import { isPast, isToday, todayISO } from '../lib/date'
import { MOOD_EMPTY_COPY, tasksForMood } from '../lib/moods'
import { computeAvailability, captionForMood } from '../lib/freeTime'
import { pickEmptyCopy } from '../lib/emptyCopy'
import { TodayHero } from '../components/today/TodayHero'
import { StatePicker } from '../components/today/StatePicker'
import { TaskList } from '../components/tasks/TaskList'
import { ScheduleList } from '../components/calendar/ScheduleList'
import { ConnectCalendarCard } from '../components/calendar/ConnectCalendarCard'
import { SectionLabel } from '../components/ui/Primitives'

const importanceScore = { high: 2, medium: 1, low: 0 }

interface TodayViewProps {
  name: string
  tasks: Task[]
  categoryById: Map<string, Category>
  calendar: GoogleCalendarStore
  onAddTaskFromEvent: (event: CalendarEvent) => void
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, dueDate: string | null) => void
}

export function TodayView({
  name,
  tasks,
  categoryById,
  calendar,
  onAddTaskFromEvent,
  onToggle,
  onEdit,
  onDelete,
  onMove,
}: TodayViewProps) {
  const [mood, setMood] = useState<MoodKey | null>(null)

  const todayTasks = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed && t.dueDate && isToday(t.dueDate))
        .sort((a, b) => importanceScore[b.importance] - importanceScore[a.importance] || a.effortMinutes - b.effortMinutes),
    [tasks],
  )

  const overdueTasks = useMemo(
    () => tasks.filter((t) => !t.completed && t.dueDate && isPast(t.dueDate)),
    [tasks],
  )

  const calendarConnected = calendar.status === 'connected'

  const todayEvents = useMemo(
    () =>
      calendar.events
        .filter((e) => e.start.slice(0, 10) === todayISO())
        .sort((a, b) => a.start.localeCompare(b.start)),
    [calendar.events],
  )

  const availability = useMemo(
    () => (calendarConnected ? computeAvailability(calendar.events) : null),
    [calendarConnected, calendar.events],
  )

  const moodTasks = useMemo(() => (mood ? tasksForMood(mood, tasks, availability) : []), [mood, tasks, availability])
  const caption = mood ? captionForMood(mood, availability) : null

  return (
    <div>
      <TodayHero name={name} />
      <StatePicker selected={mood} onSelect={setMood} />

      {mood && (
        <div className="mt-9">
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <SectionLabel>RIGHT NOW</SectionLabel>
            {caption && (
              <span className="font-hand text-base" style={{ color: 'var(--accent)' }}>
                {caption}
              </span>
            )}
          </div>
          {moodTasks.length === 0 ? (
            <p className="font-hand py-8 text-center text-xl" style={{ color: 'var(--ink-dim)' }}>
              {MOOD_EMPTY_COPY[mood]}
            </p>
          ) : (
            <TaskList
              tasks={moodTasks}
              categoryById={categoryById}
              hideDueDate
              emptyText=""
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
            />
          )}
        </div>
      )}

      <div className="mt-9">
        <SectionLabel>TASKS</SectionLabel>
        <TaskList
          tasks={todayTasks}
          categoryById={categoryById}
          hideDueDate
          emptyText={pickEmptyCopy('today')}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
        />
      </div>

      {overdueTasks.length > 0 && (
        <div className="mt-10">
          <p className="font-hand mb-2 text-lg" style={{ color: 'var(--ink-dim)' }}>
            a few from before ↴
          </p>
          <TaskList
            tasks={overdueTasks}
            categoryById={categoryById}
            emptyText=""
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
          />
        </div>
      )}

      <div className="mt-10 border-t pt-8" style={{ borderColor: 'var(--line)' }}>
        <SectionLabel>📎 SCHEDULE</SectionLabel>
        {calendarConnected ? (
          <ScheduleList events={todayEvents} emptyText={pickEmptyCopy('scheduleToday')} onAddTask={onAddTaskFromEvent} />
        ) : (
          <ConnectCalendarCard
            status={calendar.status}
            error={calendar.error}
            lastSyncedAt={calendar.lastSyncedAt}
            onConnect={calendar.connect}
            onDisconnect={calendar.disconnect}
            onSync={calendar.sync}
            compact
          />
        )}
      </div>
    </div>
  )
}
