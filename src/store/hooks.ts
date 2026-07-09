/**
 * Typed Redux Hooks
 *
 * Instead of using plain `useDispatch` and `useSelector` throughout the app,
 * we create typed versions here once and import from this file everywhere.
 *
 * Why? Plain hooks return `unknown` types. These typed hooks give full
 * autocomplete and type safety from your Redux state automatically.
 *
 * Usage:
 *   import { useAppDispatch, useAppSelector } from '@/store/hooks'
 *   const dispatch = useAppDispatch()
 *   const user = useAppSelector(state => state.auth.user)
 */

import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

/** Use this instead of `useDispatch` everywhere in the app */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

/** Use this instead of `useSelector` everywhere in the app */
export const useAppSelector = useSelector.withTypes<RootState>()
