# IndexedDB & Push Notifications Setup Guide

## 📦 What's Been Implemented

### 1. **IndexedDB for Offline Storage**
- ✅ Complete IndexedDB wrapper service
- ✅ Stores: Watchlist, Recently Viewed, Metadata Cache, Notifications
- ✅ React hooks for easy data access
- ✅ Automatic sync with backend when online
- ✅ Background sync support

### 2. **Push Notifications**
- ✅ Service worker with push notification handlers
- ✅ Notification permission component
- ✅ Notification settings component
- ✅ Backend API routes for subscriptions
- ✅ Database models for storing subscriptions
- ✅ Support for notification preferences

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
pnpm add web-push
```

### Step 2: Generate VAPID Keys

VAPID keys are required for push notifications. Generate them once:

```bash
npx web-push generate-vapid-keys
```

This will output something like:
```
=======================================
Public Key:
BG3xBz... (your public key)

Private Key:
wpI4RjsX... (your private key)
=======================================
```

### Step 3: Update Environment Variables

Add these to your `.env` file:

```env
# Push Notifications - VAPID Keys
NEXT_PUBLIC_VAPID_PUBLIC_KEY="your-public-key-here"
VAPID_PRIVATE_KEY="your-private-key-here"
VAPID_SUBJECT="mailto:your-email@example.com"
```

**Important:**
- The public key must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser
- The private key should NEVER be exposed to the client
- Replace `your-email@example.com` with your actual email

### Step 4: Update Database Schema

Run Prisma migrations to add the new PushSubscription model:

```bash
# Generate Prisma client
pnpm prisma generate

# Create and run migration
pnpm prisma migrate dev --name add_push_subscriptions

# Or if in production
pnpm prisma migrate deploy
```

### Step 5: Add Components to Your App

#### Add Notification Prompt to Home Page

Edit `src/app/home/layout.tsx` or `src/app/layout.tsx`:

```tsx
import { NotificationPrompt } from "app/components/shared/NotificationPrompt";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <NotificationPrompt delay={5000} autoShow={true} />
    </>
  );
}
```

#### Add Notification Settings to Settings Page

Create `src/app/settings/page.tsx`:

```tsx
import { NotificationSettings } from "app/components/shared/NotificationSettings";

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
      <NotificationSettings />
    </div>
  );
}
```

### Step 6: Rebuild and Test

```bash
# Build the app (this generates the service worker)
pnpm build

# Start production server
pnpm start

# Open in browser
# Note: Push notifications require HTTPS (or localhost for testing)
```

## 📱 Using IndexedDB

### Basic Usage

```tsx
import { useWatchlist, useRecentlyViewed, useOfflineStorage } from "app/hooks/useIndexedDB";

function MyComponent() {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { recentlyViewed, addToRecentlyViewed } = useRecentlyViewed();
  const { isOnline, syncWithBackend } = useOfflineStorage();

  // Add to watchlist
  const handleAddToWatchlist = async () => {
    await addToWatchlist({
      tmdbId: 123456,
      mediaType: "movie",
      title: "The Movie",
      posterPath: "/path/to/poster.jpg",
      overview: "Movie description...",
      rating: 8.5,
    });
  };

  // Add to recently viewed
  const handleTrackView = async () => {
    await addToRecentlyViewed({
      tmdbId: 123456,
      mediaType: "tv",
      title: "The Series",
      posterPath: "/path/to/poster.jpg",
      season: 1,
      episode: 5,
    });
  };

  return (
    <div>
      {!isOnline && <p>You're offline!</p>}
      {/* Your component */}
    </div>
  );
}
```

### Advanced Usage

#### Caching Metadata

```tsx
import { useMetadataCache } from "app/hooks/useIndexedDB";

const { getCachedMetadata, cacheMetadata } = useMetadataCache();

// Check cache before fetching from API
const getShowDetails = async (tmdbId: number, mediaType: "movie" | "tv") => {
  // Try cache first
  const cached = await getCachedMetadata(tmdbId, mediaType);
  if (cached) {
    return cached;
  }

  // Fetch from API
  const data = await fetch(`/api/shows/${tmdbId}`).then(r => r.json());

  // Cache for 24 hours
  await cacheMetadata(tmdbId, mediaType, data, 24);

  return data;
};
```

#### Background Sync

```tsx
import { notificationService } from "app/services/notificationService";

// Request background sync when adding to watchlist offline
const handleAddOffline = async (item) => {
  await indexedDBService.addToWatchlist(item);

  // Request sync when connection is restored
  await notificationService.requestSync("sync-watchlist");
};
```

## 🔔 Using Push Notifications

### Send a Test Notification

```tsx
import { notificationService } from "app/services/notificationService";

const handleTest = async () => {
  await notificationService.testNotification();
};
```

### Send Notifications from Backend

```typescript
// In your backend code
const response = await fetch("/api/notifications/send", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    userId: "user-id", // Optional: send to specific user
    title: "New Episode Available!",
    message: "Season 2, Episode 5 of Breaking Bad is now available",
    url: "/series/1396", // URL to open when clicked
    icon: "/icon-192x192.svg",
    image: "https://image.tmdb.org/t/p/w500/poster.jpg",
    tag: "new-episode",
    actions: [
      {
        action: "view",
        title: "Watch Now",
      },
      {
        action: "dismiss",
        title: "Later",
      },
    ],
  }),
});
```

### Notification Types

The system supports three types of notifications:

1. **New Episodes** - When a new episode is available for a show in watch history
2. **Watchlist Updates** - When new seasons/movies are added to watchlist items
3. **Recommendations** - Weekly personalized recommendations

Users can configure these in the NotificationSettings component.

## 🧪 Testing

### Test IndexedDB

1. Open browser DevTools
2. Go to Application → Storage → IndexedDB
3. Find "MovieAppDB"
4. Inspect stores: watchlist, recentlyViewed, metadataCache
5. Add items and verify they appear

### Test Push Notifications

#### Local Testing (Chrome)

1. Open your app in Chrome
2. Open DevTools → Application → Service Workers
3. Click "Update" to reload service worker
4. Go to Application → Push Messaging
5. Click "Send" to send a test push

#### Test Subscription Flow

```tsx
// In browser console
const { notificationService } = await import("./services/notificationService");

