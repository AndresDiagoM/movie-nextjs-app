"use client";

import React, { useEffect, useState } from "react";

export default function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<div className="w-full h-full min-h-screen overflow-y-auto relative">
			{children}
		</div>
	);
}

