# MuseGala Admin Dashboard Frontend Architecture Roadmap

This document is the global frontend architecture guide for `muse_gala_admin_dashboard`.

Stack:

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- NextAuth
- REST APIs

The admin dashboard is an internal operations product. It should prioritize correctness, fast data workflows, reliable tables/forms, clear permissions, auditability, and maintainability over marketing polish.

## Current Codebase Review

Current strengths:

- Uses Next.js App Router with route groups: `src/app/(admin)` and `src/app/(auth)`.
- Has reusable primitives in `src/components/ui`.
- Uses TanStack Query, Zustand, Zod, React Hook Form, Radix UI, and Tailwind.
- Has domain areas for bookings, customers, lenders, listings, disputes, finance, returns, support, CMS, and team management.

Main changes needed in this codebase:

- Fix `src/provider/AppProvider.tsx`: it creates a new `QueryClient` on every render. Store it with `useState` or `useMemo`.
- Consolidate API clients from `src/lib/*-api.ts` into domain-level API modules.
- Move domain-specific types from route folders into consistent domain folders.
- Standardize folder naming: use kebab-case or camelCase consistently.
- Keep route `_components` for page-only components, but move reusable domain components to `src/features`.
- Add error boundaries and loading states per admin route group.
- Add tests for table filtering, status actions, permission checks, and forms.
- Add Sentry or equivalent error monitoring before production admin usage grows.

Recommended target structure:

```text
src/
  app/
    (auth)/
    (admin)/
      bookings/
      customers/
      lenders/
      listing/
      finance/
      returns/
      disputes/
      support/
  features/
    bookings/
      api.ts
      queries.ts
      components/
      schemas.ts
      types.ts
    customers/
    lenders/
    listings/
    finance/
    returns/
    disputes/
    support/
    cms/
    team/
  components/
    ui/
    layout/
    data-table/
    feedback/
  lib/
    api-client.ts
    auth.ts
    permissions.ts
    query-client.ts
    utils.ts
  stores/
  hooks/
  types/
```

## Architecture Choice

Use a **feature-based frontend architecture** inside the current app.

Why it is needed:

- Admin pages are organized by business workflows.
- Feature folders keep UI, API calls, schemas, and types close together.
- Future engineers can own one admin area without touching unrelated pages.

Trade-offs:

- Some duplication can appear between features.
- Shared abstractions need review discipline.

When to implement:

- Start now for new admin features.
- Gradually migrate existing route-specific code into `src/features`.

When not to implement:

- Do not move one-off page-only components out of `_components`.
- Do not create a package or abstraction for every small helper.

Common mistake:

- Letting every page invent its own API calls, table states, filters, and modals.

## Pages, Layouts, Components, Hooks, Services

Recommended rules:

- `src/app`: routing, layouts, loading states, error boundaries, metadata.
- `src/app/**/_components`: components used only by that route.
- `src/features/<domain>`: reusable business components, queries, schemas, types, permissions, and actions.
- `src/components/ui`: design-system primitives only.
- `src/components/data-table`: shared table shell, pagination, filters, empty states.
- `src/lib/api-client.ts`: single REST client with auth, request ID, error normalization, and timeout handling.
- `src/hooks`: generic hooks only.
- `src/stores`: global client state only.

## Reusable UI And Design System

Use `src/components/ui` as the primitive layer and build admin-specific patterns above it.

Admin design-system layers:

```text
components/ui             Button, Input, Dialog, Select, Table primitives
components/data-table     Data table, column controls, filters, pagination
components/forms          Form field wrappers and validation display
components/feedback       Empty, error, skeleton, toast patterns
components/layout         Sidebar, top bar, breadcrumbs, page header
features/*/components     Domain-specific UI
```

When to implement:

- Immediately for tables, buttons, modals, forms, status badges, and empty/error states.

When not to implement:

- Do not build a complex design-token package until multiple apps need to share it.

Common mistake:

- Mixing domain behavior into `components/ui`.

## State Management

Use each tool for one job:

- **TanStack Query**: server state, lists, details, mutations, cache invalidation.
- **Zustand**: client-only state such as chat UI state, filters that must survive route changes, modal state.
- **React Context**: stable providers such as auth/session/theme/query client.
- **URL search params**: table filters, pagination, tabs, and date filters that should be shareable.
- **React Hook Form + Zod**: forms and validation.

Important change:

```tsx
const [queryClient] = useState(() => new QueryClient());
```

Do not use Redux Toolkit unless state logic becomes complex enough to need reducers, middleware, or event logs.

## Performance Strategy

Admin performance priorities:

- Fast route transitions.
- Efficient tables and filters.
- Avoiding unnecessary client JavaScript.
- Keeping charts and maps out of the initial bundle unless needed.

Implement from day one:

- Stable `QueryClient`.
- Route-level `loading.tsx`.
- Route-level `error.tsx`.
- Server components by default.
- Client components only for interactivity.
- Dynamic imports for charts, maps, and heavy modals.
- Pagination and server-side filtering for large tables.
- Debounced search with URL state.

When to use:

- **Code splitting**: finance charts, map views, large modals, CSV import, chat.
- **Lazy loading**: secondary tabs, modal contents, charts, rarely used admin actions.
- **SSR**: permission-gated admin shell and initial page data where freshness matters.
- **SSG/ISR**: rarely in admin because data is dynamic and permissioned.
- **Edge rendering**: only for lightweight auth redirects or globally distributed read-only pages.

Common mistake:

- Making the whole admin dashboard a client component.

## API Communication Layer

Create one shared REST client:

```text
src/lib/api-client.ts
src/features/bookings/api.ts
src/features/bookings/queries.ts
```

The client should handle:

