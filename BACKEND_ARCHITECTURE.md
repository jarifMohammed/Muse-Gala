# MuseGala Backend Architecture Roadmap

This document outlines a production-grade backend roadmap for evolving MuseGala from MVP to large scale.

Target stack:

- Go
- PostgreSQL
- Redis
- Docker
- REST APIs

The existing backend has feature areas for auth, users, listings, bookings, payments, payouts, messaging, disputes, subscriptions, CMS, webhooks, and background jobs. The long-term backend should preserve these product boundaries while enforcing stronger domain ownership, transactional consistency, observability, and deployment discipline.

## Recommended Initial Architecture

Start with a **modular monolith in a monorepo**.

Why it is needed:

- MuseGala has transactional workflows around bookings, payments, lender allocation, returns, disputes, and payouts.
- These workflows need strong consistency more than independent deployment early on.
- A modular monolith gives startup speed while keeping clear paths to future service extraction.
- It avoids the operational cost of microservices before the team and product domain are mature.

Trade-offs:

- Modules are not independently deployable at first.
- Boundaries must be enforced by code review and package structure.
- A careless modular monolith can still become a tangled monolith.

When to implement:

- From day one of the Go/PostgreSQL backend.

When not to implement:

- If separate teams already own independent domains and need independent deploys.
- If one domain has radically different scaling needs from the beginning.

Do not start with microservices. Use event-driven patterns inside the monolith first.

## Codebase Structure

Recommended structure:

```text
/apps
  /api
  /worker
  /migrate
/internal
  /platform
    /postgres
    /redis
    /http
    /auth
    /observability
    /queue
    /config
  /modules
    /identity
    /catalog
    /listing
    /booking
    /payment
    /payout
    /messaging
    /notification
    /dispute
    /returnflow
    /admin
    /cms
/pkg
  /errors
  /idempotency
  /pagination
/migrations
/api/openapi
```

Each module should follow this internal shape:

```text
domain.go        pure business types, state rules, invariants
service.go       use cases and orchestration
repository.go    repository interfaces
postgres.go      persistence implementation
http.go          REST handlers and route wiring
events.go        domain events emitted and consumed by the module
```

Why it is needed:

- Separates transport, business logic, persistence, and integrations.
- Makes future service extraction easier.
- Lets future teams own modules without rewriting the system.

Trade-offs:

- More structure than quick CRUD.
- Cross-module calls must be intentional.

When not to implement:

- Do not over-abstract throwaway prototypes.

## Domain Boundaries

Recommended bounded contexts:

- **Identity/Auth**: users, roles, sessions, refresh tokens, KYC state.
- **Catalog**: master dresses and searchable public inventory.
- **Listing**: lender-owned rentable items, approval, availability.
- **Booking**: rental lifecycle, allocation, status transitions, cancellation, return state.
- **Payment/Payout**: Stripe payment intents, refunds, transfers, webhook ingestion.
- **Messaging**: chat rooms, messages, read receipts, realtime delivery.
- **Notification**: email, SMS, push templates, delivery attempts.
- **Dispute/Return**: late returns, evidence, escalation, admin decisions.
- **Admin/CMS**: dashboards, operational workflows, content management.

The **Booking** module should be the core consistency owner. Payment, payout, messaging, and notification should react to booking/payment events instead of freely mutating booking state from scattered code paths.

Common mistake:

- Treating booking status as free-form strings instead of an explicit state machine.

## Database Design

Use PostgreSQL as the source of truth from the beginning.

Recommended practices:

- Use migrations with `goose`, `atlas`, or `golang-migrate`.
- Use `pgx` for PostgreSQL access.
- Consider `sqlc` for type-safe SQL.
- Use UUID or ULID primary keys.
- Use foreign keys for core relational data.
- Use check constraints for important enum-like values.
- Use unique constraints for business invariants.
- Add `created_at` and `updated_at` consistently.
- Use `deleted_at` only where soft delete is required.

Important tables:

- `users`
- `sessions`
- `refresh_tokens`
- `lenders`
- `listings`
- `catalog_items`
- `bookings`
- `booking_status_history`
- `booking_holds`
- `payments`
- `payment_events`
- `payouts`
- `promo_codes`
- `promo_code_redemptions`
- `chat_rooms`
- `messages`
- `notifications`
- `webhook_events`
- `outbox_events`
- `audit_logs`

Recommended early indexes:

