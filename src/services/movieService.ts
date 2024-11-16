import { env } from "app/env.mjs";
import { cache } from "react";
import BaseService from "./baseService";

const API_BASE_URL = env.NEXT_PUBLIC_TMDB_API_URL;

/**
 * @class MovieService
 * @description Service class for fetching movie data
 */
class MovieService extends BaseService {
	private static instance: MovieService;
	private axiosInstance;

	private constructor() {
		super();
		this.axiosInstance = BaseService.axios(API_BASE_URL);
	}

	/**
	 * @method getInstance
	 * @returns {MovieService} - The singleton instance of the MovieService class
	 */
	public static getInstance(): MovieService {
		if (!MovieService.instance) {
			MovieService.instance = new MovieService();
		}
		return MovieService.instance;
	}

	static fetchShows = cache(async () => {
		const response = await this.getInstance().axiosInstance.get("/trending/all/day", {
			params: {
				language: "en-US",
				page: 1,
			},
		});
		return response.data;
	});

	static fetchPopularMovies = cache(async () => {
		const response = await this.getInstance().axiosInstance.get(
			"/movie/popular",
			{
				params: {
					language: "en-US",
					page: 1,
				},
			}
		);
		return response.data;
	});

	static fetchDiscoverMovies = cache(async () => {
		const response = await this.getInstance().axiosInstance.get(
			"/discover/movie",
			{
				params: {
					language: "en-US",
					primary_release_year: 2024,
					sort_by: "popularity.desc",
					page: 1,
					limit: 1,
				},
			}
		);
		return response.data;
	});

	static fetchMovieDetails = cache(async (id: number) => {
		const response = await this.getInstance().axiosInstance.get(
			`/movie/${id}`,
			{
				params: {
					language: "en-US",
				},
			}
		);
		return response.data;
	});

	static fetchTrendingMovies = cache(async () => {
		const response = await this.getInstance().axiosInstance.get(
			"/trending/movie/day",
			{
				params: {
					language: "en-US",
					page: 1,
				},
			}
		);
		return response.data;
	});

	static fetchTrendingAll = cache(async () => {
		const response = await this.getInstance().axiosInstance.get(
			"/trending/all/day"
		);
		return response.data;
	});
}

export default MovieService;

// cache from react is used to cache the data from the API calls, so that the data is not fetched again and again
