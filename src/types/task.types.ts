/**
 * task.types.ts — Task Domain Types
 *
 * Single source of truth for Task entities, columns, priorities, and action shapes.
 */

import type { ProjectMember } from './project.types'

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface TaskComment {
  id: string
  taskId: string
  author: ProjectMember
  message: string
  createdAt: string
}

export interface TaskAttachment {
  id: string
  taskId: string
  name: string
  url: string
  createdAt: string
}

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  assignee: ProjectMember | null
  comments: TaskComment[]
  attachments: TaskAttachment[]
  createdAt: string
  updatedAt: string
}

export interface TasksState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
}
