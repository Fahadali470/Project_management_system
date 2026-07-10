/**
 * ProjectsPage.tsx — Projects Dashboard View
 *
 * Renders the full portfolio list of projects. Includes status filtering,
 * completion progress tracking, member stacks, and quick navigation to details.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import EmptyState from '@/components/ui/EmptyState'
import CreateProjectModal from '@/components/forms/CreateProjectModal'
import type { ProjectStatus, Project } from '@/types/project.types'

const colorMaps: Record<string, { border: string; text: string; bg: string; bar: string }> = {
  indigo: {
    border: 'border-indigo-500/30 group-hover:border-indigo-500/60',
    text: 'text-indigo-400',
    bg: 'bg-indigo-500/5',
    bar: 'bg-indigo-500',
  },
  rose: {
    border: 'border-rose-500/30 group-hover:border-rose-500/60',
    text: 'text-rose-400',
    bg: 'bg-rose-500/5',
    bar: 'bg-rose-500',
  },
  emerald: {
    border: 'border-emerald-500/30 group-hover:border-emerald-500/60',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/5',
    bar: 'bg-emerald-500',
  },
  cyan: {
    border: 'border-cyan-500/30 group-hover:border-cyan-500/60',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/5',
    bar: 'bg-cyan-500',
  },
  amber: {
    border: 'border-amber-500/30 group-hover:border-amber-500/60',
    text: 'text-amber-400',
    bg: 'bg-amber-500/5',
    bar: 'bg-amber-500',
  },
  purple: {
    border: 'border-purple-500/30 group-hover:border-purple-500/60',
    text: 'text-purple-400',
    bg: 'bg-purple-500/5',
    bar: 'bg-purple-500',
  },
}

const defaultColor = {
  border: 'border-indigo-500/30 group-hover:border-indigo-500/60',
  text: 'text-indigo-400',
  bg: 'bg-indigo-500/5',
  bar: 'bg-indigo-500',
}

export default function ProjectsPage() {
  const { projects } = useAppSelector((state) => state.projects)
  const { tasks } = useAppSelector((state) => state.tasks)
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Compute stats/progress on the fly to keep in sync with real task completions
  const enrichProjectData = (project: Project) => {
    const projectTasks = tasks.filter((t) => t.projectId === project.id)
    const total = projectTasks.length
    const completed = projectTasks.filter((t) => t.status === 'done').length
    const computedProgress = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      ...project,
      progress: project.status === 'completed' && computedProgress === 0 ? 100 : computedProgress,
      taskCount: total,
      completedTaskCount: completed,
    }
  }

  const enrichedProjects = projects.map(enrichProjectData)

  const filteredProjects = enrichedProjects.filter(
    (p) => filter === 'all' || p.status === filter
  )

  const tabOptions: { value: ProjectStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All Projects' },
    { value: 'planning', label: 'Planning' },
    { value: 'active', label: 'Active' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
  ]

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Projects</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage your portfolios, monitor progress, and review key deadlines.
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
          New Project
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="border-b border-neutral-800">
        <nav className="flex space-x-6 overflow-x-auto pb-px" aria-label="Tabs">
          {tabOptions.map((tab) => {
            const isActive = filter === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all focus:outline-none ${
                  isActive
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description={
            filter === 'all'
              ? "You haven't created any projects yet. Build one to start tracking task workflows."
              : `There are currently no projects matching the status "${filter}".`
          }
          actionLabel={filter === 'all' ? 'Create Project' : undefined}
          onAction={filter === 'all' ? () => setIsCreateOpen(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const colorMeta = colorMaps[project.color] || defaultColor
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className={`group flex flex-col justify-between rounded-xl border bg-neutral-900/40 p-6 hover:bg-neutral-900/60 transition-all duration-350 cursor-pointer ${colorMeta.border}`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="project-status" value={project.status} />
                    <Badge variant="priority" value={project.priority} />
                  </div>

                  {/* Name & Desc */}
                  <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors leading-snug">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Progress, Members & Metadata */}
                <div className="mt-8 space-y-4">
                  {/* Task counts & percentage */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-400">
                      {project.completedTaskCount}/{project.taskCount} Tasks
                    </span>
                    <span className="font-semibold text-white">{project.progress}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colorMeta.bar}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800/40">
                    {/* Member Stacks */}
                    <div className="flex -space-x-2 overflow-hidden">
                      {project.members.slice(0, 4).map((member) => (
                        <Avatar
                          key={member.id}
                          name={member.name}
                          src={member.avatar}
                          size="xs"
                          className="ring-2 ring-neutral-900"
                        />
                      ))}
                      {project.members.length > 4 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-bold text-neutral-400 ring-2 ring-neutral-900">
                          +{project.members.length - 4}
                        </div>
                      )}
                    </div>

                    {/* Due Date Info */}
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                      <svg className="h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(project.dueDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Modal Dialog */}
      <CreateProjectModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  )
}
