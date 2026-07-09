/**
 * SignupPage.tsx — User Registration Component
 *
 * Implements the signup form:
 * - Managed using React Hook Form and Zod validation.
 * - Password complexity requirements (length, uppercase, lowercase, numbers, special characters).
 * - Cross-field validation (confirmPassword must match password).
 * - Simulated Redux authentication registration.
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCredentials, setLoading, setError } from '@/features/auth/authSlice'

// ── Password Complexity Validator Regex ──
const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

// ── Zod Validation Schema ──
const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Full name is required' })
      .min(2, { message: 'Name must be at least 2 characters long' }),
    email: z
      .string()
      .min(1, { message: 'Email address is required' })
      .email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(passwordComplexityRegex, {
        message: 'Must contain 8+ characters, with at least 1 uppercase, 1 lowercase, 1 number, and 1 special symbol',
      }),
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms of Service & Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export default function SignupPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  })

  // ── Form Submission Handler ──
  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      // Simulate API Response delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user generation payload (Phase 1 authentication simulation)
      const mockUser = {
        id: `user-mock-${Math.random().toString(36).substring(2, 9)}`,
        name: data.name,
        email: data.email,
        avatar: null,
        role: 'owner' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        emailVerified: false, // Email verification pending in standard workflows
      }

      dispatch(
        setCredentials({
          user: mockUser,
          token: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        })
      )

      // Direct redirection to home/dashboard
      navigate('/', { replace: true })
    } catch (err: unknown) {
      dispatch(setError(err instanceof Error ? err.message : 'Registration failed'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center lg:text-left mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Get started with TaskFlow Pro free today. No credit card required.
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-300">
            Full name
          </label>
          <div className="mt-1.5">
            <input
              id="name"
              type="text"
              placeholder="Sarah Connor"
              {...register('name')}
              className={`w-full rounded-lg bg-neutral-900 border ${
                errors.name ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-primary-500'
              } px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors`}
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
              disabled={isLoading}
            />
          </div>
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-xs text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
            Email address
          </label>
          <div className="mt-1.5">
            <input
              id="email"
              type="email"
              placeholder="sarah@skynet.com"
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
          <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
            Password
          </label>
          <div className="mt-1.5">
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
            <p id="password-error" className="mt-1.5 text-xs text-red-400 leading-normal">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300">
            Confirm password
          </label>
          <div className="mt-1.5">
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              className={`w-full rounded-lg bg-neutral-900 border ${
                errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-primary-500'
              } px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors`}
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              disabled={isLoading}
            />
          </div>
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="mt-1.5 text-xs text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Agree to terms */}
        <div className="pt-2">
          <div className="flex items-start">
            <input
              id="agreeToTerms"
              type="checkbox"
              {...register('agreeToTerms')}
              className="mt-1 h-4 w-4 rounded bg-neutral-900 border-neutral-800 text-primary-600 focus:ring-primary-500/20"
              disabled={isLoading}
            />
            <label htmlFor="agreeToTerms" className="ml-2 text-sm text-neutral-400">
              I agree to the{' '}
              <a href="#" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="mt-1.5 text-xs text-red-400">
              {errors.agreeToTerms.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-primary-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Footer Links */}
      <p className="mt-8 text-center text-sm text-neutral-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
