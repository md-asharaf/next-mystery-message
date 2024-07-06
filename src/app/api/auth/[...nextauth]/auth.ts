import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/user.models";
import NextAuth, { NextAuthResult } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth }: NextAuthResult = NextAuth({
    providers: [
        credentials({
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
                    const isPasswordCorrect = bcrypt.compare(
                        password,
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
});
