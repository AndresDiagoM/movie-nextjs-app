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
	searchParams: { [key: string]: string };
}

const fetchShowDetails = async (id: number, mediaType: MediaType) => {
	return await ShowsService.fetchShowDetails(id, mediaType);
};

const MoviesId: React.FC<MoviesProps> = ({ params, searchParams }) => {
	const { id } = React.use(params);
	const { mediaType } = React.use(searchParams);
	const [show, setShow] = React.useState<Show | null>(null);
	const [currentService, setCurrentService] =
		React.useState<string>(StreamingService);
	const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

	React.useEffect(() => {
		const showId = Number(id);
		const getShowDetails = async () => {
			const showDetails = await fetchShowDetails(
				showId,
				mediaType as MediaType
			);
			setShow(showDetails);
		};
		getShowDetails();
	}, [id, mediaType]);

	if (!show) {
		return <div>Loading...</div>;
	}

	const videoUrl = `${currentService}${mediaType}/${show.id}`;
	console.log("Params: ", id, " Media Type: ", mediaType);
	console.log("Show: ", show);
	console.log("Video URL: ", videoUrl);

	const handleServiceChange = (service: string) => {
		setCurrentService(service);
		setIsPlaying(true);
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
