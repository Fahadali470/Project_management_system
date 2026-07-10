/**
 * workspaceSlice.ts — Redux State Slice for Workspace and Members
 *
 * Manages details of the current workspace and the roster of members.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ProjectMember } from '@/types/project.types'

export interface Workspace {
  id: string
  name: string
  slug: string
  logo: string | null
}

export interface WorkspaceState {
  currentWorkspace: Workspace | null
  members: ProjectMember[]
  isLoading: boolean
  error: string | null
}

const mockMembers: ProjectMember[] = [
  {
    id: 'mem-1',
    name: 'Fahad Ali',
    email: 'fahad@taskflowpro.com',
    avatar: null,
    role: 'owner',
  },
  {
    id: 'mem-2',
    name: 'Sarah Connor',
    email: 'sarah@skynet.com',
    avatar: null,
    role: 'admin',
  },
  {
    id: 'mem-3',
    name: 'John Doe',
    email: 'john@taskflowpro.com',
    avatar: null,
    role: 'member',
  },
  {
    id: 'mem-4',
    name: 'Alice Smith',
    email: 'alice@taskflowpro.com',
    avatar: null,
    role: 'viewer',
  },
]

const initialState: WorkspaceState = {
  currentWorkspace: {
    id: 'ws-1',
    name: 'TaskFlow Pro Headquarters',
    slug: 'taskflow-hq',
    logo: null,
  },
  members: mockMembers,
  isLoading: false,
  error: null,
}

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    updateWorkspaceName: (state, action: PayloadAction<string>) => {
      if (state.currentWorkspace) {
        state.currentWorkspace.name = action.payload
      }
    },
    addMember: (state, action: PayloadAction<ProjectMember>) => {
      state.members.push(action.payload)
    },
    removeMember: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter((m) => m.id !== action.payload)
    },
  },
})

export const { updateWorkspaceName, addMember, removeMember } = workspaceSlice.actions

export default workspaceSlice.reducer
