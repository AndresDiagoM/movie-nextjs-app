import React from "react";
import type { Metadata } from "next";


export const metadata: Metadata = {
	title: "Movies",
};

const Movies: React.FC = () => {
	return (
		<div className="pt-20">
			<h2>Movies</h2>
		</div>
	);
};

export default Movies;
