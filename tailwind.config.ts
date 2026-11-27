import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			borderRadius: {
				card: "16px",
			},
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				// Live TV theme
				live: {
					bg: "#0a0a0b",
					surface: "#121216",
					panel: "#0c0c10",
					accent: "#9146ff",
					"accent-soft": "#b48cff",
					red: "#ff3b30",
					text: "#f4f4f5",
				},
			},
		},
	},
	plugins: [],
};
export default config;
