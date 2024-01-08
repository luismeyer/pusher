import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

if (!process.env.NEXTAUTH_GITHUB_ID || !process.env.NEXTAUTH_GITHUB_SECRET) {
  throw new Error(
    "Missing NEXTAUTH_GITHUB_ID or NEXTAUTH_GITHUB_SECRET environment variables"
  );
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.NEXTAUTH_GITHUB_ID,
      clientSecret: process.env.NEXTAUTH_GITHUB_SECRET,
    }),
  ],
});

export { handler as GET, handler as POST };
