import { prisma } from "app/libs/db";
import { NextResponse } from "next/server";

async function POST(request) {
	const data = await request.json();

	const user = await prisma.user.create({
		data: {
			username: data.username,
			email: data.email,
			password: data.password,
		},
	});

	return NextResponse.json({ message: "Register route", user });
}

export { POST };
