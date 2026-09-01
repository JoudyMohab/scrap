import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { Importance } from '../../types'

export function ImportanceMark({ importance }: { importance: Importance }) {
  if (importance === 'high') {
    return (
      <span
        className="inline-block h-[7px] w-[7px] rounded-full"
        style={{ background: 'var(--accent)' }}
        title="high importance"
      />
    )
  }
  if (importance === 'medium') {
    return (
      <span
        className="inline-block h-[7px] w-[7px] rounded-full border"
        style={{ borderColor: 'var(--ink-dim)' }}
        title="medium importance"
      />
    )
  }
  return null
}

export function Chip({
  active,
  children,
  onClick,
  className = '',
  ...rest
}: {
  active?: boolean
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition-all active:scale-95 ${className}`}
      style={{
        borderColor: active ? 'var(--accent)' : 'var(--line)',
        background: active ? 'var(--accent-soft)' : 'transparent',
        color: active ? 'var(--ink)' : 'var(--ink-dim)',
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

export function IconButton({
  children,
  className = '',
  title,
  ...rest
}: { children: ReactNode; title?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      title={title}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-[var(--ink-dim)] transition-colors hover:border-[var(--line)] hover:text-[var(--ink)] active:scale-90 ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export function SectionLabel({ children, dim }: { children: ReactNode; dim?: boolean }) {
  return (
    <h2
      className="mb-3 text-xs font-semibold tracking-[0.2em]"
      style={{ color: dim ? 'var(--ink-dim)' : 'var(--ink)' }}
    >
      {children}
    </h2>
  )
}
