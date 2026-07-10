/**
 * projectsSlice.ts — Redux State Slice for Projects
 *
 * Manages list of active projects, project CRUD operations, and current selection.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ProjectsState, Project, ProjectMember } from '@/types/project.types'

const mockMembers: ProjectMember[] = [
  { id: 'mem-1', name: 'Fahad Ali', email: 'fahad@taskflowpro.com', avatar: null, role: 'owner' },
  { id: 'mem-2', name: 'Sarah Connor', email: 'sarah@skynet.com', avatar: null, role: 'admin' },
  { id: 'mem-3', name: 'John Doe', email: 'john@taskflowpro.com', avatar: null, role: 'member' },
  { id: 'mem-4', name: 'Alice Smith', email: 'alice@taskflowpro.com', avatar: null, role: 'viewer' },
]

const initialMockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'TaskFlow SaaS Platform',
    description: 'Core product engineering. Building high performance board interfaces and task workflows.',
    status: 'active',
    priority: 'high',
    dueDate: '2026-08-30',
    color: 'indigo',
    members: [mockMembers[0]!, mockMembers[1]!, mockMembers[2]!],
    progress: 65,
    createdAt: '2026-06-01T08:00:00Z',
    updatedAt: '2026-07-10T12:00:00Z',
  },
  {
    id: 'proj-2',
    name: 'Skynet Defense System',
    description: 'System integrity monitoring and predictive neural threat analysis dashboard.',
    status: 'on_hold',
    priority: 'urgent',
    dueDate: '2026-12-31',
    color: 'rose',
    members: [mockMembers[0]!, mockMembers[1]!],
    progress: 12,
    createdAt: '2026-07-01T09:00:00Z',
    updatedAt: '2026-07-09T15:30:00Z',
  },
  {
    id: 'proj-3',
    name: 'Marketing Website Redesign',
    description: 'Overhaul corporate page with modern interactive components and high-converting layouts.',
    status: 'completed',
    priority: 'low',
    dueDate: '2026-07-01',
    color: 'emerald',
    members: [mockMembers[0]!, mockMembers[2]!, mockMembers[3]!],
    progress: 100,
    createdAt: '2026-05-15T10:00:00Z',
    updatedAt: '2026-07-01T17:00:00Z',
  },
  {
    id: 'proj-4',
    name: 'Mobile App Client (React Native)',
    description: 'Companion mobile app implementing task push notifications and simple list viewing.',
    status: 'active',
    priority: 'medium',
    dueDate: '2026-10-15',
    color: 'cyan',
    members: [mockMembers[0]!, mockMembers[2]!],
    progress: 40,
    createdAt: '2026-06-15T11:00:00Z',
    updatedAt: '2026-07-10T10:00:00Z',
  },
  {
    id: 'proj-5',
    name: 'Q3 Product Expansion Strategy',
    description: 'Strategy document and roadmap creation for international markets expansion.',
    status: 'planning',
    priority: 'low',
    dueDate: '2026-09-15',
    color: 'amber',
    members: [mockMembers[0]!, mockMembers[3]!],
    progress: 0,
    createdAt: '2026-07-05T08:00:00Z',
    updatedAt: '2026-07-05T08:00:00Z',
  },
]

const initialState: ProjectsState = {
  projects: initialMockProjects,
  activeProject: null,
  isLoading: false,
  error: null,
}

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Omit<Project, 'id' | 'progress' | 'createdAt' | 'updatedAt'>>) => {
      const newProject: Project = {
        ...action.payload,
        id: `proj-${Math.random().toString(36).substring(2, 9)}`,
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.projects.push(newProject)
    },
    updateProject: (state, action: PayloadAction<Partial<Project> & { id: string }>) => {
      const project = state.projects.find((p) => p.id === action.payload.id)
      if (project) {
        Object.assign(project, action.payload)
        project.updatedAt = new Date().toISOString()
        
        if (state.activeProject && state.activeProject.id === action.payload.id) {
          state.activeProject = {
            ...state.activeProject,
            ...action.payload,
            updatedAt: new Date().toISOString(),
          }
        }
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload)
      if (state.activeProject && state.activeProject.id === action.payload) {
        state.activeProject = null
      }
    },
    setActiveProject: (state, action: PayloadAction<string | null>) => {
      const found = state.projects.find((p) => p.id === action.payload)
      state.activeProject = found || null
    },
    updateProjectProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const project = state.projects.find((p) => p.id === action.payload.id)
      if (project) {
        project.progress = action.payload.progress
        if (state.activeProject && state.activeProject.id === action.payload.id) {
          state.activeProject.progress = action.payload.progress
        }
      }
    },
    resetProjects: () => initialState,
  },
})

export const {
  addProject,
  updateProject,
  deleteProject,
  setActiveProject,
  updateProjectProgress,
  resetProjects,
} = projectsSlice.actions

export default projectsSlice.reducer
