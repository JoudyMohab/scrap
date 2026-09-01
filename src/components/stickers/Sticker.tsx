import { CategoryIcon } from './icons'
import type { IconKey } from '../../types'

function hashRotation(seed: string, spread = 10): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return ((Math.abs(h) % (spread * 2 * 10)) / 10 - spread)
}

interface StickerProps {
  icon: IconKey
  hue: string
  seed: string
  size?: number
  tape?: boolean
  className?: string
}

export function Sticker({ icon, hue, seed, size = 34, tape = false, className = '' }: StickerProps) {
  const rot = hashRotation(seed)
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full transition-transform duration-200 hover:rotate-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: `color-mix(in srgb, ${hue} 22%, transparent)`,
        border: `1.5px solid color-mix(in srgb, ${hue} 55%, transparent)`,
        color: hue,
        transform: `rotate(${rot}deg)`,
        boxShadow: '0 2px 6px -2px rgba(0,0,0,0.4)',
      }}
    >
      {tape && (
        <span
          aria-hidden
          className="absolute -top-2 left-1/2 h-3 w-6 -translate-x-1/2 -rotate-3 bg-[var(--ink)]/10"
          style={{ backdropFilter: 'blur(1px)' }}
        />
      )}
      <CategoryIcon icon={icon} className="h-[58%] w-[58%]" />
    </span>
  )
}
