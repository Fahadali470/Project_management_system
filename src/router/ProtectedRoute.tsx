/**
 * ProtectedRoute.tsx — Authentication Route Guard
 *
 * This component protects routes that require an active user session.
 * If the user is authenticated, it renders the child routes using `<Outlet />`.
 * If not authenticated, it redirects them to the login page, preserving the requested route in state
 * so they can be redirected back after a successful login.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const location = useLocation()

  // Prevent redirect flashes while initial authentication checks run (e.g. JWT verification on startup)
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          <p className="text-neutral-400 text-sm font-medium animate-pulse">
            Verifying your session...
          </p>
        </div>
      </div>
    )
  }

  // If not authenticated, redirect to /login and preserve current location in state
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}
