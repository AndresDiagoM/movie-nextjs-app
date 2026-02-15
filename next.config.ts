import type { NextConfig } from "next";
import withPWA from "next-pwa";
import { env } from "./src/env.mjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: env.NEXT_PUBLIC_TMDB_IMAGE_DOMAIN,
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  sassOptions: {
    includePaths: ["src/sass"],
    prependData: `@use "main.sass" as *`,
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Disable PWA in development
  // Add custom service worker for push notifications
  sw: "sw.js",
  // swSrc: "public/sw-custom.js",
  // Workbox options
  // Workbox options: using a custom service worker via `swSrc`.
  // Define runtime caching strategies inside `public/sw-custom.js` when using InjectManifest.
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.themoviedb\.org\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "tmdb-api-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /^https:\/\/image\.tmdb\.org\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "tmdb-images-cache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
  ],
} as any)(nextConfig);
