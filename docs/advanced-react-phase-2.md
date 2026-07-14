# Phase 2 Advanced React Notes

These notes document the Phase 2 architecture now present in TaskFlow Pro. The current UI still uses local mock slices for screens, but the app now has the production path for persisted state, backend API access, route splitting, error isolation, Suspense loading states, and runtime profiling.

## 1. Context API

Why it exists:
Context shares UI state across a subtree without prop drilling.

Business problem:
The mobile sidebar needs to be opened from `Header` and rendered/closed by `Sidebar`. That state is shell UI state, not domain data, so Redux would be too heavy.

How it is implemented:
`src/context/AppShellContext.tsx` owns `isMobileSidebarOpen`, open/close/toggle actions, Escape key handling, and body scroll locking.

Architecture:

```text
DashboardLayout
  -> AppShellProvider
    -> Header uses openMobileSidebar()
    -> Sidebar uses isMobileSidebarOpen and closeMobileSidebar()
```

Interview questions:
- When would you choose Context over Redux?
- What performance issue can Context cause?
- How do you prevent invalid Context usage?

Common mistakes:
- Putting frequently changing large objects in one global Context.
- Using Context for server cache or complex domain state.
- Forgetting a custom hook guard when the provider is missing.

Best practices:
- Keep Context focused.
- Memoize provider values.
- Use Context for cross-cutting UI state, theme, auth session metadata, or feature flags.

## 2. Redux Persist

Why it exists:
Redux state resets on refresh unless persisted.

Business problem:
Users expect login/session-like data, workspace edits, project changes, and task updates to survive page reloads during the mock frontend phase.

How it is implemented:
`src/store/index.ts` wraps the root reducer with `persistReducer`, and `src/main.tsx` uses `PersistGate`.

Persisted slices:
- `auth`
- `workspace`
- `projects`
- `tasks`

Interview questions:
- What should never be stored in Redux Persist?
- How do migrations work for persisted state?
- Why do persisted actions need serializable-check exceptions?

Common mistakes:
- Persisting sensitive tokens without considering storage security.
- Persisting API cache forever.
- Not versioning persisted state when state shape changes.

Best practices:
- Persist only what improves user experience.
- Whitelist slices rather than persisting everything.
- Plan migrations before production data exists.

## 3. RTK Query

Why it exists:
RTK Query provides Redux-native server-state fetching, caching, invalidation, and generated hooks.

Business problem:
When Django REST API arrives, project/task/workspace data should be fetched through a predictable API service instead of scattered `fetch` calls.

How it is implemented:
`src/services/api/taskflowApi.ts` defines backend endpoints for current user, workspace, projects, project detail, and tasks.

Architecture:

```text
taskflowApi
  -> fetchBaseQuery(env.API_BASE_URL)
  -> prepareHeaders reads auth.token from Redux
  -> endpoints expose generated hooks
  -> store mounts reducer + middleware
```

Interview questions:
- What is the difference between client state and server state?
- How does RTK Query know what data to invalidate?
- Why does RTK Query need middleware?

Common mistakes:
- Duplicating fetched server data into another Redux slice unnecessarily.
- Forgetting cache tags and invalidation.
- Using RTK Query and manual loading/error flags for the same request.

Best practices:
- Use tags for mutation invalidation.
- Keep endpoint names domain-oriented.
- Let RTK Query own server cache once the backend is real.

## 4. TanStack Query

Why it exists:
TanStack Query is a framework-agnostic server-state library with excellent cache controls and ergonomic hooks.

Business problem:
Some teams prefer server cache outside Redux. Providing TanStack hooks teaches both common enterprise patterns.

How it is implemented:
`src/services/queries/useTaskflowQueries.ts` exposes query hooks backed by the shared Axios client.

Architecture:

```text
QueryClientProvider
  -> useProjectsQuery()
    -> apiClient.get('/projects/')
      -> Django REST API base URL
```

Interview questions:
- How is TanStack Query different from Redux?
- What are query keys?
- What is `staleTime`?

Common mistakes:
- Creating unstable query keys.
- Refetching too aggressively.
- Using TanStack Query for local form state.

Best practices:
- Keep query keys centralized.
- Use `enabled` for dependent queries.
- Keep backend reads in query hooks and UI state in React/Redux.

## 5. API Layer

Why it exists:
An API layer centralizes backend communication and keeps UI components clean.

Business problem:
When endpoint paths, auth headers, timeouts, or error handling change, the app should be updated in one place.

How it is implemented:
`src/services/api` contains:
- `httpClient.ts` for Axios.
- `taskflowApi.ts` for RTK Query.
- `index.ts` for public exports.

Architecture:

