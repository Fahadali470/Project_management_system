/**
 * Badge.tsx — Reusable Priority & Status Badges
 *
 * Renders consistent and visually polished labels for task priorities,
 * workflow statuses, and project stages.
 */

type BadgeVariant = 'priority' | 'status' | 'project-status' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  value: string
  className?: string
}

export default function Badge({ variant = 'default', value, className = '' }: BadgeProps) {
  const getStyles = () => {
    const val = value.toLowerCase()

    // ── Priority Badges ──
    if (variant === 'priority') {
      switch (val) {
        case 'urgent':
          return 'bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.1)]'
        case 'high':
          return 'bg-orange-500/10 border-orange-500/20 text-orange-400'
        case 'medium':
          return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
        case 'low':
          return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        default:
          return 'bg-neutral-800 border-neutral-700 text-neutral-400'
      }
    }

    // ── Task Workflow Status Badges ──
    if (variant === 'status') {
      switch (val) {
        case 'todo':
          return 'bg-neutral-800/80 border-neutral-700 text-neutral-300'
        case 'in_progress':
          return 'bg-primary-500/10 border-primary-500/20 text-primary-400 shadow-[0_0_8px_rgba(99,102,241,0.1)]'
        case 'review':
          return 'bg-purple-500/10 border-purple-500/20 text-purple-400'
        case 'done':
          return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        default:
          return 'bg-neutral-800 border-neutral-700 text-neutral-400'
      }
    }

    // ── Project Lifecycle Status Badges ──
    if (variant === 'project-status') {
      switch (val) {
        case 'planning':
          return 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
        case 'active':
          return 'bg-primary-500/10 border-primary-500/20 text-primary-400 shadow-[0_0_8px_rgba(99,102,241,0.1)]'
        case 'completed':
          return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        case 'on_hold':
          return 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        default:
          return 'bg-neutral-800 border-neutral-700 text-neutral-400'
      }
    }

    // ── Default / Custom ──
    return 'bg-neutral-800 border-neutral-700 text-neutral-300'
  }

  const formatText = (text: string) => {
    // Replace underscores with spaces and capitalize words
    return text
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border transition-all duration-200 uppercase tracking-wider ${getStyles()} ${className}`}
    >
      {formatText(value)}
    </span>
  )
}
