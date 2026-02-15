"use client";

import { ShowsContainer } from "app/components/shared/ShowsContainer";
import ShowsService from "app/services/showService";
import { MediaType, Show } from "app/types";
import { getSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface WatchedShowsSectionProps {
  mediaType: MediaType;
  title?: string;
}

export const WatchedShowsSection = ({
  mediaType,
  title = "Continue Watching",
}: WatchedShowsSectionProps) => {
  const [continueWatching, setContinueWatching] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const userEmailRef = useRef<string | null>(null);

  // Get the API type param based on MediaType
  const apiType = mediaType === MediaType.MOVIE ? "MOVIE" : "TV";
  const apiResultKey =
    mediaType === MediaType.MOVIE ? "movieTmdbIds" : "seriesTmdbIds";

  const fetchWatchedShows = useCallback(
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
          `/api/shows?email=${encodeURIComponent(session.user.email)}&page=${page}&limit=12&type=${apiType}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!res.ok) {
          console.log(
            `Failed to fetch watched ${apiType.toLowerCase()}, status:`,
            res.status,
          );
          setIsLoading(false);
          setIsLoadingMore(false);
          return;
        }

        const result = await res.json();
        console.log(`[Client] Watched ${apiType} Page ${page}:`, result);

        // Update pagination info
        setHasMore(result.pagination?.hasMore || false);

        const tmdbIds = result[apiResultKey];
        if (tmdbIds && tmdbIds.length > 0) {
          // Fetch all shows in parallel using Promise.all
          const showPromises = tmdbIds.map(async (showId: string) => {
            try {
              return await ShowsService.fetchShowDetails(
                parseInt(showId),
                mediaType,
              );
            } catch (error) {
              console.error(
                `Failed to fetch ${apiType.toLowerCase()} ${showId}:`,
                error,
              );
              return null;
            }
          });

          const shows = await Promise.all(showPromises);
          // Filter out null values (failed requests)
          const validShows = shows.filter(
            (show): show is Show => show !== null,
          );

          if (append) {
            setContinueWatching((prev) => [...prev, ...validShows]);
          } else {
            setContinueWatching(validShows);
          }

          console.log(
            `[Client] Continue Watching: ${validShows.length} ${apiType.toLowerCase()} loaded`,
          );
        }
      } catch (error) {
        console.error(
          `[Client] Error fetching watched ${apiType.toLowerCase()}:`,
          error,
        );
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [mediaType, apiType, apiResultKey],
  );

  useEffect(() => {
    fetchWatchedShows(1, false);
  }, [fetchWatchedShows]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      const nextPage = currentPage + 1;
      console.log(
        `[Client] Loading more ${apiType.toLowerCase()} - Page ${nextPage}`,
      );
      setCurrentPage(nextPage);
      fetchWatchedShows(nextPage, true);
    }
  }, [currentPage, hasMore, isLoadingMore, fetchWatchedShows, apiType]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (continueWatching.length === 0) {
    return null;
  }

  return (
    <ShowsContainer
      shows={continueWatching}
      title={title}
      mediaType={mediaType}
      onLoadMoreAction={hasMore ? loadMore : undefined}
      isLoadingMore={isLoadingMore}
    />
  );
};
