const COPY = {
  today: ['look at you. all caught up.', 'nothing pressing. enjoy that.', "today's clear. suspicious, but nice."],
  upcoming: ["nothing on the horizon.", 'the future is wide open.', "it's suspiciously empty in here."],
  overdue: ['nothing escaped you. impressive.', 'the past is clean for once.'],
  completed: ["nothing finished yet — that's fine.", 'the done pile is still empty.'],
  all: ['a blank page. add something whenever.', 'nothing here. suspicious.'],
  search: ['nothing matches. try a different word.'],
  scheduleToday: ['nothing scheduled. suspiciously free.', 'the day is yours, apparently.'],
  scheduleUpcoming: ['nothing on the calendar yet.', 'wide open, as far as the eye can see.'],
  scheduleDisconnected: ['your schedule is hiding from us.'],
} as const

export function pickEmptyCopy(key: keyof typeof COPY): string {
  const list = COPY[key]
  return list[Math.floor(Math.random() * list.length)]
}
