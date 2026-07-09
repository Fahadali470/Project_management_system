/**
 * DashboardPage.tsx — Main Dashboard Landing View
 *
 * This is the default overview page users see when logging in.
 * Currently serves as a structural placeholder for Phase 1.
 * Will later contain real metrics, recent activity feeds, and task summaries.
 */

import { useAppSelector } from '@/store/hooks'

const stats = [
  { name: 'Active Projects', stat: '12', trend: '+2 this week' },
  { name: 'Tasks Completed', stat: '48', trend: 'In the last 7 days' },
  { name: 'Upcoming Deadlines', stat: '5', trend: 'Needs attention soon' },
]

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth)
  
  // Extract first name for a friendly greeting, fallback to "there"
  const firstName = user?.name ? user.name.split(' ')[0] : 'there'

  return (
    <div className="space-y-8">
      {/* Greeting Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back, {firstName} 👋
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Here is a quick overview of what's happening across your workspaces today.
        </p>
      </div>

      {/* Metrics Grid Skeleton */}
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 pt-5 pb-12 shadow-sm sm:px-6 sm:pt-6 group hover:border-primary-500/50 transition-colors"
          >
            <dt>
              <p className="truncate text-sm font-medium text-neutral-400">{item.name}</p>
            </dt>
            <dd className="flex items-baseline pb-6 sm:pb-7">
              <p className="text-3xl font-bold text-white">{item.stat}</p>
              <p className="ml-2 flex items-baseline text-sm font-semibold text-primary-400">
                {item.trend}
              </p>
              
              <div className="absolute inset-x-0 bottom-0 bg-neutral-800/30 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-400 hover:text-primary-300 transition-colors">
                    View all<span className="sr-only"> {item.name} stats</span>
                  </a>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </dl>

      {/* Placeholder Activity Feed Area */}
      <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900/30 p-6">
        <h2 className="text-lg font-medium text-white mb-4">Recent Activity</h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg className="h-12 w-12 text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-neutral-400 font-medium">No recent activity found.</p>
          <p className="text-sm text-neutral-500 mt-1">Activities will populate here as you interact with projects.</p>
        </div>
      </div>
    </div>
  )
}
