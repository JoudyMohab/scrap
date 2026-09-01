import { formatHeaderDate, greetingForHour } from '../../lib/date'

export function TodayHero({ name }: { name: string }) {
  const { weekday, monthDay } = formatHeaderDate()
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold tracking-[0.25em]" style={{ color: 'var(--ink-dim)' }}>
        {weekday} · {monthDay}
      </p>
      <h1 className="font-display mt-1 text-3xl sm:text-4xl" style={{ color: 'var(--ink)' }}>
        {greetingForHour()}, {name}.
      </h1>
      <p className="font-hand mt-1 text-xl" style={{ color: 'var(--accent)' }}>
        what are we capable of today?
      </p>
    </div>
  )
}
