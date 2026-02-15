/**
 * Push Notification Service
 * Handles push notification subscriptions and permissions
 */

export interface NotificationPermissionStatus {
	supported: boolean;
	permission: NotificationPermission;
	subscription: PushSubscription | null;
}

export interface NotificationPreferences {
	enabled: boolean;
	newEpisodes: boolean;
	watchlistUpdates: boolean;
	recommendations: boolean;
}

class NotificationService {
	private vapidPublicKey =
		process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
		""; // Set this in .env

	/**
	 * Check if push notifications are supported
	 */
	isSupported(): boolean {
		return (
			typeof window !== "undefined" &&
			"serviceWorker" in navigator &&
			"PushManager" in window &&
			"Notification" in window
		);
	}

	/**
	 * Get current notification permission status
	 */
	async getPermissionStatus(): Promise<NotificationPermissionStatus> {
		if (!this.isSupported()) {
			return {
				supported: false,
				permission: "denied",
				subscription: null,
			};
		}

		try {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.getSubscription();

			return {
				supported: true,
				permission: Notification.permission,
				subscription,
			};
		} catch (error) {
			console.error("Error getting permission status:", error);
			return {
				supported: true,
				permission: Notification.permission,
				subscription: null,
			};
		}
	}

	/**
	 * Request notification permission
	 */
	async requestPermission(): Promise<NotificationPermission> {
		if (!this.isSupported()) {
			throw new Error("Push notifications are not supported");
		}

		try {
			const permission = await Notification.requestPermission();
			console.log("Notification permission:", permission);

			if (permission === "granted") {
				// Subscribe to push notifications
				await this.subscribe();
			}

			return permission;
		} catch (error) {
			console.error("Error requesting notification permission:", error);
			throw error;
		}
	}

	/**
	 * Subscribe to push notifications
	 */
	async subscribe(): Promise<PushSubscription> {
		if (!this.isSupported()) {
			throw new Error("Push notifications are not supported");
		}

		if (Notification.permission !== "granted") {
			throw new Error("Notification permission not granted");
		}

		try {
			const registration = await navigator.serviceWorker.ready;

			// Check if already subscribed
			let subscription = await registration.pushManager.getSubscription();

			if (!subscription) {
				// Subscribe to push notifications
				subscription = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
				});

				console.log("Push notification subscription:", subscription);

				// Send subscription to backend
				await this.sendSubscriptionToBackend(subscription);
			}

			return subscription;
		} catch (error) {
			console.error("Error subscribing to push notifications:", error);
			throw error;
		}
	}

	/**
	 * Unsubscribe from push notifications
	 */
	async unsubscribe(): Promise<boolean> {
		if (!this.isSupported()) {
			return false;
		}

		try {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.getSubscription();

			if (subscription) {
				const successful = await subscription.unsubscribe();

				if (successful) {
					// Remove subscription from backend
					await this.removeSubscriptionFromBackend(subscription);
				}

				return successful;
			}

			return false;
		} catch (error) {
			console.error("Error unsubscribing from push notifications:", error);
			throw error;
		}
	}

	/**
	 * Send subscription to backend
	 */
	private async sendSubscriptionToBackend(subscription: PushSubscription): Promise<void> {
		try {
			const response = await fetch("/api/notifications/subscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(subscription),
			});

			if (!response.ok) {
				throw new Error("Failed to send subscription to backend");
			}

			console.log("Subscription sent to backend successfully");
		} catch (error) {
			console.error("Error sending subscription to backend:", error);
			throw error;
		}
	}

	/**
	 * Remove subscription from backend
	 */
	private async removeSubscriptionFromBackend(subscription: PushSubscription): Promise<void> {
		try {
			const response = await fetch("/api/notifications/unsubscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(subscription),
			});

			if (!response.ok) {
				throw new Error("Failed to remove subscription from backend");
			}

			console.log("Subscription removed from backend successfully");
		} catch (error) {
			console.error("Error removing subscription from backend:", error);
			throw error;
		}
	}

	/**
	 * Update notification preferences
	 */
	async updatePreferences(preferences: NotificationPreferences): Promise<void> {
		try {
			const response = await fetch("/api/notifications/preferences", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(preferences),
			});

			if (!response.ok) {
				throw new Error("Failed to update notification preferences");
			}

			console.log("Notification preferences updated successfully");
		} catch (error) {
			console.error("Error updating notification preferences:", error);
			throw error;
		}
	}

	/**
	 * Get notification preferences
	 */
	async getPreferences(): Promise<NotificationPreferences> {
		try {
			const response = await fetch("/api/notifications/preferences");

			if (!response.ok) {
				throw new Error("Failed to get notification preferences");
			}

			return await response.json();
		} catch (error) {
			console.error("Error getting notification preferences:", error);
			// Return default preferences
			return {
				enabled: false,
				newEpisodes: true,
				watchlistUpdates: true,
				recommendations: true,
			};
		}
	}

	/**
	 * Test notification
	 */
	async testNotification(): Promise<void> {
		if (!this.isSupported()) {
			throw new Error("Notifications are not supported");
		}

		if (Notification.permission !== "granted") {
			throw new Error("Notification permission not granted");
		}

		try {
			const registration = await navigator.serviceWorker.ready;

			await registration.showNotification("Movie App Test", {
				body: "Push notifications are working! 🎉",
				icon: "/icon-192x192.svg",
				badge: "/icon-192x192.svg",
				tag: "test",
				requireInteraction: false,
				actions: [
					{
						action: "view",
						title: "View",
					},
					{
						action: "dismiss",
						title: "Dismiss",
					},
				],
			});
		} catch (error) {
			console.error("Error showing test notification:", error);
			throw error;
		}
	}

	/**
	 * Convert VAPID key from base64 to Uint8Array
	 */
	private urlBase64ToUint8Array(base64String: string): Uint8Array {
		const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
		const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

		const rawData = window.atob(base64);
		const outputArray = new Uint8Array(rawData.length);

		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i);
		}

		return outputArray;
	}

	/**
	 * Request background sync
	 */
	async requestSync(tag: string): Promise<void> {
		if (!this.isSupported()) {
			return;
		}

		try {
			const registration = await navigator.serviceWorker.ready;

			if ("sync" in registration) {
				await (registration as any).sync.register(tag);
				console.log("Background sync registered:", tag);
			}
		} catch (error) {
			console.error("Error requesting background sync:", error);
		}
	}
}

export const notificationService = new NotificationService();
