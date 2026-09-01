export function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-14 text-center">
      <span className="font-hand text-2xl" style={{ color: 'var(--ink-dim)' }}>
        {text}
      </span>
    </div>
  )
}
