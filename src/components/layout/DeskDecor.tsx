import { CategoryIcon } from '../stickers/icons'
import type { IconKey } from '../../types'

const ITEMS: { icon: IconKey; top: number; rot: number; size: number }[] = [
  { icon: 'star', top: 4, rot: -12, size: 32 },
  { icon: 'helmet', top: 20, rot: 8, size: 50 },
  { icon: 'leaf', top: 42, rot: -6, size: 38 },
  { icon: 'music', top: 60, rot: 14, size: 44 },
  { icon: 'camera', top: 78, rot: -10, size: 42 },
]

export function DeskDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-40 xl:block">
      {ITEMS.map((it, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            top: `${it.top}%`,
            right: 24,
            width: it.size,
            height: it.size,
            transform: `rotate(${it.rot}deg)`,
            color: 'var(--ink-dim)',
            opacity: 0.16,
          }}
        >
          <CategoryIcon icon={it.icon} className="h-full w-full" />
        </span>
      ))}
    </div>
  )
}
