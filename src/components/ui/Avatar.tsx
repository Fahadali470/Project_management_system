/**
 * Avatar.tsx — Reusable User Avatar Component
 *
 * Renders user profile images with a smooth fallback containing initials
 * overlayed on a colorful, deterministic gradient.
 */

interface AvatarProps {
  name: string
  src?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

export default function Avatar({ name, src, size = 'sm', className = '' }: AvatarProps) {
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/)
    const first = parts[0] || '?'
    if (parts.length <= 1) return first.substring(0, 2).toUpperCase()
    const last = parts[parts.length - 1] || ''
    return (first.charAt(0) + last.charAt(0)).toUpperCase()
  }

  // Deterministic gradient selection based on user's name
  const getGradientClass = (userName: string) => {
    const gradients = [
      'from-primary-500 to-indigo-600',
      'from-emerald-400 to-teal-600',
      'from-rose-500 to-pink-600',
      'from-amber-400 to-orange-600',
      'from-cyan-500 to-blue-600',
      'from-purple-500 to-violet-700',
    ]
    let hash = 0
    for (let i = 0; i < userName.length; i++) {
      hash = userName.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % gradients.length
    return gradients[index] || 'from-primary-500 to-indigo-600'
  }

  const sizeClasses = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden border border-neutral-800 font-semibold text-white select-none ${sizeClasses[size]} ${className}`}
      title={name}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div className={`h-full w-full bg-gradient-to-br flex items-center justify-center ${getGradientClass(name)}`}>
          {getInitials(name)}
        </div>
      )}
    </div>
  )
}
