import { env } from "app/env.mjs";
import { MediaType } from "app/types";
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

	/**
	 * Fetches the search results based on the provided query.
	 * It can search across multiple types (movies, TV shows, etc.) or keywords.
	 * @method searchShows
	 * @param {string} query - The search query.
	 * @param {boolean} [multi=true] - Whether to search across multiple types (default is true).
	 *                                 If false, it searches for keywords.
	 * @returns {Promise<any>} - The response from the API containing the search results.
	 */
	static searchShows = this.safeApiCall(async (query: string, multi = true) => {
		const param = multi ? "multi" : "keyword";
		const response = await this.getInstance().axiosInstance.get(
			`/search/${param}`,
			{
				params: {
					query,
				},
			}
		);
		return response.data;
	});

	/**
	 * Fetches the discover series or movies, also by genre
	 * @method fetchDiscoverShows
	 * @param {MediaType} mediaType - The type of media (movie or tv)
	 * @param {number} genreId - The ID of the genre
	 * @returns {Promise<any>} - The response from the API
	 */
	static fetchDiscoverShows = this.safeApiCall(async (mediaType: MediaType, genreId: number) => {
		const response = await this.getInstance().axiosInstance.get(
			`/discover/${mediaType}`,
			{
				params: {
					language: "en-US",
					primary_release_year: 2024,
					sort_by: "popularity.desc",
					page: 1,
					limit: 1,
					with_genres: genreId,
				},
			}
		);
		return response.data;
	});

	/**
	 * Fetches the details of a show
	 * @method fetchShowDetails
	 * @param {number} id - The ID of the show
	 * @param {MediaType} mediaType - The type of media (movie or tv)
	 * @returns {Promise<any>} - The response from the API
	 */
	static fetchShowDetails = this.safeApiCall(async (id: number, mediaType: MediaType) => {
		const response = await this.getInstance().axiosInstance.get(
			`/${mediaType}/${id}`,
			{
				params: {
					language: "en-US",
				},
			}
		);
		return response.data;
	});

	/**
	 * Fetches the trending tv shows or movies, by the week or day
	 * @method fetchTrending
	 * @param {string} timeWindow - The time window for the trending data (day or week)
	 * @param {string} mediaType - The type of media (movie, tv or all)
	 * @returns {Promise<any>} - The response from the API
	 */
	static fetchTrending = this.safeApiCall(
		async (timeWindow: string, mediaType: MediaType) => {
			const response = await this.getInstance().axiosInstance.get(
				`/trending/${mediaType}/${timeWindow}`
			);
			return response.data;
		}
	);

	/**
	 * Fetches the trailer for a show
	 * @method fetchShowTrailer
	 * @param {MediaType} mediaType - The type of media (movie or tv)
	 */
	static fetchShowTrailer = this.safeApiCall(async (mediaType: MediaType, id: number) => {
		const response = await this.getInstance().axiosInstance.get(
			`/${mediaType}/${id}/videos`
		);
		return response.data;
	});

	/**
	 * Fetches the latest movie, just 1 movie
	 * @method fetchLatestMovies
	 * @returns {Promise<any>} - The response from the API
	 */
	static fetchLatestMovie = this.safeApiCall(async () => {
		const response = await this.getInstance().axiosInstance.get(
			"/movie/latest",
			{
				params: {
					language: "en-US",
					page: 1,
				},
			}
		);
		return response.data;
	});

	/**
	 * Fetches movies lists
	 * @method fetchMovies
	 * @param {string} listType - The type of list to fetch (popular, top_rated, upcoming, now_playing)
	 * now_playing: Get a list of movies that are currently in theatres.
	 * popular: Get a list of the current popular movies on TMDb. This list updates daily.
	 * top_rated: Get the top rated movies on TMDb.
	 * upcoming: Get a list of upcoming movies in theatres.
	 * @returns {Promise<any>} - The response from the API
	 */
	static fetchMoviesList = this.safeApiCall(async (listType: string) => {
		const response = await this.getInstance().axiosInstance.get(
			`/movie/${listType}`,
			{
				params: {
					language: "en-US",
					page: 1,
				}
			}
		);
		return response.data;
	});

	/**
	 * Fetches tv shows lists
	 * @method fetchTvShowsList
	 * @param {string} listType - The type of list to fetch (popular, top_rated, on_the_air, airing_today)
	 * on_the_air: Get a list of shows that are currently on the air.
	 * airing_today: Get a list of shows that are airing today.
	 * popular: Get a list of the current popular TV shows on TMDb. This list updates daily.
	 * top_rated: Get the top rated TV shows on TMDb.
	 * @returns {Promise<any>} - The response from the API
	 * @example
	 * ShowsService.fetchTvShowsList("popular");
	 */
	static fetchTvShowsList = this.safeApiCall(async (listType: string) => {
		const response = await this.getInstance().axiosInstance.get(
			`/tv/${listType}`,
			{
				params: {
					language: "en-US",
					page: 1,
				}
			}
		);
		return response.data;
	});

	/**
	 * Fetches the genres of tv series or movies
	 * @method fetchGenres
	 * @param {MediaType} mediaType - The type of media (movie or tv)
	 * @returns {Promise<any>} - The response from the API
	 */
	static fetchGenres = this.safeApiCall(async (mediaType: MediaType) => {
		const response = await this.getInstance().axiosInstance.get(
			`/genre/${mediaType}/list`
		);
		return response.data;
	});
}

export default ShowsService;

// cache from react is used to cache the data from the API calls, so that the data is not fetched again and again
