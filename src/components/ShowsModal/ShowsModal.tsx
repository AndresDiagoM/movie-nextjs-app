"use client";

import MovieService from "app/services/movieService";
import { Movie, Show } from "app/types";
import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
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

	const handleClose = () => {
		setIsVisible(false);
		onClose();
	};

	useEffect(() => {
		const details = async () => {
			const data = await MovieService.fetchMovieDetails(movie.id);
			console.log("[MovieModal] Movie details: ", data);
			setMovieDetails(data);
		};
		details();
	}, [movie.id]);

	if (!isVisible) return null;

	return (
		<>
			{/* Backdrop for stop scrolling of the page */}
			<div
				className={styles.backdrop}
				onClick={handleClose}
			/>

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
							<div className={styles.playButtonContainer}>
								<button className={styles.playButton}>
									<FaPlay className={styles.playIcon} /> Play
								</button>
							</div>
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
