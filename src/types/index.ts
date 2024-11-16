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
