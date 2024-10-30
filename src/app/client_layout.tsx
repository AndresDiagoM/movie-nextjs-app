"use client";

import localFont from "next/font/local";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSignInAlt } from "react-icons/fa";
import "./globals.css";

// Fonts
const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const isHomePage = pathname === "/home" || pathname === "/" ? true : false;

	return (
		<div
			className={`relative min-h-screen w-full flex flex-col bg-cover bg-center ${
				geistSans.variable
			} ${geistMono.variable} antialiased ${
				isHomePage ? "bg-cover bg-center" : ""
			}`}
			style={isHomePage ? { backgroundImage: 'url("welcome.jpg")' } : {}}
		>
			{/* Overlay for darker background */}
			<div className="absolute inset-0 bg-black opacity-70"></div>

			{/* Navigation */}
			<header className="relative z-10 text-center text-white">
				<nav
					className={`flex justify-between items-center p-6 w-full max-w-6xl mx-auto`}
				>
					<Link href="/">
						<h1 className="text-xl font-bold cursor-pointer">Sudo-Flix</h1>
					</Link>
					<ul className="flex space-x-6">
						<li>
							<Link href="/home" className="hover:underline">
								Home
							</Link>
						</li>
						<li>
							<Link href="/movies" className="hover:underline">
								Movies
							</Link>
						</li>
						<li>
							<Link href="/series" className="hover:underline">
								Series
							</Link>
						</li>
						<li>
							<Link href="/trending" className="hover:underline">
								Trending
							</Link>
						</li>
					</ul>
					<div className="flex space-x-4 items-center">
						<a
							href="#blocks"
							className="flex ml-4 bg-white text-black py-2 px-4 rounded-full hover:bg-gray-200"
						>
							Login
							<FaSignInAlt className="ml-2 w-full py-1" size="24px" />
						</a>
					</div>
				</nav>
			</header>

			{/* Main Content */}
			<main className="relative z-10 flex-grow flex flex-col">{children}</main>
		</div>
	);
}
