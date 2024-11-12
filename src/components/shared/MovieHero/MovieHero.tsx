import { Movie } from "app/types/movies";
import { FaPlay } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import styles from "./MovieHero.module.sass";

export const MovieHero = ({ movie }: { movie: Movie }) => {
	return (
		<div
			className={styles.MovieHome}
			style={{ backgroundImage: `url(${movie.backdrop_path})` }}
		>
			<h1 className={styles.MovieHomeTitle}>{movie.title}</h1>
			<p className={styles.MovieHomeStats}>
				{(movie.vote_average ?? 0) * 10}% Match | {movie.release_date}
			</p>
			<p className={styles.MovieHomeDate}>
				New movies and TV shows are added every week.
			</p>
			<p className={styles.MovieHomeDescription}>
				We provide you with the latest movies and TV shows.
			</p>

			<div className={styles.MovieHomeButtons}>
				<button className={styles.playButton}>
					<FaPlay className={styles.playIcon} /> Play
				</button>

				<button className={styles.infoButton}>
					<FaCircleInfo className={styles.infoIcon} />
					More Info
				</button>
			</div>
		</div>
	);
};
