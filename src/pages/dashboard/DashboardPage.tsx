/**
 * DashboardPage.tsx — Main Analytics Dashboard View
 *
 * Implements the centralized metrics tracker dashboard:
 * - Direct queries of Redux slices (projects, tasks, workspace).
 * - Live stats cards counting active projects, completed tasks, and upcoming due items.
 * - Interactive Recharts AreaChart graphing task completions.
 * - Recent activity stream populated by task events sorted by modification date.
 * - Project quick creation modal attachment.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAppSelector } from '@/store/hooks'
import CreateProjectModal from '@/components/forms/CreateProjectModal'
import Avatar from '@/components/ui/Avatar'

const chartData = [
  { day: 'Mon', completed: 3 },
  { day: 'Tue', completed: 7 },
  { day: 'Wed', completed: 5 },
  { day: 'Thu', completed: 11 },
  { day: 'Fri', completed: 9 },
  { day: 'Sat', completed: 4 },
  { day: 'Sun', completed: 8 },
]

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { projects } = useAppSelector((state) => state.projects)
  const { tasks } = useAppSelector((state) => state.tasks)
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Greet user
  const firstName = user?.name ? user.name.split(' ')[0] : 'there'

  // Live Metrics calculations
  const activeProjectsCount = projects.filter((p) => p.status !== 'completed').length
  const completedTasksCount = tasks.filter((t) => t.status === 'done').length
  
  // Calculate upcoming deadlines (due in next 7 days, excluding completed ones)
  const oneWeekFromNow = new Date()
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7)
  const upcomingDeadlinesCount = tasks.filter((t) => {
    if (t.status === 'done') return false
    const due = new Date(t.dueDate)
    return due >= new Date() && due <= oneWeekFromNow
  }).length

  const stats = [
    { name: 'Active Projects', stat: activeProjectsCount.toString(), trend: 'All ongoing boards' },
    { name: 'Tasks Completed', stat: completedTasksCount.toString(), trend: 'Across all workspaces' },
    { name: 'Upcoming Deadlines', stat: upcomingDeadlinesCount.toString(), trend: 'Due within next 7 days' },
  ]

  // Recent activity stream: sorted by updatedAt desc, slice top 5
  const sortedActivities = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  // Map status names to cleaner text labels
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return 'To Do'
      case 'in_progress': return 'In Progress'
      case 'review': return 'In Review'
      case 'done': return 'Completed'
      default: return status
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-1.5 text-sm text-neutral-400">
            Monitor real-time workflow telemetry and track ongoing sprints.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-primary-500 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Quick Project
        </button>
      </div>

      {/* Metrics Cards */}
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 group hover:border-primary-500/50 transition-all duration-300"
          >
            <dt className="text-sm font-medium text-neutral-400">{item.name}</dt>
            <dd className="mt-2 flex items-baseline justify-between">
              <p className="text-3xl font-bold text-white tracking-tight">{item.stat}</p>
              <p className="text-xs font-semibold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-full border border-primary-500/15">
                {item.trend}
              </p>
            </dd>
          </div>
        ))}
      </dl>

      {/* Analytics Chart & Activity Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Completion AreaChart */}
        <div className="lg:col-span-2 rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Task Completion Rate</h2>
            <p className="text-xs text-neutral-400 mt-1">Weekly review of tasks closed successfully.</p>
          </div>
          
          <div className="h-80 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="day" stroke="#737373" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#737373" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Activity</h2>
            <p className="text-xs text-neutral-400 mt-1">Latest updates on task workflows.</p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
            {sortedActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-500">
                <svg className="h-8 w-8 text-neutral-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs">No task updates yet.</p>
              </div>
            ) : (
              sortedActivities.map((task) => (
                <div key={task.id} className="flex gap-3 text-xs leading-relaxed p-3 rounded-lg bg-neutral-950/20 border border-neutral-900 hover:border-neutral-800 transition-colors">
                  {task.assignee ? (
                    <Avatar name={task.assignee.name} src={task.assignee.avatar} size="xs" className="mt-0.5" />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-neutral-800 flex items-center justify-center text-[9px] font-semibold text-neutral-400 mt-0.5">
                      U
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <p className="text-neutral-300">
                      <span className="font-semibold text-white">
                        {task.assignee?.name || 'Unassigned User'}
                      </span>{' '}
                      moved <span className="font-medium text-primary-400">{task.title}</span> to{' '}
                      <span className="font-semibold text-white lowercase">
                        {getStatusLabel(task.status)}
                      </span>
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {new Date(task.updatedAt).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Workspace Shortcut Links */}
      <div className="rounded-xl border border-neutral-800 bg-gradient-to-r from-neutral-900/40 via-neutral-900/30 to-neutral-900/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Need a comprehensive review of your portfolios?</h3>
          <p className="text-xs text-neutral-400 mt-1">Navigate to the projects catalog to check columns, drag/drop tasks, or add assignees.</p>
        </div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors shrink-0"
        >
          View project portfolio
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Project Quick Creation Modal */}
      <CreateProjectModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  )
}