// Check support
console.log("Supported:", notificationService.isSupported());

// Request permission
const permission = await notificationService.requestPermission();
console.log("Permission:", permission);

// Send test
await notificationService.testNotification();
```

### Test Offline Mode

1. Open DevTools → Network
2. Check "Offline"
3. Interact with app
4. Verify data is stored in IndexedDB
5. Uncheck "Offline"
6. Verify data syncs with backend

## 🏗️ Architecture

### IndexedDB Structure

```
MovieAppDB/
├── watchlist/          # User's watchlist
│   ├── id (key)
│   ├── tmdbId
│   ├── mediaType
│   ├── title
│   ├── posterPath
│   ├── addedAt
│   └── synced
├── recentlyViewed/     # Continue watching
│   ├── id (key)
│   ├── tmdbId
│   ├── mediaType
│   ├── title
│   ├── lastViewedAt
│   ├── season
│   ├── episode
│   └── progress
├── metadataCache/      # API response cache
│   ├── id (key)
│   ├── tmdbId
│   ├── mediaType
│   ├── data
│   ├── cachedAt
│   └── expiresAt
└── notifications/      # Notification prefs
    └── preferences
```

### Push Notification Flow

```
User → Request Permission → Subscribe
                              ↓
                     Store in Database
                              ↓
                    Backend Sends Push
                              ↓
                   Service Worker Receives
                              ↓
                    Show Notification
                              ↓
                User Clicks → Open URL
```

## 🔒 Security Considerations

1. **VAPID Keys**
   - Keep private key secure
   - Never commit to git
   - Use environment variables
   - Rotate regularly

2. **Subscription Data**
   - Encrypt sensitive data
   - Implement rate limiting
   - Validate all inputs
   - Clean up expired subscriptions

3. **Notification Content**
   - Sanitize all user input
   - Validate URLs
   - Limit notification frequency
   - Respect user preferences

## 🐛 Troubleshooting

### IndexedDB Not Working

- Check browser support (all modern browsers support it)
- Check for private browsing (IndexedDB is disabled)
- Check storage quota
- Clear IndexedDB and try again

### Push Notifications Not Working

**Common issues:**

1. **Service Worker not registered**
   - Build the app: `pnpm build`
   - Check DevTools → Application → Service Workers

2. **VAPID keys not set**
   - Verify environment variables
   - Restart dev server after adding keys

3. **Permission denied**
   - Clear site data
   - Try in incognito
   - Check browser notification settings

4. **Notifications not showing**
   - Check notification permission
   - Verify subscription is active
   - Check service worker console logs

5. **HTTPS required**
   - Localhost works for testing
   - Production requires HTTPS
   - Use ngrok for local HTTPS testing

### Database Migration Issues

```bash
# Reset database (⚠️ loses all data)
pnpm prisma migrate reset

# Force push schema (⚠️ loses all data)
pnpm prisma db push --force-reset

# Generate client only
pnpm prisma generate
```

## 📈 Performance Tips

1. **IndexedDB**
   - Limit watchlist size (e.g., 100 items)
   - Regularly clean expired cache
   - Use indexes for faster queries
   - Batch operations when possible

2. **Push Notifications**
   - Batch notification sends
   - Clean up invalid subscriptions
   - Use notification tags to replace old notifications
   - Implement rate limiting

## 🚀 Future Enhancements

- [ ] Periodic background sync for watchlist
- [ ] Download full episodes for offline viewing
- [ ] Smart caching based on user behavior
- [ ] Notification scheduling system
- [ ] Push notification analytics
- [ ] A/B testing for notification content
- [ ] Rich media notifications
- [ ] Action buttons in notifications

## 📚 Resources

- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web Push Protocol](https://web.dev/push-notifications-overview/)
- [VAPID](https://blog.mozilla.org/services/2016/08/23/sending-vapid-identified-webpush-notifications-via-mozillas-push-service/)
