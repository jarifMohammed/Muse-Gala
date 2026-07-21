# MuseGala Lender Dashboard Frontend Architecture Roadmap

This README is the frontend architecture guide for `muse_gala_lender_dashboard`.

Stack:

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- NextAuth
- Socket.IO
- REST APIs

The lender dashboard is a workflow-heavy business application. It should prioritize reliable listing management, booking operations, payouts, subscription flows, chat, dispute handling, and form-heavy lender tasks.

## Current Codebase Review

Current strengths:

- Uses Next.js App Router with `(auth)` and `(dashboard)` route groups.
- Has dashboard areas for bookings, listings, chats, disputes, payments, subscription plans, help center, and account settings.
- Uses TanStack Query, Zustand, NextAuth, React Hook Form, Zod, Tailwind, Radix UI, and Socket.IO.
- `components/Providers/query-provider.tsx` already keeps `QueryClient` stable with `useState`.

Main changes needed in this codebase:

- Consider moving to a `src/` structure later to match admin and website.
- Consolidate repeated chat hooks with the website app.
- Consolidate repeated UI primitives with admin and website through a future shared package.
- Reduce UI library overlap: this app uses Radix/shadcn-style primitives and also MUI. Prefer one default component system.
- Move `services/*`, `hooks/*`, `zustand/*`, and domain components into `features/*`.
- Fix naming consistency, for example typo-like names such as `useDebounc.tsx`.
- Add route-level `error.tsx` and more `loading.tsx` files for workflow-heavy pages.
- Add E2E tests for lender listing creation, booking accept/reject, chat, payout setup, and dispute submission.

Recommended target structure:

```text
src/
  app/
    (auth)/
    (dashboard)/
      bookings/
      listings/
      chats/
      disputes/
      payments/
      subscription-plans/
      account-settings/
  features/
    auth/
    dashboard-overview/
    listings/
    bookings/
    chat/
    disputes/
    payments/
    subscriptions/
    account-settings/
    support/
  components/
    ui/
    layout/
    forms/
    feedback/
  lib/
    api-client.ts
    query-client.ts
    auth.ts
    utils.ts
  stores/
  hooks/
  types/
  schemas/
```

If a full `src/` migration is too disruptive, keep the current root structure temporarily and still introduce root-level `features/`.

## Architecture Choice

Use a **feature-based dashboard architecture**.

Why it is needed:

- Lender workflows are domain-specific and stateful.
- Listings, bookings, payouts, subscriptions, chat, and disputes should be independently maintainable.
- Future developers can own one lender workflow without touching the whole dashboard.

Trade-offs:

- Shared components need careful extraction.
- Some existing files must move gradually.

When to implement:

- Immediately for new lender features.
- Gradually migrate existing services/hooks/components by domain.

When not to implement:

- Do not move every tiny page-only component if it is not reused.

Common mistake:

- Building all workflows from global components and global stores until nobody knows which domain owns behavior.

## Pages, Layouts, Components, Hooks, Services

Recommended rules:

- `app`: routes, layouts, loading, error, metadata.
- `app/**/_components`: route-only components.
- `features/<domain>`: domain components, queries, API calls, schemas, and types.
- `components/ui`: design-system primitives only.
- `components/layout`: sidebar, top bar, dashboard shell.
- `components/forms`: reusable form field wrappers.
- `services`: should be migrated into `features/*/api.ts`.
- `zustand`: should be migrated into `stores` or feature-local stores.

Why it is needed:

- Lender pages have complex workflows and should not depend on scattered hooks/services.

Trade-offs:

- File moves require import cleanup.

When not to implement:

- Do not build a generic abstraction until at least two features need it.

## Reusable UI And Design System

Use one primary UI system.

Recommended:

- Keep Radix/shadcn-style primitives as the default.
- Use MUI only where a specific advanced component is worth the bundle and design trade-off.
- Standardize buttons, inputs, modals, drawers, tables, badges, status labels, form fields, and empty states.

Design-system layers:

```text
components/ui             primitives
components/forms          form field wrappers
components/layout         dashboard chrome
components/feedback       loading, empty, error, toast
features/*/components     domain-specific UI
```

Why it is needed:

- Lenders repeat the same workflow patterns across bookings, listings, payments, and disputes.

Trade-offs:

- Consolidating UI can slow short-term feature work.

When to implement:

- Start with forms, tables, status badges, modals, and file uploads.

When not to implement:

