/**
 * App.tsx — Root Application Component
 *
 * Responsibilities:
 * 1. Render the router (all routes live here or in router/index.tsx)
 * 2. Apply global theme class to <html> element
 *
 * What does NOT live here:
 * - Business logic (lives in feature hooks)
 * - API calls (lives in services/)
 * - Redux state (lives in features/)
 * - Provider setup (lives in main.tsx)
 */

import { Routes, Route } from 'react-router-dom'

// Placeholder pages — will be replaced as we build each phase
function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          TaskFlow <span className="text-primary-400">Pro</span>
        </h1>
        <p className="text-neutral-400 text-lg mb-8">
          Project Management for Modern Teams
        </p>
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-500/10 border border-primary-500/20 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-primary-300 font-medium">
            Phase 1 — Foundation Setup Complete
          </span>
        </div>
      </div>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="text-center">
        <p className="text-8xl font-bold text-primary-500 mb-4">404</p>
        <h1 className="text-2xl font-semibold text-white mb-2">Page Not Found</h1>
        <p className="text-neutral-400">The page you're looking for doesn't exist.</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
