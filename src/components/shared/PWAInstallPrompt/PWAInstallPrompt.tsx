"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const DISMISSED_KEY = "pwa_install_dismissed_at";
const DISMISS_DAYS = 14;

// "Not now" hides the prompt for two weeks, not just until the next page load.
const wasDismissedRecently = () => {
  try {
    const at = Number(localStorage.getItem(DISMISSED_KEY));
    return at > 0 && Date.now() - at < DISMISS_DAYS * 86_400_000;
  } catch {
    return false;
  }
};

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallPrompt(!wasDismissedRecently());
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      // Track successful installation (you can replace with your analytics)
      // gtag('event', 'pwa_install', { method: 'prompt' });

      // Show success message to user
      toast.success("App installed successfully! 🎉");

      // Store installation status
      localStorage.setItem("pwa_installed", "true");
    } else {
      // Track dismissal for analytics
      // gtag('event', 'pwa_install_dismissed', { method: 'prompt' });
      toast("Installation cancelled", {
        icon: "ℹ️",
      });
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {
      // Storage can be blocked; the prompt then only hides until the next load.
    }
    setShowInstallPrompt(false);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-black/90 backdrop-blur-sm border border-gray-700 rounded-lg p-4 z-50 max-w-sm mx-auto">
      <div className="flex items-start space-x-3">
        <div className="flex-1">
          <h3 className="text-white font-medium text-sm">Install App</h3>
          <p className="text-gray-300 text-xs mt-1">
            Add this app to your home screen for a better experience
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
      <div className="flex space-x-2 mt-3">
        <button
          onClick={handleInstallClick}
          className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors flex-1"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition-colors"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
