# Integration Examples

## How to Integrate IndexedDB with Existing Components

### Example 1: Update ShowsModal to use IndexedDB Watchlist

```tsx
// src/components/shared/ShowsModal/ShowsModal.tsx
"use client";

import { useWatchlist } from "app/hooks/useIndexedDB";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function ShowsModal({ show, isOpen, onClose }) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if show is in watchlist when modal opens
  useEffect(() => {
    if (isOpen && show) {
      checkWatchlist();
    }
  }, [isOpen, show]);

  const checkWatchlist = async () => {
    const inList = await isInWatchlist(show.id, show.media_type);
    setInWatchlist(inList);
  };

  const handleToggleWatchlist = async () => {
    setLoading(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlist(show.id, show.media_type);
        toast.success("Removed from watchlist");
      } else {
        await addToWatchlist({
          tmdbId: show.id,
          mediaType: show.media_type,
          title: show.title || show.name,
          posterPath: show.poster_path,
          backdropPath: show.backdrop_path,
          overview: show.overview,
          rating: show.vote_average,
          releaseDate: show.release_date || show.first_air_date,
        });
        toast.success("Added to watchlist");
      }
      setInWatchlist(!inWatchlist);
    } catch (error) {
      console.error("Error toggling watchlist:", error);
      toast.error("Failed to update watchlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your modal content */}
      <button
        onClick={handleToggleWatchlist}
        disabled={loading}
        className={`px-4 py-2 rounded ${
          inWatchlist ? "bg-red-600" : "bg-green-600"
        }`}
      >
        {loading ? "..." : inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
      </button>
    </div>
  );
}
```

### Example 2: Display Recently Viewed on Home Page

```tsx
// src/app/home/page.tsx
import { RecentlyViewedSection } from "app/components/home/RecentlyViewedSection";

export default async function Home() {
  // ... existing code ...

  return (
    <div className="min-h-screen flex flex-col">
      <MovieHero randomShow={randomShow} />

      <div className="relative pt-0 p-8 text-white text-center flex-1 space-y-8">
        {/* Add Recently Viewed Section at the top */}
        <RecentlyViewedSection />

        {/* Existing sections */}
        <ShowsContainer shows={trendingMovies.results} title="Trending Shows Week" />
        {/* ... */}
      </div>
    </div>
  );
}
```

```tsx
// src/components/home/RecentlyViewedSection.tsx
"use client";

import { useRecentlyViewed } from "app/hooks/useIndexedDB";
import { ShowsContainer } from "app/components/shared/ShowsContainer";
import { MediaType } from "app/types";

export function RecentlyViewedSection() {
  const { recentlyViewed, loading } = useRecentlyViewed(10);

  if (loading) {
    return <div className="text-white">Loading recently viewed...</div>;
  }

  if (recentlyViewed.length === 0) {
    return null;
  }

  // Convert RecentlyViewedItem to Show format
  const shows = recentlyViewed.map((item) => ({
    id: item.tmdbId,
    title: item.title,
    name: item.title,
    poster_path: item.posterPath,
    media_type: item.mediaType,
    // Add progress indicator
    progress: item.progress,
    season: item.season,
    episode: item.episode,
  }));

  return (
    <ShowsContainer
      shows={shows}
      title="Continue Watching"
      mediaType={MediaType.MOVIE}
    />
  );
}
```

### Example 3: Track Video Views

```tsx
// src/components/shared/VideoPlayer/VideoPlayer.tsx
"use client";

import { useRecentlyViewed } from "app/hooks/useIndexedDB";
import { useEffect, useRef } from "react";

function VideoPlayer({ show, season, episode }) {
  const { addToRecentlyViewed, updateProgress } = useRecentlyViewed();
  const playerRef = useRef(null);

  // Track when user starts watching
  useEffect(() => {
    addToRecentlyViewed({
      tmdbId: show.id,
      mediaType: show.media_type,
      title: show.title || show.name,
      posterPath: show.poster_path,
      season,
      episode,
    });
  }, [show, season, episode]);

  // Save progress every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        updateProgress(show.id, show.media_type, currentTime, season, episode);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [show, season, episode]);

  return (
    <ReactPlayer
      ref={playerRef}
      url={videoUrl}
      // ... other props
    />
  );
}
```

### Example 4: Offline-First Search with Cache

