"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SignInContent() {
	const { status } = useSession();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const searchParams = useSearchParams();
	const callbackUrl = searchParams?.get("callbackUrl") || "/";
	const signInError = searchParams?.get("error"); // Get the error from search params

	useEffect(() => {
		if (status === "authenticated") {
			router.push("/");
		}
	}, [status, router]);

	if (status === "loading" || status === "authenticated") {
		return (
			<div className="w-full max-w-md space-y-8 rounded-lg bg-white/10 p-6 shadow-md text-center">
				<h2 className="text-2xl font-bold">Loading...</h2>
			</div>
		);
	}

	const handleCredentialsSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			setError("");

			const result = await signIn("credentials", {
				email,
				password,
				redirect: false, // Prevent automatic redirect
				callbackUrl: callbackUrl,
			});

			if (result?.error) {
				// Redirect to the error page with the error message
				setError(result.error);
				router.push(`/auth/error?error=${result.error}`);
			} else {
				// If sign-in is successful, redirect to the callback URL
				router.push(callbackUrl);
			}
		} catch (error) {
			setError("An error occurred. Please try again later.");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleOAuthSignIn = (provider: "google" | "github") => {
		try {
			setLoading(true);
			setError("");
			signIn(provider, { callbackUrl });
		} catch (error) {
			setError(`Error signing in with ${provider}`);
			setLoading(false);
			console.error(error);
		}
	};

	return (
		<div className="w-full max-w-md space-y-8 rounded-lg bg-white/10 p-6 shadow-md">
			<h2 className="text-center text-3xl font-bold tracking-tight">
				Sign in to your account
			</h2>

			{error && (
				<div className="rounded-md bg-red-50 p-4 text-red-500">{error}</div>
			)}

			<div className="space-y-4">
				<button
					onClick={() => handleOAuthSignIn("google")}
					disabled={loading}
					className="flex w-full justify-center gap-3 rounded-lg bg-white px-4 py-2 text-black hover:bg-gray-200 disabled:opacity-50"
				>
					<Image
						src="https://www.google.com/favicon.ico"
						alt="Google"
						width={24}
						height={24}
						unoptimized
					/>
					Sign in with Google
				</button>

				<button
					onClick={() => handleOAuthSignIn("github")}
					disabled={loading}
					className="flex w-full justify-center gap-3 rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
				>
					<Image
						src="https://github.com/favicon.ico"
						alt="GitHub"
						width={24}
						height={24}
						unoptimized
					/>
					Sign in with GitHub
				</button>
			</div>

			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-gray-300"></div>
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="bg-[#141414] px-2 text-gray-300">
						Or continue with
					</span>
				</div>
			</div>

			<form onSubmit={handleCredentialsSubmit} className="mt-8 space-y-6">
				<div className="space-y-4 rounded-md shadow-sm">
					<div>
						<label htmlFor="email" className="sr-only">
							Email address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							className="relative block w-full rounded-lg border-0 p-2 text-gray-900"
							placeholder="Email address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="password" className="sr-only">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							className="relative block w-full rounded-lg border-0 p-2 text-gray-900"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? "Signing in..." : "Sign in with Email"}
				</button>
			</form>
			{signInError && (
				<div className="rounded-md bg-red-50 p-4 text-red-500">
					{signInError}
				</div>
			)}
		</div>
	);
}

export default function SignIn() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center py-2">
			<Suspense
				fallback={
					<div className="w-full max-w-md space-y-8 rounded-lg bg-white/10 p-6 shadow-md text-center">
						<h2 className="text-2xl font-bold">Loading...</h2>
					</div>
				}
			>
				<SignInContent />
			</Suspense>
		</div>
	);
}
