import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Category, Importance, Task } from '../../types'
import { addDays, todayISO } from '../../lib/date'
import { Sticker } from '../stickers/Sticker'
import type { NewTaskInput } from '../../hooks/useTaskStore'

const EFFORT_PRESETS = [5, 10, 15, 30, 45, 60, 90, 120]
const IMPORTANCE_OPTS: { key: Importance; label: string }[] = [
  { key: 'low', label: 'low' },
  { key: 'medium', label: 'medium' },
  { key: 'high', label: 'high' },
]

interface TaskEditorProps {
  open: boolean
  task: Task | null
  categories: Category[]
  initialValues?: Partial<NewTaskInput>
  onClose: () => void
  onSave: (input: NewTaskInput, id?: string) => void
  onDelete?: (id: string) => void
  onRequestNewCategory: () => void
}

export function TaskEditor({ open, task, categories, initialValues, onClose, onSave, onDelete, onRequestNewCategory }: TaskEditorProps) {
  const [title, setTitle] = useState(task?.title ?? initialValues?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? initialValues?.description ?? '')
  const [categoryId, setCategoryId] = useState<string | null>(
    task?.categoryId ?? initialValues?.categoryId ?? categories[0]?.id ?? null,
  )
  const [dueDate, setDueDate] = useState<string | null>(task?.dueDate ?? initialValues?.dueDate ?? null)
  const [importance, setImportance] = useState<Importance>(task?.importance ?? initialValues?.importance ?? 'medium')
  const [effortMinutes, setEffortMinutes] = useState(task?.effortMinutes ?? initialValues?.effortMinutes ?? 15)

  if (!open) return null

  const canSave = title.trim().length > 0

  const submit = () => {
    if (!canSave) return
    onSave(
      {
        title: title.trim(),
        description: description.trim(),
        categoryId,
        dueDate,
        importance,
        effortMinutes,
      },
      task?.id,
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.45)' }}
        onClick={onClose}
      />
      <motion.div
        key="panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l"
        style={{ background: 'var(--bg-1)', borderColor: 'var(--line)' }}
      >
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--line)' }}>
          <h2 className="font-display text-lg" style={{ color: 'var(--ink)' }}>
            {task ? 'edit task' : 'new task'}
          </h2>
          <button onClick={onClose} className="text-xl leading-none" style={{ color: 'var(--ink-dim)' }}>
            &times;
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <div>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="what needs doing?"
              className="w-full border-b bg-transparent pb-2 text-lg outline-none font-display"
              style={{ borderColor: 'var(--line-strong)', color: 'var(--ink)' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) submit()
              }}
            />
          </div>

          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="a note to yourself (optional)"
              rows={3}
              className="w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            />
          </div>

          <div>
            <p className="mb-2 text-xs tracking-wide" style={{ color: 'var(--ink-dim)' }}>
              CATEGORY
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryId(c.id)}
                  className="flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-sm transition-all active:scale-95"
                  style={{
                    borderColor: categoryId === c.id ? c.hue : 'var(--line)',
                    background: categoryId === c.id ? `color-mix(in srgb, ${c.hue} 16%, transparent)` : 'transparent',
                    color: categoryId === c.id ? 'var(--ink)' : 'var(--ink-dim)',
                  }}
                >
                  <Sticker icon={c.icon} hue={c.hue} seed={c.id} size={18} />
                  {c.name}
                </button>
              ))}
              <button
                onClick={onRequestNewCategory}
                className="rounded-full border border-dashed px-2.5 py-1.5 text-sm"
                style={{ borderColor: 'var(--line-strong)', color: 'var(--ink-dim)' }}
              >
                + new
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs tracking-wide" style={{ color: 'var(--ink-dim)' }}>
              DUE DATE
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {[
                ['today', todayISO()],
                ['tomorrow', addDays(todayISO(), 1)],
                ['none', null],
              ].map(([label, val]) => (
                <button
                  key={label}
                  onClick={() => setDueDate(val as string | null)}
                  className="rounded-full border px-2.5 py-1.5 text-sm"
                  style={{
                    borderColor: dueDate === val ? 'var(--accent)' : 'var(--line)',
                    background: dueDate === val ? 'var(--accent-soft)' : 'transparent',
                    color: 'var(--ink)',
                  }}
                >
                  {label}
                </button>
              ))}
              <input
                type="date"
                value={dueDate ?? ''}
                onChange={(e) => setDueDate(e.target.value || null)}
                className="rounded-md border bg-transparent px-2 py-1.5 text-sm outline-none"
                style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs tracking-wide" style={{ color: 'var(--ink-dim)' }}>
              IMPORTANCE
            </p>
            <div className="inline-flex rounded-full border p-1" style={{ borderColor: 'var(--line)' }}>
              {IMPORTANCE_OPTS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setImportance(opt.key)}
                  className="rounded-full px-3 py-1 text-sm capitalize transition-colors"
                  style={{
                    background: importance === opt.key ? 'var(--accent)' : 'transparent',
                    color: importance === opt.key ? 'var(--color-paper)' : 'var(--ink-dim)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs tracking-wide" style={{ color: 'var(--ink-dim)' }}>
              ESTIMATED EFFORT
            </p>
            <div className="flex flex-wrap gap-2">
              {EFFORT_PRESETS.map((m) => (
                <button
                  key={m}
                  onClick={() => setEffortMinutes(m)}
                  className="rounded-full border px-2.5 py-1 text-sm"
                  style={{
                    borderColor: effortMinutes === m ? 'var(--accent)' : 'var(--line)',
                    background: effortMinutes === m ? 'var(--accent-soft)' : 'transparent',
                    color: 'var(--ink)',
                  }}
                >
                  {m < 60 ? `${m}m` : `${m / 60}h`}
                </button>
              ))}
              <input
                type="number"
                min={1}
                value={effortMinutes}
                onChange={(e) => setEffortMinutes(Math.max(1, Number(e.target.value) || 1))}
                className="w-20 rounded-md border bg-transparent px-2 py-1 text-sm outline-none"
                style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t px-5 py-4" style={{ borderColor: 'var(--line)' }}>
          {task && onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="mr-auto text-sm"
              style={{ color: 'var(--ink-dim)' }}
            >
              delete
            </button>
          )}
          <button onClick={onClose} className="rounded-full border px-4 py-2 text-sm" style={{ borderColor: 'var(--line)', color: 'var(--ink-dim)' }}>
            cancel
          </button>
          <button
            onClick={submit}
            disabled={!canSave}
            className="rounded-full px-5 py-2 text-sm font-medium disabled:opacity-40"
            style={{ background: 'var(--accent)', color: 'var(--color-paper)' }}
          >
            {task ? 'save' : 'add task'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
