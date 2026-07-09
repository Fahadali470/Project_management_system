/**
 * main.tsx — Application Entry Point
 *
 * This is where the React app boots. Everything here wraps the entire app
 * and is only rendered ONCE. This is where global providers live.
 *
 * Provider order matters — outer providers are available to inner ones.
 * Order: StrictMode → QueryClient → Redux → Router → App
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { store } from './store'
import '@/styles/globals.css'

/**
 * TanStack Query configuration
 *
 * staleTime: 5 minutes — don't re-fetch data if it's less than 5 minutes old
 * gcTime: 10 minutes — keep unused data in cache for 10 minutes
 * retry: 1 — retry failed requests once before showing an error
 * refetchOnWindowFocus: false — don't re-fetch every time user switches tabs
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,       // 5 minutes
      gcTime: 1000 * 60 * 10,          // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error(
    '[TaskFlow Pro] Could not find root element with id="root". ' +
    'Check your index.html file.'
  )
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ReduxProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
