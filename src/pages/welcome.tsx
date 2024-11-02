import React from "react";

const WelcomePage: React.FC = () => {
	return (
		<div
			className={`relative pt-20 min-h-screen w-full flex flex-col bg-cover bg-center`}
			style={{ backgroundImage: 'url("welcome.jpg")' }}
		>
			{/* Overlay for darker background */}
			<div className="absolute inset-0 bg-black opacity-70"></div>

			<div className="relative flex-grow flex flex-col items-center text-center text-white px-4">
				<div className="mt-10 max-w-3xl mx-auto justify-center">
					<h1 className="text-5xl font-bold mb-10">
						Watch TV Shows Online, Watch Movies Online
					</h1>
					<h2 className="text-4xl font-bold mb-14">Free Streaming</h2>
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
		</div>
	);
};

export default WelcomePage;
