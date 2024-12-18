import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import NextAuth, { NextAuthConfig, NextAuthResult } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthConfig = {
    trustHost: process.env.NODE_ENV === "production",
    providers: [
        Credentials({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async ({ email, password }): Promise<any> => {
                await dbConnect();
                try {
                    const user= await userModel.findOne({ email });
                    if (!user?.isVerified) {
                        return null;
                    }
                    const isPasswordCorrect = await bcrypt.compare(
                        password as string,
                        user?.password || ""
                    );
                    return isPasswordCorrect ? user : null;
                } catch (error: any) {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString(); // Convert ObjectId to string
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET,
    pages: {
        signIn: "/sign-in",
    },
};
export const { handlers, signIn, signOut, auth }: NextAuthResult =
    NextAuth(authOptions);
