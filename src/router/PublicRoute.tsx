/**
 * PublicRoute.tsx — Guest Route Guard
 *
 * This component guards public auth pages (Login, Signup, Forgot Password).
 * If the user is NOT authenticated, it renders the page.
 * If the user IS already authenticated, it redirects them to the home page/dashboard
 * to prevent them from accessing guest-only screens.
 */

import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'

export default function PublicRoute() {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  // Prevent redirect flashes while checking auth state on load
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  // If authenticated, redirect guest back to dashboard
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
}
