"use client";

import { MovieModal } from "app/components/MovieModal";
import { Show } from "app/types";
import Image from "next/image";
import { useState } from "react";

export const ShowsContainer = ({ shows }: { shows: Show[] }) => {
	const [selectedMovie, setSelectedMovie] = useState<Show | null>(null);

	return (
		<div className="pt-0 background-transparent -mt-20 z-20 relative">
			<div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-black z-0" />
			<h1 className="pl-8 text-2xl font-bold mb-4 relative z-10">Trending Now</h1>
			<div className="pl-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
				{Array.isArray(shows) && shows.map((movie) => (
					<div key={movie?.id} className="relative">
						<Image
							src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
							alt={movie?.title || ""}
							className="rounded-lg cursor-pointer"
							width={500}
							height={750}
							priority
							onClick={() => setSelectedMovie(movie)}
						/>
						{/* <h2 className="text-lg font-semibold">{movie?.title}</h2> */}
					</div>
				))}
			</div>
			{selectedMovie && (
				<MovieModal
					movie={selectedMovie}
					onClose={() => setSelectedMovie(null)}
				/>
			)}
		</div>
	);
};
