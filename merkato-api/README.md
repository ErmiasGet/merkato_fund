# Merkato shared API

This API is shared by `merkato-fund` and `merkato-fund-admin`. PostgreSQL stores users, opaque sessions, one-time password reset tokens, website content, slides, videos, financial terms, settings, and admin audit events.

## Local setup

1. Copy `.env.example` to `.env`. Copy the full PostgreSQL URI from Supabase **Project Settings > Database > Connect** into `DATABASE_URL`; keep the URI private. Set a unique `ADMIN_PASSWORD` (at least 16 characters). The API will not start until the database connects and its schema is migrated. Configure SMTP before relying on password-reset email delivery.
2. Install API dependencies here: `npm install`.
4. Verify database credentials/network access: `npm run db:check` (before migrations this confirms connectivity but reports the schema missing).
5. Apply schema and initial content: `npm run db:migrate` then `npm run db:seed`.
6. Confirm the schema is ready: `npm run db:check`.
7. Start API: `npm run dev`. It checks both the database connection and required tables before listening on port 4000.
8. Start both Vite apps in separate terminals. Their env files point to `http://localhost:4000`.

For password recovery, configure `ADMIN_SITE_URL` to the origin that serves the admin frontend. The reset email must open the admin app's `/reset-password` route so the token and administrator password are handled by the shared API.

For Amharic translation, enable **Cloud Translation API** in the Google Cloud project, create a restricted server API key, and set it as `GOOGLE_CLOUD_TRANSLATE_API_KEY` in `merkato-api/.env`. Restrict the key to Cloud Translation API and never add it to a Vite `VITE_*` variable or commit it. The API endpoint rate-limits translation requests and caches translations in memory; the browser also caches results locally.

The API listens on port 4000 by default. `WEB_ORIGINS` must contain the exact origins of both frontends. Use a real SMTP provider for reset email; API responses intentionally do not reveal whether an email address is registered. Production requires HTTPS and secure cookie transport.

## Use Supabase PostgreSQL

The API uses PostgreSQL through `pg`, so Supabase can host the database without changing the existing cookie-based authentication or admin authorization. Copy the full PostgreSQL URI from **Project Settings > Database > Connect**. Use the **Session pooler** connection for local development when direct database connectivity is unavailable. Put the URI in `merkato-api/.env` as `DATABASE_URL`, with `DATABASE_SSL=true`. The `NEXT_PUBLIC_SUPABASE_URL` and publishable key are browser credentials; they are not a PostgreSQL connection string and cannot replace this server-only value.

After configuring the connection, run `npm run db:migrate` and `npm run db:seed` from `merkato-api`. The migration creates the API's users, sessions, CMS, and audit tables in the connected Supabase database. The seed command creates the initial admin using `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Ensure these commands target the intended Supabase project before running them; never use the Supabase service-role key in the browser.

## Deploy to Vercel

Deploy the repository as **three separate Vercel projects**, each with its own root directory:

| Project | Root directory | Vercel preset |
| --- | --- | --- |
| `merkato-api` | `merkato-api` | Other (auto-detects `api/index.js`) |
| `merkato-fund` | `merkato-fund` | Vite |
| `merkato-fund-admin` | `merkato-fund-admin` | Vite |

The API is exposed as a serverless function from `api/index.js`; `src/dev-server.js` is only used for local development. Do not run `db:migrate` or `db:seed` from a Vercel build. Run them locally against the production `DATABASE_URL`:

```bash
npm run db:migrate
npm run db:seed
npm run db:check
```

### API environment variables

Set these in **Project Settings > Environment Variables** for the API project:

```
NODE_ENV=production
DATABASE_URL=<Supabase connection URI>
DATABASE_SSL=true
DB_POOL_MAX=1
WEB_ORIGINS=https://<fund-project>.vercel.app,https://<admin-project>.vercel.app
SESSION_COOKIE_NAME=merkato_session
SESSION_TTL_DAYS=7
PASSWORD_RESET_TTL_MINUTES=30
SMTP_HOST=...
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASSWORD=...
SMTP_FROM=Merkato Fund <no-reply@your-domain>
PUBLIC_SITE_URL=https://<fund-project>.vercel.app
ADMIN_SITE_URL=https://<admin-project>.vercel.app
GOOGLE_CLOUD_TRANSLATE_API_KEY=...
```

For serverless use the Supabase **transaction pooler** URI (port `6543`) and keep `DB_POOL_MAX=1`. Use the session/direct URI for local migrations.

### Frontend environment variables

The Vite apps call `/api` on their own origin in production and Vercel proxies it to the API project through the rewrite in each `vercel.json`. Replace `https://merkato-api.vercel.app` in both frontend `vercel.json` files with the final API production URL.

Alternatively, set `VITE_API_URL=https://<api-project>.vercel.app` at build time and delete the `/api` rewrite. In that case the API and frontends are cross-site, so also set `COOKIE_SAME_SITE=none` on the API. Same-origin proxying is recommended because browsers increasingly block third-party cookies.

## API summary

- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`
- Public published CMS bundle: `GET /api/public/site-data`
- Admin-only CRUD: `/api/admin/content`, `/api/admin/slides`, `/api/admin/videos`, `/api/admin/financialTerms`
- Admin-only settings: `/api/admin/site-settings`

Public signup creates a `participant`. It cannot grant an admin role. The initial admin is bootstrapped from `ADMIN_EMAIL` and `ADMIN_PASSWORD` by `npm run db:seed`; an existing account is never silently promoted or overwritten.
