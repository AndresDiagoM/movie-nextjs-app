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
	adult: boolean | null;
	title: string;
	status: string;
	original_title: string;
	overview: string;
	genre_ids: number[];
	popularity: number;
	poster_path: string;
	backdrop_path: string;
	release_date: string;
	budget: number;
	// Additional fields optional
	genres?: Genre[];
	imdb_id?: string;
	origin_country?: string[];
	runtime?: number;
	vote_average?: number;
	vote_count?: number;
	video?: boolean;
	production_companies?: ProductionCompany[];
	production_countries?: ProductionCountry[];
	spoken_languages?: SpokenLanguage[];
}

export interface SpokenLanguage {
	iso_639_1: string;
	name: string;
	english_name: string;
}

export interface ProductionCompany {
	id: number;
	logo_path: string | null;
	name: string;
	origin_country: string;
}

export interface ProductionCountry {
	iso_3166_1: string;
	name: string;
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