# Forkly API

A production-structured REST API for **Forkly** — an online food ordering & restaurant
management platform. Built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

This is the backend counterpart to the Forkly frontend (customer site) and the Restaurant
Owner / Delivery Partner / Admin dashboards.

---

## Tech stack

| Concern            | Choice                                    |
|---------------------|--------------------------------------------|
| Runtime / language  | Node.js + TypeScript                       |
| Framework           | Express                                    |
| Database            | PostgreSQL                                 |
| ORM                 | Prisma                                     |
| Auth                | JWT (access + refresh), bcrypt password hashing |
| Validation          | Zod                                        |
| Docs                | OpenAPI 3.0 (`docs/openapi.yaml`) served via Swagger UI at `/api-docs` |
| Logging             | winston + morgan                           |
| Rate limiting       | express-rate-limit                         |
| Testing             | Jest + Supertest                           |
| Containerization    | Docker + docker-compose                    |

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and point `DATABASE_URL` at your Postgres instance. Generate real JWT secrets
for anything beyond local development:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Generate the Prisma client and run migrations

```bash
npx prisma generate
npx prisma migrate dev --name init
```

> **Note:** these two commands need normal internet access (Prisma downloads its query
> engine binary on first run). This is standard for every Prisma project — nothing
> Forkly-specific to worry about.

### 4. (Optional) seed sample data

```bash
npm run prisma:seed
```

This creates a demo admin, restaurant owner, and customer account (credentials are printed
to the console), a sample restaurant with a small menu, and two coupons.

### 5. Run the dev server

```bash
npm run dev
```

The API listens on `http://localhost:4000` by default. Interactive API docs are served at
`http://localhost:4000/api-docs`.

### 6. Run tests

```bash
npm test
```

Tests run against a lightweight in-memory Prisma stub (see `test/mocks/`), so they don't
require a live database — fast enough to run in CI on every push.

---

## Running with Docker

```bash
docker compose up --build
```

This starts Postgres and the API together, runs `prisma migrate deploy` automatically, and
exposes the API on `http://localhost:4000`.

---

## Project structure

```
src/
  config/         env loading, Prisma client singleton, logger, swagger loader
  middleware/      auth (JWT + RBAC), validation, rate limiting, centralized error handling
  validators/      Zod schemas for every request body/query
  controllers/     business logic, one file per resource
  services/        logic shared across controllers (e.g. coupon discount math)
  routes/          Express routers, one file per resource, mounted in routes/index.ts
  utils/           JWT, password hashing, pagination, API response envelope, AppError
  __tests__/       Jest + Supertest test suites
  app.ts           Express app assembly (exported for tests)
  server.ts        process entry point (starts listening, graceful shutdown)
prisma/
  schema.prisma    full data model (see below)
  seed.ts          sample data for local development
docs/
  openapi.yaml               full OpenAPI 3.0 spec (served at /api-docs)
  Forkly.postman_collection.json   importable Postman collection
```

---

## Data model

