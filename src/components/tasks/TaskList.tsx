import { AnimatePresence, motion } from 'framer-motion'
import type { Category, Task } from '../../types'
import { TaskRow } from './TaskRow'
import { EmptyState } from './EmptyState'

interface TaskListProps {
  tasks: Task[]
  categoryById: Map<string, Category>
  hideDueDate?: boolean
  emptyText: string
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, dueDate: string | null) => void
}

export function TaskList({ tasks, categoryById, hideDueDate, emptyText, onToggle, onEdit, onDelete, onMove }: TaskListProps) {
  if (tasks.length === 0) return <EmptyState text={emptyText} />

  return (
    <div>
      <AnimatePresence initial={false}>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.22 }}
          >
            <TaskRow
              task={task}
              category={task.categoryId ? categoryById.get(task.categoryId) : undefined}
              hideDueDate={hideDueDate}
              onToggle={() => onToggle(task.id)}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
              onMove={(d) => onMove(task.id, d)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
