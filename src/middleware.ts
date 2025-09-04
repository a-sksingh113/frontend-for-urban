import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("token_middleware")?.value;
  const { pathname } = request.nextUrl;

  // If token exists and user tries to visit /login or /signup, redirect to dashboard
  if (
    token &&
    (pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/forgot-password")
  ) {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  // protected routes if token doesn't exist
  const protectedRoutes = ["/dashboard", "/reset-password"];

  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow request to proceed
  return NextResponse.next();
}

// Apply middleware for these paths
export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard",
    "/forgot-password/:path*",
    "/reset-password",
  ],
};
