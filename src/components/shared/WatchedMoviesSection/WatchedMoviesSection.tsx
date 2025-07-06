"use client";

import { ShowsContainer } from "app/components/shared/ShowsContainer";
import ShowsService from "app/services/showService";
import { MediaType, Show } from "app/types";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const WatchedMoviesSection = () => {
  const [continueWatching, setContinueWatching] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWatchedMovies = async () => {
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
          `/api/shows?email=${encodeURIComponent(session.user.email)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!res.ok) {
          console.log("Failed to fetch watched movies, status:", res.status);
          setIsLoading(false);
          return;
        }

        const result = await res.json();
        console.log("[Client] Watched Movies: ", result);

        if (result.movieTmdbIds && result.movieTmdbIds.length > 0) {
          // Fetch all movies in parallel using Promise.all
          const moviePromises = result.movieTmdbIds.map(
            async (movieId: string) => {
              try {
                return await ShowsService.fetchShowDetails(
                  parseInt(movieId),
                  MediaType.MOVIE
                );
              } catch (error) {
                console.error(`Failed to fetch movie ${movieId}:`, error);
                return null;
              }
            }
          );

          const movies = await Promise.all(moviePromises);
          // Filter out null values (failed requests)
          const validMovies = movies.filter(
            (movie): movie is Show => movie !== null
          );

          setContinueWatching(validMovies);
          console.log("[Client] Continue Watching: ", validMovies.length);
        }
      } catch (error) {
        console.error("[Client] Error fetching watched movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchedMovies();
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
      mediaType={MediaType.MOVIE}
    />
  );
};
