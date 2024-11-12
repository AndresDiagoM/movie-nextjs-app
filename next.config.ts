import type { NextConfig } from "next";
import { env } from "./src/env.mjs";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: env.NEXT_PUBLIC_TMDB_IMAGE_DOMAIN,
			},
		],
	},
	sassOptions: {
		includePaths: ["src/sass"],
		prependData: `@use "main.sass" as *`,
	},
};

export default nextConfig;