- Do not create a full token package until all three frontends move toward a monorepo.

Common mistake:

- Mixing multiple component libraries without clear rules.

## State Management

Use:

- **TanStack Query** for server state: listings, bookings, payouts, subscriptions, disputes, chat history.
- **Zustand** for client-only state: socket connection, selected chat, temporary UI filters, multi-step form state.
- **URL search params** for filters, tabs, pagination, date ranges.
- **React Hook Form + Zod** for forms.
- **Context** for stable providers only.

Why it is needed:

- Lender data changes frequently and should be cached/invalidation-driven.
- Workflow UI state should not pollute server-state caches.

Trade-offs:

- Requires clear query key conventions.

When not to implement:

- Do not store API response data in Zustand unless it is truly client-only derived state.

Common mistake:

- Keeping booking/listing data in global stores and manually refreshing it.

## Performance Strategy

Dashboard performance priorities:

- Fast route transitions.
- Fast table/list filtering.
- Reliable file uploads.
- Efficient chat.
- Avoiding heavy bundles in pages that do not need them.

Implement from day one:

- Server components by default.
- Client components only for interactive workflows.
- Dynamic imports for chat, CSV import, bulk listing forms, date pickers, charts, and file upload modals.
- Server-side pagination/filtering for bookings, payments, disputes, and listings.
- Debounced search backed by URL state.
- Image optimization for listing media.

When to use code splitting:

- Chat, CSV import, large forms, date pickers, MUI-heavy components, charts.

When to use lazy loading:

- Modal content, secondary tabs, payment setup, support forms.

When to use SSR:

- Authenticated dashboard shell and initial dashboard data.

When to use SSG/ISR:

- Rarely. Lender dashboard data is private and dynamic.

When to use edge rendering:

- Usually not needed.

Common mistake:

- Loading chat/socket/file-upload code on every dashboard page.

## API Communication Layer

Create a single REST client:

```text
lib/api-client.ts
features/listings/api.ts
features/bookings/api.ts
features/payments/api.ts
features/chat/api.ts
```

The client should handle:

- Base URL.
- Auth/session.
- Timeouts.
- Error normalization.
- Request IDs.
- Typed responses.
- Safe-read retries only.

Why it is needed:

- Lender workflows need consistent error handling and retry behavior.

Trade-offs:

- The generic client must stay small.

When not to implement:

- Do not hide domain-specific workflows inside the generic API client.

## Auth And Authorization

Use NextAuth for lender sessions.

Recommended:

- Protect `(dashboard)` at layout/middleware level.
- Check lender role before rendering dashboard pages.
- Backend must enforce ownership for listings, bookings, payouts, chats, disputes, and account settings.
- Frontend should hide controls the lender cannot use, but never rely on UI-only security.

Common mistake:

- Fetching dashboard data before session/role is known.

## Forms And Complex Workflows

Use React Hook Form + Zod.

Critical workflows:

- Listing creation and editing.
- Bulk import.
- Booking accept/reject.
- Cancellation.
- Try-on exchange.
- Payout setup.
- Subscription plan selection.
- Dispute submission.
- Account settings.

Recommended:

- Multi-step forms should have explicit step state.
- Persist drafts only when safe.
- Disable mutation buttons while submitting.
- Show recovery paths for failed uploads/payments.
- Use exact query invalidation after mutations.

Common mistake:

- Letting each form invent its own validation and error display.

## Error Boundaries And Graceful Degradation

Add:

- Route-level `error.tsx` for bookings, listings, chats, disputes, payments, account settings.
- Route-level `loading.tsx` for all heavy dashboard pages.
- Empty states for no listings, bookings, payments, chats, and disputes.
- Retry buttons for failed fetches.
- Offline/reconnect UI for chat.
- Upload failure recovery.

Do not auto-retry destructive mutations.

## Feature Flags

Start simple:

- Typed config flags for new workflow rollouts.

Introduce a feature flag service when:

- Features need per-lender rollout.
- Subscription plan experiments begin.
- Risky workflows need instant rollback.

Do not introduce a feature flag vendor before you need segmented rollout.

## Accessibility, Theming, Localization

Accessibility:

- Keyboard-friendly dashboard navigation.
- Accessible modals and drawers.
- Proper labels for every input.
- Focus management for multi-step forms.
- Status badges with text, not color only.
- Accessible file upload controls.

Theming:

- Use CSS variables and Tailwind tokens.
- Keep dark mode only if product requires it.

