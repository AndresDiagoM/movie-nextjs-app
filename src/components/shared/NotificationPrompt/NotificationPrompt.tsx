"use client";

import { useEffect, useState, useCallback } from "react";
import { notificationService } from "app/services/notificationService";
import toast from "react-hot-toast";

interface NotificationPromptProps {
	/**
	 * Delay in ms before showing the prompt (default: 5000ms)
	 */
	delay?: number;
	/**
	 * Whether to show the prompt automatically (default: true)
	 */
	autoShow?: boolean;
}

export default function NotificationPrompt({
	delay = 5000,
	autoShow = true,
}: NotificationPromptProps) {
	const [showPrompt, setShowPrompt] = useState(false);
	const [isSupported, setIsSupported] = useState(false);
	const [permission, setPermission] = useState<NotificationPermission>("default");

	useEffect(() => {
		const checkSupport = async () => {
			const supported = notificationService.isSupported();
			setIsSupported(supported);

			if (supported) {
				const status = await notificationService.getPermissionStatus();
				setPermission(status.permission);

				// Only show prompt if permission is default and not already dismissed
				const dismissed = localStorage.getItem("notification_prompt_dismissed");
				if (
					autoShow &&
					status.permission === "default" &&
					!dismissed &&
					!status.subscription
				) {
					setTimeout(() => {
						setShowPrompt(true);
					}, delay);
				}
			}
		};

		checkSupport();
	}, [delay, autoShow]);

	const handleEnable = useCallback(async () => {
		try {
			const permissionResult = await notificationService.requestPermission();
			setPermission(permissionResult);

			if (permissionResult === "granted") {
				toast.success("Notifications enabled! 🔔");
				setShowPrompt(false);
			} else if (permissionResult === "denied") {
				toast.error("Notifications blocked. Enable them in your browser settings.");
				setShowPrompt(false);
				localStorage.setItem("notification_prompt_dismissed", "true");
			}
		} catch (error) {
			console.error("Error enabling notifications:", error);
			toast.error("Failed to enable notifications");
		}
	}, []);

	const handleDismiss = useCallback(() => {
		setShowPrompt(false);
		localStorage.setItem("notification_prompt_dismissed", "true");
	}, []);

	const handleNotNow = useCallback(() => {
		setShowPrompt(false);
		// Don't mark as dismissed, so it can show again later
	}, []);

	if (!isSupported || !showPrompt) {
		return null;
	}

	return (
		<div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-purple-900/95 to-indigo-900/95 backdrop-blur-sm border border-purple-600 rounded-lg p-4 z-50 max-w-md mx-auto shadow-xl">
			<div className="flex items-start space-x-3">
				<div className="flex-shrink-0 text-2xl">🔔</div>
				<div className="flex-1 min-w-0">
					<h3 className="text-white font-semibold text-sm mb-1">
						Stay Updated with New Episodes
					</h3>
					<p className="text-gray-200 text-xs leading-relaxed">
						Get notified when new episodes of your favorite shows are available, and
						receive personalized recommendations.
					</p>
				</div>
				<button
					onClick={handleDismiss}
					className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
					aria-label="Dismiss forever"
					type="button"
				>
					✕
				</button>
			</div>

			<div className="flex space-x-2 mt-4">
				<button
					onClick={handleEnable}
					className="bg-white text-purple-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors flex-1"
					type="button"
				>
					Enable Notifications
				</button>
				<button
					onClick={handleNotNow}
					className="bg-purple-800/50 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700/50 transition-colors"
					type="button"
				>
					Not now
				</button>
			</div>
		</div>
	);
}
