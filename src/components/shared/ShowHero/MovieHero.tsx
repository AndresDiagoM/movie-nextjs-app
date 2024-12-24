"use client";

import useWindowSize from "app/hooks/useWindowSize";
import { Show } from "app/types";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import styles from "./MovieHero.module.sass";

export const MovieHero = ({ randomShow }: { randomShow?: Show }) => {
	const { width } = useWindowSize();

	if (!randomShow) return null;
	const imageUrl = `https://image.tmdb.org/t/p/${
		width <= 768 ? "w780" : "original"
	}${randomShow.backdrop_path}`;

	// console.log("Width: ", width);
	// console.log("imageUrl: ", imageUrl);

	return (
		<div
			className={styles.MovieHome}
			style={{
				backgroundImage: `url(${imageUrl})`,
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
						randomShow.media_type ?? "movie"
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
