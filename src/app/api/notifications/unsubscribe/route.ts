import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
	try {
		const subscription = await request.json();

		if (!subscription || !subscription.endpoint) {
			return NextResponse.json(
				{ error: "Invalid subscription data" },
				{ status: 400 }
			);
		}

		const { endpoint } = subscription;

		// Delete subscription from database
		await prisma.pushSubscription.delete({
			where: { endpoint },
		});

		return NextResponse.json({
			success: true,
			message: "Subscription removed",
		});
	} catch (error: any) {
		console.error("Error unsubscribing from push notifications:", error);

		// If subscription not found, return success anyway
		if (error?.code === "P2025") {
			return NextResponse.json({
				success: true,
				message: "Subscription not found",
			});
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
