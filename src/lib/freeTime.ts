import type { CalendarEvent, MoodKey } from '../types'
import { formatEffort } from './date'

export interface DayWindow {
  startHour: number
  endHour: number
}

// waking/working hours we consider when looking for free time — not every
// minute outside a calendar event is "available". Make this configurable
// (per-user settings) once the smarter planning feature lands.
export const DEFAULT_DAY_WINDOW: DayWindow = { startHour: 8, endHour: 23 }

export interface FreeBlock {
  start: Date
  end: Date
  minutes: number
}

export interface Availability {
  /** minutes from now until the next calendar event, or until the day window ends. null when there's no signal (not connected, or outside the day window). */
  nextEventGapMinutes: number | null
  /** the largest free block remaining today, if any. */
  bestBlock: FreeBlock | null
}

function dayWindowFor(date: Date, window: DayWindow): { start: Date; end: Date } {
  const start = new Date(date)
  start.setHours(window.startHour, 0, 0, 0)
  const end = new Date(date)
  end.setHours(window.endHour, 0, 0, 0)
  return { start, end }
}

function toBlock(start: Date, end: Date): FreeBlock {
  return { start, end, minutes: Math.round((end.getTime() - start.getTime()) / 60000) }
}

function busyIntervals(events: CalendarEvent[], dayStart: Date, dayEnd: Date): { start: Date; end: Date }[] {
  const clipped = events
    .filter((e) => !e.allDay)
    .map((e) => ({ start: new Date(e.start), end: new Date(e.end) }))
    .map((iv) => ({
      start: iv.start < dayStart ? dayStart : iv.start,
      end: iv.end > dayEnd ? dayEnd : iv.end,
    }))
    .filter((iv) => iv.start < iv.end)
    .sort((a, b) => a.start.getTime() - b.start.getTime())

  const merged: { start: Date; end: Date }[] = []
  for (const iv of clipped) {
    const last = merged[merged.length - 1]
    if (last && iv.start <= last.end) {
      if (iv.end > last.end) last.end = iv.end
    } else {
      merged.push({ ...iv })
    }
  }
  return merged
}

/** free blocks for the day containing `forDate`, inside the given waking-hours window. */
export function computeFreeBlocks(
  events: CalendarEvent[],
  forDate: Date = new Date(),
  window: DayWindow = DEFAULT_DAY_WINDOW,
): FreeBlock[] {
  const { start: dayStart, end: dayEnd } = dayWindowFor(forDate, window)
  const busy = busyIntervals(events, dayStart, dayEnd)

  const blocks: FreeBlock[] = []
  let cursor = dayStart
  for (const iv of busy) {
    if (iv.start > cursor) blocks.push(toBlock(cursor, iv.start))
    if (iv.end > cursor) cursor = iv.end
  }
  if (cursor < dayEnd) blocks.push(toBlock(cursor, dayEnd))
  return blocks
}

export function computeAvailability(
  events: CalendarEvent[],
  now: Date = new Date(),
  window: DayWindow = DEFAULT_DAY_WINDOW,
): Availability {
  const { start: dayStart, end: dayEnd } = dayWindowFor(now, window)
  const blocks = computeFreeBlocks(events, now, window)

  let nextEventGapMinutes: number | null = null
  if (now >= dayStart && now <= dayEnd) {
    const current = blocks.find((b) => b.start <= now && now < b.end)
    nextEventGapMinutes = current ? Math.round((current.end.getTime() - now.getTime()) / 60000) : 0
  }

  let bestBlock: FreeBlock | null = null
  let bestRemaining = 0
  for (const b of blocks) {
    if (b.end <= now) continue
    const remaining = b.start <= now ? Math.round((b.end.getTime() - now.getTime()) / 60000) : b.minutes
    if (remaining > bestRemaining) {
      bestRemaining = remaining
      bestBlock = b.start <= now ? { start: now, end: b.end, minutes: remaining } : b
    }
  }

  return { nextEventGapMinutes, bestBlock }
}

function partOfDay(d: Date): string {
  const h = d.getHours()
  if (h < 12) return 'this morning'
  if (h < 17) return 'this afternoon'
  return 'this evening'
}

const SHORT_MOODS: MoodKey[] = ['tired', 'quick', 'blank']

/** a short, calm caption describing availability relevant to the selected mood. null when there's nothing useful to say. */
export function captionForMood(mood: MoodKey, availability: Availability | null): string | null {
  if (!availability) return null
  const { nextEventGapMinutes, bestBlock } = availability

  if (SHORT_MOODS.includes(mood)) {
    if (nextEventGapMinutes == null) return null
    if (nextEventGapMinutes <= 0) return 'your next event is starting now.'
    return `${formatEffort(nextEventGapMinutes)} before your next event.`
  }

  if (bestBlock) return `${formatEffort(bestBlock.minutes)} free block ${partOfDay(bestBlock.start)}.`
  if (nextEventGapMinutes != null && nextEventGapMinutes > 0) return `${formatEffort(nextEventGapMinutes)} before your next event.`
  return null
}
