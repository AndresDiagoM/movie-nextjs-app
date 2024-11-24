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

	// handle video url
	const [videoUrl, setVideoUrl] = React.useState<string>("");
	const [selectedSeason, setSelectedSeason] = React.useState<number | null>(
		null
	);
	const [selectedEpisode, setSelectedEpisode] = React.useState<number | null>(
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
		setSelectedEpisode(null);
	};

	const handleEpisodeSelect = (episodeNumber: number) => {
		setSelectedEpisode(episodeNumber);
		if (currentService.includes("vidsrc.cc")) {
			setVideoUrl(
				`${currentService}${mediaType}/${show?.id}/${selectedSeason}/${selectedEpisode}`
			);
		} else if (currentService.includes("vidsrc.xyz")) {
			setVideoUrl(
				`${currentService}${mediaType}/${show?.id}/${selectedSeason}-${selectedEpisode}`
			);
		}
		console.log("[MOVIES] Video URL: ", videoUrl);
	};

	return (
		<div
			className="relative bg-cover bg-center min-h-screen flex flex-col"
			style={{
				backgroundImage: `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`,
			}}
		>
			<div className="absolute inset-0 bg-black opacity-50"></div>
			<div className="relative pt-20 z-20 p-8 text-white text-center flex-grow">
				<h2 className="text-4xl font-bold">{show.title || show.name}</h2>

				{/* Video Player */}
				<div className="flex justify-center mt-4">
					<VideoPlayer url={videoUrl} height="600px" width="80%" />
				</div>

				{/* If is tv show, show number of seasons, and episodes */}
				{isTvShow && (
					<div className="pt-4 mt-4">
						<p className="text-lg">
							Number of Seasons: {show.number_of_seasons} | Number of Episodes:{" "}
							{show.number_of_episodes}
						</p>
						<div className="mt-4">
							{show.seasons?.map((season) => (
								<div key={season.id} className="mb-4">
									<button
										onClick={() => handleSeasonSelect(season.season_number!)}
										className="px-4 py-2 bg-gray-700 text-white rounded"
									>
										{season.name}
									</button>
									{selectedSeason === season.season_number && (
										<div className="mt-2">
											{season.episode_count !== null &&
												Array.from({ length: season.episode_count }, (_, i) => (
													<button
														key={i}
														onClick={() => handleEpisodeSelect(i + 1)}
														className="mr-2 px-2 py-1 bg-gray-500 text-white rounded"
													>
														Episode {i + 1}
													</button>
												))}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				)}

				{/* Buttons to switch streaming services */}
				<div className="pt-4 mt-4">
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
				<p className="mt-4 text-lg">
					Release Date: {show.release_date || show.first_air_date}
				</p>
				<p className="mt-2 text-lg">Overview: {show.overview}</p>
			</div>
		</div>
	);
};

export default MoviesId;
