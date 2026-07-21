/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password");
        }

        try {
          const url =
            process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/auth/login";

          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const response = await res.json();

          if (!res.ok) {
            throw new Error(response.message || "Login failed");
          }

          const { user, accessToken } = response.data;

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role, // "ADMIN" | "SUPER_ADMIN"
            permissions: user.permissions || [], // 👈 ADD THIS
            profileImage: user.profileImage,
            accessToken,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Authentication failed. Please try again.");
        }
      },
    }),
  ],

  callbacks: {
    // Store data inside JWT  
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.permissions = user.permissions || []; // 👈 ADD
        token.profileImage = user.profileImage;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    // Expose JWT → session
    async session({ session, token }: { session: any; token: JWT }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
        permissions: token.permissions || [], // 👈 ADD
        profileImage: token.profileImage,
        accessToken: token.accessToken,
      };
      return session;
    },
  },
});
