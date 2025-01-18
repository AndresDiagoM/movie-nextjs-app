"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function RegisterContent() {
	const { status } = useSession();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	// Callback URL, if any
	const searchParams = useSearchParams();
	const callbackUrl = searchParams?.get("callbackUrl") || "/";
	// Form fields
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	// console.log("errors", errors);

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

	const handleRegisterSubmit = handleSubmit(async (data) => {
		try {
			setLoading(true);
			setError("");

			if (data.password !== data.confirmPassword) {
				setError("Passwords do not match.");
				setLoading(false);
				return;
			}

			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await res.json();
			console.log("result", result);

			// Redirect user to the callback URL
			router.push(callbackUrl);
		} catch (error) {
			setError("An error occurred. Please try again later.");
			console.error(error);
		} finally {
			setLoading(false);
		}
	});

	return (
		<div className="w-full max-w-md space-y-8 rounded-lg bg-white/10 p-6 shadow-md">
			<h2 className="text-center text-3xl font-bold tracking-tight">
				Create your account
			</h2>

			{error && (
				<div className="rounded-md bg-red-50 p-4 text-red-500">{error}</div>
			)}

			<form onSubmit={handleRegisterSubmit} className="mt-8 space-y-6">
				<div className="space-y-4 rounded-md shadow-sm">
					<div>
						<label htmlFor="username" className="sr-only">
							Username
						</label>
						<input
							type="text"
							className="relative block w-full rounded-lg border-0 p-2 text-gray-900"
							placeholder="Username"
							{...register("username", {
								required: {
									value: true,
									message: "Enter a valid username.",
								},
							})}
						/>
						{errors.username && (
							<span className="text-red-500 text-sm">
								{typeof errors.username?.message === "string"
									? errors.username.message
									: "This field is required."}
							</span>
						)}
					</div>

					<div>
						<label htmlFor="email" className="sr-only">
							Email address
						</label>
						<input
							type="email"
							className="relative block w-full rounded-lg border-0 p-2 text-gray-900"
							placeholder="Email address"
							{...register("email", {
								required: {
									value: true,
									message: "Enter a valid email address.",
								},
							})}
						/>
						{errors.email && (
							<span className="text-red-500 text-sm">
								{typeof errors.email?.message === "string"
									? errors.email.message
									: "This field is required."}
							</span>
						)}
					</div>

					<div>
						<label htmlFor="password" className="sr-only">
							Password
						</label>
						<input
							type="password"
							className="relative block w-full rounded-lg border-0 p-2 text-gray-900"
							placeholder="Password"
							{...register("password", {
								required: {
									value: true,
									message: "Enter a valid password.",
								},
							})}
						/>
						{errors.password && (
							<span className="text-red-500 text-sm">
								{typeof errors.password?.message === "string"
									? errors.password.message
									: "This field is required."}
							</span>
						)}
					</div>
					<div>
						<label htmlFor="confirm-password" className="sr-only">
							Confirm Password
						</label>
						<input
							type="password"
							className="relative block w-full rounded-lg border-0 p-2 text-gray-900"
							placeholder="Confirm Password"
							{...register("confirmPassword", {
								required: {
									value: true,
									message: "Enter a valid password.",
								},
							})}
						/>
						{errors.confirmPassword && (
							<span className="text-red-500 text-sm">
								{typeof errors.confirmPassword?.message === "string"
									? errors.confirmPassword.message
									: "This field is required."}
							</span>
						)}
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? "Registering..." : "Register"}
				</button>
			</form>
		</div>
	);
}

export default function Register() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center py-2">
			<Suspense
				fallback={
					<div className="w-full max-w-md space-y-8 rounded-lg bg-white/10 p-6 shadow-md text-center">
						<h2 className="text-2xl font-bold">Loading...</h2>
					</div>
				}
			>
				<RegisterContent />
			</Suspense>
		</div>
	);
}
