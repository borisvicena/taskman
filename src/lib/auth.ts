// lib/auth.ts
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          throw new Error("Please enter your email and password");
        }

        try {
          await connectDB();

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            console.error("User not found:", credentials.email);
            throw new Error("Invalid email or password");
          }

          if (!user.passwordHash) {
            console.error("User has no password hash:", credentials.email);
            throw new Error("Invalid email or password");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!isPasswordValid) {
            console.error("Invalid password for user:", credentials.email);
            throw new Error("Invalid email or password");
          }

          console.log("User authenticated successfully:", user._id);

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await connectDB();

          // Check if user exists with this googleId
          let dbUser = await User.findOne({ googleId: account.providerAccountId });

          if (!dbUser) {
            // Check if user exists with this email
            dbUser = await User.findOne({ email: user.email });

            if (dbUser) {
              // User exists but doesn't have googleId, update it
              dbUser.googleId = account.providerAccountId;
              dbUser.name = user.name || dbUser.name;
              await dbUser.save();
            } else {
              // Create new user
              dbUser = await User.create({
                name: user.name,
                email: user.email,
                googleId: account.providerAccountId,
              });
            }
          } else {
            // Update user info if needed
            dbUser.name = user.name || dbUser.name;
            dbUser.email = user.email || dbUser.email;
            await dbUser.save();
          }

          // Store the MongoDB _id in the user object for the JWT callback
          user.id = dbUser._id.toString();

          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, profile, user }) {
      // On initial sign in, user object is available
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
        },
      };
    },
  },
  pages: {
    signIn: "/login",
  },
};

// Helper function for server-side
export function getServerAuthSession() {
  return getServerSession(authOptions);
}
