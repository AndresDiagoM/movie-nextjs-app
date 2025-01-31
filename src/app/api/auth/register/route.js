import { prisma } from "app/libs/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

async function POST(request) {
	const data = await request.json();

	try {

		// Check if the user already exists
		const userExists = await prisma.user.findUnique({
			where: {
                email: data.email,
            },
		});

		if (userExists) {
            console.log("User already exists");
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

		const user = await prisma.user.create({
			data: {
				username: data.username,
				email: data.email,
				password: await bcrypt.hash(data.password, 10),
			},
		});

		// const { password, ...userWithoutPassword } = user;
		delete user.password;
	
		return NextResponse.json({ message: "Register route", user });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "An error occurred" }, { status: 500 });
	}
}

export { POST };
