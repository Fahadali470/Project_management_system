/**
 * main.tsx â€” Application Entry Point
 *
 * This is where the React app boots. Everything here wraps the entire app
 * and is only rendered ONCE. This is where global providers live.
 *
 * Provider order matters â€” outer providers are available to inner ones.
 * Order: StrictMode â†’ QueryClient â†’ Redux â†’ PersistGate â†’ Router â†’ App
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { persistor, store } from './store'
import RouteLoadingFallback from '@/components/system/RouteLoadingFallback'
import '@/styles/globals.css'

/**
 * TanStack Query configuration
 *
 * staleTime: 5 minutes â€” don't re-fetch data if it's less than 5 minutes old
 * gcTime: 10 minutes â€” keep unused data in cache for 10 minutes
 * retry: 1 â€” retry failed requests once before showing an error
 * refetchOnWindowFocus: false â€” don't re-fetch every time user switches tabs
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
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
        <PersistGate loading={<RouteLoadingFallback />} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </ReduxProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
