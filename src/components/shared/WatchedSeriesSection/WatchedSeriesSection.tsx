"use client";

import { ShowsContainer } from "app/components/shared/ShowsContainer";
import ShowsService from "app/services/showService";
import { MediaType, Show } from "app/types";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const WatchedSeriesSection = () => {
  const [continueWatching, setContinueWatching] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWatchedSeries = async () => {
      try {
        setIsLoading(true);
        // Get the user session
        const session = await getSession();

        if (!session || !session.user?.email) {
          console.log("User is not logged in or no email found");
          setIsLoading(false);
          return;
        }

        const res = await fetch(
          `/api/shows?email=${encodeURIComponent(session.user.email)}&type=TV`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!res.ok) {
          console.log("Failed to fetch watched series, status:", res.status);
          setIsLoading(false);
          return;
        }

        const result = await res.json();
        console.log("[Client] Watched Series: ", result);

        if (result.seriesTmdbIds && result.seriesTmdbIds.length > 0) {
          // Fetch all series in parallel using Promise.all
          const seriesPromises = result.seriesTmdbIds.map(
            async (seriesId: string) => {
              try {
                return await ShowsService.fetchShowDetails(
                  parseInt(seriesId),
                  MediaType.TV
                );
              } catch (error) {
                console.error(`Failed to fetch series ${seriesId}:`, error);
                return null;
              }
            }
          );

          const series = await Promise.all(seriesPromises);
          // Filter out null values (failed requests)
          const validSeries = series.filter(
            (show): show is Show => show !== null
          );

          setContinueWatching(validSeries);
          console.log(
            "[Client] Continue Watching Series: ",
            validSeries.length
          );
        }
      } catch (error) {
        console.error("[Client] Error fetching watched series:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchedSeries();
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (continueWatching.length === 0) {
    return null;
  }

  return (
    <ShowsContainer
      shows={continueWatching}
      title="Continue Watching"
      mediaType={MediaType.TV}
    />
  );
};
