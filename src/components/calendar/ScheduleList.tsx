import { motion } from 'framer-motion'
import type { CalendarEvent } from '../../types'
import { ScheduleAgendaItem } from './ScheduleAgendaItem'
import { EmptyState } from '../tasks/EmptyState'

interface ScheduleListProps {
  events: CalendarEvent[]
  emptyText: string
  onAddTask?: (event: CalendarEvent) => void
}

export function ScheduleList({ events, emptyText, onAddTask }: ScheduleListProps) {
  if (events.length === 0) return <EmptyState text={emptyText} />

  return (
    <div>
      {events.map((event) => (
        <motion.div key={event.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
          <ScheduleAgendaItem event={event} onAddTask={onAddTask} />
        </motion.div>
      ))}
    </div>
  )
}
