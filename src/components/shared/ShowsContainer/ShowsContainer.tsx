"use client";

import { ShowModal } from "app/components/shared/ShowsModal";
import { Show } from "app/types";
import Image from "next/image";
import { useState, useEffect } from "react";

export const ShowsContainer = ({ shows }: { shows: Show[] }) => {
	const [selectedMovie, setSelectedMovie] = useState<Show | null>(null);

	useEffect(() => {
		if (selectedMovie) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [selectedMovie]);

	return (
		<div className="pt-0 background-transparent -mt-20 z-20 relative">
			<div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-black z-0" />
			<h1 className="pl-8 text-2xl font-bold mb-4 relative z-10">
				Trending Now
			</h1>
			<div className="pl-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
				{Array.isArray(shows) &&
					shows.map((movie) => (
						<div key={movie?.id} className="relative group">
							<Image
								src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
								alt={movie?.title || ""}
								className="rounded-lg cursor-pointer transform transition-transform duration-300 group-hover:scale-105"
								width={500}
								height={750}
								priority
								onClick={() => setSelectedMovie(movie)}
							/>
							<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg max-h-[70%] overflow-hidden">
								{movie?.overview}
							</div>
						</div>
					))}
			</div>
			{selectedMovie && (
				<ShowModal
					movie={selectedMovie}
					onClose={() => setSelectedMovie(null)}
				/>
			)}
		</div>
	);
};
