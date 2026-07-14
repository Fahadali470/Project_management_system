import axios from 'axios'
import type { AxiosError } from 'axios'
import { env } from '@/config/env'

interface PersistedAuthState {
  token?: string | null
  refreshToken?: string | null
}

export interface NormalizedApiError {
  message: string
  status?: number
  details?: unknown
}

function readPersistedAuthState(): PersistedAuthState | null {
  if (typeof window === 'undefined') return null

  try {
    const persistedRoot = window.localStorage.getItem('persist:taskflow-root')
    if (!persistedRoot) return null

    const parsedRoot = JSON.parse(persistedRoot) as { auth?: string }
    if (!parsedRoot.auth) return null

    return JSON.parse(parsedRoot.auth) as PersistedAuthState
  } catch {
    return null
  }
}

function normalizeApiError(error: AxiosError): NormalizedApiError {
  return {
    message: error.message || 'Unexpected API error',
    status: error.response?.status,
    details: error.response?.data,
  }
}

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const auth = readPersistedAuthState()

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(normalizeApiError(error))
)
