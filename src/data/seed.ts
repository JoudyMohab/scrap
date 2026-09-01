import type { Category, Task } from '../types'
import { addDays, todayISO } from '../lib/date'

export const HUE_PALETTE = [
  '#c9553f', // terracotta
  '#c9a227', // ochre
  '#7c9473', // sage
  '#6e8fb5', // dusty blue
  '#b5729a', // dusty rose
  '#8a7ab5', // muted violet
  '#d98a4a', // amber
  '#5fa3a3', // teal
]

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-university', name: 'University', icon: 'grad-cap', hue: '#c9a227' },
  { id: 'cat-coding', name: 'Coding', icon: 'laptop', hue: '#6e8fb5' },
  { id: 'cat-creative', name: 'Creative', icon: 'paintbrush', hue: '#b5729a' },
  { id: 'cat-work', name: 'Work', icon: 'briefcase', hue: '#7c9473' },
  { id: 'cat-content', name: 'Content', icon: 'camera', hue: '#d98a4a' },
  { id: 'cat-personal', name: 'Personal', icon: 'heart', hue: '#c9553f' },
  { id: 'cat-reading', name: 'Reading', icon: 'book', hue: '#8a7ab5' },
]

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function buildSeedTasks(): Task[] {
  const t = todayISO()
  const now = new Date().toISOString()
  const mk = (partial: Partial<Task> & Pick<Task, 'title' | 'categoryId'>): Task => ({
    id: uid('task'),
    description: '',
    dueDate: null,
    importance: 'medium',
    effortMinutes: 20,
    completed: false,
    completedAt: null,
    createdAt: now,
    ...partial,
  })

  return [
    mk({ title: 'Reply to MIU email', categoryId: 'cat-university', dueDate: t, effortMinutes: 10, importance: 'high' }),
    mk({ title: 'Finish portfolio hero section', categoryId: 'cat-personal', dueDate: t, effortMinutes: 80, importance: 'medium' }),
    mk({ title: 'F1 telemetry project', categoryId: 'cat-coding', dueDate: t, effortMinutes: 45, importance: 'high' }),
    mk({ title: 'Upload lecture notes', categoryId: 'cat-university', dueDate: t, effortMinutes: 5, importance: 'low' }),
    mk({ title: 'Organize downloads folder', categoryId: 'cat-personal', dueDate: null, effortMinutes: 10, importance: 'low' }),
    mk({
      title: 'Draft next content calendar',
      categoryId: 'cat-content',
      dueDate: addDays(t, 1),
      effortMinutes: 30,
      importance: 'medium',
    }),
    mk({
      title: 'Read two chapters',
      categoryId: 'cat-reading',
      dueDate: addDays(t, 2),
      effortMinutes: 40,
      importance: 'low',
    }),
    mk({
      title: 'Sketch new logo concepts',
      categoryId: 'cat-creative',
      dueDate: addDays(t, 3),
      effortMinutes: 60,
      importance: 'medium',
    }),
    mk({
      title: 'Send invoice',
      categoryId: 'cat-work',
      dueDate: addDays(t, -2),
      effortMinutes: 10,
      importance: 'high',
    }),
    mk({
      title: 'Clean up camera roll',
      categoryId: 'cat-content',
      dueDate: addDays(t, -1),
      effortMinutes: 15,
      importance: 'low',
    }),
    mk({
      title: 'Book dentist appointment',
      categoryId: 'cat-personal',
      dueDate: addDays(t, -5),
      effortMinutes: 5,
      importance: 'medium',
    }),
    mk({
      title: 'Water the plants',
      categoryId: 'cat-personal',
      dueDate: null,
      effortMinutes: 5,
      importance: 'low',
      completed: true,
      completedAt: now,
    }),
    mk({
      title: 'Submit assignment 3',
      categoryId: 'cat-university',
      dueDate: addDays(t, -1),
      effortMinutes: 90,
      importance: 'high',
      completed: true,
      completedAt: now,
    }),
  ]
}
