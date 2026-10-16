# GYONGS Next.js (frontend + backend, same PostgreSQL, same functionality)

This is a like-for-like migration of the legacy Express + vanilla HTML app into Next.js.
No new features. No ORM. No payment gateway. No new admin system.

## Legacy (removed)
- Old Express backend (`server.js`, `routes/`, `db.js`, `auth.js`) deleted.
- Old vanilla frontend (`public/*.html`, `public/*.js`) deleted.
- PostgreSQL `gyongs_db` kept unchanged (`db/schema.sql`, `db/seed.sql`).

## Next.js (current, project root)
- Frontend: `app/` pages (same GYONGS design, same copy, same flows)
- Backend: `app/api/*/route.js` (same endpoints, same SQL, same auth)
- DB: same PostgreSQL via `lib/db.js` (`pg` Pool, no Prisma)
- Assets: `public/assets/*.png` + `public/login.css`
- Config: `package.json`, `next.config.js`, `jsconfig.json` at project root
- Env: `.env.local` (local) + `.env` (PostgreSQL/backend config)

## Setup (Windows cmd)
1. Run Next.js from the project root:
   ```
   npm install
   npm run dev
   ```
   Open http://localhost:3000
   Health: http://localhost:3000/api/health
   (DB/env come from `.env.local` / `.env`.)

## Routes map (same behavior)
- `/` (public home, first 8 products preview)
- `/services` (public collections + ?category=)
- `/about`, `/contact`
- `/login` (login + register panels, localStorage token)
- `/shop` (protected, ?category=, View + Add to Cart)
- `/product/[id]` (protected details + qty + Add)
- `/cart` (protected table, qty +/-, remove, subtotal/total)
- `/checkout` (demo checkout, NO real payment)
- `/orders` (my orders + View details)
- `/api/auth/*`, `/api/products*`, `/api/cart*`, `/api/orders*`, `/api/health`

## Notes
- `.env.local` holds PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD/JWT_SECRET (never commit).
- Admin: set `ADMIN_EMAIL` to the email of the account allowed to open `/admin`; the account must be registered normally first.
- JWT in httpOnly `gyongs_token` cookie + `localStorage` token, same as legacy.
- Images: `/assets/*` served by Next.js from `public/assets/`.
- `login.css` served by Next.js from `public/login.css`.
- PostgreSQL files/config: `db/` + `.env`.
- Java admin tool (unchanged): `gyongs-admin/`.
