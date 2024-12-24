// import { TrendingMovies } from "app/components/home/TrendingMovies";
import { MovieHero } from "app/components/shared/ShowHero";
import { ShowsContainer } from "app/components/shared/ShowsContainer";
import ShowsService from "app/services/showService";
import { MediaType } from "app/types";
import { getRandomMovieFromList } from "app/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Home",
};

export default async function Home() {
	const trendingMovies = await ShowsService.fetchTrending(
		"week",
		MediaType.MOVIE
	);
	const randomShow = getRandomMovieFromList(trendingMovies.results);
	// console.log("[Home] Shows: ", shows.results.length);

	// Fetch now playing movies
	const latestMovies = await ShowsService.fetchMoviesList("now_playing");
	const popularMovies = await ShowsService.fetchMoviesList("popular");
	// const topRatedMovies = await ShowsService.fetchMoviesList("top_rated");
	// console.log("[Home] Latest Movies: ", latestMovies.results.length);

	const CoSeries = await ShowsService.fetchDiscoverShows(MediaType.TV, {
		with_origin_country: "CO|MX|US",
	});
	// console.log("[Home] Popular TV Shows: ", popularTvShows);

	return (
		<div className="min-h-screen flex flex-col">
			{/* Hero Section */}
			<MovieHero randomShow={randomShow} />

			<div className="relative pt-0 p-8 text-white text-center flex-1 space-y-8">
				{/* Trending Shows, series and movies */}
				<ShowsContainer
					shows={trendingMovies.results}
					title="Trending Shows Week"
					mediaType={MediaType.MOVIE}
				/>

				{/* Popular TV Shows */}
				<ShowsContainer
					shows={CoSeries.results}
					title="Popular TV Shows"
					mediaType={MediaType.TV}
				/>

				{/* Now playing movies */}
				<ShowsContainer
					shows={latestMovies.results}
					title="Latest Movies"
					mediaType={MediaType.MOVIE}
				/>

				{/* Popular Movies */}
				<ShowsContainer
					shows={popularMovies.results}
					title="Popular Movies"
					mediaType={MediaType.MOVIE}
				/>

				{/* Top Rated Movies */}
				{/* <ShowsContainer shows={topRatedMovies.results} title="Top Rated Movies" /> */}
			</div>
		</div>
	);
}

// export default Home;
