# Graph Report - .  (2026-05-18)

## Corpus Check
- 98 files · ~71,633 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 466 nodes · 702 edges · 52 communities (30 shown, 22 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 46 edges (avg confidence: 0.86)
- Token cost: 172,830 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_MovieSeries Pages|Movie/Series Pages]]
- [[_COMMUNITY_Workbox Service Worker (Core)|Workbox Service Worker (Core)]]
- [[_COMMUNITY_Push Notification System|Push Notification System]]
- [[_COMMUNITY_IndexedDB Offline Storage Hooks|IndexedDB Offline Storage Hooks]]
- [[_COMMUNITY_Workbox Caching Strategies|Workbox Caching Strategies]]
- [[_COMMUNITY_Notification UI and Settings|Notification UI and Settings]]
- [[_COMMUNITY_API Routes (Auth and Notifications)|API Routes (Auth and Notifications)]]
- [[_COMMUNITY_Workbox Route Registration|Workbox Route Registration]]
- [[_COMMUNITY_Shared UI Components|Shared UI Components]]
- [[_COMMUNITY_Layout Shell Components|Layout Shell Components]]
- [[_COMMUNITY_App Layout and Session|App Layout and Session]]
- [[_COMMUNITY_Header Navigation AST|Header Navigation AST]]
- [[_COMMUNITY_Custom Service Worker Sync|Custom Service Worker Sync]]
- [[_COMMUNITY_Cron Episode Check Route|Cron Episode Check Route]]
- [[_COMMUNITY_DB Layer and Auth Routes|DB Layer and Auth Routes]]
- [[_COMMUNITY_Types and Enums|Types and Enums]]
- [[_COMMUNITY_App Branding and Icons|App Branding and Icons]]
- [[_COMMUNITY_Service Worker Entry|Service Worker Entry]]
- [[_COMMUNITY_Base HTTP Service|Base HTTP Service]]
- [[_COMMUNITY_PWA Manifest and Share|PWA Manifest and Share]]
- [[_COMMUNITY_Misc preferences|Misc: preferences]]
- [[_COMMUNITY_Misc error|Misc: error]]
- [[_COMMUNITY_Misc pwainstallprompt|Misc: pwainstallprompt]]
- [[_COMMUNITY_Misc send|Misc: send]]
- [[_COMMUNITY_Misc src|Misc: src]]
- [[_COMMUNITY_Misc src|Misc: src]]
- [[_COMMUNITY_Misc register|Misc: register]]
- [[_COMMUNITY_Misc id|Misc: id]]
- [[_COMMUNITY_Misc privacy|Misc: privacy]]
- [[_COMMUNITY_Misc src|Misc: src]]
- [[_COMMUNITY_Misc page|Misc: page]]
- [[_COMMUNITY_Misc movie|Misc: movie]]
- [[_COMMUNITY_Misc app|Misc: app]]
- [[_COMMUNITY_Misc types|Misc: types]]
- [[_COMMUNITY_Misc page|Misc: page]]
- [[_COMMUNITY_Misc nextsvg|Misc: nextsvg]]
- [[_COMMUNITY_Misc vercelsvg|Misc: vercelsvg]]
- [[_COMMUNITY_Misc hooks|Misc: hooks]]
- [[_COMMUNITY_Misc layout|Misc: layout]]
- [[_COMMUNITY_Misc layout|Misc: layout]]
- [[_COMMUNITY_Misc layout|Misc: layout]]

## God Nodes (most connected - your core abstractions)
1. `IndexedDBService` - 27 edges
2. `a` - 18 edges
3. `r` - 15 edges
4. `NotificationService` - 15 edges
5. `MediaType` - 15 edges
6. `y` - 13 edges
7. `Show` - 12 edges
8. `Movie Next.js App` - 12 edges
9. `Shows Container Component` - 9 edges
10. `f()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Google Site Verification File` --references--> `Movie Next.js App`  [EXTRACTED]
  public/google5c786cb7e2e7ae45.html → README.md
- `PWA Enhanced Manifest Setup Guide` --references--> `PWA Screenshots Directory`  [EXTRACTED]
  docs/PWA_SETUP.md → public/screenshots/README.txt
- `Root Layout` --semantically_similar_to--> `Layout Server Metadata`  [INFERRED] [semantically similar]
  src/app/layout.tsx → src/app/layout-server.tsx
- `PushSubscription Prisma Model` --implements--> `Prisma ORM`  [EXTRACTED]
  docs/CRON_SETUP.md → README.md
- `WatchEntry Prisma Model` --implements--> `Prisma ORM`  [EXTRACTED]
  docs/CRON_SETUP.md → README.md

