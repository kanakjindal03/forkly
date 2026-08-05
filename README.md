# Forkly — Full Project

Everything built so far for Forkly, an online food ordering & restaurant management
platform: the customer site, three role-based dashboards, and a complete backend API.

```
forkly-project/
  frontend/   Vite + React app — all 4 web experiences (see frontend/README.md)
  backend/    Node/Express/TypeScript/Prisma REST API (see backend/README.md)
```

**Important:** the frontend and backend are **not yet wired together**. The frontend runs
entirely on realistic mock data in the browser; the backend is a fully working, separately
runnable API. You can run either one on its own today. Connecting them (replacing the
frontend's mock state with real `fetch` calls to the API) is the natural next step — ask
and I can do that next.

Requirements: **Node.js 18+** and **npm** for the frontend. The backend additionally needs
**PostgreSQL** (or Docker, which includes it for you).

---

## Option A — just look at the website (fastest)

```bash
cd frontend
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). You'll see a picker for the four
experiences: Customer site, Owner dashboard, Delivery dashboard, Admin dashboard. That's it
— no database, no API, no environment variables needed for this path.

---

## Option B — run the backend API too

### 1. Get PostgreSQL running

Easiest: use Docker for just the database —

```bash
docker run --name forkly-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=forkly -p 5432:5432 -d postgres:16
```

(Or point `DATABASE_URL` in the next step at any Postgres you already have.)

### 2. Set up and run the API

```bash
cd backend
npm install
cp .env.example .env          # defaults already match the docker command above
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed           # optional: creates demo accounts + a sample restaurant
npm run dev
```

The API is now at `http://localhost:4000`, with interactive docs at
`http://localhost:4000/api-docs`. Full details, the data model, auth flow, and testing
instructions are in `backend/README.md`.

### 3. (Optional) run everything via Docker Compose instead

```bash
cd backend
docker compose up --build
```

This starts Postgres **and** the API together and runs migrations automatically.

---

## Verification already done

So you know what's actually been checked rather than just written:

- **Database schema** — applied directly against a live PostgreSQL instance (tables, enums,
  foreign keys, cascades). Verified relational integrity end-to-end (e.g. a restaurant with
  order history correctly refuses deletion).
- **Backend** — 28 automated tests (Jest + Supertest) pass, covering auth, role-based access
  control, input validation, and coupon-discount math, exercised through the real Express
  app. `tsc` type-checks clean except for symbols that only exist after you run
  `prisma generate` (expected — see `backend/README.md`).
- **Frontend** — `npm run build` completes with no errors, and each of the four apps was
  additionally rendered with real React (server-side render pass) to catch runtime errors a
  bundler check alone wouldn't — all four render cleanly.

---

## What's mocked / not yet built

- Frontend ↔ backend integration (see note at the top)
- Real payment gateway (currently simulated)
- Outbound email (password reset, order confirmations — currently stubbed)
- A dedicated delivery-partner earnings ledger (currently derived from order data)

See each sub-project's README for more detail on its own scope.
