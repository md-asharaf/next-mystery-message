export { auth as middleware } from "./app/api/auth/[...nextauth]/auth";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function authMiddleware(req: NextRequest) {
    const token = await getToken({
        req,
        salt: "10",
        secret: process.env.NEXT_AUTH_SECRET,
    });
    const url = req.nextUrl;
    if (
        token &&
        (url.pathname.startsWith("/sign-in") ||
            url.pathname.startsWith("/sign-up") ||
            url.pathname.startsWith("/verify") ||
            url.pathname.startsWith("/"))
    ) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
}
