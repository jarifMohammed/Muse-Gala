# MuseGala Website Frontend Architecture Roadmap

This README is the frontend architecture guide for `muse_gala_website`.

Stack:

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- NextAuth
- Stripe
- REST APIs

The website is the public customer-facing application. It should prioritize SEO, Core Web Vitals, product discovery, checkout reliability, accessibility, conversion, and graceful degradation.

## Current Codebase Review

Current strengths:

- Uses Next.js App Router under `src/app`.
- Has public website route groups, auth routes, account routes, shop, checkout, policies, and return flows.
- Has product, checkout, chat, account, policy, and UI component folders.
- Uses generated sitemap and robots files.
- Uses TanStack Query, Zustand, Zod, React Hook Form, Stripe, NextAuth, and Tailwind.

Main changes needed in this codebase:

- Fix `src/providers/AppProvider.tsx`: it creates a new `QueryClient` on every render. Store it with `useState` or `useMemo`.
- Treat public marketing and policy pages as static/SSG where possible.
- Treat product listing/detail pages as SSR or ISR depending on freshness needs.
- Move product/shop/account/checkout APIs into feature-level API modules.
- Deduplicate chat hooks and socket stores with lender dashboard when a monorepo is introduced.
- Add route-level `loading.tsx` and `error.tsx` for shop, checkout, account, and find-near-you.
- Use `next/image` consistently for public images and product media.
- Add real performance monitoring for Core Web Vitals.

Recommended target structure:

```text
src/
  app/
    (website)/
      shop/
      account/
      checkout/
      become-lender/
      find-near-you/
      (auth)/
      (policies)/
  features/
    auth/
    product-discovery/
    product-detail/
    checkout/
    account/
    chat/
    wishlist/
    become-lender/
    location-search/
    policies/
  components/
    ui/
    layout/
    marketing/
    feedback/
  lib/
    api-client.ts
    query-client.ts
    seo.ts
    analytics.ts
    utils.ts
  stores/
  hooks/
  types/
```

## Architecture Choice

Use a **feature-based, domain-driven frontend** inside the current Next.js app.

Why it is needed:

- The website has clear customer domains: discovery, product detail, checkout, account, chat, and lender acquisition.
- Feature folders keep API, UI, schemas, and state close together.
- SEO pages and authenticated account flows can evolve independently.

Trade-offs:

- Requires discipline to keep shared UI generic.
- Some route components will need gradual migration.

When to implement:

- Start now for shop, checkout, account, and find-near-you.

When not to implement:

- Do not over-abstract one-off marketing sections.

Common mistake:

- Mixing conversion-focused page sections with reusable design-system components.

## Pages, Layouts, Components, Hooks, Services

Recommended rules:

- `src/app`: routes, layouts, loading, errors, metadata, sitemap, robots.
- `src/app/**/_components`: route-only sections.
- `src/features/product-discovery`: shop filters, product grids, search APIs.
- `src/features/checkout`: checkout form, payment APIs, validation, order state.
- `src/features/account`: profile, order history, disputes, rewards.
- `src/features/chat`: chat hooks, socket client, message UI.
- `src/components/ui`: primitives only.
- `src/components/marketing`: reusable public landing sections.
- `src/lib/api-client.ts`: shared REST client.

Why it is needed:

- Public pages, authenticated pages, and checkout workflows have different performance and reliability needs.

Trade-offs:

- Some existing components will need to move gradually.

When not to implement:

- Do not move every landing-page section into `features` unless it has logic or reuse.

## Design System And UI Scaling

Use layered components:

```text
components/ui            Button, Input, Dialog, Sheet, Tabs, Select
components/layout        Navbar, footer, account shell
components/marketing     Landing sections, banners, CTAs
features/*/components    Product card, checkout form, chat UI
```

Why it is needed:

- The website needs consistent brand expression without making every page hard to change.

Trade-offs:

- A strict design system can slow marketing iteration.

When to implement:

- Immediately for form fields, buttons, product cards, badges, modals, drawers, and checkout states.

When not to implement:

- Do not lock marketing pages into rigid components before conversion testing.

Common mistake:

- Copying similar product cards into multiple folders with slightly different behavior.

## State Management

Use:

- **TanStack Query** for server state: products, account data, bookings, chat history, promos.
- **Zustand** for client-only state: filters, cart-like checkout UI state, socket state, location selection.
- **URL search params** for shop filters, sort, page, size, color, location, and price range.
- **React Hook Form + Zod** for checkout, auth, account, become-lender, and contact forms.
- **Context** only for stable app providers.

