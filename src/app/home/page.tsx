// import { TrendingMovies } from "app/components/home/TrendingMovies";
import { MovieHero } from "app/components/shared/ShowHero";
import { ShowsContainer } from "app/components/shared/ShowsContainer";
import ShowsService from "app/services/showService";
import { getRandomMovieFromList } from "app/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Home",
};

export default async function Home() {
	const shows = await ShowsService.fetchShows();
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
