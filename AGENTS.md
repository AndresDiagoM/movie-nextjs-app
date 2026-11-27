# AGENTS.md — movie-nextjs-app

Instructions for any coding agent (Claude Code, Codex, opencode, Antigravity) working in this repo.
This file takes precedence over global agent instructions.

## Project

A Netflix-style movie and series app. Users browse TMDB content, watch through Vidsrc embeds, keep a
watch history (IndexedDB on the client, PostgreSQL via Prisma on the server) and get push
notifications for new episodes. Deployed on Vercel; the database is Supabase Postgres.

Author: AndresDiagoM — github.com/AndresDiagoM/movie-nextjs-app

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack in dev), React 19 |
| Language | TypeScript, SASS modules, Tailwind CSS 3 |
| Auth | NextAuth v4 — GitHub, Google and Credentials (bcryptjs) |
| ORM / DB | Prisma 6 → Supabase PostgreSQL |
| Client storage | IndexedDB (`src/services/indexedDB.ts` + hooks) |
| State | Zustand (`src/stores/search.ts`) |
| PWA / push | next-pwa (Workbox, disabled in dev), Web Push with VAPID keys |
| External APIs | TMDB (metadata), Vidsrc (streaming embeds) |
| Lint / format | Biome (primary, scope: `src/`) + ESLint (Next rules) |
| Package manager | pnpm |
| Hosting | Vercel, with the cron job in `vercel.json` |

## Commands

```bash
pnpm dev               # dev server on http://localhost:3005 (PWA disabled)
pnpm build             # production build
pnpm start             # production server
pnpm run biome:check   # lint + format check
pnpm run biome:fix     # auto-fix + format
pnpm run lint:all      # Biome, then ESLint

npx prisma generate                     # also runs on postinstall
npx prisma migrate dev --name <name>    # create + apply a migration
npx prisma studio
```

There is no test suite yet (`src/test/` is empty). Before finishing a change, run
`pnpm run lint:all` and `pnpm build`.

## Layout

```
src/
  app/                    App Router pages and API routes
    api/auth/             [...nextauth] handler + register
    api/cron/             check-new-episodes (Vercel cron, daily at 00:00 UTC)
    api/notifications/    subscribe / unsubscribe / send / preferences
    api/shows/route.js    watch-history CRUD (Prisma)
    api/share/            PWA Share Target
    home/ movies/[...id]/ series/[...id]/ search/ auth/ privacy-policy/
  components/shared/      reusable UI (Header, ShowsContainer, ShowsModal, VideoPlayer, …)
  components/providers/   SessionProvider (client), ServerSession (server)
  hooks/                  useIndexedDB.ts, useWindowSize.ts
  services/               baseService.ts, showService.ts, indexedDB.ts, notificationService.ts
  stores/search.ts        Zustand search filters
  types/                  Show, Movie, Season, Genre, Filters; enums/genre.ts, enums/request-type.ts
  libs/db.ts              Prisma singleton
  env.mjs                 t3-env validated env vars
  pages/welcome.tsx       landing page (Pages Router, on purpose)
prisma/schema.prisma      User, WatchEntry, PushSubscription
public/                   sw.js (Workbox), sw-custom.js (background sync), manifest.json, icons
docs/                     index in docs/README.md
  specs/                  CRON_SETUP, PWA_SETUP, INDEXEDDB_NOTIFICATIONS_SETUP, INTEGRATION_EXAMPLES
  supabase/               MCP + skills setup, migration/RLS guide, changelog
```

## Conventions

- **Imports:** `app/*` and `@/*` both resolve to `src/*`. Existing code uses `app/`; keep it, and
  don't mix both styles in one file.
- **Services:** `ShowsService` and `BaseService` are static singletons wrapped in `safeApiCall`.
  Call `ShowsService.method(...)`; never instantiate them.
- **Prisma:** import `prisma` from `src/libs/db.ts`. Never call `new PrismaClient()`.
- **Env vars:** read them through `src/env.mjs`, not `process.env`, in client code. A new var goes
  in both the schema and `runtimeEnv`.
- **Types:** prefer the exported types in `app/types`; `Show` covers movies and TV.
- **Enums:** use `MediaType.TV` / `MediaType.MOVIE` from `app/types/enums/request-type`. Raw
  `"tv"`/`"movie"` only for Vidsrc/TMDB URLs. The Prisma enum is different: `MOVIE | SERIES`.
- **Styles:** component styles in a `.module.sass` next to the component. Global CSS only in
  `src/app/globals.css`.
- **Biome:** 2-space indent, line width 100, single quotes in TS, double quotes in JSX, no
  semicolons, trailing commas. Run `pnpm run biome:fix` before committing.
- **`any`:** avoid it; if needed, add `// biome-ignore lint/suspicious/noExplicitAny: <reason>`.
- **Comments:** only when the *why* isn't obvious.

## Intentional behavior (don't "fix")

- next-pwa is disabled when `NODE_ENV === 'development'`. Test push/PWA with
  `pnpm build && pnpm start`.
- `ShowsModal` renders through `createPortal` into `document.body`, and the trailer autoplays
  2 s after it opens.
- `src/pages/welcome.tsx` uses the Pages Router alongside the App Router.

## Database (Supabase)

Full guide: `docs/supabase/database.md` (migration workflow, RLS) and `docs/supabase/changelog.md`.

- Prisma owns the schema. Change `prisma/schema.prisma`, then `npx prisma migrate dev --name <name>`.
  Never edit a migration that's already applied, and don't change tables from the Supabase dashboard.
- Prisma names the tables `"User"`, `"WatchEntry"` and `"PushSubscription"` (PascalCase, quoted in SQL).
- **Row-level security is on, with no policies,** for every table (migration
  `20261126000000_push_subscription_and_rls`). That's deliberate: the app reaches the database only
  through Prisma, connected as `postgres`, which owns the tables, so RLS doesn't apply to it, while
  the Supabase API roles (`anon`, `authenticated`) are locked out. The Supabase advisor's
  "RLS enabled, no policy" notice is expected. Every new table must enable RLS in its migration.
  Add policies only if the app starts using supabase-js on the client.
- Destructive SQL (drop, truncate, delete without `WHERE`, rewriting columns) needs the user's
  explicit approval first.

## Environment

Variables live in `.env` (git-ignored by `.env*`). Names, never values:

- Server: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GITHUB_ID`, `GITHUB_SECRET`,
  `GOOGLE_ID`, `GOOGLE_SECRET`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, `CRON_SECRET`
- Client: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_TMDB_API_URL`,
  `NEXT_PUBLIC_TMDB_IMAGE_DOMAIN`, `NEXT_PUBLIC_TMDB_TOKEN`, `NEXT_PUBLIC_VIDSRC_API_URL`,
  `NEXT_PUBLIC_VIDSRC2_API_URL`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, plus optional analytics and
  social links, and optional `NEXT_PUBLIC_EXTRA_SERVERS` / `NEXT_PUBLIC_EXTRA_CHANNELS` (JSON; see
  `docs/specs/LIVE_TV_AND_SERVERS.md`)

`SKIP_ENV_VALIDATION=1` skips t3-env validation (for example in Docker builds). The cron endpoint
requires `Authorization: Bearer $CRON_SECRET`.

## Don't

- Commit `.env*` or anything with real secrets.
- Enable PWA in dev in `next.config.ts`.
- Add ESLint rules that Biome already covers.
- Add AI attribution (`Co-Authored-By`, "Generated with …") to commits or PRs.
- Commit or push unless the user asks.
