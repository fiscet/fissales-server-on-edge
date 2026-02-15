"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/drizzle/db";
import { users, verificationTokens } from "@/lib/drizzle/schema";
import { eq, and, gt } from "drizzle-orm";
import { randomBytes } from "crypto";
import {
  signJWT,
  hashPassword,
  verifyPassword,
  setAuthCookie,
  clearAuthCookie,
  sendVerificationEmail,
  sendPasswordResetEmail,
  getCurrentUserId,
} from "@/lib/auth";

// Base auth result type for consistent responses
export type AuthResult = {
  success: boolean;
  error?: string;
};

// Token expiration times
const VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const PASSWORD_RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

/**
 * Generate a secure random token
 */
function generateToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Server-side login action
 * Authenticates user with email and password
 */
export async function loginAction(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    // Find user by email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (userResult.length === 0) {
      return { success: false, error: "Invalid email or password" };
    }

    const user = userResult[0];

    // Check if user has a password set (might be OAuth user)
    if (!user.password_hash) {
      return { success: false, error: "Invalid email or password" };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password" };
    }

    // Check if email is verified
    if (!user.email_verified) {
      return {
        success: false,
        error: "Please verify your email address before logging in",
      };
    }

    // Generate JWT and set cookie
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    console.log("[Login] Setting auth cookie for user:", user.email);
    await setAuthCookie(token);

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Server-side signup action
 * Creates new user account with email verification
 */
export async function signUpAction(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthResult> {
  try {
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      // Check if user is already verified
      if (existingUser[0].email_verified) {
        return {
          success: false,
          error: "An account with this email already exists. Try logging in instead.",
        };
      }
      // User exists but not verified - resend verification email
      const user = existingUser[0];
      const token = generateToken();
      const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY);

      // Delete old verification tokens for this user
      await db
        .delete(verificationTokens)
        .where(
          and(
            eq(verificationTokens.user_id, user.id),
            eq(verificationTokens.type, "email_verification")
          )
        );

      // Create new verification token
      await db.insert(verificationTokens).values({
        user_id: user.id,
        token,
        type: "email_verification",
        expires_at: expiresAt,
      });

      // Send verification email
      await sendVerificationEmail(user.email, token, user.full_name || undefined);

      return { success: true };
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        password_hash: passwordHash,
        full_name: fullName || null,
        email_verified: false,
        role: "member",
      })
      .returning();

    // Generate verification token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY);

    await db.insert(verificationTokens).values({
      user_id: newUser.id,
      token,
      type: "email_verification",
      expires_at: expiresAt,
    });

    // Send verification email
    await sendVerificationEmail(newUser.email, token, fullName);

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Server-side logout action
 * Terminates user session
 */
export async function logoutAction(): Promise<AuthResult> {
  try {
    await clearAuthCookie();
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Server-side password reset action
 * Sends password reset email to user
 */
export async function resetPasswordAction(email: string): Promise<AuthResult> {
  try {
    const normalizedEmail = email.toLowerCase();

    // Find user by email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    // Always return success to prevent email enumeration
    if (userResult.length === 0) {
      return { success: true };
    }

    const user = userResult[0];

    // Delete old password reset tokens for this user
    await db
      .delete(verificationTokens)
      .where(
        and(
          eq(verificationTokens.user_id, user.id),
          eq(verificationTokens.type, "password_reset")
        )
      );

    // Generate new token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY);

    await db.insert(verificationTokens).values({
      user_id: user.id,
      token,
      type: "password_reset",
      expires_at: expiresAt,
    });

    // Send password reset email
    await sendPasswordResetEmail(user.email, token, user.full_name || undefined);

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Server-side password update action
 * Updates user's password when authenticated
 */
export async function updatePasswordAction(
  password: string
): Promise<AuthResult> {
  try {
    // Get current user from cookie
    const userId = await getCurrentUserId();

    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update user password
    await db
      .update(users)
      .set({
        password_hash: passwordHash,
        updated_at: new Date(),
      })
      .where(eq(users.id, userId));

    return { success: true };
  } catch (error) {
    console.error("Password update error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Verify email token and mark email as verified
 */
export async function verifyEmailToken(token: string): Promise<AuthResult> {
  try {
    // Find the token
    const tokenResult = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          eq(verificationTokens.type, "email_verification"),
          gt(verificationTokens.expires_at, new Date())
        )
      )
      .limit(1);

    if (tokenResult.length === 0) {
      return { success: false, error: "Invalid or expired verification link" };
    }

    const verificationToken = tokenResult[0];

    // Update user as verified
    await db
      .update(users)
      .set({
        email_verified: true,
        updated_at: new Date(),
      })
      .where(eq(users.id, verificationToken.user_id));

    // Delete the verification token
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, verificationToken.id));

    // Get user data for JWT
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, verificationToken.user_id))
      .limit(1);

    if (userResult.length > 0) {
      const user = userResult[0];
      // Generate JWT and set cookie
      const jwtToken = await signJWT({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      await setAuthCookie(jwtToken);
    }

    return { success: true };
  } catch (error) {
    console.error("Email verification error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Verify password reset token and update password
 */
export async function verifyPasswordResetToken(
  token: string,
  newPassword: string
): Promise<AuthResult> {
  try {
    // Find the token
    const tokenResult = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          eq(verificationTokens.type, "password_reset"),
          gt(verificationTokens.expires_at, new Date())
        )
      )
      .limit(1);

    if (tokenResult.length === 0) {
      return { success: false, error: "Invalid or expired reset link" };
    }

    const verificationToken = tokenResult[0];

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update user password and mark email as verified
    await db
      .update(users)
      .set({
        password_hash: passwordHash,
        email_verified: true,
        updated_at: new Date(),
      })
      .where(eq(users.id, verificationToken.user_id));

    // Delete the verification token
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, verificationToken.id));

    // Get user data for JWT
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, verificationToken.user_id))
      .limit(1);

    if (userResult.length > 0) {
      const user = userResult[0];
      // Generate JWT and set cookie
      const jwtToken = await signJWT({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      await setAuthCookie(jwtToken);
    }

    return { success: true };
  } catch (error) {
    console.error("Password reset verification error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
