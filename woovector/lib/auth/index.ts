// Auth module exports
export { signJWT, verifyJWT, getJWTCookieMaxAge, type JWTPayload } from "./jwt";
export { hashPassword, verifyPassword } from "./password";
export {
  setAuthCookie,
  getAuthCookie,
  clearAuthCookie,
  getAuthCookieFromRequest,
  setAuthCookieOnResponse,
  clearAuthCookieOnResponse,
  AUTH_COOKIE_NAME,
} from "./cookies";
export { sendVerificationEmail, sendPasswordResetEmail } from "./email";

// Re-export middleware
export { authMiddleware } from "./middleware";

// Helper functions for user management
import { db } from "@/lib/drizzle/db";
import { users, type User, type UserRole } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getAuthCookie } from "./cookies";
import { verifyJWT } from "./jwt";

/**
 * Get the current authenticated user ID from the JWT cookie
 * Use this when you only need the user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const token = await getAuthCookie();
    if (!token) {
      return null;
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return null;
    }

    return payload.userId;
  } catch (error) {
    console.error("Error getting current user ID:", error);
    return null;
  }
}

/**
 * Require user ID - throws redirect if not authenticated
 * Use this for most common authentication use case
 */
export async function requireUserId(): Promise<string> {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/auth/login");
  }

  return userId;
}

/**
 * Get the current authenticated user with full data
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return null;
    }

    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return result[0] ?? null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Get the current authenticated user with role information
 */
export async function getCurrentUserWithRole(): Promise<{
  user: User;
  isAdmin: boolean;
} | null> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }

    return {
      user,
      isAdmin: user.role === "admin",
    };
  } catch (error) {
    console.error("Error getting current user with role:", error);
    return null;
  }
}

/**
 * Check if a user ID has admin role
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const result = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return result[0]?.role === "admin";
  } catch (error) {
    console.error("Error checking user admin status:", error);
    return false;
  }
}

/**
 * Require admin access - redirects if not authorized
 */
export async function requireAdminAccess(): Promise<void> {
  const userWithRole = await getCurrentUserWithRole();

  if (!userWithRole) {
    console.warn("Admin access attempted without authentication");
    redirect("/auth/login");
  }

  if (!userWithRole.isAdmin) {
    console.warn(
      `Non-admin user ${userWithRole.user.id} attempted admin access`
    );
    redirect("/unauthorized");
  }
}

/**
 * Check if current authenticated user is admin (non-throwing version)
 */
export async function checkCurrentUserIsAdmin(): Promise<boolean> {
  const userWithRole = await getCurrentUserWithRole();
  return userWithRole?.isAdmin ?? false;
}

/**
 * Validate that a user role is valid
 */
export function isValidUserRole(role: string): role is UserRole {
  return role === "member" || role === "admin";
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case "admin":
      return "Administrator";
    case "member":
      return "Member";
    default:
      return "Unknown";
  }
}
