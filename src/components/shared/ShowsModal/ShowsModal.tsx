"use client";

import ShowsService from "app/services/showService";
import { MediaType, Movie, Show } from "app/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import ReactPlayer from "react-player";
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

	// state for video player
	const [isPlaying, setIsPlaying] = useState(false);
	const [showTrailer, setShowTrailer] = useState(false);
	const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
	const [showTrailerAfterDelay, setShowTrailerAfterDelay] = useState(false);

	const handleClose = () => {
		setIsVisible(false);
		onCloseAction();
	};
	const handlePlay = () => {
		if (showTrailer && trailerUrl) {
			setIsPlaying((prev) => !prev);
		}
	};

	// console.log("[ShowModal] Movie: ", movie, movie.media_type);
	const showMediaType = movie.media_type || mediaType;
	// console.log("[ShowModal] Show media type: ", showMediaType, movie.media_type);

	useEffect(() => {
		const details = async () => {
			const data = await ShowsService.fetchShowDetails(movie.id, mediaType || movie.media_type);
			// console.log("[MovieModal] Movie details: ", data);
			// console.log("[MovieModal] Movie link: ", `/movies/${movie.id}?mediaType=${movie.media_type ?? ""}`);
			setMovieDetails(data);
		};
		details();

		// get the trailer
		const trailer = async () => {
			// const mediaType = movie.media_type === "tv" ? MediaType.TV : MediaType.MOVIE;
			const data = await ShowsService.fetchShowTrailer(
				showMediaType,
				movie.id
			);
			// console.log("[MovieModal] Movie trailer: ", mediaType , movie.media_type);
			if (data.results.length) {
				setShowTrailer(true);
				setTrailerUrl(`https://www.youtube.com/embed/${data.results[0].key}`);
			}
		};
		trailer();
	}, [movie, mediaType, showMediaType]);

	useEffect(() => {
		if (showTrailer) {
			const timer = setTimeout(() => {
				setShowTrailerAfterDelay(true);
				setIsPlaying(true); // Automatically play the trailer
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [showTrailer]);

	if (!isVisible) return null;

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
						style={{
							backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
						}}
					>
						{showTrailerAfterDelay && trailerUrl ? (
							<ReactPlayer
								url={trailerUrl}
								playing={isPlaying}
								width="100%"
								height="100%"
								light={false}
								controls={true}
								volume={0.5}
								className={styles.reactPlayer}
								onPause={() => handlePlay}
								config={{
									youtube: {
										playerVars: {
											modestbranding: 1,
											rel: 0,
										},
									},
								}}
							/>
						) : (
							<>
								{!isPlaying && (
									<div className={styles.playButtonContainer}>
										<button className={styles.playButton} onClick={handlePlay}>
											<FaPlay className={styles.playIcon} /> Play
										</button>
									</div>
								)}
							</>
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
						href={showMediaType === 'tv' 
							? `/series/${movie.id}?mediaType=tv` 
							: `/movies/${movie.id}?mediaType=movie`}
						passHref
					>
						<button className={styles.infoButton}>More Info</button>
					</Link>
				</div>
			</div>
		</>,
		document.body
	);
};
