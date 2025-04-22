import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import NextAuth, { NextAuthConfig, NextAuthResult } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthConfig = {
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
                    const user = await userModel.findOne({ email });
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
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessage =
                    token.isAcceptingMessage as boolean;
                session.user.username = token.username as string;
            }
            return session;
        },
    },
    trustHost: true,
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/sign-in",
    },
};
export const { handlers, signIn, signOut, auth }: NextAuthResult =
    NextAuth(authOptions);
