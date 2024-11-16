// import { TrendingMovies } from "app/components/home/TrendingMovies";
import { ShowsContainer } from "app/components/home/ShowsContainer";
import { MovieHero } from "app/components/shared/ShowHero";
import MovieService from "app/services/movieService";
import type { Metadata } from "next";
import {getRandomMovieFromList} from "app/utils";

export const metadata: Metadata = {
	title: "Home",
};

export default async function Home() {
	const shows = await MovieService.fetchShows();
	const randomShow = getRandomMovieFromList(shows.results);
	console.log("Shows: ", shows.results.length);
	return (
		<div className="">
			{/* Hero Section */}
			<MovieHero randomShow={randomShow} />
			{/* Trending Movies */}
			{/* <TrendingMovies /> */}
			<ShowsContainer shows={shows.results} />
		</div>
	);
}

// export default Home;
