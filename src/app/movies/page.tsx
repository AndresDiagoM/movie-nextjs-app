import { MovieHero } from "app/components/shared/ShowHero";
import { ShowsContainer } from "app/components/shared/ShowsContainer";
import ShowsService from "app/services/showService";
import { MediaType } from "app/types";
import { getRandomMovieFromList } from "app/utils";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Movies",
};

const Movies: React.FC = async () => {
	const latestMovies = await ShowsService.fetchMoviesList("now_playing");
	const randomShow = getRandomMovieFromList(latestMovies.results);
	// console.log("[Movies] Shows: ", shows.results.length);

	// const latestMovie = await ShowsService.fetchLatestMovie();
	// console.log("[Movies] Latest Movie: ", latestMovie);

	// fetch movie list by genre action, genre_id 12
	const actionMovies = await ShowsService.fetchDiscoverShows(
		MediaType.MOVIE,
		28
	);

	// fetch movie list by genre comedy, genre_id 35
	const comedyMovies = await ShowsService.fetchDiscoverShows(
		MediaType.MOVIE,
		35
	);

	return (
		<div className="pt-0 min-h-screen flex flex-col">
			{/* Hero Section */}
			<MovieHero randomShow={randomShow} />

			<div className="relative pt-0 z-20 p-8 text-white text-center flex-1 space-y-8">
				{/* Latest Movies */}
				<ShowsContainer shows={latestMovies.results} title="Latest Movies" mediaType={MediaType.MOVIE} />

				{/* Action Movies */}
				<ShowsContainer shows={actionMovies.results} title="Action Movies" mediaType={MediaType.MOVIE} />

				{/* Comedy Movies */}
				<ShowsContainer shows={comedyMovies.results} title="Comedy Movies" mediaType={MediaType.MOVIE} />
			</div>
		</div>
	);
};

export default Movies;
