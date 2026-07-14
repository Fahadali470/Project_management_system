# Atomic Design Notes For TaskFlow Pro

Atomic Design is a way to organize UI from small reusable parts into full product screens. In a SaaS project management app, this keeps the interface consistent while the product grows from authentication pages into dashboards, boards, calendars, settings, and eventually realtime collaboration.

## Why This Exists In Real Software

Large products repeat the same visual and interaction patterns many times: buttons, badges, avatars, modals, forms, navigation, filters, and cards. Without a shared component model, teams copy markup, ship inconsistent UI, and make simple design changes expensive.

Atomic Design solves that by separating component responsibility:

- Atoms are the smallest reusable UI pieces.
- Molecules combine atoms into small interface units.
- Organisms combine molecules into larger product sections.
- Templates define reusable page layouts.
- Pages connect layouts, state, routing, and real feature behavior.

## Business Problem It Solves

TaskFlow Pro is meant to look and behave like a production SaaS app. Recruiters and engineers expect consistency across screens, because consistency signals that the developer can build maintainable product systems rather than isolated demo pages.

Atomic Design helps with:

- Faster feature development because common UI already exists.
- Safer refactoring because shared UI behavior lives in one place.
- Better accessibility because reusable components can encode labels, focus states, and keyboard behavior.
- Cleaner reviews because each component has a clear responsibility.
- Scalable teamwork because frontend engineers can work in predictable layers.

## How Companies Usually Implement It

Companies rarely create folders named only `atoms`, `molecules`, and `organisms` forever. In mature apps, the idea usually becomes a practical folder strategy:

- A shared design-system folder for reusable primitives.
- Feature folders for domain-specific components.
- Layout folders for app shells and navigation.
- Page folders for route-level screens.

That is the approach used in this project. The repo uses atomic thinking while keeping the folder names familiar for React engineers.

## Current Project Mapping

### Atoms

Small reusable visual pieces with minimal business logic.

- `src/components/ui/Avatar.tsx`
- `src/components/ui/Badge.tsx`

Rules:

- Accept data through props.
- Avoid reading Redux directly.
- Stay reusable across projects, tasks, dashboard, and settings.

### Molecules

Small composed UI patterns that combine atoms and local behavior.

- `src/components/ui/Modal.tsx`
- `src/components/ui/EmptyState.tsx`
- Form field groups inside auth and create modals
- Task attachment rows and comment rows inside `TaskDetailModal`

Rules:

- Can manage small local interaction state.
- Should still be reusable or easy to extract when repeated.
- Should not own route-level data loading.

### Organisms

Large interface sections composed from atoms and molecules.

- `src/components/layout/Header.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/forms/CreateProjectModal.tsx`
- `src/components/forms/CreateTaskModal.tsx`
- `src/components/tasks/TaskDetailModal.tsx`

Rules:

- Can connect to feature-level state when necessary.
- Should expose clear props for parent layout control.
- Should keep domain behavior focused and avoid becoming full pages.

### Templates

Reusable page shells that define structure but not a specific feature screen.

- `src/components/layout/AuthLayout.tsx`
- `src/components/layout/DashboardLayout.tsx`

Rules:

- Own layout composition, spacing, and shared shell behavior.
- Render route content through `Outlet`.
- Coordinate shell-level UI such as the mobile sidebar drawer.

### Pages

Route-level screens that connect state, feature behavior, and layout content.

- `src/pages/auth/LoginPage.tsx`
- `src/pages/auth/SignupPage.tsx`
- `src/pages/auth/ForgotPasswordPage.tsx`
- `src/pages/dashboard/DashboardPage.tsx`
- `src/pages/projects/ProjectsPage.tsx`
- `src/pages/projects/ProjectDetailPage.tsx`
- `src/pages/calendar/CalendarPage.tsx`
- `src/pages/settings/SettingsPage.tsx`

Rules:

- May read Redux state and dispatch actions.
- May coordinate multiple organisms.
- Should delegate repeated UI to components instead of duplicating markup.

## Architecture Diagram

```text
Routes
  -> Layout Templates
    -> Organisms
      -> Molecules
        -> Atoms
```

Current example:

```text
/projects/:projectId
  -> DashboardLayout
    -> Header
    -> Sidebar
    -> ProjectDetailPage
      -> Kanban Columns
      -> CreateTaskModal
      -> TaskDetailModal
        -> Modal
        -> Badge
        -> Avatar
```

## Folder Structure Rule For Future Work

Use this decision path before creating a new component:

1. If it is reusable visual UI with no domain state, place it in `src/components/ui`.
2. If it is shared layout or navigation, place it in `src/components/layout`.
3. If it belongs to one feature workflow, place it in the closest feature component folder, such as `src/components/tasks`.
4. If it is a route screen, place it in `src/pages/<feature>`.
5. If it is domain state, actions, or reducers, place it in `src/features/<feature>`.
6. If it is a shared TypeScript domain shape, place it in `src/types`.

## Review Checklist

Before marking a UI feature complete, check:

- Does this duplicate an existing atom, molecule, or organism?
- Can this component be named by what it is, not how it looks?
- Does it accept data through props unless it truly owns feature state?
- Does the page delegate repeated UI to reusable components?
- Are focus states, labels, keyboard behavior, and responsive states handled?
- Would another engineer know where to place the next similar component?

## Interview Notes

Atomic Design is useful to explain because it shows that you understand frontend architecture beyond styling.

Strong answer:

> I use Atomic Design as a mental model for component responsibility. In TaskFlow Pro, primitives like badges and avatars are reusable UI atoms, modals and empty states are molecules, navigation and task detail panels are organisms, layouts are templates, and routed screens are pages. This keeps components reusable without forcing the repo into artificial folder names.

Common mistake:

> Creating too many tiny components too early. Abstraction should happen when a pattern repeats or when separating it makes the code easier to understand.

Production best practice:

> Keep atoms and molecules independent from Redux and routing. Let pages and organisms coordinate application state, then pass the needed data down.
