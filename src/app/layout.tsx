"use client";

import AuthProvider from "@/components/providers/SessionProvider";
import { Footer } from "app/components/shared/Footer";
import { Header } from "app/components/shared/Header";
import { PWAInstallPrompt } from "app/components/shared/PWAInstallPrompt";
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

  console.log("[Layout] ShowHEADER", showHeader, pathname);

  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="5AVDCAjEnF-JVjYdBcUv2UoXux4FSTN7uBYzO9XYxs8"
        />
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Movie NextJS App" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MovieApp" />
        <meta
          name="description"
          content="Your favorite movies and series streaming app"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png" />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icon-512x512.png" color="#000000" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://yourdomain.com" />
        <meta name="twitter:title" content="Movie NextJS App" />
        <meta
          name="twitter:description"
          content="Your favorite movies and series streaming app"
        />
        <meta
          name="twitter:image"
          content="https://yourdomain.com/icon-192x192.png"
        />
        <meta name="twitter:creator" content="@YourHandle" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Movie NextJS App" />
        <meta
          property="og:description"
          content="Your favorite movies and series streaming app"
        />
        <meta property="og:site_name" content="Movie NextJS App" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta
          property="og:image"
          content="https://yourdomain.com/icon-512x512.png"
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

          {/* PWA Install Prompt */}
          <PWAInstallPrompt />
        </AuthProvider>
      </body>
    </html>
  );
}
