import { motion } from 'framer-motion'
import type { Category, Task } from '../../types'
import { formatDueLabel, formatEffort, isPast, isToday } from '../../lib/date'
import { Sticker } from '../stickers/Sticker'
import { ImportanceMark } from '../ui/Primitives'
import { TaskCheckbox } from './TaskCheckbox'
import { StrikeTitle } from './StrikeTitle'
import { MoveMenu } from './MoveMenu'

const PencilIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <path d="M13.5 3.5 16.5 6.5 6.5 16.5H3.5v-3Z" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
)
const TrashIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <path d="M4 6h12M8 6V4h4v2M6 6l1 11h6l1-11" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const CalendarIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6}>
    <rect x="3" y="4.5" width="14" height="12" rx="1.5" />
    <path d="M3 8h14M7 3v3M13 3v3" strokeLinecap="round" />
  </svg>
)

interface TaskRowProps {
  task: Task
  category?: Category
  hideDueDate?: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  onMove: (dueDate: string | null) => void
}

export function TaskRow({ task, category, hideDueDate, onToggle, onEdit, onDelete, onMove }: TaskRowProps) {
  const escaped = !task.completed && !!task.dueDate && isPast(task.dueDate)
  const dueToday = !!task.dueDate && isToday(task.dueDate)

  return (
    <motion.div
      layout
      initial={false}
      animate={{ opacity: task.completed ? 0.55 : 1 }}
      className="group flex items-start gap-3 border-b py-3.5 last:border-none"
      style={{ borderColor: 'var(--line)' }}
    >
      <TaskCheckbox checked={task.completed} onChange={onToggle} />

      <div className="min-w-0 flex-1">
        <p className="text-[15px] leading-snug" style={{ color: 'var(--ink)' }}>
          <StrikeTitle text={task.title} done={task.completed} />
        </p>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px]" style={{ color: 'var(--ink-dim)' }}>
          {category && (
            <span className="inline-flex items-center gap-1.5">
              <Sticker icon={category.icon} hue={category.hue} seed={category.id} size={18} />
              {category.name}
            </span>
          )}
          <span>·</span>
          <span>{formatEffort(task.effortMinutes)}</span>
          <ImportanceMark importance={task.importance} />

          {!hideDueDate && task.dueDate && !escaped && (
            <>
              <span>·</span>
              <span className={dueToday ? 'font-medium' : ''} style={{ color: dueToday ? 'var(--accent)' : undefined }}>
                {formatDueLabel(task.dueDate)}
              </span>
            </>
          )}
        </div>

        {escaped && (
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="font-hand text-base leading-none" style={{ color: 'var(--accent)' }}>
              this one escaped you
            </span>
            <button
              type="button"
              onClick={() => onMove(new Date().toISOString().slice(0, 10))}
              className="text-xs underline decoration-dotted underline-offset-2"
              style={{ color: 'var(--ink)' }}
            >
              do today
            </button>
            <MoveMenu
              onMove={onMove}
              trigger={
                <button
                  type="button"
                  className="text-xs underline decoration-dotted underline-offset-2"
                  style={{ color: 'var(--ink)' }}
                >
                  move
                </button>
              }
            />
            <button
              type="button"
              onClick={onDelete}
              className="text-xs underline decoration-dotted underline-offset-2"
              style={{ color: 'var(--ink-dim)' }}
            >
              delete
            </button>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <MoveMenu
          onMove={onMove}
          trigger={
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink-dim)] hover:bg-[var(--line)]/40 hover:text-[var(--ink)]"
              title="reschedule"
            >
              <CalendarIcon />
            </span>
          }
        />
        <button
          type="button"
          onClick={onEdit}
          title="edit"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink-dim)] hover:bg-[var(--line)]/40 hover:text-[var(--ink)]"
        >
          <PencilIcon />
        </button>
        <button
          type="button"
          onClick={onDelete}
          title="delete"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--ink-dim)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
        >
          <TrashIcon />
        </button>
      </div>
    </motion.div>
  )
}