```sql
CREATE INDEX idx_bookings_customer_created_at ON bookings (customer_id, created_at DESC);
CREATE INDEX idx_bookings_lender_created_at ON bookings (lender_id, created_at DESC);
CREATE INDEX idx_bookings_status_sla ON bookings (status, sla_expires_at);
CREATE INDEX idx_bookings_listing_dates ON bookings (listing_id, rental_start_date, rental_end_date);
CREATE UNIQUE INDEX idx_payments_stripe_intent ON payments (stripe_payment_intent_id);
CREATE UNIQUE INDEX idx_webhook_events_provider_event ON webhook_events (provider, provider_event_id);
CREATE INDEX idx_messages_room_created_at ON messages (chat_room_id, created_at DESC);
CREATE INDEX idx_listings_lender_status ON listings (lender_id, approval_status, is_active);
```

For rental availability, avoid unsafe check-then-insert logic. Use one of:

- A `booking_holds` table with expiration.
- PostgreSQL exclusion constraints over date ranges.
- `SELECT ... FOR UPDATE` on inventory rows during booking creation.

When not to implement:

- Do not shard early.
- Do not add read replicas before query tuning and indexing.

## Redis, Queues, And Background Jobs

Use Redis early, but narrowly.

Good Redis use cases:

- Rate limiting.
- Short-lived booking holds.
- Idempotency response cache.
- Session/token denylist if needed.
- Realtime presence.
- Lightweight job queues with a library such as `asynq`.

Do not use Redis as the source of truth for bookings, payments, payouts, or inventory.

For durable business events, use a PostgreSQL transactional outbox first:

1. API writes booking/payment data inside a database transaction.
2. The same transaction writes an `outbox_events` row.
3. A worker polls the outbox.
4. The worker sends email, calls Stripe, emits websocket events, or triggers downstream work.
5. The worker marks the event processed or failed.

When to introduce brokers:

- **SQS/RabbitMQ**: when worker volume or durability requirements outgrow the database-backed outbox/job table.
- **Kafka**: when many consumers, event replay, analytics, or a data platform require event streams.

Common mistake:

- Adding Kafka for simple email jobs.

## Concurrency And Consistency

Assume every endpoint can be retried, double-clicked, called concurrently, or replayed by a webhook.

Use:

- Database transactions for booking creation and payment state changes.
- Unique constraints as final correctness guards.
- Idempotency keys for booking and payment creation.
- Optimistic locking with a `version` column for admin edits.
- `SELECT ... FOR UPDATE` for booking, inventory, payout, and wallet-like mutations.
- Stripe webhook deduplication with `provider_event_id`.
- Explicit state machines for booking and payment transitions.

When not to implement:

- Avoid distributed locks unless the invariant cannot be protected by PostgreSQL.

## API Design

Keep REST APIs.

Recommended conventions:

- Prefix routes with `/api/v1`.
- Use cursor pagination for large lists.
- Use a stable error envelope:

```json
{
  "code": "BOOKING_CONFLICT",
  "message": "This listing is unavailable for the selected dates.",
  "request_id": "req_123",
  "details": {}
}
```

- Maintain OpenAPI documentation.
- Separate public, customer, lender, admin, and webhook route groups.
- Make additive changes where possible.
- Use deprecation windows for breaking changes.

Common mistake:

- Creating `/v2` for every small response change.

## Authentication, Authorization, And Security

Security baseline:

- Short-lived access tokens.
- Rotating refresh tokens stored hashed in PostgreSQL.
- RBAC roles: `customer`, `lender`, `admin`, `super_admin`.
- ABAC ownership checks for customer/lender/admin resources.
- Password hashing with Argon2id or bcrypt.
- Webhook signature verification.
- Strict CORS.
- CSRF protection if using cookies.
- Request validation for all inputs.
- Rate limits for auth, checkout, and public APIs.
- Audit logs for admin, payment, payout, and dispute actions.
- Secrets stored in a cloud secret manager.
- Signed upload URLs for object storage.

When not to implement:

- Do not build a complex permission engine before RBAC plus ownership checks are insufficient.

## Retries, Circuit Breakers, And Recovery

For Stripe, email, Cloudinary, KYC, and other providers:

- Use timeouts on every call.
- Retry only safe or idempotent operations.
- Use exponential backoff with jitter.
- Store failed jobs in a dead-letter table or queue.
- Add circuit breakers for degraded providers.
- Build manual replay tooling for failed webhooks and outbox events.
- Make event consumers idempotent.

Do not retry non-idempotent external operations without an idempotency key.

## Traffic Spikes

Prepare with:

- Stateless API containers.
- Horizontal scaling behind a load balancer.
- Redis-backed rate limits.
- CDN for static and media assets.
- Object storage for uploads.
- Database connection pool limits.
- PgBouncer when connection counts grow.
- Load tests for auth, listing search, booking checkout, and webhooks.

Common bottleneck:

- Database pressure and external provider latency usually fail before Go CPU.

## Observability

Production logs should be structured JSON to stdout.

Add:

