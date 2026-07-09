/**
 * Environment Configuration
 *
 * This module validates and exports all environment variables at app startup.
 * If a required variable is missing, the app throws immediately — "fail fast".
 *
 * Why this pattern matters:
 * - Prevents runtime errors deep in the app caused by missing config
 * - Makes environment requirements self-documenting
 * - Gives TypeScript full type safety on env vars
 * - Industry standard: used at Netflix, Shopify, Atlassian
 */

/**
 * Read a required environment variable.
 * Throws at startup if the variable is missing or empty.
 */
function requireEnv(key: string): string {
  const value = import.meta.env[key]
  if (!value || value.trim() === '') {
    throw new Error(
      `[TaskFlow Pro] Missing required environment variable: "${key}"\n` +
      `Please check your .env.development or .env.production file.\n` +
      `Refer to .env.example for all required variables.`
    )
  }
  return value
}

/**
 * Read an optional environment variable with a fallback default.
 */
function optionalEnv(key: string, defaultValue: string): string {
  const value = import.meta.env[key]
  return value && value.trim() !== '' ? value : defaultValue
}

/**
 * The single source of truth for all environment configuration.
 * Import this object anywhere in the app instead of using import.meta.env directly.
 *
 * @example
 * import { env } from '@/config/env'
 * const response = await axios.get(`${env.API_BASE_URL}/projects/`)
 */
export const env = {
  /** Base URL of the Django REST API */
  API_BASE_URL: requireEnv('VITE_API_BASE_URL'),

  /** Human-readable app name */
  APP_NAME: optionalEnv('VITE_APP_NAME', 'TaskFlow Pro'),

  /** Current environment: 'development' | 'production' | 'test' */
  APP_ENV: optionalEnv('VITE_APP_ENV', 'development'),

  /** App version from package.json or env */
  APP_VERSION: optionalEnv('VITE_APP_VERSION', '1.0.0'),

  /** Derived boolean flags — no need to read env var directly */
  IS_DEV: optionalEnv('VITE_APP_ENV', 'development') === 'development',
  IS_PROD: optionalEnv('VITE_APP_ENV', 'development') === 'production',
} as const

// Type export so you can type function params that accept config
export type AppEnv = typeof env
