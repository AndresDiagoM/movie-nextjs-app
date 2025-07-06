"use client";

import { VideoPlayer } from "app/components/shared/VideoPlayer";
import { env } from "app/env.mjs";
import ShowsService from "app/services/showService";
import { MediaType, Show } from "app/types";
import { getSession } from "next-auth/react";
import React from "react";

const StreamingService = env.NEXT_PUBLIC_VIDSRC_API_URL;
const StreamingService2 = env.NEXT_PUBLIC_VIDSRC2_API_URL;

interface MoviesProps {
  // Next.js App Router - params is a Promise<{ id: string }>
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mediaType: string }>;
}

const fetchShowDetails = async (id: number, mediaType: MediaType) => {
  return await ShowsService.fetchShowDetails(id, mediaType);
};

const MoviesId: React.FC<MoviesProps> = ({ params, searchParams }) => {
  const [id, setId] = React.useState<string>("");
  const [mediaType, setMediaType] = React.useState<string>("");
  const [show, setShow] = React.useState<Show | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentService, setCurrentService] =
    React.useState<string>(StreamingService);

  // handle video url
  const [videoUrl, setVideoUrl] = React.useState<string>("");

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
        setVideoUrl(`${currentService}${mediaType}/${showDetails?.id}`);
      } finally {
        setIsLoading(false);
      }
    };
    getShowDetails();
  }, [id, mediaType, currentService]);

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
        document.body.offsetHeight;
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
          console.log("User is not logged in");
          return;
        }

        // Only proceed if we have show data
        if (!show) return;

        // User is logged in
        const data = {
          user: session.user,
          show: show,
        };

        const res = await fetch("/api/shows?type=MOVIE", {
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

  console.log("Params: ", id, " Media Type: ", mediaType);
  console.log("Show: ", show);
  console.log("Video URL: ", videoUrl);

  const handleServiceChange = (service: string) => {
    setCurrentService(service);
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
        <div className="flex justify-center mt-4 rounded-lg overflow-hidden">
          <VideoPlayer url={videoUrl} />
        </div>

        {/* Buttons to switch streaming services */}
        <div className="flex flex-col pt-4 mt-4 justify-center items-center text-center space-y-4 text-white">
          <button
            onClick={() => handleServiceChange(StreamingService)}
            className="px-4 py-2 bg-gray-800 rounded w-[80%] sm:w-[60%] md:w-[40%] lg:w-[20%] text-sm sm:text-base md:text-lg lg:text-xl"
          >
            Streaming Service 1
          </button>
          <button
            onClick={() => handleServiceChange(StreamingService2)}
            className="px-4 py-2 bg-gray-800 rounded w-[80%] sm:w-[60%] md:w-[40%] lg:w-[20%] text-sm sm:text-base md:text-lg lg:text-xl"
          >
            Streaming Service 2
          </button>
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

export default MoviesId;
