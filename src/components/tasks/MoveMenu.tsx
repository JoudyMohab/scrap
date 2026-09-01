import { useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { addDays, todayISO } from '../../lib/date'
import { useClickOutside } from '../../hooks/useClickOutside'

export function MoveMenu({
  onMove,
  trigger,
}: {
  onMove: (dueDate: string | null) => void
  trigger: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setOpen(false), open)

  const pick = (d: string | null) => {
    onMove(d)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <span onClick={() => setOpen((o) => !o)}>{trigger}</span>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 top-full z-30 mt-1.5 w-44 overflow-hidden rounded-lg border shadow-lg"
            style={{ background: 'var(--bg-1)', borderColor: 'var(--line)', boxShadow: 'var(--shadow-pop)' }}
          >
            {[
              ['Today', todayISO()],
              ['Tomorrow', addDays(todayISO(), 1)],
              ['Next week', addDays(todayISO(), 7)],
              ['No date', null],
            ].map(([label, val]) => (
              <button
                key={label}
                type="button"
                onClick={() => pick(val as string | null)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-[var(--accent-soft)]"
                style={{ color: 'var(--ink)' }}
              >
                {label}
              </button>
            ))}
            <label className="flex items-center gap-2 border-t px-3 py-2 text-sm" style={{ borderColor: 'var(--line)' }}>
              <span style={{ color: 'var(--ink-dim)' }}>Pick date</span>
              <input
                type="date"
                className="ml-auto bg-transparent text-xs outline-none"
                style={{ color: 'var(--ink)' }}
                onChange={(e) => e.target.value && pick(e.target.value)}
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
