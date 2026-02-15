"use client";

import { useEffect, useState, useCallback } from "react";
import {
	notificationService,
	type NotificationPreferences,
} from "app/services/notificationService";
import toast from "react-hot-toast";

export default function NotificationSettings() {
	const [isSupported, setIsSupported] = useState(false);
	const [permission, setPermission] = useState<NotificationPermission>("default");
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [loading, setLoading] = useState(true);
	const [preferences, setPreferences] = useState<NotificationPreferences>({
		enabled: false,
		newEpisodes: true,
		watchlistUpdates: true,
		recommendations: true,
	});

	const loadSettings = useCallback(async () => {
		setLoading(true);
		try {
			const supported = notificationService.isSupported();
			setIsSupported(supported);

			if (supported) {
				const status = await notificationService.getPermissionStatus();
				setPermission(status.permission);
				setIsSubscribed(!!status.subscription);

				if (status.subscription) {
					const prefs = await notificationService.getPreferences();
					setPreferences(prefs);
				}
			}
		} catch (error) {
			console.error("Error loading notification settings:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadSettings();
	}, [loadSettings]);

	const handleEnableNotifications = async () => {
		try {
			const permissionResult = await notificationService.requestPermission();
			setPermission(permissionResult);

			if (permissionResult === "granted") {
				setIsSubscribed(true);
				setPreferences((prev) => ({ ...prev, enabled: true }));
				toast.success("Notifications enabled! 🔔");
			} else {
				toast.error("Notification permission denied");
			}
		} catch (error) {
			console.error("Error enabling notifications:", error);
			toast.error("Failed to enable notifications");
		}
	};

	const handleDisableNotifications = async () => {
		try {
			const success = await notificationService.unsubscribe();
			if (success) {
				setIsSubscribed(false);
				setPreferences((prev) => ({ ...prev, enabled: false }));
				toast.success("Notifications disabled");
			}
		} catch (error) {
			console.error("Error disabling notifications:", error);
			toast.error("Failed to disable notifications");
		}
	};

	const handleTogglePreference = async (key: keyof NotificationPreferences) => {
		if (key === "enabled") return; // Handle separately

		const newPreferences = {
			...preferences,
			[key]: !preferences[key],
		};

		setPreferences(newPreferences);

		try {
			await notificationService.updatePreferences(newPreferences);
			toast.success("Preferences updated");
		} catch (error) {
			console.error("Error updating preferences:", error);
			toast.error("Failed to update preferences");
			// Revert on error
			setPreferences(preferences);
		}
	};

	const handleTestNotification = async () => {
		try {
			await notificationService.testNotification();
			toast.success("Test notification sent!");
		} catch (error) {
			console.error("Error sending test notification:", error);
			toast.error("Failed to send test notification");
		}
	};

	if (loading) {
		return (
			<div className="bg-gray-900 rounded-lg p-6">
				<div className="animate-pulse space-y-4">
					<div className="h-6 bg-gray-800 rounded w-1/2"></div>
					<div className="h-4 bg-gray-800 rounded w-3/4"></div>
					<div className="h-10 bg-gray-800 rounded"></div>
				</div>
			</div>
		);
	}

	if (!isSupported) {
		return (
			<div className="bg-gray-900 rounded-lg p-6">
				<h3 className="text-white text-lg font-semibold mb-2">Notifications</h3>
				<p className="text-gray-400 text-sm">
					Push notifications are not supported in your browser.
				</p>
			</div>
		);
	}

	return (
		<div className="bg-gray-900 rounded-lg p-6 space-y-6">
			<div>
				<h3 className="text-white text-lg font-semibold mb-2">Push Notifications</h3>
				<p className="text-gray-400 text-sm mb-4">
					Get notified about new episodes, updates, and recommendations.
				</p>
			</div>

			{/* Main toggle */}
			<div className="flex items-center justify-between">
				<div>
					<p className="text-white font-medium">Enable Notifications</p>
					<p className="text-gray-400 text-sm">
						{permission === "granted"
							? isSubscribed
								? "Notifications are enabled"
								: "Click to subscribe"
							: permission === "denied"
								? "Notifications blocked by browser"
								: "Click to enable"}
					</p>
				</div>
				{permission === "granted" ? (
					isSubscribed ? (
						<button
							onClick={handleDisableNotifications}
							className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
							type="button"
						>
							Disable
						</button>
					) : (
						<button
							onClick={handleEnableNotifications}
							className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
							type="button"
						>
							Subscribe
						</button>
					)
				) : permission === "denied" ? (
					<span className="text-gray-500 text-sm">Check browser settings</span>
				) : (
					<button
						onClick={handleEnableNotifications}
						className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
						type="button"
					>
						Enable
					</button>
				)}
			</div>

			{/* Preference toggles */}
			{isSubscribed && (
				<>
					<div className="border-t border-gray-800 pt-4 space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-white font-medium">New Episodes</p>
								<p className="text-gray-400 text-sm">
									Get notified when new episodes are available
								</p>
							</div>
							<button
								onClick={() => handleTogglePreference("newEpisodes")}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
									preferences.newEpisodes ? "bg-purple-600" : "bg-gray-700"
								}`}
								type="button"
								aria-label="Toggle new episodes notifications"
							>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										preferences.newEpisodes ? "translate-x-6" : "translate-x-1"
									}`}
								/>
							</button>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<p className="text-white font-medium">Watchlist Updates</p>
								<p className="text-gray-400 text-sm">
									Get notified about updates to shows in your watchlist
								</p>
							</div>
							<button
								onClick={() => handleTogglePreference("watchlistUpdates")}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
									preferences.watchlistUpdates ? "bg-purple-600" : "bg-gray-700"
								}`}
								type="button"
								aria-label="Toggle watchlist updates notifications"
							>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										preferences.watchlistUpdates ? "translate-x-6" : "translate-x-1"
									}`}
								/>
							</button>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<p className="text-white font-medium">Recommendations</p>
								<p className="text-gray-400 text-sm">
									Get weekly personalized recommendations
								</p>
							</div>
							<button
								onClick={() => handleTogglePreference("recommendations")}
								className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
									preferences.recommendations ? "bg-purple-600" : "bg-gray-700"
								}`}
								type="button"
								aria-label="Toggle recommendations notifications"
							>
								<span
									className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
										preferences.recommendations ? "translate-x-6" : "translate-x-1"
									}`}
								/>
							</button>
						</div>
					</div>

					{/* Test notification button */}
					<div className="border-t border-gray-800 pt-4">
						<button
							onClick={handleTestNotification}
							className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full"
							type="button"
						>
							Send Test Notification
						</button>
					</div>
				</>
			)}
		</div>
	);
}
