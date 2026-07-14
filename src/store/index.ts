/**
 * Redux Store â€” Central State Configuration
 *
 * This is the root Redux store. All feature slices are combined here.
 * Redux Persist keeps selected feature state across browser refreshes.
 * RTK Query is mounted beside the mock slices so Phase 3 can connect the UI
 * to Django REST endpoints without reworking the state architecture.
 */

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from '@/features/auth/authSlice'
import projectsReducer from '@/features/projects/projectsSlice'
import tasksReducer from '@/features/tasks/tasksSlice'
import workspaceReducer from '@/features/workspace/workspaceSlice'
import { taskflowApi } from '@/services/api/taskflowApi'

const rootReducer = combineReducers({
  auth: authReducer,
  workspace: workspaceReducer,
  projects: projectsReducer,
  tasks: tasksReducer,
  [taskflowApi.reducerPath]: taskflowApi.reducer,
})

const persistConfig = {
  key: 'taskflow-root',
  version: 1,
  storage,
  whitelist: ['auth', 'workspace', 'projects', 'tasks'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(taskflowApi.middleware),

  devTools: import.meta.env.DEV,
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
