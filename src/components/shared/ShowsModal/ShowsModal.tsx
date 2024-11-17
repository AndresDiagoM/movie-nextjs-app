"use client";

import ShowsService from "app/services/showService";
import { Movie, Show } from "app/types";
import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import ReactPlayer from "react-player";
import styles from "./ShowsModal.module.sass";

export const ShowModal = ({
	movie,
	onClose,
}: {
	movie: Show;
	onClose: () => void;
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
		onClose();
	};
	const handlePlay = () => {
		if (showTrailer && trailerUrl) {
			setIsPlaying((prev) => !prev);
		}
	};

	useEffect(() => {
		const details = async () => {
			const data = await ShowsService.fetchMovieDetails(movie.id);
			console.log("[MovieModal] Movie details: ", data);
			setMovieDetails(data);
		};
		details();

		// get the trailer
		const trailer = async () => {
			const data = await ShowsService.fetchShowTrailer(
				movie.media_type,
				movie.id
			);
			console.log("[MovieModal] Movie trailer: ", data);
			if (data.results.length) {
				setShowTrailer(true);
				setTrailerUrl(`https://www.youtube.com/embed/${data.results[0].key}`);
			}
		};
		trailer();
	}, [movie]);

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

	return (
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
											rel: 0 
										}
									}
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
							{(movieDetails?.vote_average ?? 0) * 10}% Match
						</p>
						<p>
							| {movieDetails?.genres?.map((genre) => genre.name).join(", ")} |
						</p>
						<p>{movieDetails?.runtime} minutes |</p>
						<p>{movie?.release_date || movie?.first_air_date}</p>
					</div>
					<button className={styles.infoButton}>More Info</button>
				</div>
			</div>
		</>
	);
};
