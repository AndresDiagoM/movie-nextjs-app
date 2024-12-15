import { env } from "app/env.mjs";
import axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosRequestConfig,
	type InternalAxiosRequestConfig,
} from "axios";
import { cache } from "react";
const BEARER_TOKEN = env.NEXT_PUBLIC_TMDB_TOKEN;

/**
 * @class BaseService
 * @description Base service class for all services
 */
class BaseService {
	constructor() {
		if (this.constructor === BaseService) {
			throw new Error("Classes can't be instantiated.");
		}
	}

	/**
	 * Creates an Axios instance with the given base URL and configures interceptors.
	 * @param {string} baseUrl - The base URL for the Axios instance.
	 * @returns {AxiosInstance} - Configured Axios instance.
	 */
	static axios(baseUrl: string): AxiosInstance {
		const instanceConfig: AxiosRequestConfig = this.getConfig(baseUrl);
		const instance: AxiosInstance = axios.create(instanceConfig);

		/**
		 * Request interceptor to add authorization headers.
		 * @param {InternalAxiosRequestConfig} config - Axios request config.
		 * @returns {InternalAxiosRequestConfig} - Modified Axios request config.
		 */
		const onRequest = (
			config: InternalAxiosRequestConfig
		): InternalAxiosRequestConfig => {
			if (config.baseURL?.includes("themoviedb")) {
				config.headers.Authorization = `Bearer ${BEARER_TOKEN}`;
			}
			return config;
		};

		/**
		 * Error response interceptor for enhanced error logging.
		 * @param {AxiosError | Error} error - The error object.
		 * @returns {Promise<AxiosError>} - Rejected promise with the error.
		 */
		const onErrorResponse = (
			error: AxiosError | Error
		): Promise<AxiosError> => {
			console.error(`Error in request: ${error.message}`, error);
			return Promise.reject(error);
		};

		instance.interceptors.request.use(onRequest, onErrorResponse);

		return instance;
	}

	/**
	 * Returns the Axios request configuration.
	 * @param {string} baseUrl - The base URL for the Axios instance.
	 * @returns {AxiosRequestConfig} - Axios request configuration.
	 */
	static getConfig(baseUrl: string): AxiosRequestConfig {
		return {
			timeout: 15000,
			baseURL: baseUrl,
			responseType: "json",
			maxContentLength: 100000,
			validateStatus: (status: number) => status >= 200 && status < 300,
			maxRedirects: 5,
		};
	}

	/**
	 * Type guard to check if a PromiseSettledResult is a PromiseRejectedResult.
	 * @param {PromiseSettledResult<unknown>} input - The PromiseSettledResult to check.
	 * @returns {boolean} - True if the input is a PromiseRejectedResult, false otherwise.
	 */
	static isRejected = (
		input: PromiseSettledResult<unknown>
	): input is PromiseRejectedResult => input.status === "rejected";

	/**
	 * Type guard to check if a PromiseSettledResult is a PromiseFulfilledResult.
	 * @param {PromiseSettledResult<T>} input - The PromiseSettledResult to check.
	 * @returns {boolean} - True if the input is a PromiseFulfilledResult, false otherwise.
	 */
	static isFulfilled = <T>(
		input: PromiseSettledResult<T>
	): input is PromiseFulfilledResult<T> => input.status === "fulfilled";

	/**
	 * Handles API errors with specific error messages
	 * @protected
	 * @param {unknown} error - The error object
	 * @throws {Error} - A formatted error message
	 */
	protected static handleApiError(error: unknown) {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError;
			switch (axiosError.response?.status) {
				case 404:
					throw new Error('Resource not found - Please check if the requested content exists');
				case 401:
					throw new Error('Unauthorized - Please check your API key');
				case 429:
					throw new Error('Too many requests - Please try again later');
				default:
					throw new Error(`API Error: ${axiosError.message}`);
			}
		}
		throw error;
	}

	/**
	 * Wraps API calls with error handling and caching
	 * @protected
	 * @param {Function} apiCall - The API call function to execute
	 * @returns {Function} - Cached function with the same parameters
	 */
	protected static safeApiCall<TArgs extends unknown[], TReturn>(
		apiCall: (...args: TArgs) => Promise<TReturn>
	): (...args: TArgs) => Promise<TReturn> {
		return cache(async (...args: TArgs) => {
			try {
				return await apiCall(...args);
			} catch (error) {
				throw this.handleApiError(error);
			}
		});
	}
}

export default BaseService;
