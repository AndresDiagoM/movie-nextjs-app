import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const title = formData.get("title") as string;
		const text = formData.get("text") as string;
		const url = formData.get("url") as string;

		// Log the shared content (you can process it as needed)
		console.log("Shared content received:", { title, text, url });

		// Parse the shared URL to extract movie/series info if it's from TMDB or similar
		// Example: if someone shares a TMDB link, we can extract the ID and redirect to our player

		// For now, redirect to search with the shared text
		const searchQuery = text || title || "";
		const redirectUrl = searchQuery
			? `/search?q=${encodeURIComponent(searchQuery)}&source=share`
			: "/home?source=share";

		// Return a redirect response
		return NextResponse.redirect(new URL(redirectUrl, request.url));
	} catch (error) {
		console.error("Error handling shared content:", error);
		return NextResponse.redirect(new URL("/home?source=share&error=1", request.url));
	}
}
