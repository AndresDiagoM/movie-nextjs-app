# Vercel Cron Job Setup - New Episodes Notifications

## Overview

The app now has a daily cron job that checks for new episodes of series users are watching and sends push notifications when new episodes are available.

## Features

- ✅ Daily check at midnight (00:00 UTC)
- ✅ Checks TMDB API for new episodes
- ✅ Only notifies users who:
  - Have active push subscriptions
  - Enabled "New Episodes" notifications in preferences
  - Are watching the series
- ✅ Smart episode tracking (checks next episode after last watched)
- ✅ Handles multiple new episodes
- ✅ Automatically cleans up invalid subscriptions

## Files Created

1. **`vercel.json`** - Cron job configuration
2. **`/src/app/api/cron/check-new-episodes/route.ts`** - Cron job handler
3. **`.env`** - Added `CRON_SECRET` for security

## Configuration

### Environment Variables

Add these to your Vercel project settings:

```bash
CRON_SECRET=cron_secret_key_2026_secure_random_string
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BNM3tP-YWqfLeV5Zi55CMPF0SCQR8H4FXUDIu1zYmnca-wbXMcuLNQ6zJ-mT5VHQN9km6E9cVwwS9SZwWQ5-Qfc
VAPID_PRIVATE_KEY=FtgWZtxN7dZ0WZJK5i0W6SkFn-ydygtFXSt7v0oSw7g
VAPID_SUBJECT=mailto:andresdiag@unicauca.edu.co
```

### Vercel Configuration

The cron job is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-new-episodes",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**Schedule:** `0 0 * * *` = Every day at midnight UTC

## Testing

### Local Testing

To test the cron job locally, make a GET request with the authorization header:

```bash
# PowerShell
$headers = @{
    Authorization = "Bearer cron_secret_key_2026_secure_random_string"
}
Invoke-RestMethod -Uri "http://localhost:3000/api/cron/check-new-episodes" -Headers $headers

# Or using curl
curl -H "Authorization: Bearer cron_secret_key_2026_secure_random_string" \
     http://localhost:3000/api/cron/check-new-episodes
```

### Test Response

```json
{
  "success": true,
  "usersChecked": 5,
  "newEpisodes": 3,
  "notificationsSent": 2,
  "timestamp": "2026-02-14T12:00:00.000Z"
}
```

## How It Works

1. **User Watches an Episode**
   - Watch entry is recorded in database
   - Includes series ID, season, and episode number

2. **Daily Cron Job Runs**
   - Fetches all active users with series watch history
   - For each user's watched series:
     - Checks TMDB for episodes after the last watched
     - Only considers episodes that have already aired
     - Checks current season + next season

3. **Notification Sent**
   - If new episodes found:
     - Gets series name and poster
     - Creates push notification
     - Sends to all user's active subscriptions
   - Invalid subscriptions are automatically removed

## Notification Format

**Single Episode:**
```
Title: "New episode of Breaking Bad!"
Body: "S5E10: Granite State"
```

**Multiple Episodes:**
```
Title: "3 new episodes of Breaking Bad!"
Body: "Starting with S5E10"
```

## Customization

### Change Schedule

Edit `vercel.json` to change the cron schedule:

```json
{
  "crons": [
    {
      "path": "/api/cron/check-new-episodes",
      "schedule": "0 */6 * * *"  // Every 6 hours
    }
  ]
}
```

### Cron Schedule Format

```
 ┌───────────── minute (0 - 59)
 │ ┌───────────── hour (0 - 23)
 │ │ ┌───────────── day of month (1 - 31)
 │ │ │ ┌───────────── month (1 - 12)
 │ │ │ │ ┌───────────── day of week (0 - 6)
 │ │ │ │ │
 * * * * *
```

**Examples:**
- `0 0 * * *` - Daily at midnight
- `0 */6 * * *` - Every 6 hours
- `0 9 * * *` - Daily at 9 AM
- `0 0 * * 1` - Every Monday at midnight

### Vercel Free Tier Limitations

- ✅ Minimum interval: 1 hour
- ✅ Included in free plan
- ⚠️ Execution timeout: 10 seconds (may need to optimize for many users)
- ⚠️ Shares monthly function invocation limit

## Monitoring

### View Logs in Vercel

1. Go to your project in Vercel Dashboard
2. Click "Functions" tab
3. Find `/api/cron/check-new-episodes`
4. View execution logs

### Log Output

The cron job logs:
- Number of users checked
- New episodes found per series
- Notifications sent
- Any errors

## Database Schema

The cron job relies on:

```prisma
model WatchEntry {
  id          String   @id @default(cuid())
  userId      String
  type        MediaType
  tmdbId      Int
  season      Int?
  episode     Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model PushSubscription {
  enabled     Boolean  @default(true)
  newEpisodes Boolean  @default(true)
  // ... other fields
}
```

## Security

- ✅ Authorization header required
- ✅ CRON_SECRET must match
- ✅ Only Vercel can call this endpoint in production
- ✅ Invalid subscriptions automatically cleaned up

## Deployment

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Add daily new episodes cron job"
   git push
   ```

2. **Deploy to Vercel:**
   - Vercel will automatically detect `vercel.json`
   - Cron job will be set up automatically
   - No additional configuration needed

3. **Add Environment Variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add `CRON_SECRET` and VAPID keys

## Troubleshooting

### Cron Job Not Running

1. Check Vercel Dashboard → Functions → Logs
2. Verify `vercel.json` is in root directory
3. Verify environment variables are set
4. Check that you're on a paid plan if using intervals < 1 hour

### No Notifications Sent

1. Check user has:
   - Active subscription (`enabled: true`)
   - New episodes preference enabled (`newEpisodes: true`)
   - Watched episodes in database
2. Check TMDB API is accessible
3. Verify VAPID keys are correct

### Too Many Users / Timeout

If you have many users and hit the 10-second timeout:

1. **Option 1:** Process in batches
   ```typescript
   const batchSize = 50;
   for (let i = 0; i < users.length; i += batchSize) {
     const batch = users.slice(i, i + batchSize);
     // Process batch
   }
   ```

2. **Option 2:** Upgrade Vercel plan for longer timeouts

3. **Option 3:** Use a queue system (BullMQ, Inngest, etc.)

## Future Enhancements

- [ ] Add digest mode (weekly summary instead of daily)
- [ ] Support for upcoming episodes (next 7 days)
- [ ] Notification for season premieres
- [ ] Notification for series finale
- [ ] Custom notification time per user
- [ ] Batch notifications to reduce API calls

## Resources

- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- [Web Push Protocol](https://web.dev/push-notifications-overview/)
- [TMDB API Documentation](https://developers.themoviedb.org/3)
