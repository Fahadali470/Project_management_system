/**
 * ProjectDetailPage.tsx — Detailed Project Board View (Kanban Board)
 *
 * Implements a full drag-and-drop Kanban Board layout divided into columns:
 * Todo | In Progress | Review | Done.
 * Incorporates active task metrics, priority indicators, delete triggers,
 * and quick addition modal wrappers.
 */

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { DndContext, useDraggable, useDroppable, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { moveTask, deleteTask } from '@/features/tasks/tasksSlice'
import { setActiveProject } from '@/features/projects/projectsSlice'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import EmptyState from '@/components/ui/EmptyState'
import CreateTaskModal from '@/components/forms/CreateTaskModal'
import type { Task, TaskStatus } from '@/types/task.types'

const COLUMNS: { id: TaskStatus; title: string; bgClass: string; textClass: string; dotClass: string }[] = [
  { id: 'todo', title: 'To Do', bgClass: 'bg-neutral-900/30', textClass: 'text-neutral-400', dotClass: 'bg-neutral-500' },
  { id: 'in_progress', title: 'In Progress', bgClass: 'bg-primary-950/10', textClass: 'text-primary-400', dotClass: 'bg-primary-500' },
  { id: 'review', title: 'In Review', bgClass: 'bg-purple-950/10', textClass: 'text-purple-400', dotClass: 'bg-purple-500' },
  { id: 'done', title: 'Completed', bgClass: 'bg-emerald-950/10', textClass: 'text-emerald-400', dotClass: 'bg-emerald-500' },
]

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const project = useAppSelector((state) =>
    state.projects.projects.find((p) => p.id === projectId)
  )

  const allTasks = useAppSelector((state) => state.tasks.tasks)
  const projectTasks = allTasks.filter((t) => t.projectId === projectId)

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [activeDragId, setActiveDragId] = useState<string | null>(null)

  // Track project selection in Redux for child views if any
  useEffect(() => {
    if (projectId) {
      dispatch(setActiveProject(projectId))
    }
    return () => {
      dispatch(setActiveProject(null))
    }
  }, [projectId, dispatch])

  if (!project) {
    return (
      <div className="py-12">
        <EmptyState
          title="Project not found"
          description="The project you are looking for does not exist or has been deleted."
          actionLabel="Back to projects"
          onAction={() => navigate('/projects')}
        />
      </div>
    )
  }

  // Handle task drag logic
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null)
    const { active, over } = event

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    // Dispatches task status movement
    dispatch(moveTask({ id: taskId, status: newStatus }))
  }

  const activeDragTask = projectTasks.find((t) => t.id === activeDragId)

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm font-medium text-neutral-400">
        <Link to="/projects" className="hover:text-white transition-colors">
          Projects
        </Link>
        <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-white truncate max-w-xs">{project.name}</span>
      </div>

      {/* Project Header Info */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-neutral-800">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-white">{project.name}</h1>
            <Badge variant="project-status" value={project.status} />
            <Badge variant="priority" value={project.priority} />
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed">{project.description}</p>
        </div>

        {/* Action Panel / Members list */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 shrink-0">
          {/* Members list */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Assigned Team
            </p>
            <div className="flex -space-x-1.5">
              {project.members.map((member) => (
                <Avatar
                  key={member.id}
                  name={member.name}
                  src={member.avatar}
                  size="sm"
                  className="ring-2 ring-neutral-950"
                />
              ))}
            </div>
          </div>

          {/* Quick Create Task */}
          <button
            type="button"
            onClick={() => setIsAddTaskOpen(true)}
            className="inline-flex items-center gap-2 justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-primary-500 transition-colors self-end md:self-auto"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board Area */}
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start pb-12">
          {COLUMNS.map((col) => {
            const columnTasks = projectTasks.filter((t) => t.status === col.id)
            return (
              <DroppableColumn key={col.id} col={col} taskCount={columnTasks.length}>
                <div className="space-y-4">
                  {columnTasks.map((task) => (
                    <DraggableTaskCard key={task.id} task={task} />
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 px-4 rounded-xl border border-dashed border-neutral-800 bg-neutral-900/5 text-center text-xs text-neutral-500">
                      Drag tasks here
                    </div>
                  )}
                </div>
              </DroppableColumn>
            )
          })}
        </div>

        {/* Drag Overlay for seamless card moving visuals */}
        <DragOverlay>
          {activeDragId ? (
            <div className="opacity-90 scale-105 rotate-1 cursor-grabbing">
              <TaskCard task={activeDragTask!} isOverlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Creation Modal */}
      <CreateTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        projectId={project.id}
      />
    </div>
  )
}

// ─────────────────────────────────────────────
//  Droppable Column Component
// ─────────────────────────────────────────────

interface DroppableColumnProps {
  col: (typeof COLUMNS)[number]
  taskCount: number
  children: React.ReactNode
}

function DroppableColumn({ col, taskCount, children }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: col.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border transition-colors p-4 flex flex-col min-h-[500px] ${col.bgClass} ${
        isOver ? 'border-primary-500/40 bg-neutral-800/10' : 'border-neutral-800/60'
      }`}
    >
      {/* Column Title */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800/50">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${col.dotClass}`} />
          <h3 className="text-sm font-bold text-white tracking-wide">{col.title}</h3>
        </div>
        <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs font-semibold text-neutral-400">
          {taskCount}
        </span>
      </div>

      {/* Column Cards */}
      <div className="flex-1">{children}</div>
    </div>
  )
}

// ─────────────────────────────────────────────
//  Draggable Card Wrapper Component
// ─────────────────────────────────────────────

function DraggableTaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  // Disable standard translations when card is being represented in the DragOverlay
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  if (isDragging) {
    return <div ref={setNodeRef} style={style} className="h-[120px] rounded-xl border border-dashed border-neutral-800 bg-neutral-900/10 opacity-30" />
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
      <TaskCard task={task} />
    </div>
  )
}

// ─────────────────────────────────────────────
//  Task Card View Component
// ─────────────────────────────────────────────

function TaskCard({ task, isOverlay = false }: { task: Task; isOverlay?: boolean }) {
  const dispatch = useAppDispatch()

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      dispatch(deleteTask(task.id))
    }
  }

  return (
    <div
      className={`group relative rounded-xl border border-neutral-800 bg-neutral-900 p-4 shadow-sm hover:border-neutral-700/80 transition-all ${
        isOverlay ? 'shadow-glow border-primary-500/50' : ''
      }`}
    >
      {/* Top Details */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <Badge variant="priority" value={task.priority} />
        
        {/* Delete Card Button */}
        {!isOverlay && (
          <button
            type="button"
            onClick={handleDelete}
            className="md:opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-neutral-800 text-neutral-500 hover:text-red-400 transition-all focus:outline-none"
            title="Delete task"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Title & Description */}
      <h4 className="text-sm font-bold text-white tracking-tight leading-snug line-clamp-2">
        {task.title}
      </h4>
      <p className="mt-1 text-xs text-neutral-400 leading-relaxed line-clamp-2">
        {task.description}
      </p>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between pt-2.5 border-t border-neutral-800/40">
        {/* Due Date */}
        <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-500">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(task.dueDate).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </div>

        {/* Assignee Avatar */}
        {task.assignee ? (
          <Avatar name={task.assignee.name} src={task.assignee.avatar} size="xs" />
        ) : (
          <div className="h-5 w-5 rounded-full border border-dashed border-neutral-800 bg-neutral-900 flex items-center justify-center text-[8px] font-semibold text-neutral-500" title="Unassigned">
            U
          </div>
        )}
      </div>
    </div>
  )
}
