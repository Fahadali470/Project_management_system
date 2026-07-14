/**
 * App.tsx — Application Root Component
 *
 * This file mounts our global routing structure.
 * Global styles, themes, and route configurations are imported and controlled here.
 */

import AppRoutes from '@/router'
import ErrorBoundary from '@/components/system/ErrorBoundary'
import PerformanceProfiler from '@/components/system/PerformanceProfiler'

export default function App() {
  return (
    <ErrorBoundary>
      <PerformanceProfiler id="TaskFlowApp">
        <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-primary-500/30 selection:text-primary-200">
          <AppRoutes />
        </div>
      </PerformanceProfiler>
    </ErrorBoundary>
  )
}