Important change:

```tsx
const [queryClient] = useState(() => new QueryClient());
```

Why it is needed:

- Product discovery needs shareable URLs.
- Checkout needs predictable form state.
- Server data should not be manually copied into Zustand.

Trade-offs:

- URL-backed filters require careful parsing and validation.

When not to implement:

- Do not use Redux unless workflows become complex enough to need event-style reducers.

Common mistake:

- Keeping shop filters only in local component state, making pages impossible to share or restore.

## Performance Strategy

Website performance priorities:

- Core Web Vitals.
- Fast first load.
- SEO crawlability.
- Product image optimization.
- Reliable checkout.

Implement from day one:

- Use server components by default.
- Keep client components small.
- Use `next/image`.
- Define route metadata.
- Use static rendering for policies and stable marketing pages.
- Use ISR for product and content pages that can tolerate short freshness delays.
- Use SSR for personalized account and checkout flows.
- Dynamically import maps, chat, Stripe-heavy widgets, and large modals.
- Run bundle analysis before major launches.

When to use code splitting:

- Product maps, chat, checkout payment widgets, filters drawer, account tabs.

When to use lazy loading:

- Below-the-fold marketing sections, reviews, related products, chat, modals.

When to use SSR:

- Account pages, checkout, authenticated user data, inventory-sensitive product states.

When to use SSG:

- Policy pages, about, how-it-works, lender FAQ, stable landing pages.

When to use ISR:

- Product detail pages, public catalog pages, CMS-driven homepage sections.

When to use edge rendering:

- Lightweight geo/location redirects or A/B routing only after normal SSR is insufficient.

Common mistake:

- Making the whole public website client-rendered and losing SEO/performance.

## Data Fetching, Caching, And Prefetching

Use:

- Next.js `fetch` caching for server-rendered public data.
- TanStack Query for client-side interactive data.
- Prefetch product detail pages from visible product cards only when useful.
- Cache stable CMS/policy data longer.
- Keep checkout and availability data fresh.

Why it is needed:

- Product discovery can be cached; checkout cannot be stale.

Trade-offs:

- Mixed caching strategies require clear ownership.

When not to implement:

- Do not cache inventory-sensitive checkout responses aggressively.

## API Communication Layer

Create:

```text
src/lib/api-client.ts
src/features/product-discovery/api.ts
src/features/checkout/api.ts
src/features/account/api.ts
```

The API client should include:

- Base URL.
- Auth/session handling.
- Timeouts.
- Error normalization.
- Request IDs.
- Retry only for safe reads.
- Typed request and response contracts.

Common mistake:

- Calling REST endpoints directly from many components.

## Auth And Authorization

Use NextAuth for customer sessions.

Recommended:

- Protect account and checkout routes at layout or middleware level.
- Keep unauthenticated product discovery fast and cacheable.
- Avoid exposing secrets through `NEXT_PUBLIC_*`.
- Backend must enforce ownership for account, booking, chat, and dispute data.

When not to implement:

- Do not block public product pages behind client-side auth checks.

## Forms And Complex Workflows

Use React Hook Form + Zod.

Critical website workflows:

- Sign up/login/OTP/reset password.
- Become lender form.
- Checkout.
- Promo code application.
- Return token flow.
- Dispute/report issue.
- Contact form.

Recommended:

- Persist only safe draft state.
- Disable submit during mutations.
- Show clear payment failure recovery.
- Make checkout mutations idempotent through backend support.

Common mistake:

- Treating checkout as a normal form instead of a failure-prone transactional workflow.

## Error Boundaries And Graceful Degradation

Add:

- `error.tsx` for shop, product detail, checkout, account, find-near-you.
- `loading.tsx` for dynamic routes.
- Empty states for no products, no bookings, no wishlist, no chats.
- Retry buttons for failed product/account fetches.
- Fallback UI when maps fail to load.

Do not auto-retry payment mutations.

## Feature Flags And Experimentation

Start with typed environment/config flags.

Introduce GrowthBook, Statsig, LaunchDarkly, or PostHog feature flags when:

- Marketing needs A/B tests.
- Product rollout differs by user segment.
- Checkout experiments need controlled rollout.

Do not introduce experimentation before analytics and conversion events are reliable.

## Accessibility, Theming, Localization

Accessibility:

- Semantic HTML for marketing pages.
- Proper heading order.
- Keyboard access for filters, drawers, modals, checkout, chat.
- Alt text for product images.
- Focus management for dialogs and drawers.
- Contrast checks for brand colors.

Theming:

