export function StrikeTitle({ text, done }: { text: string; done: boolean }) {
  return (
    <span className="relative inline-block">
      {text}
      {done && (
        <svg
          className="strike-animate pointer-events-none absolute left-0 top-1/2 w-full"
          height="14"
          viewBox="0 0 100 14"
          preserveAspectRatio="none"
          style={{ transform: 'translateY(-50%)' }}
        >
          <path className="strike-path" d="M1 7 Q 25 3, 50 8 T 99 6" style={{ color: 'var(--accent)' }} />
        </svg>
      )}
    </span>
  )
}
