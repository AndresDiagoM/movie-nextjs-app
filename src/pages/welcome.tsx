"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

const WelcomePage: React.FC = () => {
	return (
		<div
			className="relative pt-20 min-h-screen w-full flex flex-col bg-cover bg-center bg-fixed"
			style={{ backgroundImage: 'url("welcome.jpg")' }}
		>
			{/* Gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90"></div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className="relative flex-grow flex flex-col items-center justify-center text-center text-white px-4 space-y-8"
			>
				<div className="max-w-4xl mx-auto">
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.8 }}
						className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
					>
						Watch TV Shows Online, Watch Movies Online
					</motion.h1>

					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.8 }}
						className="text-4xl md:text-5xl font-bold mb-8 text-gray-200"
					>
						Free Streaming
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6, duration: 0.8 }}
						className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-gray-300"
					>
						Step into a world where entertainment knows no boundaries, where
						your screens come alive with an endless array of captivating
						stories.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.8, duration: 0.5 }}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Link
							href="/home"
							className="inline-block bg-gradient-to-r from-gray-100 to-white text-black py-4 px-8 rounded-full font-bold text-lg transition-all hover:from-white hover:to-gray-200 hover:shadow-lg hover:shadow-white/30"
						>
							WATCH NOW
						</Link>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
};

export default WelcomePage;
