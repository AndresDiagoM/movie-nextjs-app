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
	const [currentService, setCurrentService] =
		React.useState<string>(StreamingService);

	// handle video url
	const [videoUrl, setVideoUrl] = React.useState<string>("");

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

	return (
		<div className="w-full min-h-screen overflow-y-auto">
			{/* Background Image Container */}
			<div className="fixed top-0 left-0 w-full h-full -z-10">
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
					style={{
						backgroundImage: `url(https://image.tmdb.org/t/p/original${show?.backdrop_path})`,
					}}
				/>
				<div className="absolute inset-0 bg-black/50" />
			</div>

			{/* Content Container */}
			<div className="relative z-10 pt-20 p-8 text-white">
				{/* Show Title */}
				<h2 className="text-4xl font-bold text-center mb-6">
					{show?.title || show?.name}
				</h2>

				{/* Video Player */}
				<div className="flex justify-center mt-4">
					<VideoPlayer url={videoUrl} height="600px" width="80%" />
				</div>

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
		</div>
	);
};

export default MoviesId;
