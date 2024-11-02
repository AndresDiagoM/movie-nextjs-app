import { fetchTrendingMovies } from "app/services/movieService";
import Image from "next/image";
import styles from "./TrendingMovies.module.css";

interface Movie {
	id: number;
	title: string;
	original_title: string;
	overview: string;
	genre_ids: number[];
	popularity: number;
	poster_path: string;
	backdrop_path: string;
	release_date: string;
}

export const TrendingMovies = async () => {
	const data = await fetchTrendingMovies();
	const movies: Movie[] = data.results;
	console.log("[TendingMovies] Movies length: ", movies.length);

	return (
		<div className={styles.TrendingMovies}>
			<h1>Trending Now</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{movies?.map((movie) => (
					<div
						key={movie?.id}
						className="flex flex-col items-center justify-center"
					>
						<Image
							src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
							alt={movie?.title}
							className="rounded-lg"
							width={500}
							height={750}
							priority
						/>
						<h2 className="text-lg font-semibold">{movie?.title}</h2>
					</div>
				))}
			</div>
		</div>
	);
};

export default TrendingMovies;
