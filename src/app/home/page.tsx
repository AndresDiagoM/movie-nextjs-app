import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
	title: "Home",
};

const Home: React.FC = () => {
	return (
		<div className="pt-5">
			<h2>Homepage of Sudo-flix</h2>
		</div>
	);
};

export default Home;
