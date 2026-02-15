/**
 * Custom Service Worker for Push Notifications
 * This file will be merged with the auto-generated service worker by next-pwa
 */

// Listen for push events
self.addEventListener("push", (event) => {
	console.log("[Service Worker] Push received:", event);

	let notificationData = {
		title: "Movie App",
		body: "You have a new notification",
		icon: "/icon-192x192.svg",
		badge: "/icon-192x192.svg",
		data: {
			url: "/home",
		},
	};

	if (event.data) {
		try {
			const data = event.data.json();
			notificationData = {
				title: data.title || notificationData.title,
				body: data.body || notificationData.body,
				icon: data.icon || notificationData.icon,
				badge: data.badge || notificationData.badge,
				image: data.image,
				data: {
					url: data.url || notificationData.data.url,
					tmdbId: data.tmdbId,
					mediaType: data.mediaType,
					action: data.action,
				},
				actions: data.actions || [],
				tag: data.tag || "default",
				requireInteraction: data.requireInteraction || false,
			};
		} catch (err) {
			console.error("[Service Worker] Error parsing push data:", err);
		}
	}

	const promiseChain = self.registration.showNotification(
		notificationData.title,
		notificationData
	);

	event.waitUntil(promiseChain);
});

// Listen for notification clicks
self.addEventListener("notificationclick", (event) => {
	console.log("[Service Worker] Notification clicked:", event);

	event.notification.close();

	const urlToOpen = event.notification.data?.url || "/home";

	// Handle action buttons
	if (event.action) {
		console.log("[Service Worker] Action clicked:", event.action);

		switch (event.action) {
			case "view":
				// Open the specific show/movie page
				const { tmdbId, mediaType } = event.notification.data || {};
				if (tmdbId && mediaType) {
					const showUrl = `/${mediaType === "tv" ? "series" : "movies"}/${tmdbId}`;
					event.waitUntil(clients.openWindow(showUrl));
				} else {
					event.waitUntil(clients.openWindow(urlToOpen));
				}
				break;

			case "dismiss":
				// Just close the notification (already done above)
				break;

			case "watchlist":
				// Open watchlist page
				event.waitUntil(clients.openWindow("/home#watchlist"));
				break;

			default:
				event.waitUntil(clients.openWindow(urlToOpen));
		}
		return;
	}

	// Default click action - open the notification URL
	event.waitUntil(
		clients
			.matchAll({ type: "window", includeUncontrolled: true })
			.then((clientList) => {
				// Check if there's already a window/tab open
				for (const client of clientList) {
					if (client.url === urlToOpen && "focus" in client) {
						return client.focus();
					}
				}
				// If no window is open, open a new one
				if (clients.openWindow) {
					return clients.openWindow(urlToOpen);
				}
			})
	);
});

// Listen for subscription changes
self.addEventListener("pushsubscriptionchange", (event) => {
	console.log("[Service Worker] Push subscription changed:", event);

	event.waitUntil(
		self.registration.pushManager
			.subscribe(event.oldSubscription.options)
			.then((subscription) => {
				console.log("[Service Worker] Subscribed after subscription change:", subscription);

				// Send new subscription to backend
				return fetch("/api/notifications/subscribe", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(subscription),
				});
			})
			.catch((err) => {
				console.error("[Service Worker] Error re-subscribing:", err);
			})
	);
});

// Background sync for offline actions
self.addEventListener("sync", (event) => {
	console.log("[Service Worker] Background sync:", event.tag);

	if (event.tag === "sync-watchlist") {
		event.waitUntil(syncWatchlist());
	}
});

async function syncWatchlist() {
	try {
		// Open IndexedDB and get unsynced items
		const db = await openDatabase();
		const unsyncedItems = await getUnsyncedWatchlistItems(db);

		// Sync with backend
		for (const item of unsyncedItems) {
			await fetch("/api/watchlist", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(item),
			});

			// Mark as synced in IndexedDB
			await markItemSynced(db, item.id);
		}

		console.log("[Service Worker] Watchlist synced successfully");
	} catch (err) {
		console.error("[Service Worker] Error syncing watchlist:", err);
		throw err;
	}
}

function openDatabase() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open("MovieAppDB", 1);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

function getUnsyncedWatchlistItems(db) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["watchlist"], "readonly");
		const store = transaction.objectStore("watchlist");
		const index = store.index("synced");
		const request = index.getAll(false);

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

function markItemSynced(db, itemId) {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["watchlist"], "readwrite");
		const store = transaction.objectStore("watchlist");
		const getRequest = store.get(itemId);

		getRequest.onsuccess = () => {
			const item = getRequest.result;
			if (item) {
				item.synced = true;
				const putRequest = store.put(item);
				putRequest.onsuccess = () => resolve();
				putRequest.onerror = () => reject(putRequest.error);
			} else {
				resolve();
			}
		};

		getRequest.onerror = () => reject(getRequest.error);
	});
}
