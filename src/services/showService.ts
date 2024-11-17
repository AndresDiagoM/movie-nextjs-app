import { env } from "app/env.mjs";
import { MediaType } from "app/types";
import { cache } from "react";
import BaseService from "./baseService";

const API_BASE_URL = env.NEXT_PUBLIC_TMDB_API_URL;

/**
 * @class ShowsService
 * @description Service class for fetching movie data
 */
class ShowsService extends BaseService {
	private static instance: ShowsService;
	private axiosInstance;

	private constructor() {
		super();
		this.axiosInstance = BaseService.axios(API_BASE_URL);
	}

	/**
	 * @method getInstance
	 * @returns {ShowsService} - The singleton instance of the ShowsService class
	 */
	public static getInstance(): ShowsService {
		if (!ShowsService.instance) {
			ShowsService.instance = new ShowsService();
		}
		return ShowsService.instance;
	}

	static fetchShows = cache(async () => {
		const response = await this.getInstance().axiosInstance.get(
			"/trending/all/day",
			{
				params: {
					language: "en-US",
					page: 1,
				},
			}
		);
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

	static fetchShowTrailer = cache(async (mediaType: MediaType, id: number) => {
		const response = await this.getInstance().axiosInstance.get(
			`/${mediaType}/${id}/videos`
		);
		return response.data;
	});
}

export default ShowsService;

// cache from react is used to cache the data from the API calls, so that the data is not fetched again and again
