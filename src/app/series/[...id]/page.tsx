"use client";

import { ServerPlayer } from "app/components/shared/ServerPlayer";
import ShowsService from "app/services/showService";
import { MediaType, Show } from "app/types";
import { getSession } from "next-auth/react";
import React from "react";

interface SeriesProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mediaType: string }>;
}

const fetchShowDetails = async (id: number, mediaType: MediaType) => {
  return await ShowsService.fetchShowDetails(id, mediaType);
};

const SeriesId: React.FC<SeriesProps> = ({ params, searchParams }) => {
  const [id, setId] = React.useState<string>("");
  const [mediaType, setMediaType] = React.useState<string>("");
  const [show, setShow] = React.useState<Show | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedSeason, setSelectedSeason] = React.useState<number | null>(
    null
  );
  const [playing, setPlaying] = React.useState<{
    season: number;
    episode: number;
  }>({ season: 1, episode: 1 });

  React.useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      const resolvedSearchParams = await searchParams;
      setId(resolvedParams.id);
      setMediaType(resolvedSearchParams.mediaType);
    };
    resolveParams();
  }, [params, searchParams]);

  React.useEffect(() => {
    if (!id || !mediaType) return;

    const showId = Number(id);
    const getShowDetails = async () => {
      setIsLoading(true);
      try {
        const showDetails = await fetchShowDetails(
          showId,
          mediaType as MediaType
        );
        setShow(showDetails);
      } finally {
        setIsLoading(false);
      }
    };
    getShowDetails();
  }, [id, mediaType]);

  // Force scroll reset and ensure body scroll is enabled
  React.useEffect(() => {
    // Ensure scroll is enabled on mount and after data loads
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    if (!isLoading && show) {
      // Additional delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        // Force a layout recalculation
        void document.body.offsetHeight;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, show]);

  React.useEffect(() => {
    const registerInWatchedShows = async () => {
      try {
        // Check if user is logged in
        const session = await getSession();

        if (!session || !session.user?.email) {
          console.log("[Series] User is not logged in");
          return;
        }

        // Only proceed if we have show data
        if (!show) return;

        // User is logged in
        const data = {
          user: session.user,
          show: show,
        };

        const res = await fetch("/api/shows?type=SERIES", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const error = await res.json();
          console.error("Failed to register movie:", error);
          return;
        }

        const result = await res.json();
        console.log("Movie registered successfully:", result);
      } catch (error) {
        console.error("Error registering movie:", error);
      }
    };

    registerInWatchedShows();
  }, [show]);

  if (isLoading || !show) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // console.log("Params: ", id, " Media Type: ", mediaType);
  // console.log("Show: ", show);
  // console.log("Video URL: ", videoUrl);

  const handleSeasonSelect = (seasonNumber: number) => {
    setSelectedSeason(seasonNumber === selectedSeason ? null : seasonNumber);
  };

  const handleEpisodeSelect = (episodeNumber: number) => {
    if (!selectedSeason) return;
    setPlaying({ season: selectedSeason, episode: episodeNumber });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen">
      {/* Background Image Container */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${show?.backdrop_path})`,
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 pt-20 p-8 text-white min-h-screen">
        {/* Show Title */}
        <h2 className="text-4xl font-bold text-center mb-6">
          {show?.title || show?.name}
        </h2>

        {/* Video Player */}
        <ServerPlayer
          title={show.name || show.title || undefined}
          tmdbId={show.id}
          mediaType="tv"
          season={playing.season}
          episode={playing.episode}
        />
        <p className="mt-3 text-center text-sm text-white/70">
          Now playing: Season {playing.season} · Episode {playing.episode}
        </p>

        {/* show number of seasons, and episodes */}
        <div className="pt-4 mt-4">
          <p className="text-lg text-center">
            Number of Seasons: {show.number_of_seasons} | Number of Episodes:{" "}
            {show.number_of_episodes}
          </p>
          <div className="mt-6">
            {/* Season Select Dropdown */}
            <div className="max-w-xs mx-auto text-white w-[80%] sm:w-[60%] md:w-[40%] lg:w-[20%] text-sm sm:text-base md:text-lg lg:text-xl">
              <select
                value={selectedSeason || ""}
                onChange={(e) => handleSeasonSelect(Number(e.target.value))}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Season</option>
                {show.seasons?.map((season) => (
                  <option
                    key={season.id}
                    value={season.season_number ?? undefined}
                  >
                    {season.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Episodes Grid */}
            {selectedSeason && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 px-4">
                {show.seasons?.find((s) => s.season_number === selectedSeason)
                  ?.episode_count &&
                  Array.from(
                    {
                      length: show.seasons.find(
                        (s) => s.season_number === selectedSeason
                      )!.episode_count!,
                    },
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() => handleEpisodeSelect(i + 1)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          playing.season === selectedSeason &&
                          playing.episode === i + 1
                            ? "bg-live-accent text-white"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        Episode {i + 1}
                      </button>
                    )
                  )}
              </div>
            )}
          </div>
        </div>


        {/* Show Details */}
        <p className="mt-4 text-lg text-center">
          Release Date: {show.release_date || show.first_air_date}
        </p>
        <p className="mt-2 text-lg text-center">Overview: {show.overview}</p>
      </div>
    </div>
  );
};

export default SeriesId;
