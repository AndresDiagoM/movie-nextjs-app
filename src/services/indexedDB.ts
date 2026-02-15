/**
 * IndexedDB Service for PWA Offline Storage
 * Stores: watchlist, recently viewed shows, and metadata cache
 */

const DB_NAME = "MovieAppDB";
const DB_VERSION = 1;

// Store names
export const STORES = {
	WATCHLIST: "watchlist",
	RECENTLY_VIEWED: "recentlyViewed",
	METADATA_CACHE: "metadataCache",
	NOTIFICATIONS: "notifications",
} as const;

export interface WatchlistItem {
	id: string; // tmdbId + mediaType
	tmdbId: number;
	mediaType: "movie" | "tv";
	title: string;
	posterPath?: string;
	backdropPath?: string;
	overview?: string;
	rating?: number;
	releaseDate?: string;
	addedAt: number;
	synced: boolean; // Whether synced with backend
}

export interface RecentlyViewedItem {
	id: string; // tmdbId + mediaType
	tmdbId: number;
	mediaType: "movie" | "tv";
	title: string;
	posterPath?: string;
	lastViewedAt: number;
	season?: number;
	episode?: number;
	progress?: number; // Playback progress in seconds
}

export interface MetadataCache {
	id: string; // tmdbId + mediaType
	tmdbId: number;
	mediaType: "movie" | "tv";
	data: any; // Full TMDB response
	cachedAt: number;
	expiresAt: number;
}

export interface NotificationPreference {
	id: string;
	enabled: boolean;
	types: {
		newEpisodes: boolean;
		watchlistUpdates: boolean;
		recommendations: boolean;
	};
	subscription?: PushSubscription;
	updatedAt: number;
}

class IndexedDBService {
	private db: IDBDatabase | null = null;
	private initPromise: Promise<IDBDatabase> | null = null;

	/**
	 * Initialize the database
	 */
	async init(): Promise<IDBDatabase> {
		if (this.db) return this.db;
		if (this.initPromise) return this.initPromise;

		this.initPromise = new Promise((resolve, reject) => {
			if (typeof window === "undefined") {
				reject(new Error("IndexedDB is not available in this environment"));
				return;
			}

			const request = indexedDB.open(DB_NAME, DB_VERSION);

			request.onerror = () => {
				reject(new Error(`Failed to open database: ${request.error}`));
			};

			request.onsuccess = () => {
				this.db = request.result;
				resolve(this.db);
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;

				// Watchlist store
				if (!db.objectStoreNames.contains(STORES.WATCHLIST)) {
					const watchlistStore = db.createObjectStore(STORES.WATCHLIST, { keyPath: "id" });
					watchlistStore.createIndex("addedAt", "addedAt", { unique: false });
					watchlistStore.createIndex("synced", "synced", { unique: false });
				}

				// Recently viewed store
				if (!db.objectStoreNames.contains(STORES.RECENTLY_VIEWED)) {
					const recentStore = db.createObjectStore(STORES.RECENTLY_VIEWED, {
						keyPath: "id",
					});
					recentStore.createIndex("lastViewedAt", "lastViewedAt", { unique: false });
				}

				// Metadata cache store
				if (!db.objectStoreNames.contains(STORES.METADATA_CACHE)) {
					const cacheStore = db.createObjectStore(STORES.METADATA_CACHE, { keyPath: "id" });
					cacheStore.createIndex("expiresAt", "expiresAt", { unique: false });
				}

				// Notifications store
				if (!db.objectStoreNames.contains(STORES.NOTIFICATIONS)) {
					db.createObjectStore(STORES.NOTIFICATIONS, { keyPath: "id" });
				}
			};
		});

		return this.initPromise;
	}

