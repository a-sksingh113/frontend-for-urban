import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("token_middleware")?.value;
  const { pathname } = request.nextUrl;

  // If token exists and user tries to visit these routes, redirect to dashboard
  if (
    token &&
    (pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/forgot-password" ||
      pathname.startsWith("/confirm-email") ||
      pathname.startsWith("/verify-email"))
  ) {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }
  // protected routes if token doesn't exist
  const protectedRoutes = [
    "/dashboard",
    "/reset-password",
    "/results",
    "/edit-profile",
    "/profile",
    "/change-password",
    "/history",
  ];

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
    "/forgot-password/:path*",
    "/confirm-email/:path*",
    "/verify-email/:path*",
    "/dashboard",
    "/reset-password",
    "/results",
    "/edit-profile",
    "/profile",
    "/change-password",
    "/history",
  ],
};
