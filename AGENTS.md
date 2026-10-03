# AGENTS.md

BandhanJodi matrimony app on TanStack Start + Netlify. **Continue from PLAN.md.**

## Layout
- `src/routes/` — file routes (`index.tsx` hero landing, `__root.tsx` document/fonts).
- `src/lib/options.ts` — all dropdown option lists; `plans.ts` — pricing, UPI payee, money formatting; `registration.ts` — form type, zod schema, per-step validation, share text.
- `src/server/members.ts` — server functions: `submitRegistration`, `recordPayment`, `getMyProfile`.
- `db/schema.ts` — Drizzle schema (`registrations`, `membership_payments`); migrations in `netlify/database/migrations` (generate with `npx drizzle-kit generate --name <name>`; never edit applied ones).
- `public/img/` — `hero-bg.jpg`, `upi-qr.jpg` (EXIF stripped). Serve via `/.netlify/images?url=/img/...`.

## Conventions / decisions
- Passwords go only to Netlify Identity, never the DB.
- Payment prices are always charged in INR; USD is display-only.
- Layout is a phone frame on wide screens (`#phone` in `styles.css`).
- Use `.inputValidator(...)` on server functions; drizzle packages must be `@beta`.