	/**
	 * Generic method to add or update an item
	 */
	private async put<T>(storeName: string, item: T): Promise<void> {
		const db = await this.init();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction([storeName], "readwrite");
			const store = transaction.objectStore(storeName);
			const request = store.put(item);

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Generic method to get an item by key
	 */
	private async get<T>(storeName: string, key: string): Promise<T | undefined> {
		const db = await this.init();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction([storeName], "readonly");
			const store = transaction.objectStore(storeName);
			const request = store.get(key);

			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Generic method to get all items
	 */
	private async getAll<T>(storeName: string): Promise<T[]> {
		const db = await this.init();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction([storeName], "readonly");
			const store = transaction.objectStore(storeName);
			const request = store.getAll();

			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Generic method to delete an item
	 */
	private async delete(storeName: string, key: string): Promise<void> {
		const db = await this.init();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction([storeName], "readwrite");
			const store = transaction.objectStore(storeName);
			const request = store.delete(key);

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	/**
	 * Generic method to clear a store
	 */
	private async clear(storeName: string): Promise<void> {
		const db = await this.init();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction([storeName], "readwrite");
			const store = transaction.objectStore(storeName);
			const request = store.clear();

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	}

	// ==================== WATCHLIST METHODS ====================

	async addToWatchlist(item: Omit<WatchlistItem, "id" | "addedAt" | "synced">): Promise<void> {
		const watchlistItem: WatchlistItem = {
			...item,
			id: `${item.tmdbId}-${item.mediaType}`,
			addedAt: Date.now(),
			synced: false,
		};
		await this.put(STORES.WATCHLIST, watchlistItem);
	}

	async removeFromWatchlist(tmdbId: number, mediaType: "movie" | "tv"): Promise<void> {
		const id = `${tmdbId}-${mediaType}`;
		await this.delete(STORES.WATCHLIST, id);
	}

	async getWatchlist(): Promise<WatchlistItem[]> {
		const items = await this.getAll<WatchlistItem>(STORES.WATCHLIST);
		// Sort by most recently added
		return items.sort((a, b) => b.addedAt - a.addedAt);
	}

	async isInWatchlist(tmdbId: number, mediaType: "movie" | "tv"): Promise<boolean> {
		const id = `${tmdbId}-${mediaType}`;
		const item = await this.get<WatchlistItem>(STORES.WATCHLIST, id);
		return !!item;
	}

	async markWatchlistItemSynced(tmdbId: number, mediaType: "movie" | "tv"): Promise<void> {
		const id = `${tmdbId}-${mediaType}`;
		const item = await this.get<WatchlistItem>(STORES.WATCHLIST, id);
		if (item) {
			item.synced = true;
			await this.put(STORES.WATCHLIST, item);
		}
	}

	async getUnsyncedWatchlistItems(): Promise<WatchlistItem[]> {
		const items = await this.getAll<WatchlistItem>(STORES.WATCHLIST);
		return items.filter((item) => !item.synced);
	}

	// ==================== RECENTLY VIEWED METHODS ====================

	async addToRecentlyViewed(
		item: Omit<RecentlyViewedItem, "id" | "lastViewedAt">
	): Promise<void> {
		const recentItem: RecentlyViewedItem = {
			...item,
			id: `${item.tmdbId}-${item.mediaType}`,
			lastViewedAt: Date.now(),
		};
		await this.put(STORES.RECENTLY_VIEWED, recentItem);
	}

	async getRecentlyViewed(limit = 20): Promise<RecentlyViewedItem[]> {
		const items = await this.getAll<RecentlyViewedItem>(STORES.RECENTLY_VIEWED);
		// Sort by most recently viewed and limit
		return items.sort((a, b) => b.lastViewedAt - a.lastViewedAt).slice(0, limit);
	}

	async updateProgress(
		tmdbId: number,
		mediaType: "movie" | "tv",
		progress: number,
		season?: number,
		episode?: number
	): Promise<void> {
		const id = `${tmdbId}-${mediaType}`;
		const item = await this.get<RecentlyViewedItem>(STORES.RECENTLY_VIEWED, id);
		if (item) {
			item.progress = progress;
			item.lastViewedAt = Date.now();
			if (season !== undefined) item.season = season;
			if (episode !== undefined) item.episode = episode;
			await this.put(STORES.RECENTLY_VIEWED, item);
		}
	}

	async clearRecentlyViewed(): Promise<void> {
		await this.clear(STORES.RECENTLY_VIEWED);
	}

	// ==================== METADATA CACHE METHODS ====================

	async cacheMetadata(
		tmdbId: number,
		mediaType: "movie" | "tv",
		data: any,
		ttlHours = 24
	): Promise<void> {
		const cacheItem: MetadataCache = {
			id: `${tmdbId}-${mediaType}`,
			tmdbId,
			mediaType,
			data,
			cachedAt: Date.now(),
			expiresAt: Date.now() + ttlHours * 60 * 60 * 1000,
		};
		await this.put(STORES.METADATA_CACHE, cacheItem);
	}

	async getCachedMetadata(
		tmdbId: number,
		mediaType: "movie" | "tv"
	): Promise<any | undefined> {
		const id = `${tmdbId}-${mediaType}`;
		const item = await this.get<MetadataCache>(STORES.METADATA_CACHE, id);

		if (!item) return undefined;

		// Check if expired
		if (Date.now() > item.expiresAt) {
			await this.delete(STORES.METADATA_CACHE, id);
			return undefined;
		}

		return item.data;
	}

	async clearExpiredCache(): Promise<void> {
		const items = await this.getAll<MetadataCache>(STORES.METADATA_CACHE);
		const now = Date.now();
		const expired = items.filter((item) => item.expiresAt < now);

		for (const item of expired) {
			await this.delete(STORES.METADATA_CACHE, item.id);
		}
	}

	async clearAllCache(): Promise<void> {
		await this.clear(STORES.METADATA_CACHE);
	}

	// ==================== NOTIFICATION PREFERENCES ====================

	async saveNotificationPreferences(prefs: NotificationPreference): Promise<void> {
		await this.put(STORES.NOTIFICATIONS, prefs);
	}

	async getNotificationPreferences(): Promise<NotificationPreference | undefined> {
		return this.get<NotificationPreference>(STORES.NOTIFICATIONS, "preferences");
	}

	// ==================== UTILITY METHODS ====================

	async getDatabaseSize(): Promise<{ watchlist: number; recentlyViewed: number; cache: number }> {
		const [watchlist, recentlyViewed, cache] = await Promise.all([
			this.getAll(STORES.WATCHLIST),
			this.getAll(STORES.RECENTLY_VIEWED),
			this.getAll(STORES.METADATA_CACHE),
		]);

		return {
			watchlist: watchlist.length,
			recentlyViewed: recentlyViewed.length,
			cache: cache.length,
		};
	}

	async clearAll(): Promise<void> {
		await Promise.all([
			this.clear(STORES.WATCHLIST),
			this.clear(STORES.RECENTLY_VIEWED),
			this.clear(STORES.METADATA_CACHE),
			this.clear(STORES.NOTIFICATIONS),
		]);
	}

	/**
	 * Close database connection
	 */
	close(): void {
		if (this.db) {
			this.db.close();
			this.db = null;
			this.initPromise = null;
		}
	}
}

// Export singleton instance
export const indexedDBService = new IndexedDBService();
