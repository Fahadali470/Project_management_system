import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { updateUserProfile } from '@/features/auth/authSlice'
import {
  addMember,
  removeMember,
  resetWorkspace,
  updateWorkspace,
} from '@/features/workspace/workspaceSlice'
import { resetProjects } from '@/features/projects/projectsSlice'
import { resetTasks } from '@/features/tasks/tasksSlice'
import Avatar from '@/components/ui/Avatar'
import type { ProjectMember } from '@/types/project.types'
import type { User } from '@/types/auth.types'

type SettingsTab = 'profile' | 'workspace' | 'team' | 'developer'

const tabs: { id: SettingsTab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'team', label: 'Team' },
  { id: 'developer', label: 'Developer' },
]

const roleOptions: ProjectMember['role'][] = ['owner', 'admin', 'member', 'viewer']

const timezoneOptions = [
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Europe/London',
  'Asia/Karachi',
  'Asia/Dubai',
]

function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

export default function SettingsPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { currentWorkspace, members } = useAppSelector((state) => state.workspace)

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [notice, setNotice] = useState('')
  const [resetEnabled, setResetEnabled] = useState(false)

  const [profileForm, setProfileForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    role: (user?.role ?? 'owner') as User['role'],
  })

  const [workspaceForm, setWorkspaceForm] = useState({
    name: currentWorkspace?.name ?? '',
    slug: currentWorkspace?.slug ?? '',
    companyEmail: currentWorkspace?.companyEmail ?? '',
    companyWebsite: currentWorkspace?.companyWebsite ?? '',
    timezone: currentWorkspace?.timezone ?? 'America/New_York',
  })

  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    role: 'member' as ProjectMember['role'],
  })

  useEffect(() => {
    setProfileForm({
      name: user?.name ?? '',
      email: user?.email ?? '',
      role: (user?.role ?? 'owner') as User['role'],
    })
  }, [user])

  useEffect(() => {
    setWorkspaceForm({
      name: currentWorkspace?.name ?? '',
      slug: currentWorkspace?.slug ?? '',
      companyEmail: currentWorkspace?.companyEmail ?? '',
      companyWebsite: currentWorkspace?.companyWebsite ?? '',
      timezone: currentWorkspace?.timezone ?? 'America/New_York',
    })
  }, [currentWorkspace])

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(updateUserProfile(profileForm))
    setNotice('Profile settings saved.')
  }

  const handleWorkspaceSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(updateWorkspace(workspaceForm))
    setNotice('Workspace metadata saved.')
  }

  const handleMemberSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!memberForm.name.trim() || !memberForm.email.trim()) return

    dispatch(
      addMember({
        id: `mem-${Math.random().toString(36).substring(2, 9)}`,
        name: memberForm.name.trim(),
        email: memberForm.email.trim(),
        avatar: null,
        role: memberForm.role,
      })
    )

    setMemberForm({ name: '', email: '', role: 'member' })
    setNotice('Team member added.')
  }

  const handleResetMockData = () => {
    localStorage.clear()
    dispatch(resetTasks())
    dispatch(resetProjects())
    dispatch(resetWorkspace())
    setResetEnabled(false)
    setNotice('Local storage cleared and mock data reset.')
  }

  const ownerCount = members.filter((member) => member.role === 'owner').length

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage profile, workspace, team, and local development data.
          </p>
        </div>

        {notice && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
            {notice}
          </div>
        )}
      </div>

      <div className="border-b border-neutral-800">
        <nav className="flex gap-6 overflow-x-auto" role="tablist" aria-label="Settings sections">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveTab(tab.id)
                  setNotice('')
                }}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-neutral-400 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {activeTab === 'profile' && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <form onSubmit={handleProfileSubmit} className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <div>
              <h2 className="text-lg font-bold text-white">User Profile</h2>
              <p className="mt-1 text-sm text-neutral-400">Update the identity used across your workspace.</p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="profile-name" className="block text-sm font-medium text-neutral-300">
                  Full name
                </label>
                <input
                  id="profile-name"
                  value={profileForm.name}
                  onChange={(event) => setProfileForm((current) => ({ ...current, name: event.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="profile-email" className="block text-sm font-medium text-neutral-300">
                  Email address
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={profileForm.email}
                  onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="profile-role" className="block text-sm font-medium text-neutral-300">
                  Role
                </label>
                <select
                  id="profile-role"
                  value={profileForm.role}
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, role: event.target.value as User['role'] }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {formatRole(role)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-neutral-800 pt-5">
              <button
                type="submit"
                disabled={!profileForm.name.trim() || !profileForm.email.trim()}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save Profile
              </button>
            </div>
          </form>

          <aside className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <h2 className="text-lg font-bold text-white">Signed In</h2>
            <div className="mt-5 flex items-center gap-4">
              <Avatar name={profileForm.name || 'Workspace User'} src={user?.avatar} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{profileForm.name || 'Workspace User'}</p>
                <p className="truncate text-xs text-neutral-500">{profileForm.email || 'No email'}</p>
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-neutral-800 bg-neutral-950/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Current role</p>
              <p className="mt-1 text-sm font-semibold text-primary-300">{formatRole(profileForm.role)}</p>
            </div>
          </aside>
        </div>
      )}

      {activeTab === 'workspace' && (
        <form onSubmit={handleWorkspaceSubmit} className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
          <div>
            <h2 className="text-lg font-bold text-white">Workspace Metadata</h2>
            <p className="mt-1 text-sm text-neutral-400">Adjust company-level details used by the project hub.</p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="workspace-name" className="block text-sm font-medium text-neutral-300">
                Company name
              </label>
              <input
                id="workspace-name"
                value={workspaceForm.name}
                onChange={(event) => setWorkspaceForm((current) => ({ ...current, name: event.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="workspace-slug" className="block text-sm font-medium text-neutral-300">
                Workspace slug
              </label>
              <input
                id="workspace-slug"
                value={workspaceForm.slug}
                onChange={(event) => setWorkspaceForm((current) => ({ ...current, slug: event.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="workspace-email" className="block text-sm font-medium text-neutral-300">
                Company email
              </label>
              <input
                id="workspace-email"
                type="email"
                value={workspaceForm.companyEmail}
                onChange={(event) => setWorkspaceForm((current) => ({ ...current, companyEmail: event.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="workspace-site" className="block text-sm font-medium text-neutral-300">
                Website
              </label>
              <input
                id="workspace-site"
                type="url"
                value={workspaceForm.companyWebsite}
                onChange={(event) => setWorkspaceForm((current) => ({ ...current, companyWebsite: event.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="workspace-timezone" className="block text-sm font-medium text-neutral-300">
                Timezone
              </label>
              <select
                id="workspace-timezone"
                value={workspaceForm.timezone}
                onChange={(event) => setWorkspaceForm((current) => ({ ...current, timezone: event.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none"
              >
                {timezoneOptions.map((timezone) => (
                  <option key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end border-t border-neutral-800 pt-5">
            <button
              type="submit"
              disabled={!workspaceForm.name.trim() || !workspaceForm.slug.trim()}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Workspace
            </button>
          </div>
        </form>
      )}

      {activeTab === 'team' && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Team Roster</h2>
                <p className="mt-1 text-sm text-neutral-400">Add teammates or remove users from the workspace roster.</p>
              </div>
              <span className="rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs font-semibold text-neutral-400">
                {members.length} members
              </span>
            </div>

            <div className="mt-6 divide-y divide-neutral-800 overflow-hidden rounded-xl border border-neutral-800">
              {members.map((member) => {
                const canRemove = !(member.role === 'owner' && ownerCount <= 1)
                return (
                  <div key={member.id} className="flex flex-col gap-4 bg-neutral-950/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={member.name} src={member.avatar} size="md" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{member.name}</p>
                        <p className="truncate text-xs text-neutral-500">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <span className="rounded-full border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-xs font-semibold capitalize text-neutral-300">
                        {member.role}
                      </span>
                      <button
                        type="button"
                        disabled={!canRemove}
                        onClick={() => {
                          dispatch(removeMember(member.id))
                          setNotice('Team member removed.')
                        }}
                        className="rounded-lg border border-neutral-800 px-3 py-2 text-xs font-semibold text-red-300 transition-colors hover:border-red-500/30 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:text-neutral-600 disabled:hover:border-neutral-800 disabled:hover:bg-transparent"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <form onSubmit={handleMemberSubmit} className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
            <h2 className="text-lg font-bold text-white">Add Member</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="member-name" className="block text-sm font-medium text-neutral-300">
                  Name
                </label>
                <input
                  id="member-name"
                  value={memberForm.name}
                  onChange={(event) => setMemberForm((current) => ({ ...current, name: event.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="member-email" className="block text-sm font-medium text-neutral-300">
                  Email
                </label>
                <input
                  id="member-email"
                  type="email"
                  value={memberForm.email}
                  onChange={(event) => setMemberForm((current) => ({ ...current, email: event.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="member-role" className="block text-sm font-medium text-neutral-300">
                  Role
                </label>
                <select
                  id="member-role"
                  value={memberForm.role}
                  onChange={(event) =>
                    setMemberForm((current) => ({ ...current, role: event.target.value as ProjectMember['role'] }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-white focus:border-primary-500 focus:outline-none"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {formatRole(role)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!memberForm.name.trim() || !memberForm.email.trim()}
              className="mt-6 w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add Teammate
            </button>
          </form>
        </div>
      )}

      {activeTab === 'developer' && (
        <section className="max-w-3xl rounded-xl border border-neutral-800 bg-neutral-900/40 p-6">
          <div>
            <h2 className="text-lg font-bold text-white">Developer Utilities</h2>
            <p className="mt-1 text-sm text-neutral-400">Clear browser cache entries and restore the seeded mock workspace.</p>
          </div>

          <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950/40 p-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={resetEnabled}
                onChange={(event) => setResetEnabled(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-primary-600 focus:ring-primary-500/20"
              />
              <span>
                <span className="block text-sm font-semibold text-white">Enable mock data reset</span>
                <span className="mt-1 block text-xs leading-relaxed text-neutral-500">
                  This clears local storage and reloads the default project, task, and workspace slices.
                </span>
              </span>
            </label>

            <button
              type="button"
              disabled={!resetEnabled}
              onClick={handleResetMockData}
              className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:border-neutral-800 disabled:bg-neutral-900 disabled:text-neutral-600"
            >
              Clear Cache And Reset Mock Data
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
