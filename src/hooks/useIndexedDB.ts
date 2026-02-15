/**
 * React Hooks for IndexedDB operations
 */

import { useState, useEffect, useCallback } from "react";
import {
	indexedDBService,
	type WatchlistItem,
	type RecentlyViewedItem,
} from "app/services/indexedDB";

/**
 * Hook to manage watchlist
 */
export function useWatchlist() {
	const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const loadWatchlist = useCallback(async () => {
		try {
			setLoading(true);
			const items = await indexedDBService.getWatchlist();
			setWatchlist(items);
			setError(null);
		} catch (err) {
			setError(err as Error);
			console.error("Error loading watchlist:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadWatchlist();
	}, [loadWatchlist]);

	const addToWatchlist = useCallback(
		async (item: Omit<WatchlistItem, "id" | "addedAt" | "synced">) => {
			try {
				await indexedDBService.addToWatchlist(item);
				await loadWatchlist();
			} catch (err) {
				console.error("Error adding to watchlist:", err);
				throw err;
			}
		},
		[loadWatchlist]
	);

	const removeFromWatchlist = useCallback(
		async (tmdbId: number, mediaType: "movie" | "tv") => {
			try {
				await indexedDBService.removeFromWatchlist(tmdbId, mediaType);
				await loadWatchlist();
			} catch (err) {
				console.error("Error removing from watchlist:", err);
				throw err;
			}
		},
		[loadWatchlist]
	);

	const isInWatchlist = useCallback(async (tmdbId: number, mediaType: "movie" | "tv") => {
		try {
			return await indexedDBService.isInWatchlist(tmdbId, mediaType);
		} catch (err) {
			console.error("Error checking watchlist:", err);
			return false;
		}
	}, []);

	const toggleWatchlist = useCallback(
		async (item: Omit<WatchlistItem, "id" | "addedAt" | "synced">) => {
			const inWatchlist = await isInWatchlist(item.tmdbId, item.mediaType);
			if (inWatchlist) {
				await removeFromWatchlist(item.tmdbId, item.mediaType);
			} else {
				await addToWatchlist(item);
			}
		},
		[addToWatchlist, removeFromWatchlist, isInWatchlist]
	);

	return {
		watchlist,
		loading,
		error,
		addToWatchlist,
		removeFromWatchlist,
		isInWatchlist,
		toggleWatchlist,
		refresh: loadWatchlist,
	};
}

/**
 * Hook to manage recently viewed shows
 */
export function useRecentlyViewed(limit = 20) {
	const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const loadRecentlyViewed = useCallback(async () => {
		try {
			setLoading(true);
			const items = await indexedDBService.getRecentlyViewed(limit);
			setRecentlyViewed(items);
			setError(null);
		} catch (err) {
			setError(err as Error);
			console.error("Error loading recently viewed:", err);
		} finally {
			setLoading(false);
		}
	}, [limit]);

	useEffect(() => {
		loadRecentlyViewed();
	}, [loadRecentlyViewed]);

	const addToRecentlyViewed = useCallback(
		async (item: Omit<RecentlyViewedItem, "id" | "lastViewedAt">) => {
			try {
				await indexedDBService.addToRecentlyViewed(item);
				await loadRecentlyViewed();
			} catch (err) {
				console.error("Error adding to recently viewed:", err);
				throw err;
			}
		},
		[loadRecentlyViewed]
	);

	const updateProgress = useCallback(
		async (
			tmdbId: number,
			mediaType: "movie" | "tv",
			progress: number,
			season?: number,
			episode?: number
		) => {
			try {
				await indexedDBService.updateProgress(tmdbId, mediaType, progress, season, episode);
				await loadRecentlyViewed();
			} catch (err) {
				console.error("Error updating progress:", err);
				throw err;
			}
		},
		[loadRecentlyViewed]
	);

	const clearRecentlyViewed = useCallback(async () => {
		try {
			await indexedDBService.clearRecentlyViewed();
			await loadRecentlyViewed();
		} catch (err) {
			console.error("Error clearing recently viewed:", err);
			throw err;
		}
	}, [loadRecentlyViewed]);

	return {
		recentlyViewed,
		loading,
		error,
		addToRecentlyViewed,
		updateProgress,
		clearRecentlyViewed,
		refresh: loadRecentlyViewed,
	};
}

/**
 * Hook to manage metadata cache
 */
export function useMetadataCache() {
	const getCachedMetadata = useCallback(
		async (tmdbId: number, mediaType: "movie" | "tv") => {
			try {
				return await indexedDBService.getCachedMetadata(tmdbId, mediaType);
			} catch (err) {
				console.error("Error getting cached metadata:", err);
				return undefined;
			}
		},
		[]
	);

	const cacheMetadata = useCallback(
		async (tmdbId: number, mediaType: "movie" | "tv", data: any, ttlHours = 24) => {
			try {
				await indexedDBService.cacheMetadata(tmdbId, mediaType, data, ttlHours);
			} catch (err) {
				console.error("Error caching metadata:", err);
				throw err;
			}
		},
		[]
	);

	const clearExpiredCache = useCallback(async () => {
		try {
			await indexedDBService.clearExpiredCache();
		} catch (err) {
			console.error("Error clearing expired cache:", err);
			throw err;
		}
	}, []);

	const clearAllCache = useCallback(async () => {
		try {
			await indexedDBService.clearAllCache();
		} catch (err) {
			console.error("Error clearing all cache:", err);
			throw err;
		}
	}, []);

	return {
		getCachedMetadata,
		cacheMetadata,
		clearExpiredCache,
		clearAllCache,
	};
}

/**
 * Hook to manage offline storage
 */
export function useOfflineStorage() {
	const [isOnline, setIsOnline] = useState(
		typeof window !== "undefined" ? window.navigator.onLine : true
	);
	const [dbStats, setDbStats] = useState({ watchlist: 0, recentlyViewed: 0, cache: 0 });

	useEffect(() => {
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	const loadStats = useCallback(async () => {
		try {
			const stats = await indexedDBService.getDatabaseSize();
			setDbStats(stats);
		} catch (err) {
			console.error("Error loading database stats:", err);
		}
	}, []);

	useEffect(() => {
		loadStats();
	}, [loadStats]);

	const syncWithBackend = useCallback(async () => {
		if (!isOnline) {
			console.warn("Cannot sync while offline");
			return;
		}

		try {
			const unsyncedItems = await indexedDBService.getUnsyncedWatchlistItems();
			// TODO: Implement backend sync logic
			console.log("Syncing items:", unsyncedItems);
			// After successful sync, mark items as synced
			for (const item of unsyncedItems) {
				await indexedDBService.markWatchlistItemSynced(item.tmdbId, item.mediaType);
			}
		} catch (err) {
			console.error("Error syncing with backend:", err);
			throw err;
		}
	}, [isOnline]);

	const clearAll = useCallback(async () => {
		try {
			await indexedDBService.clearAll();
			await loadStats();
		} catch (err) {
			console.error("Error clearing all data:", err);
			throw err;
		}
	}, [loadStats]);

	return {
		isOnline,
		dbStats,
		syncWithBackend,
		clearAll,
		refreshStats: loadStats,
	};
}
