/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ShowsContainer } from "app/components/shared/ShowsContainer";
import { useSearchStore } from "app/stores/search";
import { MediaType } from "app/types";
import React, { useState, useEffect, ChangeEvent } from "react";
import { Skeleton } from "app/components/shared/Skeleton";
import ShowsService from "app/services/showService";

const SearchPage = () => {
	const searchStore = useSearchStore();
	const { shows, loading, query } = useSearchStore();
	const [filters, setFilters] = useState({
		genre: "",
		year: "",
		actor: "",
		title: "",
		type: "",
	});

	const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFilters({
			...filters,
			[name]: value,
		});
	};

	useEffect(() => {
		const fetchShows = async () => {
			const nonEmptyFilters = Object.fromEntries(
				Object.entries(filters).filter(([, value]) => value !== "")
			);
			const data = await ShowsService.searchShows2({
				type: filters.type,
				filters: nonEmptyFilters,
			});
			searchStore.setShows(data.results);
			searchStore.setLoading(false);
			console.log("[SearchPage] Shows: ", data.results.length, shows.length);
		};

		fetchShows();
	}, [filters.title, filters.genre, filters.year, filters.actor]);

	useEffect(() => {
		const fetchGenres = async () => {
			const data = await ShowsService.fetchGenres(filters?.type as MediaType);
			console.log("[SearchPage] Genres: ", data.genres.length);
			searchStore.setGenres(data.genres);
		};

		if (filters.type !== "" && filters.type !== "multi" && filters.type !== undefined) {
			fetchGenres();
		}
	}, [filters.type]);

	return (
		<div className="pt-[70px] min-h-screen">
			<div className="p-8 text-white text-center space-y-8">
				{/* Filters Container */}
				<div className="flex flex-col sm:flex-row sm:flex-wrap justify-center">
					<select
						name="type"
						value={filters.type}
						onChange={handleFilterChange}
						className="p-2 rounded bg-gray-800 text-white sm:w-[75%] md:w-[12%] lg:w-[16%] mb-2 sm:mb-0 sm:mr-2"
					>
						<option value="">Select Type</option>
						<option value="tv">TV</option>
						<option value="movie">MOVIE</option>
						<option value="multi">ANY</option>
					</select>
					<input
						type="text"
						name="title"
						placeholder="Title"
						value={filters.title}
						onChange={handleFilterChange}
						className="p-2 rounded bg-gray-800 text-white sm:w-[75%] md:w-[12%] lg:w-[16%] mb-2 sm:mb-0 sm:mr-2"
					/>
					<input
						type="text"
						name="actor"
						placeholder="Actor"
						value={filters.actor}
						onChange={handleFilterChange}
						className="p-2 rounded bg-gray-800 text-white sm:w-[75%] md:w-[12%] lg:w-[16%] mb-2 sm:mb-0 sm:mr-2"
					/>
					<input
						type="text"
						name="year"
						placeholder="Year"
						value={filters.year}
						onChange={handleFilterChange}
						className="p-2 rounded bg-gray-800 text-white sm:w-[75%] md:w-[12%] lg:w-[16%] mb-2 sm:mb-0 sm:mr-2"
					/>
					<select
						name="genre"
						value={filters.genre}
						onChange={handleFilterChange}
						className="p-2 rounded bg-gray-800 text-white sm:w-[75%] md:w-[12%] lg:w-[16%] mb-2 sm:mb-0"
					>
						<option value="">Select Genre</option>
						{searchStore.genres.map((genre) => (
							<option key={genre.id} value={genre.id}>
								{genre.name}
							</option>
						))}
					</select>
				</div>

				{/* Shows Container */}
				{loading ? (
					<Skeleton />
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
