import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

const prisma = new PrismaClient();

// Configure web-push with VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "";
const vapidSubject =
  process.env.VAPID_SUBJECT || "mailto:andresdiag@unicauca.edu.co";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

// TMDB API configuration
const TMDB_API_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN;

interface TMDBEpisode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  air_date: string;
}

interface TMDBSeason {
  episodes: TMDBEpisode[];
}

/**
 * Cron job to check for new episodes and send notifications
 * Runs daily at midnight (configured in vercel.json)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error("Unauthorized cron job attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[Cron] Starting new episodes check...");

    // Get all users with their watched series
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
      },
      include: {
        watchEntries: {
          where: {
            type: "SERIES",
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
        pushSubscriptions: {
          where: {
            enabled: true,
            newEpisodes: true, // Only users who want new episode notifications
          },
        },
      },
    });

    console.log(`[Cron] Found ${users.length} active users`);

    let totalNotificationsSent = 0;
    let totalNewEpisodes = 0;

    // Process each user
    for (const user of users) {
      if (user.pushSubscriptions.length === 0) {
        continue; // Skip users without active subscriptions
      }

      // Get unique series the user is watching
      const uniqueSeries = new Map<
        number,
        { season: number; episode: number }
      >();
      for (const entry of user.watchEntries) {
        const existing = uniqueSeries.get(entry.tmdbId);
        if (
          !existing ||
          (entry.season || 0) > existing.season ||
          ((entry.season || 0) === existing.season &&
            (entry.episode || 0) > existing.episode)
        ) {
          uniqueSeries.set(entry.tmdbId, {
            season: entry.season || 1,
            episode: entry.episode || 1,
          });
        }
      }

      console.log(
        `[Cron] User ${user.email} is watching ${uniqueSeries.size} series`,
      );

      // Check each series for new episodes
      for (const [tmdbId, watched] of uniqueSeries.entries()) {
        try {
          const newEpisodes = await checkForNewEpisodes(
            tmdbId,
            watched.season,
            watched.episode,
          );

          if (newEpisodes.length > 0) {
            console.log(
              `[Cron] Found ${newEpisodes.length} new episodes for series ${tmdbId}`,
            );
            totalNewEpisodes += newEpisodes.length;

            // Get series details for the notification
            const seriesDetails = await getSeriesDetails(tmdbId);

            // Send notification to user
            const sent = await sendNewEpisodeNotification(
              user.id,
              user.pushSubscriptions,
              seriesDetails.name,
              newEpisodes,
              tmdbId,
            );

            if (sent) {
              totalNotificationsSent++;
            }
          }
        } catch (error) {
          console.error(
            `[Cron] Error checking series ${tmdbId} for user ${user.email}:`,
            error,
          );
        }
      }
    }

    console.log(
      `[Cron] Job completed. New episodes: ${totalNewEpisodes}, Notifications sent: ${totalNotificationsSent}`,
    );

    return NextResponse.json({
      success: true,
      usersChecked: users.length,
      newEpisodes: totalNewEpisodes,
      notificationsSent: totalNotificationsSent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Cron] Error in check-new-episodes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Check TMDB for new episodes of a series
 */
async function checkForNewEpisodes(
  tmdbId: number,
  lastWatchedSeason: number,
  lastWatchedEpisode: number,
): Promise<TMDBEpisode[]> {
  const newEpisodes: TMDBEpisode[] = [];
  const today = new Date();

  // Check current season and next season for new episodes
  for (
    let season = lastWatchedSeason;
    season <= lastWatchedSeason + 1;
    season++
  ) {
    try {
      const response = await fetch(
        `${TMDB_API_URL}/tv/${tmdbId}/season/${season}?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) {
          // Season doesn't exist yet
          break;
        }
        throw new Error(`TMDB API error: ${response.status}`);
      }

      const seasonData: TMDBSeason = await response.json();

      // Check for new episodes
      for (const episode of seasonData.episodes) {
        // Episode is new if:
        // 1. It's in a season after the last watched season, OR
        // 2. It's in the same season but episode number is higher
        // 3. It has aired (air_date is in the past)
        const isNewEpisode =
          episode.season_number > lastWatchedSeason ||
          (episode.season_number === lastWatchedSeason &&
            episode.episode_number > lastWatchedEpisode);

        const hasAired = episode.air_date
          ? new Date(episode.air_date) <= today
          : false;

        if (isNewEpisode && hasAired) {
          newEpisodes.push(episode);
        }
      }
    } catch (error) {
      console.error(`Error fetching season ${season}:`, error);
      break; // Stop checking further seasons
    }
  }

  return newEpisodes;
}

/**
 * Get series details from TMDB
 */
async function getSeriesDetails(
  tmdbId: number,
): Promise<{ name: string; posterPath: string | null }> {
  try {
    const response = await fetch(
      `${TMDB_API_URL}/tv/${tmdbId}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      name: data.name,
      posterPath: data.poster_path,
    };
  } catch (error) {
    console.error(`Error fetching series details for ${tmdbId}:`, error);
    return { name: "Unknown Series", posterPath: null };
  }
}

/**
 * Send notification about new episodes to a user
 */
async function sendNewEpisodeNotification(
  userId: string,
  subscriptions: any[],
  seriesName: string,
  newEpisodes: TMDBEpisode[],
  tmdbId: number,
): Promise<boolean> {
  if (subscriptions.length === 0 || newEpisodes.length === 0) {
    return false;
  }

  // Sort episodes
  const sortedEpisodes = [...newEpisodes].sort(
    (a, b) =>
      a.season_number - b.season_number || a.episode_number - b.episode_number,
  );

  const firstEpisode = sortedEpisodes[0];
  const episodeCount = newEpisodes.length;

  // Create notification message
  const title =
    episodeCount === 1
      ? `New episode of ${seriesName}!`
      : `${episodeCount} new episodes of ${seriesName}!`;

  const message =
    episodeCount === 1
      ? `S${firstEpisode.season_number}E${firstEpisode.episode_number}: ${firstEpisode.name}`
      : `Starting with S${firstEpisode.season_number}E${firstEpisode.episode_number}`;

  const payload = JSON.stringify({
    title,
    body: message,
    icon: "/icon-192x192.svg",
    badge: "/icon-192x192.svg",
    url: `/series/${tmdbId}`,
    tag: `new-episode-${tmdbId}`,
    requireInteraction: false,
    actions: [
      {
        action: "view",
        title: "Watch Now",
      },
    ],
  });

  // Send to all user's subscriptions
  const results = await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      };

      try {
        await webpush.sendNotification(pushSubscription, payload);
        return { success: true };
      } catch (error: any) {
        console.error("Error sending notification:", error);

        // If subscription is invalid, remove it
        if (error.statusCode === 410 || error.statusCode === 404) {
          await prisma.pushSubscription.delete({
            where: { id: subscription.id },
          });
        }

        throw error;
      }
    }),
  );

  const successful = results.filter((r) => r.status === "fulfilled").length;
  return successful > 0;
}
