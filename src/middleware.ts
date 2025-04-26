import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName:
            process.env.NODE_ENV === "production"
                ? "__Secure-authjs.session-token"
                : "authjs.session-token",
    });
    const url = request.nextUrl.pathname;
    console.log({
        token,
    });
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

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL('/home', request.url))
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/about/:path*',
// }
