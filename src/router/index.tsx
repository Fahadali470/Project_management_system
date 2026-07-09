/**
 * AppRoutes.tsx — Application Router Mapping
 *
 * This file maps all path URLs to their respective page components.
 * It integrates the public/private route guards and sets up the layout wrappers.
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

// Layouts
import AuthLayout from '@/components/layout/AuthLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

// Dashboard Pages
import DashboardPage from '@/pages/dashboard/DashboardPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Guest Only Routes ── */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      {/* ── Authenticated Routes ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          {/* Future authenticated routes will go here (e.g., /projects, /calendar, /settings) */}
        </Route>
      </Route>

      {/* ── Catch-All Redirect ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
