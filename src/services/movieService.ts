import { env } from "app/env.mjs";
const API_BASE_URL = env.NEXT_PUBLIC_TMDB_API_URL;
const BEARER_TOKEN = env.NEXT_PUBLIC_TMDB_TOKEN;

export async function fetchTrendingMovies() {
	const response = await fetch(
		`${API_BASE_URL}/movie/popular?language=en-US&page=1`,
		{
			headers: {
				Authorization: `Bearer ${BEARER_TOKEN}`,
			},
		}
	);
	if (!response.ok) {
		throw new Error("Failed to fetch trending movies");
	}
	const data = await response.json();
	return data; 
}

export async function fetchDiscoverMovies() {
	const response = await fetch(
		`${API_BASE_URL}/discover/movie?language=en-US&primary_release_year=2024&sort_by=popularity.desc&page=1&limit=1`,
		{
			headers: {
				Authorization: `Bearer ${BEARER_TOKEN}`,
			},
		}
	);
	if (!response.ok) {
		throw new Error("Failed to fetch discover movies");
	}
	const data = await response.json();
	return data;
}

export async function fetchMovieDetails(id: number) {
    const response = await fetch(
        `${API_BASE_URL}/movie/${id}?language=en-US`,
        {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
        }
    );
    if (!response.ok) {
        throw new Error("Failed to fetch movie details");
    }
    const data = await response.json();
    return data;
}