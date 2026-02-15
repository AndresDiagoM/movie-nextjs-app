import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession();
		const subscription = await request.json();

		if (!subscription || !subscription.endpoint) {
			return NextResponse.json(
				{ error: "Invalid subscription data" },
				{ status: 400 }
			);
		}

		// Extract keys from subscription
		const { endpoint, keys } = subscription;
		const { p256dh, auth } = keys || {};

		if (!p256dh || !auth) {
			return NextResponse.json(
				{ error: "Missing subscription keys" },
				{ status: 400 }
			);
		}

		// Check if subscription already exists
		const existingSubscription = await prisma.pushSubscription.findUnique({
			where: { endpoint },
		});

		if (existingSubscription) {
			// Update existing subscription
			const updated = await prisma.pushSubscription.update({
				where: { endpoint },
				data: {
					p256dh,
					auth,
					userId: session?.user?.email ?
						(await prisma.user.findUnique({ where: { email: session.user.email } }))?.id :
						undefined,
					enabled: true,
					updatedAt: new Date(),
				},
			});

			return NextResponse.json({
				success: true,
				message: "Subscription updated",
				subscription: updated,
			});
		}

		// Create new subscription
		const newSubscription = await prisma.pushSubscription.create({
			data: {
				endpoint,
				p256dh,
				auth,
				userId: session?.user?.email ?
					(await prisma.user.findUnique({ where: { email: session.user.email } }))?.id :
					undefined,
				enabled: true,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Subscription created",
			subscription: newSubscription,
		});
	} catch (error) {
		console.error("Error subscribing to push notifications:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
