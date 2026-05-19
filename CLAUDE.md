# Movie Next.js App — Claude Instructions

## Project Overview

A Netflix-style movie/series streaming app built with Next.js 14 App Router. Users browse TMDB-sourced content, watch via Vidsrc embeds, manage a watchlist stored in IndexedDB (client) and PostgreSQL via Prisma (server), and receive push notifications for new episodes. Deployed on Vercel with Supabase as the Postgres host.

**Author:** AndresDiagoM — github.com/AndresDiagoM/movie-nextjs-app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript + SASS modules |
| Styling | Tailwind CSS + SASS (.module.sass) |
| Auth | NextAuth.js (Google + Credentials) |
| ORM | Prisma + PostgreSQL (Supabase) |
| Client storage | IndexedDB (custom service + hooks) |
| PWA | next-pwa (Workbox) — disabled in dev |
| Push notifications | Web Push API + VAPID keys |
| External APIs | TMDB (metadata), Vidsrc (streaming embeds) |
| Linter/formatter | Biome (primary) + ESLint (Next.js rules) |
| Package manager | pnpm |
| Deployment | Vercel (cron jobs via vercel.json) |

---

## Essential Commands

```bash
pnpm dev              # dev server (PWA disabled)
pnpm build            # production build
pnpm start            # production server

pnpm run biome:check  # lint + format diagnostics
pnpm run biome:fix    # auto-fix + format everything
pnpm run lint:all     # Biome check then ESLint
```

Database:
```bash
npx prisma generate   # regenerate client after schema changes
npx prisma migrate dev --name <name>   # create + apply migration
npx prisma studio     # GUI for the DB
```

---

## Architecture

### File/Import Aliases

Both `app/` and `src/` path aliases resolve to `src/`. Use `app/` in imports:
```ts
import ShowsService from "app/services/showService";
import { Show, MediaType } from "app/types";
```

### Directory Map

```
src/
  app/                  # Next.js App Router pages and API routes
    api/
      auth/             # NextAuth register + [...nextauth] handler
      cron/             # Vercel cron — checks for new TV episodes
      notifications/    # subscribe / unsubscribe / send / preferences
      shows/            # DB watchlist CRUD (Prisma)
      share/            # PWA Share Target handler
    home/               # Authenticated home page
    movies/[...id]/     # Movie detail + VideoPlayer
    series/[...id]/     # Series detail + VideoPlayer
    search/             # Search page (Zustand store + ShowsService)
    auth/               # signin / register / error pages
    privacy-policy/
  components/shared/    # All reusable UI components
    Header/             # Header, MobileMenu, SearchBar, UserMenu
    Footer/
    ShowsContainer/     # Carousel with react-slick + custom arrows
    ShowsModal/         # Portal modal — trailer autoplay + details
    ShowHero/           # Hero banner (MovieHero)
    VideoPlayer/        # Vidsrc embed (iframe)
    WatchedMoviesSection / WatchedSeriesSection / WatchedShowsSection
    NotificationPrompt / NotificationSettings
    PWAInstallPrompt/
    Skeleton/
  components/providers/ # SessionProvider (client), ServerSession (server)
  hooks/
    useIndexedDB.ts     # useWatchlist, useRecentlyViewed, useOfflineStorage, useMetadataCache
    useWindowSize.ts
  services/
    baseService.ts      # axios singleton + safeApiCall wrapper
    showService.ts      # TMDB API (extends BaseService)
    indexedDB.ts        # IndexedDBService — MovieAppDB CRUD
    notificationService.ts  # Push subscription lifecycle
  stores/
    search.ts           # Zustand store for search filters
  types/
    index.ts            # Show, Movie, Season, Genre, Filters
    enums/genre.ts      # Genre enum
    enums/request-type.ts  # MediaType, RequestType, TmdbRequest
  utils/index.ts
  libs/db.ts            # Prisma singleton (globalForPrisma pattern)
  env.mjs               # t3-env validated env vars
  pages/welcome.tsx     # Landing page (pages router — intentional)
prisma/
  schema.prisma         # User, WatchEntry, PushSubscription models
  migrations/
public/
  sw.js / sw-custom.js  # Workbox + custom background sync
  manifest.json         # PWA manifest
  icon-192x192.svg / icon-512x512.svg
```

