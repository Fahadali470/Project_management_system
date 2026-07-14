import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

interface AppShellContextValue {
  isMobileSidebarOpen: boolean
  openMobileSidebar: () => void
  closeMobileSidebar: () => void
  toggleMobileSidebar: () => void
}

const AppShellContext = createContext<AppShellContextValue | undefined>(undefined)

export function AppShellProvider({ children }: { children: ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isMobileSidebarOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileSidebarOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileSidebarOpen])

  const value = useMemo<AppShellContextValue>(
    () => ({
      isMobileSidebarOpen,
      openMobileSidebar: () => setIsMobileSidebarOpen(true),
      closeMobileSidebar: () => setIsMobileSidebarOpen(false),
      toggleMobileSidebar: () => setIsMobileSidebarOpen((current) => !current),
    }),
    [isMobileSidebarOpen]
  )

  return (
    <AppShellContext.Provider value={value}>
      {children}
    </AppShellContext.Provider>
  )
}

export function useAppShell() {
  const context = useContext(AppShellContext)

  if (!context) {
    throw new Error('useAppShell must be used inside AppShellProvider')
  }

  return context
}
