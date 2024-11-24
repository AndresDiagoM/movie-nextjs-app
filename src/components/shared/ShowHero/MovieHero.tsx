import { Show } from "app/types";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import styles from "./MovieHero.module.sass";

export const MovieHero = ({ randomShow }: { randomShow?: Show }) => {
	if (!randomShow) return null;

	return (
		<div
			className={styles.MovieHome}
			style={{
				backgroundImage: `url(https://image.tmdb.org/t/p/original${randomShow.backdrop_path})`,
			}}
		>
			<div className={styles.overlay}></div>
			<h1 className={styles.MovieHomeTitle}>
				{randomShow.title || randomShow.name}
			</h1>
			<div className={styles.MovieHomeStatsContainer}>
				<p className={styles.MovieHomeStats}>
					{((randomShow.vote_average ?? 0) * 10).toFixed(1)}% Match
				</p>
				<p className={styles.MovieHomeDate}>
					| {randomShow.release_date || randomShow.first_air_date}
				</p>
			</div>
			<p className={styles.MovieHomeDescription}>
				{randomShow.overview || "No description available"}
			</p>

			<div className={styles.MovieHomeButtons}>
				<Link
					href={`/movies/${randomShow.id}?mediaType=${
						randomShow.media_type ?? ""
					}`}
					passHref
				>
					<button className={styles.playButton}>
						<FaPlay className={styles.playIcon} /> Play
					</button>
				</Link>

				<Link
					href={`/movies/${randomShow.id}?mediaType=${
						randomShow.media_type ?? ""
					}`}
					passHref
				>
					<button className={styles.infoButton}>
						<FaCircleInfo className={styles.infoIcon} />
						More Info
					</button>
				</Link>
			</div>
		</div>
	);
};
