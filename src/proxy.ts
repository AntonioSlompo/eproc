import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isAuthPage = nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/signup");
    const isDashboardPage = nextUrl.pathname.startsWith("/dashboard");
    const isApiAuth = nextUrl.pathname.startsWith("/api/auth");

    // Allow API auth routes
    if (isApiAuth) {
        return NextResponse.next();
    }

    // Redirect logged-in users away from auth pages
    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    // Protect dashboard routes
    if (isDashboardPage && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
