interface VideoPlayerProps {
	url: string;
	height: string;
	width: string;
}

/**
 * VideoPlayer component
 * 
 * This component renders an iframe to display a video player.
 * 
 * @param {string} url - The URL of the video to be played.
 * @param {string} height - The height of the video player.
 * @param {string} width - The width of the video player.
 * 
 * @returns {JSX.Element} The rendered VideoPlayer component.
 */
export const VideoPlayer = ({ url, height, width }: VideoPlayerProps): JSX.Element => {
	return (
		<div style={{ height, width, margin: "0 auto" }}>
			<iframe
				src={url}
				width="100%"
				height="100%"
				allowFullScreen
				sandbox="allow-same-origin allow-scripts"
				style={{
					border: "none",
					marginTop: "20px",
					borderRadius: "8px",
				}}
			></iframe>
		</div>
	);
};
