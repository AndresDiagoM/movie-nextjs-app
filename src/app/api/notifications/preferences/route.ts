import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession();

		if (!session?.user?.email) {
			return NextResponse.json(
				{ error: "Not authenticated" },
				{ status: 401 }
			);
		}

		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: {
				pushSubscriptions: {
					take: 1,
					orderBy: { updatedAt: "desc" },
				},
			},
		});

		if (!user || !user.pushSubscriptions.length) {
			return NextResponse.json({
				enabled: false,
				newEpisodes: true,
				watchlistUpdates: true,
				recommendations: true,
			});
		}

		const subscription = user.pushSubscriptions[0];

		return NextResponse.json({
			enabled: subscription.enabled,
			newEpisodes: subscription.newEpisodes,
			watchlistUpdates: subscription.watchlistUpdates,
			recommendations: subscription.recommendations,
		});
	} catch (error) {
		console.error("Error getting notification preferences:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession();

		if (!session?.user?.email) {
			return NextResponse.json(
				{ error: "Not authenticated" },
				{ status: 401 }
			);
		}

		const preferences = await request.json();
		const { enabled, newEpisodes, watchlistUpdates, recommendations } = preferences;

		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		// Update all subscriptions for this user
		await prisma.pushSubscription.updateMany({
			where: { userId: user.id },
			data: {
				enabled: enabled ?? true,
				newEpisodes: newEpisodes ?? true,
				watchlistUpdates: watchlistUpdates ?? true,
				recommendations: recommendations ?? true,
				updatedAt: new Date(),
			},
		});

		return NextResponse.json({
			success: true,
			message: "Preferences updated",
		});
	} catch (error) {
		console.error("Error updating notification preferences:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
