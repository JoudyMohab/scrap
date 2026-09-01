import type { ReactElement } from 'react'
import type { IconKey } from '../../types'

type IconProps = { className?: string }

const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function GradCap({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...common}>
      <path d="M24 14 44 22 24 30 4 22Z" />
      <path d="M13 25.5V35c0 2 5 5 11 5s11-3 11-5v-9.5" />
      <path d="M44 22v10.5" />
      <circle cx="44" cy="35" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

function Laptop({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...common}>
      <rect x="11" y="10" width="26" height="17" rx="1.5" />
      <path d="M16 19.5 20 23l-4 3.5" />
      <path d="M24 26.5h5" />
      <path d="M5 34h38l-3.5 5H8.5Z" />
    </svg>
  )
}

function Paintbrush({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...common}>
      <path d="M31 8c4 0 8 4 8 8 0 3-2 5-4 6l-11 11-9-9 11-11c1-2 3-5 5-5Z" />
      <path d="M24 26 10 40" strokeWidth={2.4} />
      <path d="M8 42c-1-3 0-6 2-7 2-1 5 0 6 2" />
    </svg>
  )
}

function Briefcase({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...common}>
      <rect x="6" y="16" width="36" height="23" rx="2" />
      <path d="M17 16v-4c0-1.5 1-3 3-3h8c2 0 3 1.5 3 3v4" />
      <path d="M6 26h36" />
      <path d="M21 26v3h6v-3" />
    </svg>
  )
}

function Book({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...common}>
      <path d="M24 12c-3-2.5-8-3.5-14-3v25c6-.5 11 .5 14 3 3-2.5 8-3.5 14-3V9c-6-.5-11 .5-14 3Z" />
      <path d="M24 12v25" />
    </svg>
  )
}

function Camera({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...common}>
      <path d="M6 16h8l3-4h14l3 4h8v22H6Z" />
      <circle cx="24" cy="27" r="7" />
      <path d="M35 20h3" />
    </svg>
  )
}

function Heart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...common}>
      <path d="M24 39C11 31 6 24 6 17c0-5 4-9 9-9 4 0 7 2 9 6 2-4 5-6 9-6 5 0 9 4 9 9 0 7-5 14-18 22Z" />
    </svg>
  )
}

function Star({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...common}>
      <path d="M24 6 29 19 43 20 32 29 36 42 24 34 12 42 16 29 5 20 19 19Z" strokeLinejoin="round" />
    </svg>
  )
}

function Helmet({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...common}>
      <path d="M6 28c0-11 8-19 18-19s18 8 18 19" />
      <path d="M4 28h40v3c0 2-2 4-4 4H8c-2 0-4-2-4-4Z" />
      <path d="M17 20c3-2 11-2 14 0v6c-3 2-11 2-14 0Z" />
    </svg>
  )
}

function Leaf({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...common}>
      <path d="M10 38C8 22 20 8 40 8c2 20-12 32-30 30Z" />
      <path d="M10 38C18 28 26 20 38 12" />
    </svg>
  )
}

function Music({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...common}>
      <path d="M19 34V10l20-4v22" />
      <circle cx="14" cy="34" r="5" />
      <circle cx="34" cy="30" r="5" />
    </svg>
  )
}

function Folder({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} {...common}>
      <path d="M6 14h12l4 4h20v22H6Z" />
    </svg>
  )
}

const REGISTRY: Record<IconKey, (p: IconProps) => ReactElement> = {
  'grad-cap': GradCap,
  laptop: Laptop,
  paintbrush: Paintbrush,
  briefcase: Briefcase,
  book: Book,
  camera: Camera,
  heart: Heart,
  star: Star,
  helmet: Helmet,
  leaf: Leaf,
  music: Music,
  folder: Folder,
}

export const ICON_KEYS = Object.keys(REGISTRY) as IconKey[]

export function CategoryIcon({ icon, className }: { icon: IconKey; className?: string }) {
  const Cmp = REGISTRY[icon] ?? Folder
  return <Cmp className={className} />
}
