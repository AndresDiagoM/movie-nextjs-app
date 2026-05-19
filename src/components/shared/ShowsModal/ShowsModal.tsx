"use client";

import ShowsService from "app/services/showService";
import { MediaType, Movie, Show } from "app/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ShowsModal.module.sass";

export const ShowModal = ({
  movie,
  onCloseAction,
  mediaType,
}: {
  movie: Show;
  onCloseAction: () => void;
  mediaType: MediaType;
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  const handleClose = () => {
    setIsVisible(false);
    onCloseAction();
  };

  const showMediaType = movie.media_type || mediaType;

  useEffect(() => {
    const details = async () => {
      const data = await ShowsService.fetchShowDetails(
        movie.id,
        mediaType || movie.media_type,
      );
      setMovieDetails(data);
    };
    details();

    const fetchTrailer = async () => {
      const data = await ShowsService.fetchShowTrailer(showMediaType, movie.id);
      const trailer =
        data.results.find(
          (v: { type: string; site: string; key: string }) =>
            v.type === "Trailer" && v.site === "YouTube",
        ) || data.results[0];
      if (trailer?.key) {
        setTrailerKey(trailer.key);
      }
    };
    fetchTrailer();
  }, [movie, mediaType, showMediaType]);

  if (!isVisible) return null;

  const embedUrl = trailerKey
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&rel=0&modestbranding=1`
    : null;

  return createPortal(
    <>
      {/* Backdrop for stop scrolling of the page */}
      <div className={styles.backdrop} onClick={handleClose} />

      {/* Modal */}
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={handleClose}>
          X
        </button>
        <div className={styles.scrollContainer}>
          <div
            className={styles.imageContainer}
            style={
              embedUrl
                ? undefined
                : {
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                  }
            }
          >
            {embedUrl ? (
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                style={{ border: "none", display: "block" }}
                title={movie.title || movie.name || "Trailer"}
              />
            ) : (
              <div className={styles.playButtonContainer}>
                <span>Loading trailer...</span>
              </div>
            )}
          </div>
          <h1 className={styles.title}>{movie.title || movie.name}</h1>
          <p className={styles.overview}>{movie.overview}</p>
          <div className={styles.details}>
            <p className={styles.match}>
              {((movieDetails?.vote_average ?? 0) * 10).toFixed(2)}% Match
            </p>
            <p>
              | {movieDetails?.genres?.map((genre) => genre.name).join(", ")} |
            </p>
            {movieDetails?.runtime && <p>{movieDetails?.runtime} minutes |</p>}
            <p>{movie?.release_date || movie?.first_air_date}</p>
          </div>

          {/* Buttons */}
          <Link
            href={
              showMediaType === "tv"
                ? `/series/${movie.id}?mediaType=tv`
                : `/movies/${movie.id}?mediaType=movie`
            }
            passHref
          >
            <button className={styles.infoButton}>More Info</button>
          </Link>
        </div>
      </div>
    </>,
    document.body,
  );
};
