import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
	title: "Series",
};

interface SeriesProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ mediaType: string }>;
}

async function SeriesId({ params, searchParams }: SeriesProps) {
	const session = await getServerSession();

	if (!session) {
		redirect("/api/auth/signin");
	}

	return (
		<div className="pt-20">
			<h2>Series ids</h2>
			<p>Params: {JSON.stringify(params)}</p>
			<p>Search Params: {JSON.stringify(searchParams)}</p>
		</div>
	);
}

export default SeriesId;
