import GithubProvider from "next-auth/providers/github";
import { AuthOptions, getServerSession } from "next-auth";
import { createOrReadUser } from "./db-user";

export const auth = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    return session.user;
  }

  return false;
};

if (!process.env.NEXTAUTH_GITHUB_ID || !process.env.NEXTAUTH_GITHUB_SECRET) {
  throw new Error(
    "Missing NEXTAUTH_GITHUB_ID or NEXTAUTH_GITHUB_SECRET environment variables"
  );
}

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.NEXTAUTH_GITHUB_ID,
      clientSecret: process.env.NEXTAUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        const dbUser = await createOrReadUser(token.sub);

        session.user = { ...session.user, ...dbUser };
      }

      return session;
    },
  },
};
