import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// 7 days in seconds
const JWT_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60;

/**
 * Get the secret key as a Uint8Array for jose
 */
function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(env.JWT_SECRET);
}

/**
 * Sign a JWT token with the user payload
 * Works in both Node.js and Edge Runtime
 */
export async function signJWT(payload: JWTPayload): Promise<string> {
  console.log("[signJWT] Signing JWT for user:", payload.email);

  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + JWT_EXPIRES_IN_SECONDS)
    .sign(getSecretKey());

  return token;
}

/**
 * Verify and decode a JWT token
 * Returns the payload if valid, null if invalid or expired
 * Works in both Node.js and Edge Runtime
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    console.log("[verifyJWT] Token verified for user:", payload.email);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch (error) {
    console.log("[verifyJWT] Token verification failed:", error instanceof Error ? error.message : "Unknown error");
    return null;
  }
}

/**
 * Get the expiration time for the JWT cookie
 * Returns the max-age in seconds for cookie configuration
 */
export function getJWTCookieMaxAge(): number {
  return JWT_EXPIRES_IN_SECONDS;
}
