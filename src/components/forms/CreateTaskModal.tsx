/**
 * CreateTaskModal.tsx — Add Task Dialog Form
 *
 * Implements task creation using React Hook Form + Zod validator.
 * Populates task assignees dynamically based on the current project's member roster.
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addTask } from '@/features/tasks/tasksSlice'
import Modal from '@/components/ui/Modal'
import type { TaskStatus, TaskPriority } from '@/types/task.types'

const taskSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Task title is required' })
    .min(3, { message: 'Task title must be at least 3 characters long' }),
  description: z
    .string()
    .min(1, { message: 'Task description is required' })
    .max(250, { message: 'Description must be under 250 characters' }),
  status: z.enum(['todo', 'in_progress', 'review', 'done'] as const),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
  dueDate: z.string().min(1, { message: 'Due date is required' }),
  assigneeId: z.string().optional().or(z.literal('')), // Optional, can be unassigned
})

type TaskFormValues = z.infer<typeof taskSchema>

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
}

export default function CreateTaskModal({ isOpen, onClose, projectId }: CreateTaskModalProps) {
  const dispatch = useAppDispatch()
  
  // Find project in state to retrieve its assigned members
  const project = useAppSelector((state) =>
    state.projects.projects.find((p) => p.id === projectId)
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 1 week from now
      assigneeId: '',
    },
  })

  const onSubmit = (data: TaskFormValues) => {
    // Resolve assignee details
    const assigneeObj = project?.members.find((m) => m.id === data.assigneeId) || null

    dispatch(
      addTask({
        projectId,
        title: data.title,
        description: data.description,
        status: data.status as TaskStatus,
        priority: data.priority as TaskPriority,
        dueDate: data.dueDate,
        assignee: assigneeObj,
      })
    )

    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-300">
            Task Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Implement layout design"
            {...register('title')}
            className={`mt-1.5 w-full rounded-lg bg-neutral-800 border ${
              errors.title ? 'border-red-500 focus:border-red-500' : 'border-neutral-700 focus:border-primary-500'
            } px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-300">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="What needs to be accomplished in this task..."
            {...register('description')}
            className={`mt-1.5 w-full rounded-lg bg-neutral-800 border ${
              errors.description ? 'border-red-500 focus:border-red-500' : 'border-neutral-700 focus:border-primary-500'
            } px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors resize-none`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-neutral-300">
              Column / Status
            </label>
            <select
              id="status"
              {...register('status')}
              className="mt-1.5 w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-neutral-300">
              Priority
            </label>
            <select
              id="priority"
              {...register('priority')}
              className="mt-1.5 w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-300">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            className={`mt-1.5 w-full rounded-lg bg-neutral-800 border ${
              errors.dueDate ? 'border-red-500' : 'border-neutral-700'
            } px-4 py-2 text-sm text-white focus:border-primary-500 focus:outline-none`}
          />
          {errors.dueDate && (
            <p className="mt-1 text-xs text-red-400">{errors.dueDate.message}</p>
          )}
        </div>

        {/* Assignee Selection */}
        <div>
          <label htmlFor="assigneeId" className="block text-sm font-medium text-neutral-300">
            Assignee
          </label>
          <select
            id="assigneeId"
            {...register('assigneeId')}
            className="mt-1.5 w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none"
          >
            <option value="">Unassigned</option>
            {project?.members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.role})
              </option>
            ))}
          </select>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-400 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-600 hover:bg-primary-500 transition-colors shadow-glow"
          >
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  )
}
