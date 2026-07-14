/**
 * Header.tsx — Global Top Navigation Bar
 *
 * Implements the sticky top header containing:
 * - Global search input placeholder.
 * - Notifications toggle.
 * - User profile dropdown with logout functionality.
 * - Mobile menu toggle (hamburger) for responsive design.
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useAppShell } from '@/context/AppShellContext'
import { logout } from '@/features/auth/authSlice'

export default function Header() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { isMobileSidebarOpen, openMobileSidebar } = useAppShell()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
  }

  // Generate a fallback avatar initial
  const initials = user?.name ? user.name.charAt(0).toUpperCase() : 'U'

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-neutral-800 bg-neutral-900/80 px-4 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile Hamburger (Visible only on small screens) */}
      <button
        type="button"
        onClick={openMobileSidebar}
        className="-m-2.5 p-2.5 text-neutral-400 lg:hidden hover:text-white transition-colors"
        aria-controls="mobile-sidebar"
        aria-expanded={isMobileSidebarOpen}
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-neutral-800 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Global Search */}
        <form className="relative flex flex-1" action="#" method="GET" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <div className="relative w-full max-w-md flex items-center">
            <svg
              className="pointer-events-none absolute left-3 h-5 w-5 text-neutral-500"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            <input
              id="search-field"
              className="block h-10 w-full rounded-full border-0 bg-neutral-800/50 py-0 pl-10 pr-4 text-white placeholder:text-neutral-500 focus:bg-neutral-800 focus:ring-2 focus:ring-primary-500 sm:text-sm transition-all"
              placeholder="Search tasks, projects, or people..."
              type="search"
              name="search"
            />
          </div>
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications Button */}
          <button type="button" className="-m-2.5 p-2.5 text-neutral-400 hover:text-white transition-colors">
            <span className="sr-only">View notifications</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-neutral-800" aria-hidden="true" />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="-m-1.5 flex items-center p-1.5"
              id="user-menu-button"
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <span className="sr-only">Open user menu</span>
              {/* Avatar */}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-medium text-white shadow-sm">
                {initials}
              </span>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-white" aria-hidden="true">
                  {user?.name || 'User'}
                </span>
                <svg className="ml-2 h-4 w-4 text-neutral-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </span>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div
                className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-lg bg-neutral-800 py-2 shadow-lg ring-1 ring-white/10 focus:outline-none animate-fade-in-up"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabIndex={-1}
              >
                <div className="px-4 py-2 border-b border-neutral-700/50 mb-1">
                  <p className="text-xs text-neutral-400">Signed in as</p>
                  <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                </div>
                <Link to="/settings" className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors" role="menuitem" tabIndex={-1}>
                  Your profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors" role="menuitem" tabIndex={-1}>
                  Workspace settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-neutral-700 hover:text-red-300 transition-colors mt-1 border-t border-neutral-700/50 pt-3"
                  role="menuitem"
                  tabIndex={-1}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
