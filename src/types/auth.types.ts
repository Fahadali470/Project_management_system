/**
 * auth.types.ts — Authentication Domain Types
 *
 * Single source of truth for all auth-related TypeScript types.
 * Every form, Redux slice, and API service references these.
 */

// ─────────────────────────────────────────────
//  Core Entities
// ─────────────────────────────────────────────

/** The authenticated user object returned from the API */
export interface User {
  id: string
  name: string
  email: string
  avatar: string | null
  role: 'owner' | 'admin' | 'member' | 'viewer'
  createdAt: string
  updatedAt: string
  emailVerified: boolean
}

// ─────────────────────────────────────────────
//  Redux State Shape
// ─────────────────────────────────────────────

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// ─────────────────────────────────────────────
//  Form Data (mirrors Zod schemas)
// ─────────────────────────────────────────────

export interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export interface ForgotPasswordFormData {
  email: string
}

// ─────────────────────────────────────────────
//  API Shapes
// ─────────────────────────────────────────────

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
  message?: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
}