```text
UI / Hooks
  -> services/api
    -> env.API_BASE_URL
      -> Django REST API
```

Interview questions:
- Why should components not call raw endpoints directly?
- Where should auth headers be attached?
- How do you handle API errors consistently?

Common mistakes:
- Hardcoding URLs in components.
- Returning inconsistent error shapes.
- Mixing mock data and real API calls without clear boundaries.

Best practices:
- Centralize base URL and headers.
- Normalize errors.
- Keep endpoint functions typed.

## 6. Axios Client And Interceptors

Why it exists:
Axios interceptors let you attach cross-cutting request/response behavior once.

Business problem:
Authenticated SaaS apps need consistent Authorization headers, timeouts, and error handling.

How it is implemented:
`src/services/api/httpClient.ts` creates `apiClient`, attaches persisted auth tokens to requests, and normalizes API errors.

Interview questions:
- What belongs in a request interceptor?
- What belongs in a response interceptor?
- How would you handle token refresh?

Common mistakes:
- Creating many Axios instances without reason.
- Retrying unauthorized requests forever.
- Swallowing errors inside interceptors.

Best practices:
- Keep one primary API client.
- Normalize errors before UI sees them.
- Add refresh-token retry logic carefully to avoid loops.

## 7. Error Boundaries

Why it exists:
React error boundaries catch render-time errors and protect the rest of the UI.

Business problem:
A production dashboard should fail gracefully instead of showing a blank page.

How it is implemented:
`src/components/system/ErrorBoundary.tsx` wraps the app in `src/App.tsx`.

Interview questions:
- What errors do error boundaries catch?
- What errors do they not catch?
- Where should error boundaries be placed?

Common mistakes:
- Expecting error boundaries to catch async promise failures.
- Showing raw stack traces in production.
- Using only one boundary for a very large app.

Best practices:
- Add route or feature boundaries for large surfaces.
- Log caught errors to monitoring in production.
- Provide a recovery action.

## 8. Suspense Boundaries

Why it exists:
Suspense provides declarative loading UI while code or data is waiting.

Business problem:
Lazy pages need a polished loading state during chunk loading.

How it is implemented:
`src/router/index.tsx` wraps route elements with `Suspense` and `RouteLoadingFallback`.

Interview questions:
- What does Suspense do for lazy imports?
- How is Suspense for data different from Suspense for code?
- Where should Suspense boundaries live?

Common mistakes:
- Using one full-screen fallback for every tiny component.
- Forgetting that lazy imports need a fallback.
- Making loading UI larger than the content area it replaces.

Best practices:
- Place route-level boundaries around lazy pages.
- Use compact fallbacks inside small panels.
- Keep fallback UI consistent with app layout.

## 9. Lazy Loading

Why it exists:
Lazy loading splits JavaScript into smaller chunks.

Business problem:
Users should not download settings, calendar, and project detail code before they need those screens.

How it is implemented:
`src/router/index.tsx` imports pages with `React.lazy`.

Interview questions:
- What is code splitting?
- What should usually stay eager?
- How do lazy imports affect bundling?

Common mistakes:
- Lazy-loading tiny components that do not matter.
- Lazy-loading layout shells that are needed immediately.
- Forgetting error handling for failed chunks.

Best practices:
- Lazy-load route pages first.
- Keep shared layout eager.
- Pair lazy imports with Suspense and an ErrorBoundary.

## 10. Runtime Performance Profiling

Why it exists:
Profiling shows which components render, how long they take, and whether optimizations are needed.

Business problem:
Project management boards can grow large. Profiling prevents guesswork before adding memoization, virtualization, or expensive charts.

How it is implemented:
`src/components/system/PerformanceProfiler.tsx` wraps the app in development and logs React Profiler render measurements.

Architecture:

```text
App
  -> ErrorBoundary
    -> PerformanceProfiler (development only)
      -> Routes
```

Interview questions:
- What is the difference between actual duration and base duration?
- When should you use `React.memo`?
- How do you identify unnecessary re-renders?

Common mistakes:
- Optimizing before measuring.
- Adding memoization everywhere.
- Ignoring slow derived calculations in render.

Best practices:
- Profile in development and production-like builds.
- Optimize the slowest repeated interactions first.
- Use virtualization for large lists and memoization for stable expensive subtrees.

## Phase 2 Summary

The app now has the Phase 2 infrastructure expected in a serious React codebase:

- Context API for app shell UI state.
- Redux Persist for selected client state.
- RTK Query services for Redux-native API access.
- TanStack Query hooks for server-state fetching.
- Axios client with interceptors.
- Backend base URL integration through environment config.
- ErrorBoundary protection.
- Suspense and lazy route pages.
- Runtime render profiling in development.
