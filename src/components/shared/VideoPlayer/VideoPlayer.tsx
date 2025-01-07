interface VideoPlayerProps {
	url: string;
}

/**
 * VideoPlayer component
 *
 * This component renders an iframe to display a video player.
 *
 * @param {string} url - The URL of the video to be played.
 *
 * @returns {JSX.Element} The rendered VideoPlayer component.
 */
export const VideoPlayer = ({ url }: VideoPlayerProps): JSX.Element => {
	console.log("[VideoPlayer] URL: ", url);
	return (
		<iframe
			src={url}
			allowFullScreen
			sandbox="allow-same-origin allow-scripts allow-popups"
			className="w-full sm:w-[100%] md:w-[80%] lg:w-[70%] xl:w-[60%] h-[200px] sm:h-[200px] md:h-[300px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px] rounded-lg overflow-hidden"
		></iframe>
	);
};

/**
 * sm - 640px
 * md - 768px
 * lg - 1024px
 * xl - 1280px
 * 2xl - 1536px
 * 
 * allow-same-origin - Allows the iframe content to be treated as being from the same origin.
 * allow-scripts - Allows the iframe content to run scripts.
 */
