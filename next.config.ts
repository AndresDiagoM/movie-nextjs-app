import type { NextConfig } from "next";
import { env } from "./src/env.mjs";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: env.NEXT_PUBLIC_TMDB_IMAGE_DOMAIN,
			},
			{
				protocol: 'https',
				hostname: 'www.google.com',
			},
			{
				protocol: 'https',
				hostname: 'github.com',
				},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
		],
	},
	sassOptions: {
		includePaths: ["src/sass"],
		prependData: `@use "main.sass" as *`,
	},
};

export default nextConfig;
