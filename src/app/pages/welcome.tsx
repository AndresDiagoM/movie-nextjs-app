import React from "react";
import {
	FaGithub,
	FaGlobe,
	FaLinkedin,
	FaSignInAlt,
	FaTwitter,
} from "react-icons/fa";

const WelcomePage: React.FC = () => {
	return (
		<div
			className="relative min-h-screen w-full flex flex-col bg-cover bg-center"
			style={{ backgroundImage: 'url("welcome.jpg")' }}
		>
			{/* Overlay for darker background */}
			<div className="absolute inset-0 bg-black opacity-70"></div>

			{/* Content */}
			<div className="relative z-10 text-center text-white px-4 w-full h-full">
				<nav className="flex justify-between items-center p-6 w-full max-w-6xl mx-auto">
					<h1 className="text-xl font-bold">Sudo-Flix</h1>
					<ul className="flex space-x-6">
						<li>
							<a href="#home" className="hover:underline">
								Home
							</a>
						</li>
						<li>
							<a href="#about" className="hover:underline">
								Movies
							</a>
						</li>
						<li>
							<a href="#contact" className="hover:underline">
								Series
							</a>
						</li>
						<li>
							<a href="#docs" className="hover:underline">
								Trending
							</a>
						</li>
					</ul>
					<div className="flex space-x-4 items-center">
						{/* <a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							<FaTwitter className="text-2xl text-white" />
						</a>
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							<FaFacebook className="text-2xl text-white" />
						</a>
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							<FaInstagram className="text-2xl text-white" />
						</a> */}
						<a
							href="#blocks"
							className="flex ml-4 bg-white text-black py-2 px-4 rounded-full hover:bg-gray-200"
						>
							Login
							<FaSignInAlt className="ml-2 w-full py-1" size="24px" />
						</a>
					</div>
				</nav>

				<div className="mt-20 max-w-3xl mx-auto">
					<h1 className="text-5xl font-bold mb-6">
						Watch TV Shows Online, Watch Movies Online
					</h1>
					<h2 className="text-4xl font-bold mb-6">Free Streaming</h2>
					<p className="mb-16 max-w-xl mx-auto">
						Step into a world where entertainment knows no boundaries, where
						your screens come alive with an endless array of captivating
						stories.
					</p>
					<a
						href="#enroll"
						className="bg-white text-black py-3 px-6 rounded-full font-semibold hover:bg-gray-300"
					>
						WATCH NOW
					</a>
				</div>
			</div>

			{/* Footer */}
			<footer className="absolute w-full flex flex-row bottom-5 right-5 space-x-4 justify-center">
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
		</div>
	);
};

export default WelcomePage;
