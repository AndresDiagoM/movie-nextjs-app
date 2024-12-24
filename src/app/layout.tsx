"use client";

import { Footer } from "app/components/shared/Footer";
import { Header } from "app/components/shared/Header";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/components/providers/SessionProvider";

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
	const showHeader = pathname !== "/signin";

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
