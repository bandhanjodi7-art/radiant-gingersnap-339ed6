# BandhanJodi Roadmap

1. **Foundations (done)** — branding, styles, hero landing, option lists (`src/lib/options.ts`), plan pricing (`src/lib/plans.ts`), registration model/validation (`src/lib/registration.ts`), database schema + migration (`db/`), server functions (`src/server/members.ts`).
2. **Registration flow UI** — 10-step wizard (profile-for, family, religion, location, lifestyle, appearance + account, partner preferences, introduction) using `stepComplete`, then call `submitRegistration`.
3. **Profile summary & share** — review screen with Share button (`shareText`).
4. **Membership plans** — Premium / Personalised tabs, INR/USD toggle, checkout modal with UPI QR (`/img/upi-qr.jpg`) and `recordPayment`.
5. **Accounts** — Netlify Identity signup during registration, login, `src/lib/identity-context.tsx`, member dashboard via `getMyProfile`; run the identity skill's `enable.cjs`.
6. **Matches & admin** — browse/search profiles, admin review of registrations and payment verification.
