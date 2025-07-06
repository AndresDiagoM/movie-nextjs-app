import { prisma } from "app/libs/db";
import { NextResponse } from "next/server";
// import { MediaType } from "app/types";

async function POST(request) {
  const data = await request.json();

  // Get the type from query parameters
  const { searchParams } = new URL(request.url);
  const entryType = searchParams.get("type") || "MOVIE"; // Default to MOVIE if not specified

  // console.log("[Movies] Adding entry to list", data, "Type:", entryType);

  try {
    // First, ensure the user exists in our database
    let user = await prisma.user.findUnique({
      where: { email: data.user.email },
    });

    // If user doesn't exist, create them (for OAuth users)
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: data.user.email,
          name: data.user.name || "",
          password: "", // OAuth users don't have passwords
        },
      });
      console.log(`[Movies] Created new user: ${user.email}`);
    }

    // Check if the user already has the entry in their list
    const entryExists = await prisma.watchEntry.findFirst({
      where: {
        user: {
          email: data.user.email,
        },
        tmdbId: data.show.id,
        type: entryType,
      },
    });

    if (entryExists) {
      console.log(`[API-SHOWS] ${entryType} already exists`);
      return NextResponse.json(
        { message: `${entryType} already exists` },
        { status: 409 }
      );
    }

    // Create the show entry in the database
    const show = await prisma.watchEntry.create({
      data: {
        user: {
          connect: {
            email: data.user.email,
          },
        },
        tmdbId: data.show.id,
        title: data.show.title || data.show.name, // Handle both movie titles and TV show names
        type: entryType,
      },
    });

    // console.log("[Movies] Entry Show created", show);
    return NextResponse.json({
      message: `${entryType} added successfully`,
      show,
    });
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
