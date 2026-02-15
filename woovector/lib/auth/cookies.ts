import { cookies } from "next/headers";
import { type NextRequest, type NextResponse } from "next/server";
import { getJWTCookieMaxAge } from "./jwt";

export const AUTH_COOKIE_NAME = "auth_token";

/**
 * Set the authentication cookie in a Server Action
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  console.log("[setAuthCookie] Setting cookie, isProduction:", isProduction, "token length:", token.length);

  // In development, don't use secure flag
  // Use object syntax for more explicit control
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: false, // Always false for localhost development
    sameSite: "lax",
    maxAge: getJWTCookieMaxAge(),
    path: "/",
  });

  console.log("[setAuthCookie] Cookie set successfully");
}

/**
 * Get the authentication token from cookies in a Server Action
 */
export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

/**
 * Clear the authentication cookie in a Server Action
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Get the authentication token from a request (for middleware)
 */
export function getAuthCookieFromRequest(request: NextRequest): string | undefined {
  const cookie = request.cookies.get(AUTH_COOKIE_NAME);
  console.log("[getAuthCookieFromRequest] Cookie found:", !!cookie, "value length:", cookie?.value?.length);
  return cookie?.value;
}

/**
 * Set the authentication cookie on a response (for middleware)
 */
export function setAuthCookieOnResponse(
  response: NextResponse,
  token: string
): void {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: getJWTCookieMaxAge(),
    path: "/",
  });
}

/**
 * Clear the authentication cookie on a response (for middleware)
 */
export function clearAuthCookieOnResponse(response: NextResponse): void {
  response.cookies.delete(AUTH_COOKIE_NAME);
}
