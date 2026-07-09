/**
 * AuthLayout.tsx — Shared Authentication Layout Component
 *
 * Implements a modern split-screen layout for Login, Signup, and Password recovery:
 * - Left pane: Beautiful brand messaging with gradients, blur rings, and micro-animations.
 * - Right pane: Focus-driven container rendering authentication forms.
 * - Fully responsive: stack layout vertically on smaller viewports.
 */

import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-neutral-950">
      {/* ── Left Pane: Brand & Design (Desktop Only) ── */}
      <div className="relative hidden w-1/2 overflow-hidden bg-neutral-900 lg:block">
        {/* Glow rings decoration */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-128 w-128 translate-x-1/2 translate-y-1/2 rounded-full bg-primary-600/5 blur-3xl" />

        {/* Diagonal mesh lines decorative wrapper */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Content Container */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12 select-none">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow animate-pulse">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              TaskFlow <span className="text-primary-400">Pro</span>
            </span>
          </div>

          {/* Core App Value Proposition (Mentoring Showcase) */}
          <div className="my-auto max-w-md animate-fade-in-up">
            <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
              Manage projects, collaborate in real-time, and ship faster.
            </h2>
            <p className="mt-4 text-lg text-neutral-400">
              A production-ready project management ecosystem modeled after enterprise architectures.
            </p>

            {/* Micro Feature Bullet Points */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-neutral-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500/20 text-primary-400">
                  ✓
                </span>
                <span className="text-sm font-medium">Real-time collaborative Kanban boards</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500/20 text-primary-400">
                  ✓
                </span>
                <span className="text-sm font-medium">Granular workspaces and permission controls</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500/20 text-primary-400">
                  ✓
                </span>
                <span className="text-sm font-medium">Detailed progress charts and calendar views</span>
              </div>
            </div>
          </div>

          {/* Footer Branding Notes */}
          <div>
            <p className="text-xs text-neutral-500">
              © {new Date().getFullYear()} TaskFlow Pro. Engineered with standard enterprise patterns.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Pane: Form Renderer (Universal Container) ── */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-24 xl:px-32">
        <div className="mx-auto w-full max-w-md">
          {/* Logo brand header for Mobile only */}
          <div className="mb-8 flex items-center gap-3 justify-center lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              TaskFlow <span className="text-primary-400">Pro</span>
            </span>
          </div>

          {/* Animated wrapper around actual child routes */}
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
