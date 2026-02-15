"use client";

import { ShowModal } from "app/components/shared/ShowsModal";
import { MediaType, Show } from "app/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { CustomNextArrow, CustomPrevArrow } from "./CustomArrows";

export const ShowsContainer = ({
  shows,
  title,
  mediaType,
  onLoadMoreAction,
  isLoadingMore = false,
}: {
  shows: Show[];
  title: string;
  mediaType: MediaType;
  onLoadMoreAction?: () => void;
  isLoadingMore?: boolean;
}) => {
  const [selectedMovie, setSelectedMovie] = useState<Show | null>(null);
  const hasTriggeredLoadMore = useRef(false);

  useEffect(() => {
    if (selectedMovie) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedMovie]);

  // Reset the loadMore trigger when shows length changes (new items loaded)
  useEffect(() => {
    hasTriggeredLoadMore.current = false;
  }, [shows.length]);

  const handleAfterChange = (currentSlide: number) => {
    if (!onLoadMoreAction || hasTriggeredLoadMore.current || isLoadingMore)
      return;

    // Calculate how many slides from the end we are
    // Considering the number of slides shown at once
    const slidesToShow =
      window.innerWidth > 1024 ? 6 : window.innerWidth > 600 ? 3 : 2;
    const slidesFromEnd = shows.length - currentSlide - slidesToShow;

    // Trigger load more when we're 3 slides away from the end
    if (slidesFromEnd <= 3) {
      console.log(
        `[ShowsContainer] Near end, loading more... (slide ${currentSlide}/${shows.length})`,
      );
      hasTriggeredLoadMore.current = true;
      onLoadMoreAction();
    }
  };

  const settings = {
    dots: shows.length > 1,
    infinite: false, // Disable infinite scroll to detect end properly
    speed: 500,
    slidesToShow: Math.min(6, shows.length), // Don't show more slides than available items
    slidesToScroll: Math.min(6, shows.length),
    prevArrow: shows.length > 1 ? <CustomPrevArrow /> : <></>, // Hide arrows if only 1 item
    nextArrow: shows.length > 1 ? <CustomNextArrow /> : <></>,
    afterChange: handleAfterChange,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, shows.length),
          slidesToScroll: Math.min(3, shows.length),
          infinite: false,
          dots: shows.length > 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(2, shows.length),
          slidesToScroll: Math.min(2, shows.length),
          infinite: false,
          dots: shows.length > 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Math.min(2, shows.length),
          slidesToScroll: Math.min(2, shows.length),
          infinite: false,
          dots: shows.length > 1,
        },
      },
    ],
  };

  return (
    <div className="pt-0 background-transparent -mt-20 z-10 relative">
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-black z-0" />
      <h1 className="text-2xl font-bold mb-4 relative z-10">{title}</h1>

      {shows.length === 1 ? (
        // Single item display - centered and properly sized
        <div className="relative z-10 flex justify-center">
          {shows[0]?.poster_path && (
            <div className="relative group max-w-xs">
              <Image
                unoptimized
                src={`https://image.tmdb.org/t/p/w500${shows[0]?.poster_path}`}
                alt={shows[0]?.title || shows[0]?.name || ""}
                className="rounded-lg cursor-pointer transform transition-transform duration-300 group-hover:scale-105 w-full h-auto"
                width={300}
                height={450}
                priority
                onClick={() => setSelectedMovie(shows[0])}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg max-h-[70%] overflow-hidden">
                {shows[0]?.overview}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Multiple items - use slider
        <div className="relative z-10 mx-auto" style={{ maxWidth: "95vw" }}>
          <Slider {...settings}>
            {Array.isArray(shows) &&
              shows.map(
                (movie) =>
                  movie?.poster_path && (
                    <div key={movie?.id} className="relative group px-2">
                      <Image
                        unoptimized
                        src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
                        alt={movie?.title || movie?.name || ""}
                        className="rounded-lg cursor-pointer transform transition-transform duration-300 group-hover:scale-105"
                        width={500}
                        height={750}
                        priority
                        onClick={() => setSelectedMovie(movie)}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg max-h-[70%] overflow-hidden">
                        {movie?.overview}
                      </div>
                    </div>
                  ),
              )}
          </Slider>
          {isLoadingMore && (
            <div className="text-center mt-4">
              <span className="text-gray-400">Cargando más...</span>
            </div>
          )}
        </div>
      )}

      {selectedMovie && (
        <ShowModal
          movie={selectedMovie}
          mediaType={mediaType}
          onCloseAction={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};
