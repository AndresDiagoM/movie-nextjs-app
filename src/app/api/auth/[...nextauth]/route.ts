/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { env } from "app/env.mjs";
import { prisma } from "app/libs/db";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
	// Configure one or more authentication providers
	providers: [
		GithubProvider({
			clientId: env.GITHUB_ID,
			clientSecret: env.GITHUB_SECRET,
		}),
		GoogleProvider({
			clientId: env.GOOGLE_ID,
			clientSecret: env.GOOGLE_SECRET,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "text",
					placeholder: "jsmith@example.com",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});
				// console.log("User", user);
				if (
					user &&
					(await bcrypt.compare(credentials.password, user.password))
				) {
					return { id: user.id, email: user.email, name: user.name };
				}

				// For demo purposes:
				if (
					credentials.email === "demo@example.com" &&
					credentials.password === "demo"
				) {
					return { id: "1", name: "Demo User", email: "demo@example.com" };
				}

				return null;
			},
		}),
		// Providers.Email({
		//   server: process.env.EMAIL_SERVER,
		//   from: process.env.EMAIL_FROM,
		// }),
		// ...add more providers here
	],
	// A database is optional, but required to persist accounts in a database
	// database: process.env.DATABASE_URL,
	// The secret should be set to a reasonably long random string
	secret: process.env.SECRET,

	// A list of pages to exclude from the automatic session callback
	pages: {
		signIn: "/signin",
		error: "/error", // Custom error page
	},
	// Comment the pages key to use the default page generated by NextAuth.js, in http://localhost:3000/api/auth/signin
	// or use pages: { signIn: "/signin" } to specify a custom page with your custom form

	callbacks: {
		async signIn() {
			//{ user, account, profile, email, credentials }
			try {
				// Add any custom sign-in validation here
				return true;
			} catch (error) {
				console.error("Sign-in error:", error);
				return false;
			}
		},
		async jwt({
			token,
			user,
			account,
		}: {
			token: any;
			user?: any;
			account?: any;
		}) {
			try {
				// Add any custom JWT handling here
				return token;
			} catch (error) {
				console.error("JWT error:", error);
				return token;
			}
		},
		// async redirect(url, baseUrl) { return baseUrl },
		// async session(session, user) { return session },
		// async jwt(token, user, account, profile, isNewUser) { return token }
		async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
			// Allows relative callback URLs
			if (url.startsWith("/")) return `${baseUrl}${url}`;
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url;
			return baseUrl;
		},
	},
	events: {
		signIn({
			user,
			account,
			isNewUser,
		}: {
			user: any;
			account: any;
			isNewUser?: any;
		}) {
			console.log("[NextAuth] Signed in", { user, account, isNewUser });
		},
		signOut({ token, session }: { token: any; session: any }) {
			console.log("[NextAuth] Signed out", { token, session });
		},
		createUser({ user }: { user: any }) {
			console.log("[NextAuth] User created", { user });
		},
		linkAccount({
			user,
			account,
			profile,
		}: {
			user: any;
			account: any;
			profile: any;
		}) {
			console.log("[NextAuth] Account linked", { user, account, profile });
		},
		session({ session, token }: { session: any; token: any }) {
			console.log("[NextAuth] Session active", { session, token });
		},
	},

	// Enable debug messages in the console if you are having problems
	debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
