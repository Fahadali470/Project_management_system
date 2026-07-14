/**
 * AppRoutes.tsx â€” Application Router Mapping
 *
 * This file maps all path URLs to their respective page components.
 * It integrates public/private route guards, layout wrappers, lazy-loaded
 * route modules, and Suspense fallbacks for better initial bundle splitting.
 */

import { lazy, Suspense } from 'react'
import type { ReactElement } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import RouteLoadingFallback from '@/components/system/RouteLoadingFallback'

// Layouts stay eager because they frame most route transitions.
import AuthLayout from '@/components/layout/AuthLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const ProjectsPage = lazy(() => import('@/pages/projects/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('@/pages/projects/ProjectDetailPage'))
const CalendarPage = lazy(() => import('@/pages/calendar/CalendarPage'))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))

function withSuspense(element: ReactElement) {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      {element}
    </Suspense>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Guest Only Routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={withSuspense(<LoginPage />)} />
          <Route path="/signup" element={withSuspense(<SignupPage />)} />
          <Route path="/forgot-password" element={withSuspense(<ForgotPasswordPage />)} />
        </Route>
      </Route>

      {/* Authenticated Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={withSuspense(<DashboardPage />)} />
          <Route path="/projects" element={withSuspense(<ProjectsPage />)} />
          <Route path="/projects/:projectId" element={withSuspense(<ProjectDetailPage />)} />
          <Route path="/calendar" element={withSuspense(<CalendarPage />)} />
          <Route path="/settings" element={withSuspense(<SettingsPage />)} />
        </Route>
      </Route>

      {/* Catch-All Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
