import { TrendingMovies } from "app/components/home/TrendingMovies";
import { MovieHero } from "app/components/shared/MovieHero";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Home",
};

const Home: React.FC = () => {
	return (
		<div className="pt-5">
			{/* Hero Section */}
			<MovieHero {...{ movie: { title: "Sudo-Flix", backdrop_path: "/images/hero.jpg" } }} />

			{/* Trending Movies */}
			<TrendingMovies />
		</div>
	);
};

export default Home;
