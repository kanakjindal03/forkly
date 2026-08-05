# Forkly — Frontend

A single Vite + React project containing all four Forkly experiences. Everything runs on
realistic mock data in the browser (no backend connection yet — see `../backend` for the
matching API, and the root `README.md` for how the two fit together).

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually **http://localhost:5173**). You'll land on a portal
picker — choose one of:

- **Customer site** — browse restaurants, order food, track delivery, dark/light mode
- **Restaurant Owner dashboard** — orders, menu management, analytics, coupons
- **Delivery Partner dashboard** — accept deliveries, earnings, history
- **Admin dashboard** — platform stats, approvals, reports

A small "← Switch portal" button (bottom-left) takes you back to the picker at any time.

## Build for production

```bash
npm run build   # outputs static files to dist/
npm run preview # serve the production build locally to double-check it
```

`dist/` is a plain static site — deploy it anywhere that serves static files (Vercel,
Netlify, Cloudflare Pages, an S3 bucket + CDN, nginx, etc.).

## Structure

```
src/
  main.jsx              entry point
  storagePolyfill.js     localStorage-backed shim for window.storage (cart/favorites persistence)
  RootSwitcher.jsx       the portal picker + "switch portal" button
  apps/
    CustomerApp.jsx       the customer-facing site
    OwnerApp.jsx          restaurant owner dashboard
    DeliveryApp.jsx       delivery partner dashboard
    AdminApp.jsx          admin dashboard
```

Each file in `src/apps/` is fully self-contained (its own mock data, styling, and state) —
you can also copy any single one out and drop it into its own project if you only need
that piece.

## Notes

- Only `CustomerApp.jsx` persists anything (cart, favorites, theme) — via `window.storage`,
  polyfilled onto `localStorage` in `storagePolyfill.js` so it works in a normal browser
  exactly like it did in the Claude.ai preview.
- The dashboards (`OwnerApp`, `DeliveryApp`, `AdminApp`) reset their mock data on every page
  refresh — there's no backend behind them yet.
- Verified: `npm run build` completes cleanly, and each app was smoke-tested with a real
  React render pass (not just a bundler check) — no runtime errors.
