import { NextResponse, NextRequest } from "next/server";

const WORKSPACE_ROUTES = [
  "/family-tree", "/biographies", "/photos", "/documents",
  "/activity", "/access", "/settings", "/pricing", "/admin", "/people",
];

const AUTH_ROUTES = [
  "/login", "/register", "/forgot-password",
  "/otp-verification", "/reset-password", "/auth-success",
  "/verify-email",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get("cedig-auth");
  const isAuthenticated = !!authCookie?.value;

  if (!isAuthenticated && WORKSPACE_ROUTES.some((r) => pathname.startsWith(r))) {
    console.log('[MIDDLEWARE] Unauthenticated workspace access, redirecting to /login', { pathname });
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && AUTH_ROUTES.includes(pathname)) {
    console.log('[MIDDLEWARE] Authenticated auth-route access, redirecting to /family-tree', { pathname });
    return NextResponse.redirect(new URL("/family-tree", request.url));
  }

  // /onboarding is deprecated — always redirect to workspace
  if (pathname === "/onboarding") {
    console.log('[MIDDLEWARE] /onboarding accessed, redirecting to /family-tree', { isAuthenticated });
    return NextResponse.redirect(new URL(isAuthenticated ? "/family-tree" : "/login", request.url));
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
    "/verify-email",
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