All entities from the product spec are modeled as first-class Prisma models:
`User`, `Address`, `Restaurant`, `Category` (global cuisine taxonomy) /
`RestaurantCategory` (join table), `MenuCategory` (a restaurant's own menu sections),
`FoodItem`, `FoodImage`, `AddOn`, `Order`, `OrderItem`, `OrderItemAddOn`, `Payment`,
`Review`, `Coupon`, `Offer`, `DeliveryPartner`, `Notification`, `Favorite`.

See `prisma/schema.prisma` for the full definition, including enums for roles and status
fields (`Role`, `RestaurantStatus`, `OrderStatus`, `PaymentMethod`, `PaymentStatus`,
`DeliveryPartnerStatus`, `DiscountType`).

The relational design (keys, cascades, and constraints) was verified directly against a
live PostgreSQL instance during development — restaurants with order history, for example,
correctly refuse deletion via a foreign-key constraint rather than silently orphaning data.

---

## Authentication & roles

- `POST /api/v1/auth/register` / `/login` issue a short-lived **access token** (15 min
  default) and a longer-lived **refresh token** (7 days default). Send the access token as
  `Authorization: Bearer <token>` on subsequent requests.
- `POST /api/v1/auth/refresh` exchanges a valid refresh token for a new pair.
- Four roles: `CUSTOMER`, `RESTAURANT_OWNER`, `DELIVERY_PARTNER`, `ADMIN`. Route-level
  `authorize(...)` middleware enforces which roles can call which endpoints (see
  `src/middleware/auth.ts`).
- Restaurant owners and delivery partners start in a `PENDING` state after registering their
  restaurant / applying — an admin must approve them (`/admin/restaurants/:id/review`,
  `/admin/delivery-partners/:id/review`) before they go live.

---

## Order lifecycle

```
PENDING → ACCEPTED → PREPARING → READY → PICKED_UP → ON_THE_WAY → DELIVERED
                                     ↘ (any of the above) → CANCELLED
```

- The restaurant owner drives `PENDING → READY`.
- Once `READY`, any online, approved delivery partner can `POST /orders/:id/claim` it.
- The assigned partner then drives `PICKED_UP → ON_THE_WAY → DELIVERED`.
- The customer may cancel while still `PENDING` or `ACCEPTED`.
- All transitions are validated server-side (`src/controllers/order.controller.ts`) — you
  cannot, for example, jump straight from `PENDING` to `DELIVERED`, or update a status you
  don't have permission for.

Order pricing (subtotal, discount, delivery fee, tax, total) is **always computed
server-side** from the current food item / add-on prices at the time of ordering — the
client only sends item IDs, quantities, and a coupon code, never dollar amounts.

---

## API documentation

- **Interactive:** run the server and open `http://localhost:4000/api-docs`.
- **Static file:** `docs/openapi.yaml` (OpenAPI 3.0 — importable into Postman, Insomnia,
  Redoc, etc.)
- **Postman:** import `docs/Forkly.postman_collection.json`. It ships with collection
  variables (`baseUrl`, `accessToken`, …) and test scripts that auto-populate the token
  after login/register.

Every endpoint responds with the same envelope:

```json
// success
{ "success": true, "data": { /* ... */ }, "meta": { "page": 1, "limit": 20, "total": 42 } }

// failure
{ "success": false, "error": { "message": "...", "details": [ /* validation issues */ ] } }
```

---

## Testing strategy

- **Unit tests** — pure logic with no I/O: password hashing, JWT sign/verify, coupon
  discount computation (`src/__tests__/*.test.ts`).
- **Integration tests** — full HTTP requests through the real Express app via Supertest,
  with the Prisma client mocked at the module boundary (`jest.mock("../config/prisma")`
  per test file). This verifies real middleware behavior (auth, RBAC, Zod validation,
  centralized error handling, rate limiting config) without needing a live database in CI.
- Run everything with `npm test`, or `npm run test:watch` while developing.

---

## Security checklist

- [x] Passwords hashed with bcrypt (12 salt rounds)
- [x] JWT access + refresh tokens, short-lived access tokens
- [x] Role-based access control on every mutating endpoint
- [x] `helmet()` for secure headers
- [x] CORS restricted to a configured origin
- [x] express-rate-limit globally, with a stricter limit on auth endpoints
- [x] All input validated with Zod before it reaches a controller
- [x] Centralized error handler that never leaks stack traces in production
- [x] Server-side price/discount computation (never trusts client-sent totals)

---

## Extending this backend

A few things intentionally kept simple for this MVP that you'd want to revisit before a
real production launch:

- **Payments** are mocked (`Payment.status` is set to `PAID` immediately for card/UPI/wallet).
  Swap in a real provider (Stripe, Razorpay, etc.) behind the same `Payment` model.
- **Email** (password reset, order confirmations) is stubbed — wire up a provider
  (Postmark, SES, Resend) where the `TODO` comments are in `auth.controller.ts`.
- **Delivery partner earnings** are derived on the fly from delivered orders' delivery fees.
  A real system would want a dedicated ledger table for base pay, tips, and bonuses.
- **Admin activity logs** aren't persisted as a dedicated audit table yet — add one
  (`AuditLog { actorId, action, targetType, targetId, createdAt }`) if you need a real
  audit trail.
