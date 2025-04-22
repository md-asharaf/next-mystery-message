import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });
    const url = request.nextUrl.pathname;
    const isAuth = !!token;
    if (
        isAuth &&
        (url.startsWith("/sign-in") ||
            url.startsWith("/sign-up") ||
            url.startsWith("/verify"))
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (!isAuth && (url.startsWith("/dashboard") || url === "/")) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard", "/sign-in", "/sign-up", "/verify"],
};
