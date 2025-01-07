export enum MediaType {
	ALL = "all",
	TV = "tv",
	MOVIE = "movie",
}

export type Show = {
	adult: boolean;
	backdrop_path: string | null;
	media_type: MediaType;
	// media_type: string;
	budget: number | null;
	homepage: string | null;
	showId: string;
	id: number;
	imdb_id: string | null;
	original_language: string;
	original_title: string | null;
	overview: string | null;
	popularity: number;
	poster_path: string | null;
	number_of_seasons: number | null;
	number_of_episodes: number | null;
	release_date: string | null;
	first_air_date: string | null;
	last_air_date: string | null;
	revenue: number | null;
	runtime: number | null;
	status: string | null;
	tagline: string | null;
	title: string | null;
	name: string | null;
	video: boolean;
	vote_average: number;
	vote_count: number;
	original_name?: string;
	seasons?: Season[];
};

export type Season = {
	air_date: string | null;
	episode_count: number | null;
	id: number | null;
	name: string | null;
	overview: string | null;
	poster_path: string | null;
	season_number: number | null;
	vote_average: number | null;
};

export interface Movie {
	id: number;
	title: string;
	original_title: string;
	overview: string;
	genre_ids: number[];
	popularity: number;
	poster_path: string;
	backdrop_path: string;
	release_date: string;

	// Additional fields optional
	genres?: Genre[];
	imdb_id?: string;
	origin_country?: string[];
	runtime?: number;
	vote_average?: number;
}

export interface Genre {
	id: number;
	name: string;
}

export interface Filters {
    title?: string;
    year?: string;
    genre?: string;
    actor?: string;
}