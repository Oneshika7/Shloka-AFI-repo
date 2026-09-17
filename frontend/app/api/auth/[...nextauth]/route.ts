import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API = process.env.INTERNAL_API_URL || "http://backend:8002";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const params = new URLSearchParams();
          params.append("username", credentials.email);
          params.append("password", credentials.password);

          const res = await fetch(`${API}/api/v1/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
          });

          if (res.ok) {
            const data = await res.json();
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              accessToken: data.access_token,
            };
          } else {
            const errorText = await res.text();
            throw new Error(errorText || "Invalid credentials");
          }
        } catch (e: any) {
          console.error("Login failed:", e);
          throw new Error(e.message || "Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60, // Enforce login after 4 hours
  },
  secret: process.env.NEXTAUTH_SECRET || "development_secret_key_123",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
