"use client";

import { ShowsContainer } from "app/components/shared/ShowsContainer";
import ShowsService from "app/services/showService";
import { MediaType, Show } from "app/types";
import { getSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

export const WatchedSeriesSection = () => {
  const [continueWatching, setContinueWatching] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const userEmailRef = useRef<string | null>(null);

  const fetchWatchedSeries = useCallback(
    async (page: number, append: boolean = false) => {
      try {
        if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }

        // Get the user session
        const session = await getSession();

        if (!session || !session.user?.email) {
          console.log("User is not logged in or no email found");
          setIsLoading(false);
          setIsLoadingMore(false);
          return;
        }

        userEmailRef.current = session.user.email;

        const res = await fetch(
          `/api/shows?email=${encodeURIComponent(session.user.email)}&page=${page}&limit=12&type=TV`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!res.ok) {
          console.log("Failed to fetch watched series, status:", res.status);
          setIsLoading(false);
          setIsLoadingMore(false);
          return;
        }

        const result = await res.json();
        console.log(`[Client] Watched Series Page ${page}:`, result);

        // Update pagination info
        setHasMore(result.pagination?.hasMore || false);

        if (result.seriesTmdbIds && result.seriesTmdbIds.length > 0) {
          // Fetch all series in parallel using Promise.all
          const seriesPromises = result.seriesTmdbIds.map(
            async (seriesId: string) => {
              try {
                return await ShowsService.fetchShowDetails(
                  parseInt(seriesId),
                  MediaType.TV,
                );
              } catch (error) {
                console.error(`Failed to fetch series ${seriesId}:`, error);
                return null;
              }
            },
          );

          const series = await Promise.all(seriesPromises);
          // Filter out null values (failed requests)
          const validSeries = series.filter(
            (show): show is Show => show !== null,
          );

          if (append) {
            setContinueWatching((prev) => [...prev, ...validSeries]);
          } else {
            setContinueWatching(validSeries);
          }

          console.log(
            `[Client] Continue Watching Series: ${validSeries.length} series loaded`,
          );
        }
      } catch (error) {
        console.error("[Client] Error fetching watched series:", error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchWatchedSeries(1, false);
  }, [fetchWatchedSeries]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      const nextPage = currentPage + 1;
      console.log(`[Client] Loading more series - Page ${nextPage}`);
      setCurrentPage(nextPage);
      fetchWatchedSeries(nextPage, true);
    }
  }, [currentPage, hasMore, isLoadingMore, fetchWatchedSeries]);

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
      onLoadMoreAction={hasMore ? loadMore : undefined}
      isLoadingMore={isLoadingMore}
    />
  );
};
