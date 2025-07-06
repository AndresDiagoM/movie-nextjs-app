"use client";

import AuthProvider from "@/components/providers/SessionProvider";
import { Footer } from "app/components/shared/Footer";
import { Header } from "app/components/shared/Header";
import localFont from "next/font/local";
import { usePathname } from "next/navigation";
import "./globals.css";

// Fonts
const geistSans = localFont({
	src: "../fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "../fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	const showHeader =
		pathname !== "/auth/signin" &&
		pathname !== "/auth/register" &&
		pathname !== "/auth/error";

	console.log("ShowHEADER", showHeader, pathname);

	return (
		<html lang="en">
			<head>
				<meta
					name="google-site-verification"
					content="5AVDCAjEnF-JVjYdBcUv2UoXux4FSTN7uBYzO9XYxs8"
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
			>
				<AuthProvider>
					{showHeader && <Header />}

					{/* Main content */}
					<main className="flex-grow">{children}</main>

					{/* Footer */}
					<Footer />
				</AuthProvider>
			</body>
		</html>
	);
}
