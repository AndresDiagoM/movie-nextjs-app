"use client";

// import ShowsService from "@/services/showService";
import { ShowsContainer } from "app/components/shared/ShowsContainer";
import { useSearchStore } from "app/stores/search";
import { MediaType } from "app/types";
// import { Show } from "app/types";
import React from "react";

const SearchPage = () => {
	const { shows, loading, query } = useSearchStore();

	// console.log("[SearchPage] Shows: ", shows);

	return (
		<div className="pt-40 min-h-screen">
			<div className="p-8 text-white text-center space-y-8">
				{loading ? (
					<div>Loading...</div>
				) : (
					<ShowsContainer 
						shows={shows}
						title={query ? `Search Results for: ${query}` : "Search Results"} 
						mediaType={MediaType.MOVIE} 
					/>
				)}
			</div>
		</div>
	);
};

export default SearchPage;
