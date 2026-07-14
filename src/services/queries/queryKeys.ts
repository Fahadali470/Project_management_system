export const taskflowQueryKeys = {
  all: ['taskflow'] as const,
  authUser: () => [...taskflowQueryKeys.all, 'auth-user'] as const,
  workspace: () => [...taskflowQueryKeys.all, 'workspace'] as const,
  projects: () => [...taskflowQueryKeys.all, 'projects'] as const,
  project: (projectId: string) => [...taskflowQueryKeys.projects(), projectId] as const,
  tasks: (filters?: { projectId?: string; search?: string }) =>
    [...taskflowQueryKeys.all, 'tasks', filters ?? {}] as const,
}
