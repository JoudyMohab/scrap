import type { CalendarEvent, GCalCalendar } from '../types'

const API_BASE = 'https://www.googleapis.com/calendar/v3'

interface GCalApiCalendarListEntry {
  id: string
  summary?: string
  summaryOverride?: string
  backgroundColor?: string
  primary?: boolean
}

interface GCalApiEventDateTime {
  date?: string
  dateTime?: string
}

interface GCalApiEvent {
  id: string
  status?: string
  summary?: string
  location?: string
  description?: string
  start?: GCalApiEventDateTime
  end?: GCalApiEventDateTime
  recurringEventId?: string
}

class GCalRequestError extends Error {
  status: number
  constructor(status: number) {
    super(`google calendar request failed (${status})`)
    this.status = status
  }
}

async function gcalFetch<T>(path: string, accessToken: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${API_BASE}${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new GCalRequestError(res.status)
  return res.json() as Promise<T>
}

export function isAuthError(err: unknown): boolean {
  return err instanceof GCalRequestError && (err.status === 401 || err.status === 403)
}

export async function fetchCalendarList(accessToken: string): Promise<GCalCalendar[]> {
  const data = await gcalFetch<{ items?: GCalApiCalendarListEntry[] }>('/users/me/calendarList', accessToken)
  return (data.items ?? []).map((c) => ({
    id: c.id,
    name: c.summaryOverride || c.summary || c.id,
    color: c.backgroundColor || '#8a7ab5',
    primary: !!c.primary,
  }))
}

function normalizeEvent(raw: GCalApiEvent, calendar: GCalCalendar): CalendarEvent | null {
  if (raw.status === 'cancelled') return null

  const allDay = !!raw.start?.date && !raw.end?.date
  const start = allDay ? `${raw.start!.date}T00:00:00` : raw.start?.dateTime
  const end = allDay ? `${raw.end!.date}T00:00:00` : raw.end?.dateTime
  if (!start || !end) return null

  return {
    id: raw.id,
    calendarId: calendar.id,
    calendarName: calendar.name,
    color: calendar.color,
    title: raw.summary || '(untitled event)',
    location: raw.location || undefined,
    description: raw.description || undefined,
    allDay,
    start,
    end,
    multiDay: start.slice(0, 10) !== end.slice(0, 10),
    recurring: !!raw.recurringEventId,
  }
}

export async function fetchEvents(
  accessToken: string,
  calendar: GCalCalendar,
  timeMinISO: string,
  timeMaxISO: string,
): Promise<CalendarEvent[]> {
  const data = await gcalFetch<{ items?: GCalApiEvent[] }>(`/calendars/${encodeURIComponent(calendar.id)}/events`, accessToken, {
    timeMin: timeMinISO,
    timeMax: timeMaxISO,
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '250',
  })

  const events: CalendarEvent[] = []
  for (const raw of data.items ?? []) {
    const normalized = normalizeEvent(raw, calendar)
    if (normalized) events.push(normalized)
  }
  return events
}
