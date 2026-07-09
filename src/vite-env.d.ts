/// <reference types="vite/client" />

/**
 * vite-env.d.ts — Vite Environment Type Declarations
 *
 * This file tells TypeScript about:
 * 1. Vite's import.meta.env (VITE_ prefixed variables)
 * 2. Static asset imports (SVG, PNG, etc.)
 *
 * Without this file, TypeScript has no idea what import.meta.env is.
 */

/**
 * Extend Vite's ImportMetaEnv interface to add our app-specific env vars.
 * This gives full autocomplete when using import.meta.env.VITE_*
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_ENV: 'development' | 'production' | 'test'
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
