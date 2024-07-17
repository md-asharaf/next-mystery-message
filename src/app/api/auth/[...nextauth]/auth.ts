import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.model";
import NextAuth, { NextAuthConfig, NextAuthResult } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthConfig = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async ({ email, password }): Promise<any> => {
                await dbConnect();
                try {
                    const user = await userModel.findOne({
                        email,
                    });
                    const isPasswordCorrect = await bcrypt.compare(
                        password as string,
                        user?.password || ""
                    );
                    return isPasswordCorrect ? user : null;
                } catch (error) {
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXT_AUTH_SECRET,
    pages: {
        signIn: "/sign-in",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
    },
};
export const { handlers, signIn, signOut, auth }: NextAuthResult =
    NextAuth(authOptions);
