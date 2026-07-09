/**
 * App.tsx — Application Root Component
 *
 * This file mounts our global routing structure.
 * Global styles, themes, and route configurations are imported and controlled here.
 */

import AppRoutes from '@/router'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-primary-500/30 selection:text-primary-200">
      <AppRoutes />
    </div>
  )
}
