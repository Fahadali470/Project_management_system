import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  addTaskAttachment,
  addTaskComment,
  removeTaskAttachment,
  removeTaskComment,
  updateTask,
} from '@/features/tasks/tasksSlice'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import type { ProjectMember } from '@/types/project.types'
import type { TaskPriority } from '@/types/task.types'

const priorityOptions: TaskPriority[] = ['low', 'medium', 'high', 'urgent']

interface TaskDetailModalProps {
  isOpen: boolean
  taskId: string | null
  onClose: () => void
}

export default function TaskDetailModal({ isOpen, taskId, onClose }: TaskDetailModalProps) {
  const dispatch = useAppDispatch()
  const { tasks } = useAppSelector((state) => state.tasks)
  const { projects } = useAppSelector((state) => state.projects)
  const { user } = useAppSelector((state) => state.auth)

  const task = tasks.find((item) => item.id === taskId)
  const project = projects.find((item) => item.id === task?.projectId)
  const members = project?.members ?? []

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [commentText, setCommentText] = useState('')
  const [attachmentName, setAttachmentName] = useState('')
  const [attachmentUrl, setAttachmentUrl] = useState('')

  useEffect(() => {
    setTitle(task?.title ?? '')
    setDescription(task?.description ?? '')
    setCommentText('')
    setAttachmentName('')
    setAttachmentUrl('')
  }, [task?.id, task?.title, task?.description])

  const commentAuthor = useMemo<ProjectMember>(() => {
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      }
    }

    return (
      task?.assignee ??
      members[0] ?? {
        id: 'system-user',
        name: 'Workspace User',
        email: 'workspace@taskflowpro.com',
        avatar: null,
        role: 'member',
      }
    )
  }, [members, task?.assignee, user])

  const handleSaveBasics = () => {
    if (!task || !title.trim()) return

    dispatch(
      updateTask({
        id: task.id,
        title: title.trim(),
        description: description.trim(),
      })
    )
  }

  const handlePriorityChange = (priority: TaskPriority) => {
    if (!task) return
    dispatch(updateTask({ id: task.id, priority }))
  }

  const handleAssigneeChange = (memberId: string) => {
    if (!task) return
    const assignee = members.find((member) => member.id === memberId) ?? null
    dispatch(updateTask({ id: task.id, assignee }))
  }

  const handleCommentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!task || !commentText.trim()) return

    dispatch(
      addTaskComment({
        taskId: task.id,
        author: commentAuthor,
        message: commentText.trim(),
      })
    )
    setCommentText('')
  }

  const handleAttachmentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!task || !attachmentName.trim() || !attachmentUrl.trim()) return

    dispatch(
      addTaskAttachment({
        taskId: task.id,
        name: attachmentName.trim(),
        url: attachmentUrl.trim(),
      })
    )
    setAttachmentName('')
    setAttachmentUrl('')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Task Details' : 'Task Not Found'} size="xl">
      {!task ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-8 text-center">
          <p className="text-sm font-medium text-white">This task is no longer available.</p>
          <p className="mt-1 text-xs text-neutral-500">It may have been deleted from the board.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-6">
            <section className="rounded-xl border border-neutral-800 bg-neutral-950/30 p-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="task-title" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Title
                  </label>
                  <input
                    id="task-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm font-semibold text-white placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="task-description" className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Description
                  </label>
                  <textarea
                    id="task-description"
                    rows={6}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="mt-2 w-full resize-none rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm leading-relaxed text-neutral-200 placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveBasics}
                    disabled={!title.trim()}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-neutral-800 bg-neutral-950/30 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white">Attachments</h3>
                <span className="text-xs font-semibold text-neutral-500">{task.attachments.length}</span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {task.attachments.map((attachment) => (
                  <div key={attachment.id} className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noreferrer"
                        className="min-w-0 text-sm font-semibold text-primary-300 hover:text-primary-200"
                      >
                        <span className="block truncate">{attachment.name}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => dispatch(removeTaskAttachment({ taskId: task.id, attachmentId: attachment.id }))}
                        className="rounded p-1 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-red-400"
                        title="Remove attachment"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-1 truncate text-[11px] text-neutral-500">{attachment.url}</p>
                  </div>
                ))}
                {task.attachments.length === 0 && (
                  <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-900/30 p-4 text-sm text-neutral-500 sm:col-span-2">
                    No attachments added yet.
                  </div>
                )}
              </div>

              <form onSubmit={handleAttachmentSubmit} className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <input
                  value={attachmentName}
                  onChange={(event) => setAttachmentName(event.target.value)}
                  placeholder="Attachment name"
                  className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none"
                />
                <input
                  value={attachmentUrl}
                  onChange={(event) => setAttachmentUrl(event.target.value)}
                  placeholder="https://..."
                  className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!attachmentName.trim() || !attachmentUrl.trim()}
                  className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add
                </button>
              </form>
            </section>

            <section className="rounded-xl border border-neutral-800 bg-neutral-950/30 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-white">Comments</h3>
                <span className="text-xs font-semibold text-neutral-500">{task.comments.length}</span>
              </div>

              <div className="mt-4 space-y-3">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 rounded-lg border border-neutral-800 bg-neutral-900/60 p-3">
                    <Avatar name={comment.author.name} src={comment.author.avatar} size="xs" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-white">{comment.author.name}</p>
                        <div className="flex items-center gap-2">
                          <time className="text-[10px] text-neutral-500">
                            {new Date(comment.createdAt).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </time>
                          <button
                            type="button"
                            onClick={() => dispatch(removeTaskComment({ taskId: task.id, commentId: comment.id }))}
                            className="rounded p-1 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-red-400"
                            title="Remove comment"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">{comment.message}</p>
                    </div>
                  </div>
                ))}
                {task.comments.length === 0 && (
                  <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-900/30 p-4 text-sm text-neutral-500">
                    No comments yet.
                  </div>
                )}
              </div>

              <form onSubmit={handleCommentSubmit} className="mt-4 space-y-3">
                <textarea
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  rows={3}
                  placeholder="Add a note for the team..."
                  className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none"
                />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Avatar name={commentAuthor.name} src={commentAuthor.avatar} size="xs" />
                    Posting as <span className="font-semibold text-neutral-300">{commentAuthor.name}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add Comment
                  </button>
                </div>
              </form>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-xl border border-neutral-800 bg-neutral-950/30 p-4">
              <h3 className="text-sm font-bold text-white">Properties</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Project</p>
                  <p className="mt-1 text-sm font-medium text-white">{project?.name ?? 'Unknown project'}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</p>
                  <div className="mt-2">
                    <Badge variant="status" value={task.status} />
                  </div>
                </div>

                <div>
                  <label htmlFor="task-priority" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Priority
                  </label>
                  <select
                    id="task-priority"
                    value={task.priority}
                    onChange={(event) => handlePriorityChange(event.target.value as TaskPriority)}
                    className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-primary-500 focus:outline-none"
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="task-assignee" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Assignee
                  </label>
                  <select
                    id="task-assignee"
                    value={task.assignee?.id ?? ''}
                    onChange={(event) => handleAssigneeChange(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:border-primary-500 focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Due Date</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {new Date(task.dueDate).toLocaleDateString(undefined, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Updated</p>
                  <p className="mt-1 text-sm font-medium text-white">
                    {new Date(task.updatedAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-neutral-800 bg-neutral-950/30 p-4">
              <h3 className="text-sm font-bold text-white">Current Assignee</h3>
              {task.assignee ? (
                <div className="mt-4 flex items-center gap-3">
                  <Avatar name={task.assignee.name} src={task.assignee.avatar} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{task.assignee.name}</p>
                    <p className="truncate text-xs text-neutral-500">{task.assignee.email}</p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-neutral-500">No teammate assigned.</p>
              )}
            </section>
          </aside>
        </div>
      )}
    </Modal>
  )
}