- Use Tailwind tokens and CSS variables.
- Add dark mode only when product/design requires it.

Localization:

- Prepare for i18n by keeping user-facing strings organized.
- Introduce `next-intl` when international markets are real.

Common mistake:

- Retrofitting accessibility after the component system is already inconsistent.

## Testing Strategy

Recommended:

- Unit tests: pricing utilities, filter parsing, schemas, API mappers.
- Integration tests: shop filters, checkout form, promo flow, auth forms.
- E2E tests: signup/login, product search, product detail, checkout, account order history, return flow.
- Visual regression: homepage, product card, product detail, checkout, policy layout.

Tools:

- Vitest or Jest.
- React Testing Library.
- Playwright.
- Storybook later.
- Chromatic or Percy later.

Common mistake:

- Not testing checkout and auth until payment failures happen in production.

## Code Quality Standards

Enforce:

- TypeScript strict mode.
- ESLint.
- Prettier.
- No untyped API responses.
- No direct fetch outside API modules.
- No large client components when server components work.
- Bundle-size review for map, animation, Stripe, and chat dependencies.
- Accessibility review for every public component.

## Observability And Monitoring

Add:

- Sentry for frontend errors and performance.
- Web vitals reporting.
- Analytics for product views, filter usage, add-to-cart/checkout intent, checkout failure, signup conversion.
- Session replay only with privacy masking.
- Performance monitoring on homepage, shop, product detail, checkout.

Recommended tools:

- Sentry for errors/performance.
- PostHog or Amplitude for analytics and experiments.
- LogRocket only with strict privacy rules.
- Datadog RUM if the company standardizes on Datadog.

Do not capture payment details, passwords, tokens, addresses, or private chat content in replay/logs.

## Deployment And Environments

Use:

- `development`
- `staging`
- `production`

Rules:

- `NEXT_PUBLIC_*` only for browser-safe values.
- Stripe secret keys must stay server-side.
- Use preview deployments for PRs.
- Run lint, build, and tests in CI.
- Run Lighthouse checks for public pages before major releases.
- Roll back by redeploying a previous build.

## Team Scaling

1 developer:

- Keep one app. Add feature folders and a shared API client.

5 developers:

- Assign ownership: discovery, checkout, account, marketing, chat.
- Add E2E coverage for critical flows.

20 developers:

- Move shared UI, auth helpers, API types, chat hooks, and telemetry into monorepo packages.
- Add Storybook and visual regression.

50+ developers:

- Consider micro-frontends only for independently owned surfaces with independent release needs.

When to introduce monorepo:

- When website, lender, and admin duplicate too much UI/auth/chat/API code.

When not to introduce micro-frontends:

- Do not split the website just because it has many pages.

## Phased Roadmap

### Phase 1: MVP, 0-1,000 Users

Implement:

- Stable QueryClient provider.
- Feature folders for checkout, product discovery, account, and chat.
- Shared API client.
- SSG for policy/static marketing pages.
- SSR for account/checkout.
- ISR for product/CMS pages where safe.
- Basic Sentry.
- Basic analytics.
- Checkout E2E test.

Do not implement:

- Micro-frontends.
- Heavy experimentation platform.
- Full shared package system.

### Phase 2: Growth, 1,000-100,000 Users

Implement:

- Better product caching and prefetching.
- Core Web Vitals monitoring.
- Visual regression for public pages.
- Storybook for reusable UI.
- Feature flags for controlled rollouts.
- More E2E coverage for auth, checkout, account, and return flows.

Do not implement:

- Edge rendering everywhere.

### Phase 3: Scale, 100,000-1M Users

Implement:

- Monorepo shared packages.
- API types generated from OpenAPI.
- Design-system package shared with admin/lender.
- Advanced analytics and experimentation.
- Bundle-size budgets in CI.

Do not implement:

- Micro-frontends unless team boundaries demand independent deploys.

### Phase 4: Large Scale, 1M+ Users

Implement:

- Versioned design system.
- Shared telemetry package.
- Advanced localization if expanding markets.
- Selective edge rendering for global latency needs.
- Strong release and rollback automation.

Do not implement:

- Complex architecture without measured product or team pressure.

## Highest-Priority Changes For This Codebase

1. Fix `src/providers/AppProvider.tsx` query client stability.
2. Create `src/lib/api-client.ts`.
3. Move shop, checkout, account, and chat logic into `src/features`.
4. Add route-level loading and error boundaries for shop, checkout, account, and find-near-you.
5. Add Core Web Vitals monitoring and checkout E2E tests.
