import { type NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest } from "@/lib/auth/cookies";
import { verifyJWT } from "@/lib/auth/jwt";

/**
 * Middleware to check authentication and protect routes
 */
export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip authentication for API routes that don't need it
  if (pathname.startsWith("/api/webhooks/")) {
    return NextResponse.next({ request });
  }

  if (pathname === "/api/health") {
    return NextResponse.next({ request });
  }

  if (pathname.startsWith("/api/products-sync")) {
    return NextResponse.next({ request });
  }

  if (pathname.startsWith("/api/chatbot/")) {
    return NextResponse.next({ request });
  }

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/cookies", "/privacy", "/terms", "/contact"];

  // Auth routes (login, signup, etc.) - accessible without authentication
  const authRoutes = ["/auth/login", "/auth/sign-up", "/auth/forgot-password", "/auth/error", "/auth/confirm"];

  // Check if this is a public route
  const isPublicRoute = publicRoutes.includes(pathname);

  // Check if this is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Get the auth token from cookies
  const token = getAuthCookieFromRequest(request);
  let user = null;

  if (token) {
    const payload = await verifyJWT(token);
    if (payload) {
      user = payload;
    }
  }

  // Debug logging
  console.log(`[Middleware] Path: ${pathname}, Token: ${token ? 'present (len: ' + token.length + ')' : 'none'}, User: ${user ? user.email : 'none'}, isPublic: ${isPublicRoute}, isAuth: ${isAuthRoute}`);

  // If user is authenticated and trying to access auth routes, redirect to profile
  if (user && isAuthRoute && !pathname.includes("/auth/confirm")) {
    console.log(`[Middleware] Redirecting authenticated user from ${pathname} to /profile`);
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  // If no user and trying to access protected route, redirect to login
  if (!user && !isPublicRoute && !isAuthRoute) {
    console.log(`[Middleware] Redirecting unauthenticated user from ${pathname} to /auth/login`);
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Continue with the request
  return NextResponse.next({ request });
}
