import { useMemo, useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import TaskDetailModal from '@/components/tasks/TaskDetailModal'
import type { Task } from '@/types/task.types'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const projectColorClasses: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  indigo: {
    bg: 'bg-indigo-500/10 hover:bg-indigo-500/15',
    border: 'border-indigo-500/25',
    text: 'text-indigo-200',
    dot: 'bg-indigo-400',
  },
  rose: {
    bg: 'bg-rose-500/10 hover:bg-rose-500/15',
    border: 'border-rose-500/25',
    text: 'text-rose-200',
    dot: 'bg-rose-400',
  },
  emerald: {
    bg: 'bg-emerald-500/10 hover:bg-emerald-500/15',
    border: 'border-emerald-500/25',
    text: 'text-emerald-200',
    dot: 'bg-emerald-400',
  },
  cyan: {
    bg: 'bg-cyan-500/10 hover:bg-cyan-500/15',
    border: 'border-cyan-500/25',
    text: 'text-cyan-200',
    dot: 'bg-cyan-400',
  },
  amber: {
    bg: 'bg-amber-500/10 hover:bg-amber-500/15',
    border: 'border-amber-500/25',
    text: 'text-amber-200',
    dot: 'bg-amber-400',
  },
  purple: {
    bg: 'bg-purple-500/10 hover:bg-purple-500/15',
    border: 'border-purple-500/25',
    text: 'text-purple-200',
    dot: 'bg-purple-400',
  },
}

const defaultProjectColor = projectColorClasses.indigo!

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateKey(value: string) {
  const parts = value.split('-').map(Number)
  const year = parts[0] ?? 1970
  const month = parts[1] ?? 1
  const day = parts[2] ?? 1
  return new Date(year, month - 1, day)
}

function getCalendarDays(monthDate: Date) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const gridStart = new Date(firstDay)
  gridStart.setDate(firstDay.getDate() - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    return date
  })
}

function formatMonthTitle(date: Date) {
  return date.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
}

export default function CalendarPage() {
  const { tasks } = useAppSelector((state) => state.tasks)
  const { projects } = useAppSelector((state) => state.projects)

  const [visibleMonth, setVisibleMonth] = useState(() => new Date())
  const [projectFilter, setProjectFilter] = useState('all')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  const projectById = useMemo(() => {
    return projects.reduce<Record<string, (typeof projects)[number]>>((lookup, project) => {
      lookup[project.id] = project
      return lookup
    }, {})
  }, [projects])

  const calendarDays = useMemo(() => getCalendarDays(visibleMonth), [visibleMonth])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => projectFilter === 'all' || task.projectId === projectFilter)
  }, [projectFilter, tasks])

  const tasksByDate = useMemo(() => {
    return filteredTasks.reduce<Record<string, Task[]>>((lookup, task) => {
      const key = toDateKey(parseDateKey(task.dueDate))
      lookup[key] = [...(lookup[key] ?? []), task]
      return lookup
    }, {})
  }, [filteredTasks])

  const currentMonthTaskCount = filteredTasks.filter((task) => {
    const due = parseDateKey(task.dueDate)
    return due.getMonth() === visibleMonth.getMonth() && due.getFullYear() === visibleMonth.getFullYear()
  }).length

  const goToToday = () => setVisibleMonth(new Date())

  const goToPreviousMonth = () => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
  }

  const todayKey = toDateKey(new Date())

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Calendar</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Review upcoming task deadlines by project and month.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
            className="h-10 rounded-lg border border-neutral-800 bg-neutral-900 px-3 text-sm font-medium text-white focus:border-primary-500 focus:outline-none"
          >
            <option value="all">All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900 p-1">
            <button
              type="button"
              onClick={goToToday}
              className="rounded-md px-3 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              Today
            </button>
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
              title="Previous month"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19 8 12l7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goToNextMonth}
              className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
              title="Next month"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900/40">
        <div className="flex flex-col gap-2 border-b border-neutral-800 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-xl font-bold text-white">{formatMonthTitle(visibleMonth)}</h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              {currentMonthTaskCount} scheduled {currentMonthTaskCount === 1 ? 'task' : 'tasks'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {projects.slice(0, 5).map((project) => {
              const color = projectColorClasses[project.color] ?? defaultProjectColor
              return (
                <span key={project.id} className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400">
                  <span className={`h-2 w-2 rounded-full ${color.dot}`} />
                  {project.name}
                </span>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-neutral-800 bg-neutral-950/30">
          {weekDays.map((day) => (
            <div key={day} className="px-2 py-3 text-center text-xs font-bold uppercase tracking-wider text-neutral-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-7">
          {calendarDays.map((date) => {
            const dateKey = toDateKey(date)
            const isCurrentMonth = date.getMonth() === visibleMonth.getMonth()
            const isToday = dateKey === todayKey
            const dayTasks = tasksByDate[dateKey] ?? []

            return (
              <div
                key={dateKey}
                className={`min-h-36 border-b border-neutral-800 p-3 sm:border-r ${
                  isCurrentMonth ? 'bg-neutral-900/20' : 'bg-neutral-950/45'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                      isToday
                        ? 'bg-primary-600 text-white shadow-glow'
                        : isCurrentMonth
                          ? 'text-neutral-200'
                          : 'text-neutral-600'
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold text-neutral-500">
                      {dayTasks.length}
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-2">
                  {dayTasks.slice(0, 4).map((task) => {
                    const project = projectById[task.projectId]
                    const color = projectColorClasses[project?.color ?? 'indigo'] ?? defaultProjectColor

                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`group flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left transition-colors ${color.bg} ${color.border}`}
                      >
                        <span className={`h-2 w-2 shrink-0 rounded-full ${color.dot}`} />
                        <span className={`min-w-0 flex-1 truncate text-xs font-semibold ${color.text}`}>
                          {task.title}
                        </span>
                      </button>
                    )
                  })}

                  {dayTasks.length > 4 && (
                    <div className="rounded-md border border-neutral-800 bg-neutral-950/40 px-2 py-1 text-[11px] font-semibold text-neutral-500">
                      +{dayTasks.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <TaskDetailModal
        isOpen={selectedTaskId !== null}
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />
    </div>
  )
}
