/**
 * authSlice.ts — Redux State Slice for Authentication
 *
 * This slice manages the global authentication state:
 * - Current logged-in user details
 * - Access and refresh token storage
 * - Authentication status flags
 * - Loading and error states for authentication actions
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User } from '@/types/auth.types'

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Stores the user credentials and active session tokens.
     * Triggered upon successful login, registration, or token refresh.
     */
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken: string }>
    ) => {
      const { user, token, refreshToken } = action.payload
      state.user = user
      state.token = token
      state.refreshToken = refreshToken
      state.isAuthenticated = true
      state.error = null
    },

    /**
     * Clears all session credentials, effectively logging the user out.
     */
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null
    },

    /**
     * Updates the loading state indicator for async auth requests.
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    /**
     * Sets or clears global auth error messages.
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setCredentials, logout, setLoading, setError } = authSlice.actions

export default authSlice.reducer