### Key Patterns

**Service layer:** `ShowsService` and `BaseService` use a static singleton + `safeApiCall` wrapper. Always call via `ShowsService.methodName(...)` — never instantiate directly.

**IndexedDB hooks:** `useIndexedDB.ts` exports `useWatchlist`, `useRecentlyViewed`, `useOfflineStorage`, `useMetadataCache`. These wrap `IndexedDBService` for React state sync.

**Prisma singleton:** `src/libs/db.ts` exports `prisma`. Import it in all API routes — never call `new PrismaClient()` directly.

**PWA/Service Worker:** next-pwa is disabled in development (`NODE_ENV === 'development'`). Push notification features only work in production builds or `pnpm build && pnpm start`.

**Auth flow:** NextAuth configured at `src/app/api/auth/[...nextauth]/route.ts`. Protected pages check session via `ServerSession` (server component) or `useSession` (client component).

**ShowsModal:** Uses `createPortal` to render into `document.body`. Trailer autoplay triggers 2 seconds after the modal opens — this is intentional UX.

**`app/` alias vs `src/`:** Both resolve to the same directory. Existing code uses `app/` — keep it consistent. Do not mix both alias styles in the same file.

---

## Code Style

- **Formatter/linter:** Biome is the source of truth. Run `pnpm run biome:fix` before committing.
  - Line width: 100, 2-space indent, single quotes (TS/JS), double quotes (JSX), trailing commas.
- **Comments:** Only add them when the WHY is non-obvious. No JSDoc blocks on simple getters.
- **Types:** Prefer the exported types from `app/types` over inline type definitions. `Show` covers both movies and TV shows.
- **Enums:** Use `MediaType.TV` / `MediaType.MOVIE` — never the raw string `"tv"` or `"movie"` unless interfacing with the Vidsrc URL format.
- **No `any` unless necessary:** Use `biome-ignore lint/suspicious/noExplicitAny: <reason>` when you must.
- **SASS modules:** Component styles live in `.module.sass` files alongside the component. No global CSS unless in `app/globals.css`.

---

## Environment Variables

Required in `.env.local`:
```
DATABASE_URL=                    # Supabase PostgreSQL connection string
NEXTAUTH_SECRET=
NEXTAUTH_URL=                    # http://localhost:3000 in dev
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_TMDB_API_URL=        # https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_API_KEY=
NEXT_PUBLIC_TMDB_IMAGE_DOMAIN=   # image.tmdb.org
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
CRON_SECRET=                     # Bearer token for Vercel cron endpoint
```

---

## Database Schema (summary)

- **User** — NextAuth user (id, email, name, image)
- **WatchEntry** — userId FK, showId, mediaType, watchedAt
- **PushSubscription** — userId FK, endpoint, keys (p256dh, auth), preferences JSON

Run `npx prisma generate` after any schema change. Never edit migration files manually.

---

## Cron Jobs (Vercel)

Defined in `vercel.json`. The cron at `/api/cron/check-new-episodes` runs on a schedule, queries `WatchEntry` for TV shows, hits TMDB for new episodes, and sends push notifications via Web Push. Protected by `CRON_SECRET` header.

---

## PWA Notes

- Manifest at `public/manifest.json` — includes Share Target, shortcuts, and screenshot paths.
- Service worker `public/sw.js` is Workbox-generated. `public/sw-custom.js` handles background sync for watchlist items.
- Icons: `icon-192x192.svg` and `icon-512x512.svg` in `public/`.

---

## What NOT to Do

- Do not call `new PrismaClient()` directly — use `prisma` from `src/libs/db.ts`.
- Do not instantiate `ShowsService` — all methods are static.
- Do not use `process.env.VAR` directly in client components — go through `src/env.mjs`.
- Do not add ESLint rules that Biome already covers.
- Do not enable PWA in `next.config.ts` for development — the `disable` flag is intentional.
- Do not commit `.env.local` or any file containing real secrets.
