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
