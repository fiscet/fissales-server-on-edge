import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import {
  verifyEmailToken,
  verifyPasswordResetToken,
} from "@/app/actions/auth";

// Force dynamic rendering since we access cookies
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<void> {
  const { searchParams } = new URL(request.url);

  const token = searchParams.get("token");
  const type = searchParams.get("type");
  const next = searchParams.get("next");

  if (!token || !type) {
    redirect("/auth/error?message=Invalid%20verification%20link");
  }

  // Handle email verification
  if (type === "email_verification") {
    const result = await verifyEmailToken(token);

    if (!result.success) {
      redirect(
        `/auth/error?message=${encodeURIComponent(result.error || "Email verification failed")}`
      );
    }

    // Redirect to the intended page or profile
    const redirectUrl = next && next.startsWith("/") ? next : "/profile";
    redirect(redirectUrl);
  }

  // Handle password reset
  if (type === "password_reset") {
    // For password reset, we redirect to the update password page
    // The token will be validated when the user submits the new password
    const redirectUrl = `/auth/update-password?token=${encodeURIComponent(token)}`;
    redirect(redirectUrl);
  }

  // Invalid type
  redirect("/auth/error?message=Invalid%20verification%20type");
}

// Handle password reset form submission
export async function POST(request: NextRequest): Promise<void> {
  const formData = await request.formData();
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  if (!token || !password) {
    redirect("/auth/error?message=Invalid%20request");
  }

  const result = await verifyPasswordResetToken(token, password);

  if (!result.success) {
    redirect(
      `/auth/error?message=${encodeURIComponent(result.error || "Password reset failed")}`
    );
  }

  redirect("/profile");
}
