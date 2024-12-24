"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification token has expired or has already been used.",
    Default: "An error occurred. Please try again.",
};

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams ? searchParams.get("error") : null;
    const errorMessage = error ? errorMessages[error] ?? errorMessages.Default : errorMessages.Default;

    return (
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white/10 p-6 shadow-md text-center">
            <h2 className="text-2xl font-bold text-red-500">Authentication Error</h2>
            <p className="text-gray-200">{errorMessage}</p>
            <Link 
                href="/signin"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                Back to Sign In
            </Link>
        </div>
    );
}

export default function ErrorPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <Suspense fallback={
                <div className="w-full max-w-md space-y-8 rounded-lg bg-white/10 p-6 shadow-md text-center">
                    <h2 className="text-2xl font-bold">Loading...</h2>
                </div>
            }>
                <ErrorContent />
            </Suspense>
        </div>
    );
}