- Base URL.
- Auth headers/session.
- Timeouts.
- JSON parsing.
- Error normalization.
- Request IDs.
- 401/403 handling.
- Retry rules for safe reads only.

Do not hide feature-specific behavior inside a generic API helper.

## Auth And Authorization

Use NextAuth for session management and enforce authorization in three layers:

- Middleware/layout: block unauthenticated users.
- Route/page: require admin role.
- Component/action: check specific permission before showing controls.

Recommended:

- Keep permission rules in `src/lib/permissions.ts`.
- Add tests for permission-sensitive UI.
- Do not rely only on hiding buttons; backend must enforce permissions too.

Common mistake:

- Rendering admin pages and hiding controls after client-side session loading.

## Forms And Workflows

Use React Hook Form + Zod for all admin forms.

Protect these workflows:

- Listing approval/rejection.
- Booking status updates.
- Refunds/payout decisions.
- Dispute resolution.
- Team/admin permission changes.
- CMS publishing.

Recommended:

- Model status transitions explicitly.
- Use confirmation dialogs for destructive actions.
- Disable submit during mutation.
- Show optimistic UI only when rollback is safe.
- Invalidate exact TanStack Query keys after mutation.

## Error Handling And Graceful Degradation

Add:

- `error.tsx` per major route.
- Error boundaries around charts, maps, and tables.
- Empty states for no data.
- Skeletons for expected loading.
- Retry buttons for recoverable fetch failures.
- Toasts for mutation success/failure.

Do not auto-retry destructive mutations.

## Feature Flags

Start simple:

- Environment-based flags for internal features.
- A typed `features.ts` file.

Move later to LaunchDarkly, Statsig, GrowthBook, or ConfigCat when:

- Product needs experiments.
- Features need per-admin or per-role rollout.
- Rollbacks need to happen without deploys.

## Accessibility

Admin accessibility standards:

- Keyboard navigation for all tables, menus, dialogs, and filters.
- Visible focus states.
- Correct labels for inputs.
- Dialog focus trapping.
- Color contrast for badges and status text.
- No icon-only button without accessible label.

## Testing Strategy

Phase in tests by risk:

- Unit tests: permission helpers, formatters, schemas, table utilities.
- Integration tests: forms, filters, mutation flows, query invalidation.
- E2E tests: login, listing approval, booking status update, dispute resolution, CMS edit.
- Visual regression: shared components, tables, modals, dashboard cards.

Recommended tools:

- Vitest or Jest.
- React Testing Library.
- Playwright.
- Storybook later.
- Chromatic or Percy later.

## Code Quality Standards

Enforce:

- TypeScript strict mode.
- ESLint.
- Prettier.
- TanStack Query ESLint plugin.
- No untyped API responses.
- No `any` except with a documented reason.
- No business logic inside UI primitives.
- No direct `fetch` outside API modules.
- Pull request checklist for accessibility, loading, error, and permission states.

## Observability And Monitoring

Add:

- Sentry for errors and performance.
- Web vitals reporting.
- Analytics for admin workflow usage.
- Structured client logs for critical admin failures.
- Session replay only for internal admin users and with privacy controls.

Do not capture sensitive customer/payment data in session replay.

## Deployment And Environments

Use:

- `development`
- `staging`
- `production`

Rules:

- Only expose `NEXT_PUBLIC_*` variables to the browser.
- Keep secrets server-side.
- Build once, promote through environments where possible.
- Run `npm run lint` and `npm run build` in CI.
- Add tests before merging high-risk admin flows.
- Use preview deployments for PRs.
- Roll back by redeploying the previous artifact.

## Team Scaling

1 developer:

- Keep the current app, but start feature folders and a shared API client.

5 developers:

- Add ownership by feature: bookings, listings, finance, support/CMS.
- Add PR checklist and test requirements.

20 developers:

- Move shared UI, API types, config, and lint rules into packages in a monorepo.
- Add Storybook and visual regression.

50+ developers:

- Consider micro-frontends only if teams need independent deployments and ownership boundaries are stable.

When to introduce monorepo:

- When admin, lender, and website need shared UI, auth, API types, hooks, and tooling.

When not to introduce micro-frontends:

- Do not use them just because the app is large.

## Phased Roadmap

### Phase 1: MVP, 0-1,000 Users

Implement:

- Feature-based structure for new code.
- Stable TanStack Query provider.
- Shared API client.
- Zod schemas for forms.
- Route loading and error states.
- Permission helpers.
- Basic Sentry setup.

Do not implement:

- Micro-frontends.
- Complex feature flag platform.
- Full design-system package.

### Phase 2: Growth, 1,000-100,000 Users

Implement:

- `src/features` migration.
- Shared data-table system.
- Better query key factory.
- E2E tests for critical admin workflows.
- Storybook for shared components.
- Web vitals and workflow analytics.
- Preview deployments.

### Phase 3: Scale, 100,000-1M Users

Implement:

- Monorepo shared packages with lender and website.
- Shared API types generated from OpenAPI.
- Visual regression tests.
- Advanced role/permission UI.
- Bundle analysis in CI.

Do not implement:

- Micro-frontends unless team deployment boundaries require them.

### Phase 4: Large Scale, 1M+ Users

Implement:

- Independent packages for design system, API client, auth helpers, telemetry, and table framework.
- Micro-frontends only for independently owned admin domains if needed.
- Strong release management and rollback automation.

## Highest-Priority Changes For This Codebase

1. Fix `src/provider/AppProvider.tsx` query client stability.
2. Create `src/lib/api-client.ts` and move direct API logic behind feature APIs.
3. Create `src/features` and migrate one domain at a time.
4. Standardize tables, filters, empty states, errors, and pagination.
5. Add permission tests and E2E coverage for critical admin actions.
