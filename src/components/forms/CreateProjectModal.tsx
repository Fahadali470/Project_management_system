/**
 * CreateProjectModal.tsx — Add Project Dialog Form
 *
 * Implements project creation using React Hook Form + Zod validator.
 * Integrates project priority, status selections, color branding choices,
 * and workspace team member assignments.
 */

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addProject } from '@/features/projects/projectsSlice'
import Modal from '@/components/ui/Modal'
import type { ProjectStatus, ProjectPriority } from '@/types/project.types'

const colorOptions = [
  { value: 'indigo', name: 'Indigo', bgClass: 'bg-indigo-600', ringClass: 'ring-indigo-500/40' },
  { value: 'rose', name: 'Rose', bgClass: 'bg-rose-600', ringClass: 'ring-rose-500/40' },
  { value: 'emerald', name: 'Emerald', bgClass: 'bg-emerald-600', ringClass: 'ring-emerald-500/40' },
  { value: 'cyan', name: 'Cyan', bgClass: 'bg-cyan-600', ringClass: 'ring-cyan-500/40' },
  { value: 'amber', name: 'Amber', bgClass: 'bg-amber-600', ringClass: 'ring-amber-500/40' },
  { value: 'purple', name: 'Purple', bgClass: 'bg-purple-600', ringClass: 'ring-purple-500/40' },
]

const projectSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Project name is required' })
    .min(3, { message: 'Project name must be at least 3 characters long' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(160, { message: 'Description must be under 160 characters' }),
  status: z.enum(['planning', 'active', 'completed', 'on_hold'] as const),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
  dueDate: z.string().min(1, { message: 'Due date is required' }),
  color: z.string(),
  memberIds: z.array(z.string()).min(1, { message: 'Assign at least one project member' }),
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const dispatch = useAppDispatch()
  const { members } = useAppSelector((state) => state.workspace)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      priority: 'medium',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 2 weeks from now
      color: 'indigo',
      memberIds: [],
    },
  })

  const onSubmit = (data: ProjectFormValues) => {
    // Resolve full member objects from selected IDs
    const projectMembers = members.filter((m) => data.memberIds.includes(m.id))

    dispatch(
      addProject({
        name: data.name,
        description: data.description,
        status: data.status as ProjectStatus,
        priority: data.priority as ProjectPriority,
        dueDate: data.dueDate,
        color: data.color,
        members: projectMembers,
      })
    )

    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-300">
            Project Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Website Redesign"
            {...register('name')}
            className={`mt-1.5 w-full rounded-lg bg-neutral-800 border ${
              errors.name ? 'border-red-500 focus:border-red-500' : 'border-neutral-700 focus:border-primary-500'
            } px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
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
            placeholder="Brief overview of the project objectives..."
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
              Initial Status
            </label>
            <select
              id="status"
              {...register('status')}
              className="mt-1.5 w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none"
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
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

        {/* Brand Theme / Color */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Project Theme
          </label>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <div className="flex gap-3">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={`h-8 w-8 rounded-full border border-neutral-900 focus:outline-none transition-all ${
                      opt.bgClass
                    } ${
                      field.value === opt.value
                        ? 'ring-4 ' + opt.ringClass + ' scale-110'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    title={opt.name}
                  />
                ))}
              </div>
            )}
          />
        </div>

        {/* Members Multiselect */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Assign Team Members
          </label>
          <div className="max-h-40 overflow-y-auto border border-neutral-800 rounded-lg p-3 space-y-2 bg-neutral-950/30 custom-scrollbar">
            {members.map((member) => (
              <label
                key={member.id}
                className="flex items-center gap-3 p-1.5 rounded hover:bg-neutral-800/40 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  value={member.id}
                  {...register('memberIds')}
                  className="rounded border-neutral-700 text-primary-600 focus:ring-primary-500/20 bg-neutral-800"
                />
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] font-semibold text-white">
                    {member.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{member.name}</p>
                    <p className="text-[10px] text-neutral-400 capitalize">{member.role}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.memberIds && (
            <p className="mt-1 text-xs text-red-400">{errors.memberIds.message}</p>
          )}
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
            Create Project
          </button>
        </div>
      </form>
    </Modal>
  )
}
