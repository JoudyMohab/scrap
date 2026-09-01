import type { MoodKey, Task } from '../types'
import { isPast, isToday } from './date'
import type { Availability } from './freeTime'

export interface MoodDef {
  key: MoodKey
  emoji: string
  label: string
  subtitle: string
}

export const MOODS: MoodDef[] = [
  { key: 'energy', emoji: '⚡', label: 'energy', subtitle: 'ready to move' },
  { key: 'focus', emoji: '🧠', label: 'focus', subtitle: 'deep work' },
  { key: 'tired', emoji: '🥱', label: 'tired', subtitle: 'keep it light' },
  { key: 'quick', emoji: '⏱', label: '15 min', subtitle: 'small window' },
  { key: 'blank', emoji: '🫠', label: 'empty', subtitle: "don't want to" },
]

// priority: overdue first, then today, then everything else by soonest due date, then no date last
function urgencyRank(t: Task): number {
  if (t.dueDate && isPast(t.dueDate)) return 0
  if (t.dueDate && isToday(t.dueDate)) return 1
  if (t.dueDate) return 2
  return 3
}

function byUrgencyThen(sortFn: (a: Task, b: Task) => number) {
  return (a: Task, b: Task) => {
    const u = urgencyRank(a) - urgencyRank(b)
    if (u !== 0) return u
    return sortFn(a, b)
  }
}

const importanceScore = { high: 2, medium: 1, low: 0 }

/**
 * caps a mood's default effort ceiling against how much time is actually free
 * right now — a 30-minute task isn't a good fit if the next event starts in 10.
 * Only applies once a calendar is connected; with no availability signal the
 * mood's own default ceiling is used unchanged.
 */
function capToGap(defaultCeiling: number, availability?: Availability | null): number {
  if (!availability || availability.nextEventGapMinutes == null) return defaultCeiling
  return Math.min(defaultCeiling, Math.max(availability.nextEventGapMinutes, 0))
}

export function tasksForMood(mood: MoodKey, tasks: Task[], availability?: Availability | null): Task[] {
  const open = tasks.filter((t) => !t.completed)

  switch (mood) {
    case 'energy':
      return open
        .filter((t) => t.effortMinutes >= 20)
        .sort(byUrgencyThen((a, b) => importanceScore[b.importance] - importanceScore[a.importance]))
        .slice(0, 6)

    case 'focus':
      return open
        .filter((t) => t.effortMinutes >= 30)
        .sort(
          byUrgencyThen(
            (a, b) => importanceScore[b.importance] - importanceScore[a.importance] || b.effortMinutes - a.effortMinutes,
          ),
        )
        .slice(0, 6)

    case 'tired': {
      const ceiling = capToGap(20, availability)
      return open
        .filter((t) => t.effortMinutes <= ceiling)
        .sort(byUrgencyThen((a, b) => a.effortMinutes - b.effortMinutes))
        .slice(0, 6)
    }

    case 'quick': {
      const ceiling = capToGap(15, availability)
      return open
        .filter((t) => t.effortMinutes <= ceiling)
        .sort(byUrgencyThen((a, b) => a.effortMinutes - b.effortMinutes))
        .slice(0, 6)
    }

    case 'blank': {
      const ceiling = capToGap(10, availability)
      return open
        .filter((t) => t.effortMinutes <= ceiling)
        .sort(byUrgencyThen((a, b) => a.effortMinutes - b.effortMinutes))
        .slice(0, 3)
    }

    default:
      return []
  }
}

export const MOOD_EMPTY_COPY: Record<MoodKey, string> = {
  energy: "nothing big waiting. maybe that's a good sign.",
  focus: 'no deep-work tasks queued right now.',
  tired: "even the easy pile is clear. rest counts too.",
  quick: 'nothing that fits in 15. breathe for those instead.',
  blank: "truly nothing tiny left. you're covered.",
}
