/**
 * project.types.ts — Project Domain Types
 *
 * Single source of truth for Project entities, status lists, and priorities.
 */

export type ProjectStatus = 'planning' | 'active' | 'completed' | 'on_hold'

export type ProjectPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface ProjectMember {
  id: string
  name: string
  email: string
  avatar: string | null
  role: 'owner' | 'admin' | 'member' | 'viewer'
}

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  dueDate: string
  color: string // Tailwind color class (e.g. 'indigo', 'emerald', 'amber', 'rose', 'cyan')
  members: ProjectMember[]
  progress: number // 0 to 100
  createdAt: string
  updatedAt: string
}

export interface ProjectsState {
  projects: Project[]
  activeProject: Project | null
  isLoading: boolean
  error: string | null
}
