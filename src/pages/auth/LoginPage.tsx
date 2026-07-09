/**
 * LoginPage.tsx — User Sign-In Component
 *
 * Implements the login form:
 * - Fully managed via React Hook Form & validation schema with Zod.
 * - Integration with Redux store to manage authentication state.
 * - Mock authentication trigger to log the user in for Phase 1 verification.
 * - Fully accessible keyboard support and interactive ARIA-compliant attributes.
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCredentials, setLoading, setError } from '@/features/auth/authSlice'

// ── Zod Validation Schema ──
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters long' }),
  rememberMe: z.boolean(),
})

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  // Determine redirection path (redirect back to previous page or default to root dashboard)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  // ── Form Submission Handler ──
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      // Simulate API Response delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful response payload (Phase 1 authentication simulation)
      const mockUser = {
        id: 'user-mock-1',
        name: 'Demo Admin',
        email: data.email,
        avatar: null,
        role: 'owner' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        emailVerified: true,
      }

      dispatch(
        setCredentials({
          user: mockUser,
          token: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        })
      )

      // Navigate to destination
      navigate(from, { replace: true })
    } catch (err: unknown) {
      dispatch(setError(err instanceof Error ? err.message : 'Invalid credentials'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center lg:text-left mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Enter your details below to sign in to your workspace
        </p>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 animate-fade-in">
          <div className="flex gap-2">
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
            Email address
          </label>
          <div className="mt-1.5 relative">
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              {...register('email')}
              className={`w-full rounded-lg bg-neutral-900 border ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-primary-500'
              } px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors`}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-xs text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="mt-1.5 relative">
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full rounded-lg bg-neutral-900 border ${
                errors.password ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-primary-500'
              } px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors`}
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : undefined}
              disabled={isLoading}
            />
          </div>
          {errors.password && (
            <p id="password-error" className="mt-1.5 text-xs text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Keep Logged In */}
        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            {...register('rememberMe')}
            className="h-4 w-4 rounded bg-neutral-900 border-neutral-800 text-primary-600 focus:ring-primary-500/20"
            disabled={isLoading}
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-neutral-400">
            Keep me logged in for 30 days
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-primary-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Footer Links */}
      <p className="mt-8 text-center text-sm text-neutral-400">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
          Sign up free
        </Link>
      </p>
    </div>
  )
}
