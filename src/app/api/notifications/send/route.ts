import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import webpush from "web-push";

const prisma = new PrismaClient();

// Configure web-push with VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "";
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:your-email@example.com";

if (vapidPublicKey && vapidPrivateKey) {
	webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession();

		// Only allow authenticated users to send notifications
		// You might want to add admin role check here
		if (!session?.user?.email) {
			return NextResponse.json(
				{ error: "Not authenticated" },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const {
			userId, // Optional: send to specific user
			title,
			message,
			url,
			icon,
			image,
			actions,
			tag,
			requireInteraction,
		} = body;

		if (!title || !message) {
			return NextResponse.json(
				{ error: "Title and message are required" },
				{ status: 400 }
			);
		}

		// Get subscriptions to send to
		let subscriptions;
		if (userId) {
			subscriptions = await prisma.pushSubscription.findMany({
				where: {
					userId,
					enabled: true,
				},
			});
		} else {
			// Send to all active subscriptions (be careful with this!)
			subscriptions = await prisma.pushSubscription.findMany({
				where: {
					enabled: true,
				},
				take: 100, // Limit for safety
			});
		}

		if (subscriptions.length === 0) {
			return NextResponse.json({
				success: true,
				message: "No active subscriptions found",
				sent: 0,
			});
		}

		// Prepare notification payload
		const payload = JSON.stringify({
			title,
			body: message,
			icon: icon || "/icon-192x192.svg",
			badge: "/icon-192x192.svg",
			image,
			url: url || "/home",
			tag: tag || "notification",
			requireInteraction: requireInteraction || false,
			actions: actions || [],
		});

		// Send notifications
		const results = await Promise.allSettled(
			subscriptions.map(async (subscription) => {
				const pushSubscription = {
					endpoint: subscription.endpoint,
					keys: {
						p256dh: subscription.p256dh,
						auth: subscription.auth,
					},
				};

				try {
					await webpush.sendNotification(pushSubscription, payload);
					return { success: true, endpoint: subscription.endpoint };
				} catch (error: any) {
					console.error("Error sending notification:", error);

					// If subscription is invalid, remove it
					if (error.statusCode === 410 || error.statusCode === 404) {
						await prisma.pushSubscription.delete({
							where: { id: subscription.id },
						});
					}

					return { success: false, endpoint: subscription.endpoint, error };
				}
			})
		);

		const successful = results.filter((r) => r.status === "fulfilled").length;
		const failed = results.filter((r) => r.status === "rejected").length;

		return NextResponse.json({
			success: true,
			message: "Notifications sent",
			sent: successful,
			failed,
			total: subscriptions.length,
		});
	} catch (error) {
		console.error("Error sending push notifications:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