- Request IDs.
- Structured logs.
- OpenTelemetry tracing.
- Prometheus metrics.
- API RED metrics: request rate, errors, duration.
- Worker metrics: queue depth, retries, dead letters, processing latency.
- Business metrics: bookings created, payments failed, webhook lag.
- Alerts based on SLOs.
- Dashboards for API, PostgreSQL, Redis, workers, and Stripe/webhooks.

Do not alert on every error log. Alert on user impact and sustained failure.

## Deployment And Operations

Use Docker from the beginning.

Recommended setup:

- Multi-stage Go Dockerfile.
- Separate runtime commands for `api`, `worker`, and `migrate`.
- CI pipeline with lint, tests, race tests, migration checks, and Docker build.
- CD pipeline with controlled migrations.
- Rolling or blue/green deploys.
- Managed PostgreSQL.
- Managed Redis.
- Automated backups.
- Regular restore drills.

Do not adopt Kubernetes before the team needs its operational model.

## When To Introduce Bigger Infrastructure

Redis:

- Use in MVP for rate limits, short-lived holds, idempotency cache, and lightweight queueing.
- Do not use as source of truth.

Read replicas:

- Add when read-heavy dashboards, search, or reporting queries affect primary latency.
- Do not add before query tuning and indexing.

RabbitMQ or SQS:

- Add when background job volume grows or durable queue isolation is needed.
- Do not add while a transactional outbox and worker are enough.

Kafka:

- Add when many consumers, event replay, analytics streams, or data platform work require it.
- Do not use for simple one-consumer workflows.

Microservices:

- Add when a domain has separate team ownership, independent scaling needs, independent deploy cadence, and a clear data boundary.
- Good future candidates: payment, messaging/realtime, notification, search, catalog.
- Be careful extracting booking too early.

Sharding:

- Very late, after indexing, query tuning, read replicas, partitioning, caching, and vertical scaling are insufficient.

## Phased Roadmap

### Phase 1: MVP, 0-1,000 Users

Build:

- Go modular monolith.
- PostgreSQL primary database.
- Redis for rate limits and short-lived holds.
- REST API with `/api/v1`.
- Basic worker process.
- Database migrations.
- Docker Compose for local development.
- Structured JSON logs.
- Request IDs.
- Health check endpoint.
- Basic OpenAPI documentation.
- Basic CI.
- Stripe webhook idempotency.
- Booking/payment state machine.

Do not build:

- Kafka.
- Kubernetes.
- Sharding.
- Microservices.
- Complex CQRS.

### Phase 2: Growth, 1,000-100,000 Users

Build:

- Transactional outbox.
- Dedicated worker pools.
- Retry and dead-letter handling.
- PgBouncer.
- Stronger database indexes.
- Audit logs.
- Admin replay tooling for failed webhooks/jobs.
- Redis caching for hot reads.
- Observability dashboards.
- Alerting.
- Load testing.
- CI/CD hardening.

Do not split services unless one domain clearly blocks velocity or scaling.

### Phase 3: Scale, 100,000-1M Users

Build:

- Read replicas.
- Search service if listing/catalog search becomes heavy.
- SQS or RabbitMQ for durable job queues.
- Dedicated realtime gateway for messaging if websocket load grows.
- Partitioning for large tables such as messages, audit logs, webhook events, and outbox events.
- Advanced rate limiting.
- SLO-based alerting.
- Capacity planning.

Do not shard unless there is a measured database limit that cannot be solved another way.

### Phase 4: Large Scale, 1M+ Users

Build:

- Selective microservices.
- Kafka if event replay and many consumers are required.
- Separate payment, messaging, notification, search, or catalog services where justified.
- Multi-region read strategy if required.
- Data warehouse/event pipeline.
- Advanced fraud/risk systems.
- Strong platform engineering practices.

Do not split the core booking workflow until the consistency model is well understood.

## Common Startup Mistakes

- Starting with microservices too early.
- Waiting too long to define module boundaries.
- Putting business logic directly in HTTP handlers.
- Skipping database migrations.
- Treating cache as source of truth.
- Missing idempotency for checkout and webhooks.
- Having no audit trail for payment and admin actions.
- Running cron jobs inside API containers without coordination.
- Adding queues without dead-letter handling.
- Ignoring database indexes until production is slow.
- Not testing backup restores.
- No ownership checks on customer/lender/admin APIs.
- Modeling booking status as free-form strings instead of a state machine.
- Scaling infrastructure before measuring bottlenecks.

## Final Recommendation

Build MuseGala as a **Go modular monolith with PostgreSQL-owned consistency, Redis for coordination and caching, and an outbox-driven worker architecture**.

This gives the company fast MVP delivery, strong transactional correctness, clear domain boundaries, a codebase future engineers can extend, and a clean path to queues, read replicas, Kafka, and microservices only when the system truly needs them.
