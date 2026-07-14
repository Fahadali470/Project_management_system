import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { env } from '@/config/env'
import type { RootState } from '@/store'
import type { User } from '@/types/auth.types'
import type { Project } from '@/types/project.types'
import type { Task } from '@/types/task.types'
import type { Workspace } from '@/features/workspace/workspaceSlice'

interface TaskQueryParams {
  projectId?: string
  search?: string
}

export const taskflowApi = createApi({
  reducerPath: 'taskflowApi',
  baseQuery: fetchBaseQuery({
    baseUrl: env.API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  tagTypes: ['AuthUser', 'Workspace', 'Project', 'Task'],
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/me/',
      providesTags: ['AuthUser'],
    }),
    getWorkspace: builder.query<Workspace, void>({
      query: () => '/workspaces/current/',
      providesTags: ['Workspace'],
    }),
    getProjects: builder.query<Project[], void>({
      query: () => '/projects/',
      providesTags: (result) =>
        result
          ? [
              ...result.map((project) => ({ type: 'Project' as const, id: project.id })),
              { type: 'Project' as const, id: 'LIST' },
            ]
          : [{ type: 'Project' as const, id: 'LIST' }],
    }),
    getProject: builder.query<Project, string>({
      query: (projectId) => `/projects/${projectId}/`,
      providesTags: (_result, _error, projectId) => [{ type: 'Project', id: projectId }],
    }),
    getTasks: builder.query<Task[], TaskQueryParams | void>({
      query: (params) => ({
        url: '/tasks/',
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((task) => ({ type: 'Task' as const, id: task.id })),
              { type: 'Task' as const, id: 'LIST' },
            ]
          : [{ type: 'Task' as const, id: 'LIST' }],
    }),
  }),
})

export const {
  useGetCurrentUserQuery,
  useGetWorkspaceQuery,
  useGetProjectsQuery,
  useGetProjectQuery,
  useGetTasksQuery,
} = taskflowApi
