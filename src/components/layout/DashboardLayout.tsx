/**
 * DashboardLayout.tsx — Main Application Shell
 *
 * The foundational layout for all authenticated pages.
 * - Composes the Sidebar and Header.
 * - Handles the responsive layout shifting (padding for sidebar on desktop).
 * - Provides the central scrollable <Outlet /> for page content.
 */

import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      {/* 
        Sidebar is fixed on the left for desktop (lg:w-72).
        It handles its own responsive hiding on mobile. 
      */}
      <Sidebar />

      {/* Main content wrapper shifted to accommodate the fixed sidebar on desktop */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <Header />

        {/* 
          Main Scrollable Area 
          Uses flex-grow to take up remaining height.
        */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
