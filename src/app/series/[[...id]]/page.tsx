import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Series",
};

interface SeriesProps {
	params: { [key: string]: string };
	searchParams: { [key: string]: string };
}

const SeriesId: React.FC<SeriesProps> = ({ params, searchParams }) => {
	return (
		<div>
			<h2>Series ids</h2>
			<p>Params: {JSON.stringify(params)}</p>
			<p>Search Params: {JSON.stringify(searchParams)}</p>
		</div>
	);
};

export default SeriesId;
