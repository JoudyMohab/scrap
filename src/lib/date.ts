export function todayISO(): string {
  return toISODate(new Date())
}

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

export function isPast(iso: string): boolean {
  return iso < todayISO()
}

export function isToday(iso: string): boolean {
  return iso === todayISO()
}

export function isFuture(iso: string): boolean {
  return iso > todayISO()
}

export function formatEffort(min: number): string {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const rem = min % 60
  return rem ? `${h}h ${rem}m` : `${h}h`
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function formatHeaderDate(d: Date = new Date()) {
  return {
    weekday: WEEKDAYS[d.getDay()].toUpperCase(),
    monthDay: `${MONTHS[d.getMonth()].toUpperCase()} ${d.getDate()}`,
  }
}

export function formatDueLabel(iso: string | null): string {
  if (!iso) return 'no date'
  if (isToday(iso)) return 'today'
  const tomorrow = addDays(todayISO(), 1)
  if (iso === tomorrow) return 'tomorrow'
  const yesterday = addDays(todayISO(), -1)
  if (iso === yesterday) return 'yesterday'
  const d = new Date(iso + 'T00:00:00')
  const sameYear = d.getFullYear() === new Date().getFullYear()
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}${sameYear ? '' : `, ${d.getFullYear()}`}`
}

export function formatTime(iso: string): string {
  const d = new Date(iso)
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

export function formatEventRange(startIso: string, endIso: string, multiDay: boolean): string {
  if (!multiDay) return `${formatTime(startIso)} – ${formatTime(endIso)}`
  const start = new Date(startIso)
  const end = new Date(endIso)
  return `${MONTHS[start.getMonth()].slice(0, 3)} ${start.getDate()}, ${formatTime(startIso)} – ${MONTHS[end.getMonth()].slice(0, 3)} ${end.getDate()}, ${formatTime(endIso)}`
}

export function formatRelativeShort(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

export function greetingForHour(h: number = new Date().getHours()): string {
  if (h < 5) return 'still up'
  if (h < 12) return 'good morning'
  if (h < 17) return 'good afternoon'
  if (h < 22) return 'good evening'
  return 'good night'
}
