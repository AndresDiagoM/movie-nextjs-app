# Live TV, Multi View and player servers

## Pages
- `/live` — live channels rail, sport pills, today's and tomorrow's matches per league (TheSportsDB,
  free test key `123`, cached 15 min on the server), upcoming fixtures list, match details pop-up
  with official highlights when TheSportsDB has them.
- `/live/<channel-id>` — one channel's player, "Add to Multi View", more channels.
- `/multi-stream` — 1×2 or 2×2 grid of channels, remembered in localStorage.
- `/auth` — redirects to `/auth/signin`.

## Adding player servers (movies and series)
`NEXT_PUBLIC_VIDSRC_API_URL` and `NEXT_PUBLIC_VIDSRC2_API_URL` stay as Server 1 and 2. More servers
go in `NEXT_PUBLIC_EXTRA_SERVERS`, a JSON list (one line in `.env` / Vercel):

```
NEXT_PUBLIC_EXTRA_SERVERS=[{"name":"Server 3","movie":"https://example.com/embed/movie/{id}","tv":"https://example.com/embed/tv/{id}/{season}/{episode}"}]
```

`{id}` is the TMDB id. The player remembers the last server picked.

## Adding live channels
Defaults are official 24/7 YouTube broadcasts (`src/libs/live/channels.ts`). Add your own with
`NEXT_PUBLIC_EXTRA_CHANNELS`:

```
NEXT_PUBLIC_EXTRA_CHANNELS=[{"name":"My Channel","category":"Sports","embedUrl":"https://www.youtube.com/embed/live_stream?channel=UCxxxx","description":"…"}]
```

Only add sources you have the right to show. Both variables are read at build time, so redeploy
after changing them on Vercel.
