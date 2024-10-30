import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Movie",
};

interface MoviesIdProps {
	params: { [key: string]: string };
	searchParams: { [key: string]: string };
}

const MoviesId: React.FC<MoviesIdProps> = ({ params, searchParams }) => {
	return (
		<div>
			<h2>Movies ids</h2>
			<p>Params: {JSON.stringify(params)}</p>
			<p>Search Params: {JSON.stringify(searchParams)}</p>
		</div>
	);
};

export default MoviesId;
