export function TaskCheckbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className="group relative mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[1.6px] transition-all active:scale-90"
      style={{
        borderColor: checked ? 'var(--accent)' : 'var(--line-strong)',
        background: checked ? 'var(--accent)' : 'transparent',
      }}
    >
      {checked && (
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 stamp-pop" style={{ color: 'var(--color-paper)' }}>
          <path
            d="M4 10.5 8 14.5 16 5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {!checked && (
        <span
          className="h-1.5 w-1.5 rounded-full opacity-0 transition-opacity group-hover:opacity-40"
          style={{ background: 'var(--ink-dim)' }}
        />
      )}
    </button>
  )
}
