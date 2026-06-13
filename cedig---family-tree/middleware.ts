import { NextResponse, NextRequest } from "next/server";

const WORKSPACE_ROUTES = [
  "/family-tree", "/biographies", "/photos", "/documents",
  "/activity", "/access", "/settings", "/pricing", "/admin", "/people",
];

const AUTH_ROUTES = [
  "/login", "/register", "/forgot-password",
  "/otp-verification", "/reset-password", "/auth-success", "/onboarding",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get("cedig-auth");
  const isAuthenticated = !!authCookie?.value;

  if (!isAuthenticated && WORKSPACE_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/family-tree", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/otp-verification",
    "/reset-password",
    "/auth-success",
    "/onboarding",
    "/family-tree",
    "/biographies",
    "/photos",
    "/documents",
    "/activity",
    "/access",
    "/settings",
    "/pricing",
    "/admin",
    "/people",
    "/people/:path*",
  ],
};
