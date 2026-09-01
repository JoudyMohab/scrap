import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Category, IconKey } from '../../types'
import { ICON_KEYS } from '../stickers/icons'
import { Sticker } from '../stickers/Sticker'
import { HUE_PALETTE } from '../../data/seed'

interface CategoryManagerProps {
  open: boolean
  categories: Category[]
  onClose: () => void
  onAdd: (name: string, icon: IconKey, hue: string) => void
  onUpdate: (id: string, patch: Partial<Category>) => void
  onDelete: (id: string) => void
}

export function CategoryManager({ open, categories, onClose, onAdd, onUpdate, onDelete }: CategoryManagerProps) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState<IconKey>('star')
  const [hue, setHue] = useState(HUE_PALETTE[0])

  if (!open) return null

  const submit = () => {
    if (!name.trim()) return
    onAdd(name.trim(), icon, hue)
    setName('')
    setIcon('star')
    setHue(HUE_PALETTE[Math.floor(Math.random() * HUE_PALETTE.length)])
  }

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-xl border p-6"
          style={{ background: 'var(--bg-1)', borderColor: 'var(--line)', boxShadow: 'var(--shadow-pop)' }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg" style={{ color: 'var(--ink)' }}>
              categories
            </h2>
            <button onClick={onClose} className="text-xl leading-none" style={{ color: 'var(--ink-dim)' }}>
              &times;
            </button>
          </div>

          <div className="mb-5 max-h-52 space-y-1 overflow-y-auto">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center gap-2 rounded-md px-1 py-1.5">
                <Sticker icon={c.icon} hue={c.hue} seed={c.id} size={26} />
                <input
                  value={c.name}
                  onChange={(e) => onUpdate(c.id, { name: e.target.value })}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: 'var(--ink)' }}
                />
                <button
                  onClick={() => onDelete(c.id)}
                  className="text-xs"
                  style={{ color: 'var(--ink-dim)' }}
                >
                  remove
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4" style={{ borderColor: 'var(--line)' }}>
            <p className="mb-2 text-xs tracking-wide" style={{ color: 'var(--ink-dim)' }}>
              NEW CATEGORY
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="category name"
              className="mb-3 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            />
            <div className="mb-3 flex flex-wrap gap-2">
              {ICON_KEYS.map((k) => (
                <button
                  key={k}
                  onClick={() => setIcon(k)}
                  className="rounded-full p-0.5"
                  style={{ outline: icon === k ? `2px solid ${hue}` : 'none', outlineOffset: 2 }}
                >
                  <Sticker icon={k} hue={hue} seed={k} size={28} />
                </button>
              ))}
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {HUE_PALETTE.map((h) => (
                <button
                  key={h}
                  onClick={() => setHue(h)}
                  className="h-6 w-6 rounded-full border-2"
                  style={{ background: h, borderColor: hue === h ? 'var(--ink)' : 'transparent' }}
                />
              ))}
            </div>
            <button
              onClick={submit}
              disabled={!name.trim()}
              className="w-full rounded-full py-2 text-sm font-medium disabled:opacity-40"
              style={{ background: 'var(--accent)', color: 'var(--color-paper)' }}
            >
              add category
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
