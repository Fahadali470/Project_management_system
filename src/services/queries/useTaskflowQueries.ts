import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/services/api'
import { taskflowQueryKeys } from './queryKeys'
import type { User } from '@/types/auth.types'
import type { Project } from '@/types/project.types'
import type { Task } from '@/types/task.types'
import type { Workspace } from '@/features/workspace/workspaceSlice'

interface TaskFilters {
  projectId?: string
  search?: string
}

async function getData<TResponse>(url: string, params?: object) {
  const response = await apiClient.get<TResponse>(url, { params })
  return response.data
}

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: taskflowQueryKeys.authUser(),
    queryFn: () => getData<User>('/auth/me/'),
  })
}

export function useWorkspaceQuery() {
  return useQuery({
    queryKey: taskflowQueryKeys.workspace(),
    queryFn: () => getData<Workspace>('/workspaces/current/'),
  })
}

export function useProjectsQuery() {
  return useQuery({
    queryKey: taskflowQueryKeys.projects(),
    queryFn: () => getData<Project[]>('/projects/'),
  })
}

export function useProjectQuery(projectId: string | undefined) {
  return useQuery({
    queryKey: taskflowQueryKeys.project(projectId ?? 'missing-project'),
    queryFn: () => getData<Project>(`/projects/${projectId}/`),
    enabled: Boolean(projectId),
  })
}

export function useTasksQuery(filters?: TaskFilters) {
  return useQuery({
    queryKey: taskflowQueryKeys.tasks(filters),
    queryFn: () => getData<Task[]>('/tasks/', filters),
  })
}
