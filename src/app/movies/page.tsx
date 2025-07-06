import getUserSession from "app/components/providers/ServerSession";
import { MovieHero } from "app/components/shared/ShowHero";
import { ShowsContainer } from "app/components/shared/ShowsContainer";
import ShowsService from "app/services/showService";
import { MediaType, Show } from "app/types";
import { getRandomMovieFromList } from "app/utils";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Movies",
};

const fetchWatchedMovies = async () => {
	try {
		// Get the user session
		const session = await getUserSession();
		// console.log("[Movies] User Session: ", session);

		if (!session) {
			console.log("User is not logged in", session);
			return [];
		}

		const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
		const url = new URL("/api/movies", baseUrl);
		url.searchParams.append("email", session?.user?.email || "");
		const res = await fetch(url.toString(), {
			method: "GET",
		});

		if (!res.ok) {
			return [];
		}

		const result = await res.json();
		return result;
	} catch (error) {
		console.error("Failed to fetch watched movies", error);
		return []; // Return a default value in case of error
	}
};

const Movies: React.FC = async () => {
	const latestMovies = await ShowsService.fetchMoviesList("now_playing");
	const randomShow = getRandomMovieFromList(latestMovies.results);
	// console.log("[Movies] Shows: ", shows.results.length);

	// const latestMovie = await ShowsService.fetchLatestMovie();
	// console.log("[Movies] Latest Movie: ", latestMovie);

	// fetch movie list by genre action, genre_id 12
	const actionMovies = await ShowsService.fetchDiscoverShows(MediaType.MOVIE, {
		with_genres: 28,
	});

	// fetch movie list by genre comedy, genre_id 35
	const comedyMovies = await ShowsService.fetchDiscoverShows(MediaType.MOVIE, {
		with_genres: 35,
	});

	// Fetch the movies list watched by the user
	const watchedMovies = await fetchWatchedMovies();
	console.log("[Movies] Watched Movies: ", watchedMovies);
	const continueWatching: Show[] = [];
	if (watchedMovies.movieTmdbIds) {
		// look for each movie in the list
		for (const movieId of watchedMovies.movieTmdbIds) {
			const movie = await ShowsService.fetchShowDetails(
				movieId,
				MediaType.MOVIE
			);
			if (movie) {
				continueWatching.push(movie);
			}
		}
		console.log("[Movies] Continue Watching: ", continueWatching.length);
	}

	return (
		<div className="pt-0 min-h-screen flex flex-col">
			{/* Hero Section */}
			<MovieHero randomShow={randomShow} />

			<div className="relative pt-0 z-20 p-8 text-white text-center flex-1 space-y-8">
				{/* Watched Movies */}
				{continueWatching.length > 0 && (
					<ShowsContainer
						shows={continueWatching}
						title="Continue Watching"
						mediaType={MediaType.MOVIE}
					/>
				)}

				{/* Latest Movies */}
				<ShowsContainer
					shows={latestMovies.results}
					title="Latest Movies"
					mediaType={MediaType.MOVIE}
				/>

				{/* Action Movies */}
				<ShowsContainer
					shows={actionMovies.results}
					title="Action Movies"
					mediaType={MediaType.MOVIE}
				/>

				{/* Comedy Movies */}
				<ShowsContainer
					shows={comedyMovies.results}
					title="Comedy Movies"
					mediaType={MediaType.MOVIE}
				/>
			</div>
		</div>
	);
};

export default Movies;
