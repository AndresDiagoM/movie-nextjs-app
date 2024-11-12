"use client";

import { fetchMovieDetails } from "app/services/movieService";
import { Movie } from "app/types/movies";
import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import styles from "./MovieModal.module.sass";

export const MovieModal = ({
	movie,
	onClose,
}: {
	movie: Movie;
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
			const data = await fetchMovieDetails(movie.id);
			console.log("[MovieModal] Movie details: ", data);
			setMovieDetails(data);
		};
		details();
	}, [movie.id]);

	if (!isVisible) return null;

	return (
		<div className={styles.modal}>
			<button className={styles.closeButton} onClick={handleClose}>
				X
			</button>
			<div
				className={styles.image}
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
			<h1 className={styles.title}>{movie.title}</h1>
			<p className={styles.overview}>{movie.overview}</p>
			<div className={styles.details}>
				<p className={styles.match}>
					{(movieDetails?.vote_average ?? 0) * 10}% Match
				</p>
				<p>| {movieDetails?.genres?.map((genre) => genre.name).join(", ")} |</p>
				<p>{movieDetails?.runtime} minutes |</p>
				<p>{movie.release_date}</p>
			</div>
			<button className={styles.infoButton}>More Info</button>
		</div>
	);
};
