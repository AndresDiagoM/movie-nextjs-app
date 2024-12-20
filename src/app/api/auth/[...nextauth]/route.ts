import { env } from "app/env.mjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
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

				// Add your authentication logic here
				// For example:
				// const user = await prisma.user.findUnique({ where: { email: credentials.email }})
				// if (user && await bcrypt.compare(credentials.password, user.password)) {
				//     return { id: user.id, email: user.email, name: user.name }
				// }

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
		signIn: "/auth/signin",
		signOut: "/auth/signout",
		error: "/auth/error", // Error code passed in query string as ?error=
		verifyRequest: "/auth/verify-request", // (used for check email message)
		newUser: undefined, // If set, new users will be directed here on first sign in
	},
	callbacks: {
		// async signIn(user, account, profile) { return true },
		// async redirect(url, baseUrl) { return baseUrl },
		// async session(session, user) { return session },
		// async jwt(token, user, account, profile, isNewUser) { return token }
	},
	events: {
		// async signIn(message) { /* on successful sign in */ },
		// async signOut(message) { /* on signout */ },
		// async createUser(message) { /* user created */ },
		// async linkAccount(message) { /* account linked to a user */ },
		// async session(message) { /* session is active */ },
		// async error(message) { /* error in authentication flow */ }
	},
	// Enable debug messages in the console if you are having problems
	debug: false,
});

export { handler as GET, handler as POST };
