/**
 * tasksSlice.ts — Redux State Slice for Tasks
 *
 * Manages Kanban tasks, statuses, priorities, assignees, and movement.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { TasksState, Task, TaskStatus } from '@/types/task.types'
import type { ProjectMember } from '@/types/project.types'

const mockMembers: ProjectMember[] = [
  { id: 'mem-1', name: 'Fahad Ali', email: 'fahad@taskflowpro.com', avatar: null, role: 'owner' },
  { id: 'mem-2', name: 'Sarah Connor', email: 'sarah@skynet.com', avatar: null, role: 'admin' },
  { id: 'mem-3', name: 'John Doe', email: 'john@taskflowpro.com', avatar: null, role: 'member' },
  { id: 'mem-4', name: 'Alice Smith', email: 'alice@taskflowpro.com', avatar: null, role: 'viewer' },
]

type TaskSeed = Omit<Task, 'comments' | 'attachments'>
type AddTaskPayload = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'> &
  Partial<Pick<Task, 'comments' | 'attachments'>>

const baseMockTasks: TaskSeed[] = [
  // TaskFlow SaaS Platform (proj-1)
  {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'Define design system colors and layout guidelines',
    description: 'Establish dark mode styling tokens, typography scales, and HSL custom palette variables for components.',
    status: 'done',
    priority: 'high',
    dueDate: '2026-06-15',
    assignee: mockMembers[1]!, // Sarah Connor
    createdAt: '2026-06-02T10:00:00Z',
    updatedAt: '2026-06-15T16:00:00Z',
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    title: 'Setup Redux state slices & persistent store sync',
    description: 'Configure RTK store, initialize auth state slice, and set up local storage persistence middleware.',
    status: 'done',
    priority: 'medium',
    dueDate: '2026-06-25',
    assignee: mockMembers[0]!, // Fahad Ali
    createdAt: '2026-06-03T11:00:00Z',
    updatedAt: '2026-06-25T14:30:00Z',
  },
  {
    id: 'task-3',
    projectId: 'proj-1',
    title: 'Implement routing guards & public/private shells',
    description: 'Write ProtectedRoute and PublicRoute component wrappers and map public page paths versus dashboard subpaths.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-07-15',
    assignee: mockMembers[2]!, // John Doe
    createdAt: '2026-06-10T09:00:00Z',
    updatedAt: '2026-07-10T11:15:00Z',
  },
  {
    id: 'task-4',
    projectId: 'proj-1',
    title: 'Create drag and drop Kanban dashboard components',
    description: 'Leverage @dnd-kit to render columns and handle sorting and updates across TODO, In Progress, Review, and Done.',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-07-25',
    assignee: mockMembers[0]!, // Fahad Ali
    createdAt: '2026-07-01T14:00:00Z',
    updatedAt: '2026-07-01T14:00:00Z',
  },
  {
    id: 'task-5',
    projectId: 'proj-1',
    title: 'Weld Recharts graphics and analytical metrics cards',
    description: 'Add AreaChart data visualizations to the primary dashboard. Connect real statistics counting formulas.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-07-30',
    assignee: mockMembers[3]!, // Alice Smith
    createdAt: '2026-07-02T15:00:00Z',
    updatedAt: '2026-07-02T15:00:00Z',
  },
  {
    id: 'task-6',
    projectId: 'proj-1',
    title: 'Write comprehensive unit tests for router protection',
    description: 'Configure Vitest and React Testing Library to simulate navigation actions and test token expiration behavior.',
    status: 'review',
    priority: 'low',
    dueDate: '2026-07-20',
    assignee: mockMembers[2]!, // John Doe
    createdAt: '2026-07-05T09:30:00Z',
    updatedAt: '2026-07-09T18:00:00Z',
  },

  // Skynet Defense System (proj-2)
  {
    id: 'task-7',
    projectId: 'proj-2',
    title: 'Neural core integration protocols validation',
    description: 'Verify model inference pipelines against live radar simulated inputs. Ensure sub-50ms feedback loops.',
    status: 'todo',
    priority: 'urgent',
    dueDate: '2026-07-20',
    assignee: mockMembers[1]!, // Sarah Connor
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-07-01T10:00:00Z',
  },
  {
    id: 'task-8',
    projectId: 'proj-2',
    title: 'Calibrate thermal telemetry feeds',
    description: 'Synchronize satellite raw telemetry inputs with the central temperature projection engine.',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2026-07-25',
    assignee: mockMembers[2]!, // John Doe
    createdAt: '2026-07-02T11:00:00Z',
    updatedAt: '2026-07-08T16:20:00Z',
  },

  // Marketing Website Redesign (proj-3)
  {
    id: 'task-9',
    projectId: 'proj-3',
    title: 'Deliver Q2 design assets and visual brand guide',
    description: 'Export all high-resolution logo marks, custom vector illustrations, and color guides.',
    status: 'done',
    priority: 'low',
    dueDate: '2026-06-20',
    assignee: mockMembers[3]!, // Alice Smith
    createdAt: '2026-05-20T10:00:00Z',
    updatedAt: '2026-06-20T15:00:00Z',
  },
  {
    id: 'task-10',
    projectId: 'proj-3',
    title: 'Deploy landing page structure and hero layout',
    description: 'Construct markup using semantic tags. Implement mobile responsive grids and custom slider mechanisms.',
    status: 'done',
    priority: 'medium',
    dueDate: '2026-06-30',
    assignee: mockMembers[0]!, // Fahad Ali
    createdAt: '2026-05-25T11:00:00Z',
    updatedAt: '2026-06-30T17:45:00Z',
  },

  // Mobile App Client (proj-4)
  {
    id: 'task-11',
    projectId: 'proj-4',
    title: 'Bootstrap React Native project structure',
    description: 'Initialize CLI application shell, integrate Tailwind elements, and construct navigation folders.',
    status: 'done',
    priority: 'medium',
    dueDate: '2026-06-30',
    assignee: mockMembers[2]!, // John Doe
    createdAt: '2026-06-16T10:00:00Z',
    updatedAt: '2026-06-30T16:00:00Z',
  },
  {
    id: 'task-12',
    projectId: 'proj-4',
    title: 'Implement authentication screens & token storage',
    description: 'Weld secure storage options for login sessions. Enable facial/touch ID quick unlock toggles.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-08-15',
    assignee: mockMembers[0]!, // Fahad Ali
    createdAt: '2026-06-20T09:00:00Z',
    updatedAt: '2026-07-09T14:00:00Z',
  },
  {
    id: 'task-13',
    projectId: 'proj-4',
    title: 'Setup push notification service configuration',
    description: 'Link Apple APNS and Google FCM dashboards with our back-end message relay server.',
    status: 'todo',
    priority: 'low',
    dueDate: '2026-09-01',
    assignee: mockMembers[0]!, // Fahad Ali
    createdAt: '2026-06-25T14:00:00Z',
    updatedAt: '2026-06-25T14:00:00Z',
  },
]

const initialMockTasks: Task[] = baseMockTasks.map((task) => ({
  ...task,
  comments: [],
  attachments: [],
}))

const initialState: TasksState = {
  tasks: initialMockTasks,
  isLoading: false,
  error: null,
}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<AddTaskPayload>) => {
      const newTask: Task = {
        ...action.payload,
        id: `task-${Math.random().toString(36).substring(2, 9)}`,
        comments: action.payload.comments ?? [],
        attachments: action.payload.attachments ?? [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.tasks.push(newTask)
    },
    updateTask: (state, action: PayloadAction<Partial<Task> & { id: string }>) => {
      const task = state.tasks.find((t) => t.id === action.payload.id)
      if (task) {
        Object.assign(task, action.payload)
        task.updatedAt = new Date().toISOString()
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload)
    },
    moveTask: (state, action: PayloadAction<{ id: string; status: TaskStatus }>) => {
      const task = state.tasks.find((t) => t.id === action.payload.id)
      if (task) {
        task.status = action.payload.status
        task.updatedAt = new Date().toISOString()
      }
    },
    addTaskComment: (
      state,
      action: PayloadAction<{ taskId: string; author: ProjectMember; message: string }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId)
      if (task) {
        task.comments.push({
          id: `comment-${Math.random().toString(36).substring(2, 9)}`,
          taskId: task.id,
          author: action.payload.author,
          message: action.payload.message,
          createdAt: new Date().toISOString(),
        })
        task.updatedAt = new Date().toISOString()
      }
    },
    removeTaskComment: (
      state,
      action: PayloadAction<{ taskId: string; commentId: string }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId)
      if (task) {
        task.comments = task.comments.filter((comment) => comment.id !== action.payload.commentId)
        task.updatedAt = new Date().toISOString()
      }
    },
    addTaskAttachment: (
      state,
      action: PayloadAction<{ taskId: string; name: string; url: string }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId)
      if (task) {
        task.attachments.push({
          id: `attachment-${Math.random().toString(36).substring(2, 9)}`,
          taskId: task.id,
          name: action.payload.name,
          url: action.payload.url,
          createdAt: new Date().toISOString(),
        })
        task.updatedAt = new Date().toISOString()
      }
    },
    removeTaskAttachment: (
      state,
      action: PayloadAction<{ taskId: string; attachmentId: string }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId)
      if (task) {
        task.attachments = task.attachments.filter((attachment) => attachment.id !== action.payload.attachmentId)
        task.updatedAt = new Date().toISOString()
      }
    },
    resetTasks: () => initialState,
  },
})

export const {
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  addTaskComment,
  removeTaskComment,
  addTaskAttachment,
  removeTaskAttachment,
  resetTasks,
} = tasksSlice.actions

export default tasksSlice.reducer