## Hyperedges (group relationships)
- **Push Notification System** — web_push_protocol, service_worker, api_notifications_send_doc, cron_check_new_episodes [INFERRED 0.95]
- **Offline-First Architecture** — indexeddb_service, indexeddb_hook_useindexeddb, background_sync, service_worker [INFERRED 0.85]
- **PWA Enhanced Features** — pwa_manifest, pwa_shortcuts, pwa_share_target, api_share_route_doc [EXTRACTED 1.00]
- **PWA Icon Set** — icon192_pwa_icon_small, icon512_pwa_icon_large, app_branding_concept [INFERRED 0.95]
- **Next.js Default UI Icons** — filesvg_file_icon, globesvg_globe_icon, windowsvg_window_icon [INFERRED 0.75]
- **Push Notification End-to-End Pipeline** — services_notificationService, api_notifications_subscribe, api_cron_check_new_episodes [EXTRACTED 0.95]
- **Authentication and User Registration Flow** — api_auth_register, api_auth_nextauth, libs_db [EXTRACTED 1.00]
- **PWA Offline Storage Layer** — services_indexedDB, hooks_useIndexedDB, stores_search [INFERRED 0.75]
- **Watched Shows Display Components** — component_watchedshowssection, component_watchedmoviessection, component_watchedseriessection [INFERRED 0.95]
- **Header Navigation Components** — component_header, component_mobilemenu, component_searchbar, component_usermenu [EXTRACTED 1.00]
- **PWA and Notification Feature Cluster** — component_pwainstallprompt, component_notificationprompt, component_notificationsettings [INFERRED 0.85]

## Communities (52 total, 22 thin omitted)

### Community 0 - "Movie/Series Pages"
Cohesion: 0.05
Nodes (37): Home(), metadata, useWindowSize(), fetchShowDetails(), MoviesProps, SeriesProps, nextConfig, metadata (+29 more)

### Community 1 - "Workbox Service Worker (Core)"
Cohesion: 0.08
Nodes (24): b(), d(), deleteCacheAndMetadata(), e(), et(), f(), g(), j() (+16 more)

### Community 2 - "Push Notification System"
Cohesion: 0.08
Nodes (43): API Route: /api/notifications/send, Background Sync API, Cron Job: Check New Episodes API Route, PushSubscription Prisma Model, Vercel Cron Job Setup Documentation, VAPID Keys Configuration, vercel.json Cron Configuration, WatchEntry Prisma Model (+35 more)

### Community 3 - "IndexedDB Offline Storage Hooks"
Cohesion: 0.09
Nodes (6): IndexedDBService, MetadataCache, NotificationPreference, RecentlyViewedItem, STORES, WatchlistItem

### Community 4 - "Workbox Caching Strategies"
Cohesion: 0.13
Nodes (3): a, c(), i

### Community 5 - "Notification UI and Settings"
Cohesion: 0.16
Nodes (4): NotificationPromptProps, NotificationPermissionStatus, NotificationPreferences, NotificationService

### Community 6 - "API Routes (Auth and Notifications)"
Cohesion: 0.12
Nodes (21): NextAuth Route, Auth Register Route, Cron Check New Episodes Route, Notification Preferences Route, Notification Send Route, Notification Subscribe Route, Notification Unsubscribe Route, Share Route (+13 more)

### Community 7 - "Workbox Route Registration"
Cohesion: 0.17
Nodes (3): $(), h(), y

### Community 8 - "Shared UI Components"
Cohesion: 0.24
Nodes (15): Custom Carousel Arrows, Movie Hero Component, Shows Container Component, Shows Modal Component, Skeleton Loading Component, Video Player Component, Watched Movies Section, Watched Series Section (+7 more)

### Community 9 - "Layout Shell Components"
Cohesion: 0.18
Nodes (13): Footer Component, Header Component, Mobile Menu Component, Notification Prompt Component, Notification Settings Component, PWA Install Prompt Component, Search Bar Component, User Menu Component (+5 more)

### Community 11 - "Header Navigation AST"
Cohesion: 0.24
Nodes (3): SearchBar, SearchBarRef, UserMenuProps

### Community 12 - "Custom Service Worker Sync"
Cohesion: 0.36
Nodes (7): data, getUnsyncedWatchlistItems(), markItemSynced(), notificationData, openDatabase(), promiseChain, syncWatchlist()

### Community 13 - "Cron Episode Check Route"
Cohesion: 0.36
Nodes (7): checkForNewEpisodes(), GET(), getSeriesDetails(), prisma, sendNewEpisodeNotification(), TMDBEpisode, TMDBSeason

### Community 14 - "DB Layer and Auth Routes"
Cohesion: 0.33
Nodes (3): globalForPrisma, GET(), POST()

### Community 15 - "Types and Enums"
Cohesion: 0.33
Nodes (5): Genre, RequestType, ShowRequest, TmdbPagingResponse, TmdbRequest

### Community 16 - "App Branding and Icons"
Cohesion: 0.33
Nodes (7): App Branding and Identity, File Icon SVG, Globe Icon SVG, PWA Icon 192x192, PWA Icon 512x512, Cinema Welcome Hero Image, Browser Window Icon SVG

### Community 17 - "Service Worker Entry"
Cohesion: 0.4
Nodes (5): a(), d, n, r(), s

### Community 19 - "PWA Manifest and Share"
Cohesion: 0.47
Nodes (6): API Route: /api/share, PWA Web App Manifest, PWA Screenshots Directory, PWA Enhanced Manifest Setup Guide, PWA Share Target API, PWA App Shortcuts

### Community 32 - "Misc: page"
Cohesion: 0.67
Nodes (3): Auth Error Page, Register Page, Sign In Page

## Knowledge Gaps
- **91 isolated node(s):** `nextConfig`, `config`, `notificationData`, `data`, `promiseChain` (+86 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `a` connect `Workbox Caching Strategies` to `Workbox Service Worker (Core)`, `Workbox Route Registration`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `nextConfig`, `config`, `notificationData` to the rest of the system?**
  _91 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Movie/Series Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Workbox Service Worker (Core)` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Push Notification System` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `IndexedDB Offline Storage Hooks` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Workbox Caching Strategies` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._