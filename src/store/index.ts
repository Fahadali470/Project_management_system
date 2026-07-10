/**
 * Redux Store — Central State Configuration
 *
 * This is the root Redux store. All feature slices are combined here.
 * We use Redux Toolkit which includes:
 * - Immer (for mutating state safely in reducers)
 * - Redux Thunk middleware (for async actions)
 * - DevTools integration in development
 *
 * Pattern: Feature-based slices
 * Each feature owns its state, actions, and reducers in src/features/<feature>/
 */

import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import projectsReducer from '@/features/projects/projectsSlice'
import tasksReducer from '@/features/tasks/tasksSlice'
import workspaceReducer from '@/features/workspace/workspaceSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
  },

  // Middleware configuration
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Serializable check — warn if non-serializable values in state/actions
      serializableCheck: {
        // Ignore these action types (e.g., Date objects in forms)
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),

  // Enable Redux DevTools in development only
  devTools: import.meta.env.DEV,
})

// Infer the RootState and AppDispatch types from the store itself.
// This is the recommended pattern — types always stay in sync with actual state.
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
