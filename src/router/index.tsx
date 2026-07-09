/**
 * AppRoutes.tsx — Application Router Mapping
 *
 * This file maps all path URLs to their respective page components.
 * It integrates the public/private route guards and sets up the shared AuthLayout structure.
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import AuthLayout from '@/components/layout/AuthLayout'

// Authenticated Pages (Smart Components)
import LoginPage from '@/pages/auth/LoginPage'
import SignupPage from '@/pages/auth/SignupPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

// Placeholder dashboard page component for Phase 1 verification
function DashboardPlaceholder() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-center text-white">
      <h1 className="text-3xl font-bold mb-2">Welcome to TaskFlow Pro</h1>
      <p className="text-neutral-400 mb-6">You are successfully authenticated.</p>
      <button
        onClick={() => {
          // Clear session on click for demonstration/testing
          window.location.reload()
        }}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-500 transition-colors"
      >
        Sign Out (Test Refresh)
      </button>
    </div>
  )
}

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
        <Route path="/" element={<DashboardPlaceholder />} />
      </Route>

      {/* ── Catch-All Redirect ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
