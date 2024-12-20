"use client";

import { VideoPlayer } from "app/components/shared/VideoPlayer";
import { env } from "app/env.mjs";
import ShowsService from "app/services/showService";
import { MediaType, Show } from "app/types";
import React from "react";

const StreamingService = env.NEXT_PUBLIC_VIDSRC_API_URL;
const StreamingService2 = env.NEXT_PUBLIC_VIDSRC2_API_URL;

interface MoviesProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ mediaType: string }>;
}

const fetchShowDetails = async (id: number, mediaType: MediaType) => {
	return await ShowsService.fetchShowDetails(id, mediaType);
};

const MoviesId: React.FC<MoviesProps> = ({ params, searchParams }) => {
	const { id } = React.use(params);
	const { mediaType } = React.use(searchParams);
	const [show, setShow] = React.useState<Show | null>(null);
	const [isTvShow, setIsTvShow] = React.useState<boolean>(false);
	const [currentService, setCurrentService] =
		React.useState<string>(StreamingService);
	const [seasonsVisible, setSeasonsVisible] = React.useState(false);

	// handle video url
	const [videoUrl, setVideoUrl] = React.useState<string>("");
	const [selectedSeason, setSelectedSeason] = React.useState<number | null>(
		null
	);

	React.useEffect(() => {
		const showId = Number(id);
		const getShowDetails = async () => {
			const showDetails = await fetchShowDetails(
				showId,
				mediaType as MediaType
			);
			setShow(showDetails);
			setVideoUrl(`${currentService}${mediaType}/${showDetails?.id}`);
		};
		getShowDetails();

		if (mediaType === "tv") {
			setIsTvShow(true);
		}
	}, [id, mediaType, currentService]);

	if (!show) {
		return <div>Loading...</div>;
	}

	console.log("Params: ", id, " Media Type: ", mediaType);
	console.log("Show: ", show);
	console.log("Video URL: ", videoUrl);

	const handleServiceChange = (service: string) => {
		setCurrentService(service);
	};

	const handleSeasonSelect = (seasonNumber: number) => {
		setSelectedSeason(seasonNumber === selectedSeason ? null : seasonNumber);
	};

	const handleEpisodeSelect = (episodeNumber: number) => {
		if (currentService.includes("vidsrc.cc")) {
			setVideoUrl(
				`${currentService}${mediaType}/${show?.id}/${selectedSeason}/${episodeNumber}`
			);
		} else if (currentService.includes("vidsrc.xyz")) {
			setVideoUrl(
				`${currentService}${mediaType}/${show?.id}/${selectedSeason}-${episodeNumber}`
			);
		}
		console.log("[MOVIES] Video URL: ", videoUrl);
	};

	const toggleSeasons = () => {
		setSeasonsVisible(!seasonsVisible);
	};

	return (
		<main className="min-h-screen">
			{/* Background Image Container */}
			<div className="fixed inset-0 -z-10">
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage: `url(https://image.tmdb.org/t/p/original${show?.backdrop_path})`,
					}}
				/>
				<div className="absolute inset-0 bg-black/50" />
			</div>

			{/* Content Container */}
			<div className="relative pt-20 p-8 text-white">

				{/* Show Title */}
				<h2 className="text-4xl font-bold text-center mb-6">{show?.title || show?.name}</h2>

				{/* Video Player */}
				<div className="flex justify-center mt-4">
					<VideoPlayer url={videoUrl} height="600px" width="80%" />
				</div>

				{/* If is tv show, show number of seasons, and episodes */}
				{isTvShow && (
					<div className="pt-4 mt-4">
						<p className="text-lg text-center">
							Number of Seasons: {show.number_of_seasons} | Number of Episodes:{" "}
							{show.number_of_episodes}
						</p>
						
						<div className="flex justify-center mt-4">
							<button
								onClick={toggleSeasons}
								className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							>
								{seasonsVisible ? 'Hide Seasons' : 'Show Seasons'}
							</button>
						</div>

						{seasonsVisible && (
							<div className="mt-6 flex flex-wrap justify-center gap-4">
								{show.seasons?.map((season) => (
									<div key={season.id} className="mb-4">
										<button
											onClick={() => handleSeasonSelect(season.season_number!)}
											className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
										>
											{season.name}
										</button>
										{selectedSeason === season.season_number && (
											<div className="mt-2 flex flex-wrap gap-2">
												{season.episode_count !== null &&
													Array.from({ length: season.episode_count }, (_, i) => (
														<button
															key={i}
															onClick={() => handleEpisodeSelect(i + 1)}
															className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-400"
														>
															Episode {i + 1}
														</button>
													))}
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* Buttons to switch streaming services */}
				<div className="pt-4 mt-4 text-center">
					<button
						onClick={() => handleServiceChange(StreamingService)}
						className="mr-4 px-4 py-2 bg-blue-500 text-white rounded"
					>
						Streaming Service 1
					</button>
					<button
						onClick={() => handleServiceChange(StreamingService2)}
						className="px-4 py-2 bg-green-500 text-white rounded"
					>
						Streaming Service 2
					</button>
				</div>

				{/* Show Details */}
				<p className="mt-4 text-lg text-center">
					Release Date: {show.release_date || show.first_air_date}
				</p>
				<p className="mt-2 text-lg text-center">Overview: {show.overview}</p>
			</div>
			</main>
	);
};

export default MoviesId;
