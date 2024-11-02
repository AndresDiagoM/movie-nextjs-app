"use client";

import { MovieModal } from "app/components/MovieModal";
import { fetchTrendingMovies } from "app/services/movieService";
import { Movie } from "app/types/movies";
import Image from "next/image";
import { useState } from "react";
import styles from "./TrendingMovies.module.css";

import { useEffect } from "react";

export const TrendingMovies = () => {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

	useEffect(() => {
		const fetchMovies = async () => {
			const data = await fetchTrendingMovies();
			setMovies(data.results);
			console.log("[TendingMovies] Movies length: ", data.results.length);
		};
		fetchMovies();
	}, []);

	return (
		<div className={styles.TrendingMovies}>
			<h1>Trending Now</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mx-4">
				{movies?.map((movie) => (
					<div key={movie?.id} className={styles.MovieContainer}>
						<Image
							src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
							alt={movie?.title}
							className="rounded-lg"
							width={500}
							height={750}
							priority
							onClick={() => setSelectedMovie(movie)}
						/>
						{/* <h2 className="text-lg font-semibold">{movie?.title}</h2> */}
					</div>
				))}
			</div>
			{selectedMovie && (
				<MovieModal
					movie={selectedMovie}
					onClose={() => setSelectedMovie(null)}
				/>
			)}
		</div>
	);
};

export default TrendingMovies;
