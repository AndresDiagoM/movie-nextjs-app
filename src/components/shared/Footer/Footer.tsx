import { FaGithub, FaGlobe, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer = () => {
	return (
		<>
			{/* Footer */}
			<footer className="absolute bottom-10 w-full flex flex-row space-x-4 justify-center">
				<a
					href="https://www.linkedin.com/in/andres-felipe-diago-matta/"
					target="_blank"
					rel="noopener noreferrer"
					className="text-white hover:text-gray-400"
				>
					<FaLinkedin className="text-2xl" />
				</a>
				<a
					href="https://github.com/AndresDiagoM"
					target="_blank"
					rel="noopener noreferrer"
					className="text-white hover:text-gray-400"
				>
					<FaGithub className="text-2xl" />
				</a>
				<a
					href="https://andresdiagom.github.io/"
					target="_blank"
					rel="noopener noreferrer"
					className="text-white hover:text-gray-400"
				>
					<FaGlobe className="text-2xl" />
				</a>
				<a
					href="https://x.com/AndresDmatta"
					target="_blank"
					rel="noopener noreferrer"
				>
					<FaTwitter className="text-2xl text-white" />
				</a>
			</footer>
		</>
	);
};