```tsx
// src/services/showService.ts
import { indexedDBService } from "./indexedDB";

class ShowsService {
  async getShowDetails(tmdbId: number, mediaType: "movie" | "tv") {
    // Try cache first
    const cached = await indexedDBService.getCachedMetadata(tmdbId, mediaType);
    if (cached) {
      console.log("Returning cached data");
      return cached;
    }

    // Fetch from API
    const response = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${tmdbId}?api_key=${API_KEY}`
    );
    const data = await response.json();

    // Cache for 24 hours
    await indexedDBService.cacheMetadata(tmdbId, mediaType, data, 24);

    return data;
  }
}
```

### Example 5: Sync Watchlist with Backend

```tsx
// src/app/layout.tsx
"use client";

import { useOfflineStorage } from "app/hooks/useIndexedDB";
import { useEffect } from "react";

export default function RootLayout({ children }) {
  const { isOnline, syncWithBackend } = useOfflineStorage();

  // Sync when coming back online
  useEffect(() => {
    if (isOnline) {
      syncWithBackend().catch(console.error);
    }
  }, [isOnline]);

  return (
    <html>
      <body>
        {!isOnline && (
          <div className="bg-yellow-600 text-white p-2 text-center">
            You're offline. Changes will sync when you're back online.
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
```

### Example 6: Watchlist Page

```tsx
// src/app/watchlist/page.tsx
"use client";

import { useWatchlist } from "app/hooks/useIndexedDB";
import { ShowsContainer } from "app/components/shared/ShowsContainer";
import { MediaType } from "app/types";

export default function WatchlistPage() {
  const { watchlist, loading, removeFromWatchlist } = useWatchlist();

  if (loading) {
    return <div className="p-8 text-white">Loading watchlist...</div>;
  }

  if (watchlist.length === 0) {
    return (
      <div className="p-8 text-white text-center">
        <h1 className="text-3xl mb-4">Your Watchlist</h1>
        <p>Your watchlist is empty. Start adding shows!</p>
      </div>
    );
  }

  // Convert WatchlistItem to Show format
  const shows = watchlist.map((item) => ({
    id: item.tmdbId,
    title: item.title,
    name: item.title,
    poster_path: item.posterPath,
    backdrop_path: item.backdropPath,
    overview: item.overview,
    vote_average: item.rating,
    media_type: item.mediaType,
  }));

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">My Watchlist</h1>
        <p className="text-gray-400">{watchlist.length} items</p>
      </div>

      <ShowsContainer
        shows={shows}
        title=""
        mediaType={MediaType.MOVIE}
      />
    </div>
  );
}
```

### Example 7: Offline Indicator Component

```tsx
// src/components/shared/OfflineIndicator.tsx
"use client";

import { useOfflineStorage } from "app/hooks/useIndexedDB";
import { useState, useEffect } from "react";

export function OfflineIndicator() {
  const { isOnline, dbStats } = useOfflineStorage();
  const [show, setShow] = useState(!isOnline);

  useEffect(() => {
    if (!isOnline) {
      setShow(true);
    } else {
      // Hide after 3 seconds when back online
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
        isOnline ? "bg-green-600" : "bg-yellow-600"
      } text-white z-50`}
    >
      {isOnline ? (
        <div>
          <p className="font-bold">Back Online!</p>
          <p className="text-sm">Syncing your data...</p>
        </div>
      ) : (
        <div>
          <p className="font-bold">You're Offline</p>
          <p className="text-sm">
            {dbStats.watchlist} watchlist items available offline
          </p>
        </div>
      )}
    </div>
  );
}
```

## Quick Start Checklist

- [ ] Install dependencies: `pnpm install`
- [ ] Generate VAPID keys: `npx web-push generate-vapid-keys`
- [ ] Add keys to `.env` file
- [ ] Run migrations: `pnpm prisma migrate dev`
- [ ] Add NotificationPrompt to layout
- [ ] Add RecentlyViewedSection to home page
- [ ] Integrate watchlist with existing components
- [ ] Test offline functionality
- [ ] Test push notifications
- [ ] Build and deploy: `pnpm build && pnpm start`

## Next Steps

1. Customize notification timing and content
2. Implement notification scheduling (Task #7)
3. Add analytics tracking for offline usage
4. Create admin panel for sending notifications
5. Implement A/B testing for notifications
