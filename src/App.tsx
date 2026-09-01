import { useMemo, useState } from 'react'
import type { CalendarEvent, Task, ViewKey } from './types'
import { isFuture, isPast, isToday, todayISO } from './lib/date'
import { useTaskStore, type NewTaskInput } from './hooks/useTaskStore'
import { useTheme } from './hooks/useTheme'
import { useGoogleCalendar } from './hooks/useGoogleCalendar'
import { AppShell } from './components/layout/AppShell'
import { TaskEditor } from './components/tasks/TaskEditor'
import { CategoryManager } from './components/categories/CategoryManager'
import { TodayView } from './views/TodayView'
import { ScheduleView } from './views/ScheduleView'
import { UpcomingView } from './views/UpcomingView'
import { OverdueView } from './views/OverdueView'
import { CompletedView } from './views/CompletedView'
import { AllTasksView } from './views/AllTasksView'

const USER_NAME = 'Joudy'

function App() {
  const store = useTaskStore()
  const calendar = useGoogleCalendar()
  const { theme, toggle } = useTheme()

  const [view, setView] = useState<ViewKey>('today')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskDraft, setTaskDraft] = useState<Partial<NewTaskInput> | undefined>(undefined)
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false)
  const [jumpCategoryId, setJumpCategoryId] = useState<string | null>(null)

  const counts = useMemo(() => {
    const open = store.tasks.filter((t) => !t.completed)
    return {
      today: open.filter((t) => t.dueDate && isToday(t.dueDate)).length,
      schedule: calendar.events.filter((e) => e.start.slice(0, 10) === todayISO()).length,
      upcoming: open.filter((t) => t.dueDate && isFuture(t.dueDate)).length,
      overdue: open.filter((t) => t.dueDate && isPast(t.dueDate)).length,
      completed: store.tasks.filter((t) => t.completed).length,
      all: store.tasks.length,
    }
  }, [store.tasks, calendar.events])

  const categoryCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const t of store.tasks) {
      if (t.categoryId && !t.completed) m.set(t.categoryId, (m.get(t.categoryId) ?? 0) + 1)
    }
    return m
  }, [store.tasks])

  const openNewTask = () => {
    setEditingTask(null)
    setTaskDraft(undefined)
    setEditorOpen(true)
  }
  const openEditTask = (task: Task) => {
    setEditingTask(task)
    setTaskDraft(undefined)
    setEditorOpen(true)
  }
  const openNewTaskFromEvent = (event: CalendarEvent) => {
    setEditingTask(null)
    setTaskDraft({ title: event.title, dueDate: event.start.slice(0, 10) })
    setEditorOpen(true)
  }
  const closeEditor = () => setEditorOpen(false)

  const handleSave = (input: NewTaskInput, id?: string) => {
    if (id) store.updateTask(id, input)
    else store.addTask(input)
    setEditorOpen(false)
  }
  const handleDeleteFromEditor = (id: string) => {
    store.deleteTask(id)
    setEditorOpen(false)
  }

  const handleFilterCategory = (id: string) => {
    setJumpCategoryId(id)
    setView('all')
  }

  const rowHandlers = {
    onToggle: store.toggleComplete,
    onEdit: openEditTask,
    onDelete: store.deleteTask,
    onMove: store.moveTask,
  }

  return (
    <AppShell
      active={view}
      onNavigate={(v) => {
        setView(v)
        if (v !== 'all') setJumpCategoryId(null)
      }}
      counts={counts}
      categories={store.categories}
      categoryCounts={categoryCounts}
      onFilterCategory={handleFilterCategory}
      onAddTask={openNewTask}
      onManageCategories={() => setCategoryManagerOpen(true)}
      theme={theme}
      onToggleTheme={toggle}
    >
      {view === 'today' && (
        <TodayView
          name={USER_NAME}
          tasks={store.tasks}
          categoryById={store.categoryById}
          calendar={calendar}
          onAddTaskFromEvent={openNewTaskFromEvent}
          {...rowHandlers}
        />
      )}
      {view === 'schedule' && <ScheduleView calendar={calendar} onAddTaskFromEvent={openNewTaskFromEvent} />}
      {view === 'upcoming' && (
        <UpcomingView
          tasks={store.tasks}
          categories={store.categories}
          categoryById={store.categoryById}
          {...rowHandlers}
        />
      )}
      {view === 'overdue' && (
        <OverdueView
          tasks={store.tasks}
          categories={store.categories}
          categoryById={store.categoryById}
          {...rowHandlers}
        />
      )}
      {view === 'completed' && (
        <CompletedView
          tasks={store.tasks}
          categories={store.categories}
          categoryById={store.categoryById}
          {...rowHandlers}
        />
      )}
      {view === 'all' && (
        <AllTasksView
          key={jumpCategoryId ?? 'all'}
          tasks={store.tasks}
          categories={store.categories}
          categoryById={store.categoryById}
          initialFilters={jumpCategoryId ? { categoryIds: [jumpCategoryId] } : undefined}
          {...rowHandlers}
        />
      )}

      <TaskEditor
        key={`${editingTask?.id ?? 'new'}-${editorOpen}`}
        open={editorOpen}
        task={editingTask}
        categories={store.categories}
        initialValues={taskDraft}
        onClose={closeEditor}
        onSave={handleSave}
        onDelete={handleDeleteFromEditor}
        onRequestNewCategory={() => setCategoryManagerOpen(true)}
      />

      <CategoryManager
        open={categoryManagerOpen}
        categories={store.categories}
        onClose={() => setCategoryManagerOpen(false)}
        onAdd={store.addCategory}
        onUpdate={store.updateCategory}
        onDelete={store.deleteCategory}
      />
    </AppShell>
  )
}

export default App
