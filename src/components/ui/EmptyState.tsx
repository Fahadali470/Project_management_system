/**
 * EmptyState.tsx — Reusable Empty Layout Placeholder
 *
 * Displays a descriptive empty panel when lists are unpopulated,
 * prompting the user to take action via a button.
 */

import React from 'react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/10 py-16 px-4 text-center">
      {/* Icon Wrapper */}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-500 shadow-sm">
        {icon || (
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )}
      </div>

      {/* Text Info */}
      <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm text-neutral-400 max-w-sm leading-relaxed">{description}</p>

      {/* Optional Call to Action */}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-500 transition-colors shadow-glow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
