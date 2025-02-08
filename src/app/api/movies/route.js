import { prisma } from "app/libs/db";
import { NextResponse } from "next/server";
// import { MediaType } from "app/types";

async function POST(request) {
	const data = await request.json();
	// console.log("[Movies] Adding movie to list", data);

	try {
		// Check if the user already has the movie in their list
		const movieExists = await prisma.WatchEntry.findFirst({
			where: {
				user: {
					email: data.user.email,
				},
				tmdbId: data.show.id,
				type: "MOVIE",
			},
		});

		if (movieExists) {
			console.log("Movie already exists");
			return NextResponse.json(
				{ message: "Movie already exists" },
				{ status: 409 }
			);
		}

		// Create the show entry in the database
		const show = await prisma.WatchEntry.create({
			data: {
				user: {
					connect: {
						email: data.user.email,
					},
				},
				tmdbId: data.show.id,
				title: data.show.title,
				type: "MOVIE",
			},
		});

		// console.log("[Movies] Entry Show created", show);
		return NextResponse.json({ message: "User created", show });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "An error occurred" }, { status: 500 });
	}
}

async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const email = searchParams.get("email");

		const movies = await prisma.watchEntry.findMany({
			where: {
				user: {
					email,
				},
				type: "MOVIE",
			},
		});

		let movieTmdbIds = movies.map((movie) => movie.tmdbId);
		console.log("[API-Movies] Movies found", movieTmdbIds);
		return NextResponse.json({ message: "Entries found.", movieTmdbIds });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ message: "An error occurred" }, { status: 500 });
	}
}

export { GET, POST };
