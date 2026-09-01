export type Importance = 'low' | 'medium' | 'high'

export type IconKey =
  | 'grad-cap'
  | 'laptop'
  | 'paintbrush'
  | 'briefcase'
  | 'book'
  | 'camera'
  | 'heart'
  | 'star'
  | 'helmet'
  | 'leaf'
  | 'music'
  | 'folder'

export interface Category {
  id: string
  name: string
  icon: IconKey
  hue: string // css color used for the sticker + accents
}

export interface Task {
  id: string
  title: string
  description?: string
  categoryId: string | null
  dueDate: string | null // YYYY-MM-DD
  importance: Importance
  effortMinutes: number
  completed: boolean
  completedAt: string | null // ISO datetime
  createdAt: string // ISO datetime
}

export type MoodKey = 'energy' | 'focus' | 'tired' | 'quick' | 'blank'

export type ViewKey = 'today' | 'schedule' | 'upcoming' | 'overdue' | 'completed' | 'all'

export interface GCalCalendar {
  id: string
  name: string
  color: string
  primary?: boolean
}

export interface CalendarEvent {
  id: string
  calendarId: string
  calendarName: string
  color: string
  title: string
  location?: string
  description?: string
  allDay: boolean
  start: string // ISO datetime
  end: string // ISO datetime, exclusive
  multiDay: boolean
  recurring: boolean
}
