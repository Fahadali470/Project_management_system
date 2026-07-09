/**
 * ForgotPasswordPage.tsx — Password Recovery Request Page
 *
 * Implements the forgot password request flow:
 * - Managed using React Hook Form + Zod email validation.
 * - Dynamic rendering: replaces form input with clean check-email feedback card on success.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link } from 'react-router-dom'
import type { ForgotPasswordFormData } from '@/types/auth.types'

// ── Zod Validation Schema ──
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
})

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  // ── Form Submission Handler ──
  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API Response delay
      await new Promise((resolve) => setTimeout(resolve, 1200))
      console.log('Password reset requested for email:', data.email)
      setIsSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      {/* SUCCESS STATE FEEDBACK CARD */}
      {isSuccess ? (
        <div className="text-center animate-fade-in">
          {/* Circular Envelope Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-500/10 text-primary-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-neutral-400 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
            We have sent password reset instructions to your email address if it is registered in our system.
          </p>

          <Link
            to="/login"
            className="inline-flex justify-center items-center rounded-lg bg-neutral-900 border border-neutral-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-500"
          >
            Back to login
          </Link>
        </div>
      ) : (
        /* FORM ENTRY STATE */
        <div className="animate-fade-in">
          {/* Header */}
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              No worries, enter your email and we will send you reset instructions.
            </p>
          </div>

          {/* Global Error Banner */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
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
              <div className="mt-1.5">
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:bg-primary-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending instructions...
                </span>
              ) : (
                'Send Reset Instructions'
              )}
            </button>
          </form>

          {/* Back to login footer */}
          <p className="mt-8 text-center text-sm text-neutral-400">
            Remembered your password?{' '}
            <Link to="/login" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
