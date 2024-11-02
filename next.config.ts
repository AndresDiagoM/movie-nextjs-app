import type { NextConfig } from "next";
import { env } from './src/env.mjs';

const nextConfig: NextConfig = {
  images: {
    domains: [env.NEXT_PUBLIC_TMDB_IMAGE_DOMAIN],
  },
  /* config options here */
};

export default nextConfig;