Localization:

- Prepare strings for future i18n.
- Add `next-intl` only when localization is a real business requirement.

Common mistake:

- Using color-only status indicators in operational workflows.

## Testing Strategy

Recommended:

- Unit tests: schemas, formatters, CSV utilities, permission helpers.
- Integration tests: forms, filters, query invalidation, chat hooks.
- E2E tests: login, create listing, edit listing, accept/reject booking, submit dispute, payout setup, chat message.
- Visual regression: shared dashboard components, forms, tables, modals.

Tools:

- Vitest or Jest.
- React Testing Library.
- Playwright.
- Storybook later.
- Chromatic or Percy later.

Common mistake:

- Testing form components but not full lender workflows.

## Code Quality Standards

Enforce:

- TypeScript strict mode.
- ESLint.
- Prettier.
- No direct REST calls outside feature API modules.
- No untyped API responses.
- No duplicated chat/socket logic across apps once monorepo exists.
- No new MUI usage without a reason.
- Pull request checklist for loading, error, empty, accessibility, and mobile states.

## Observability And Monitoring

Add:

- Sentry for errors and performance.
- Web vitals reporting.
- Analytics for listing creation, booking response, payout setup, subscription conversion, chat usage.
- Session replay only with strict privacy masking.
- Client logs for upload, payment, and chat failures.

Recommended tools:

- Sentry for errors/performance.
- PostHog or Amplitude for product analytics.
- LogRocket only with privacy controls.
- Datadog RUM if backend/cloud monitoring standardizes on Datadog.

Do not record private chat, payment, KYC, or bank details.

## Deployment And Environments

Use:

- `development`
- `staging`
- `production`

Rules:

- Only browser-safe values use `NEXT_PUBLIC_*`.
- Secrets stay server-side.
- Preview deployments for PRs.
- CI runs lint, build, and tests.
- Roll back by redeploying previous build.
- Test critical lender flows in staging before release.

## Team Scaling

1 developer:

- Keep one app. Add feature folders and a shared API client.

5 developers:

- Assign owners for listings, bookings, payments, chat, account settings.
- Add E2E tests for critical workflows.

20 developers:

- Move shared UI, API types, auth helpers, chat hooks, telemetry, and config into monorepo packages.
- Add Storybook and visual regression.

50+ developers:

- Consider micro-frontends only when teams need independent deploys.

When to introduce monorepo:

- When lender, admin, and website duplicate UI, auth, chat, API, and tooling.

When not to introduce micro-frontends:

- Do not split this dashboard until team ownership and deployment boundaries are clear.

## Phased Roadmap

### Phase 1: MVP, 0-1,000 Users

Implement:

- Feature folders for listings, bookings, chat, payments, disputes, account settings.
- Shared API client.
- Consistent form components and validation.
- Loading/error/empty states.
- Basic Sentry.
- E2E tests for create listing and booking response.

Do not implement:

- Micro-frontends.
- Full design-system package.
- Heavy experimentation platform.

### Phase 2: Growth, 1,000-100,000 Users

Implement:

- Better query key strategy.
- Shared dashboard table/form system.
- More E2E tests.
- Storybook for reusable components.
- Feature flags for risky workflow rollout.
- Chat reconnection and offline UX.

Do not implement:

- Large app restructuring without gradual migration.

### Phase 3: Scale, 100,000-1M Users

Implement:

- Monorepo shared packages.
- OpenAPI-generated API types.
- Visual regression tests.
- Bundle-size checks.
- Advanced analytics for workflow drop-off.

Do not implement:

- Micro-frontends unless deployment/team boundaries require them.

### Phase 4: Large Scale, 1M+ Users

Implement:

- Versioned design-system package.
- Shared chat package if chat remains cross-app.
- Shared telemetry package.
- Strong release and rollback automation.
- Selective micro-frontends only for independently owned lender surfaces.

Do not implement:

- Complex distributed frontend architecture without measured team pressure.

## Highest-Priority Changes For This Codebase

1. Introduce `features/` and migrate listings, bookings, chat, payments, disputes, and account settings gradually.
2. Create `lib/api-client.ts` and move `services/*` behind feature API modules.
3. Consolidate chat hooks/socket stores with the website later through a monorepo package.
4. Standardize UI library usage and avoid adding new MUI components without a clear reason.
5. Add E2E tests for create listing, accept/reject booking, chat, payout setup, and dispute submission.
