"use server";

import { z } from "zod";
import { eq, and, gte } from "drizzle-orm";
import { contactSubmissions } from "@/lib/drizzle/schema";
import { db } from "@/lib/drizzle/db";
import { sendEmail } from "@/lib/email";
import { getCurrentUserId } from "@/lib/auth";

const contactFormSchema = z.object({
  fullName: z.string().trim().max(120).nullable(),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .optional()
    .transform((value) => value ?? undefined),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(2000),
  consent: z.boolean().refine((val) => val === true, {
    message: "Please confirm you agree to our privacy policy",
  }),
});

interface SubmitContactFormResult {
  success: boolean;
  referenceNumber?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function submitContactForm(
  prevState: SubmitContactFormResult | undefined,
  formData: FormData
): Promise<SubmitContactFormResult> {
  const parsed = contactFormSchema.safeParse({
    fullName: formData.get("fullName")?.toString() ?? null,
    email: formData.get("email")?.toString(),
    subject: formData.get("subject")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
    consent: formData.get("consent") === "on",
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      success: false,
      error: "Please fix the highlighted errors and try again.",
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).map(([key, errors]) => [key, errors?.[0] ?? ""])
      ),
    };
  }

  const { fullName, email, subject, message } = parsed.data;

  if (!email) {
    return {
      success: false,
      error: "Email address is required so we can follow up.",
      fieldErrors: { email: "Email address is required." },
    };
  }

  const recentSubmission = await db
    .select({ id: contactSubmissions.id })
    .from(contactSubmissions)
    .where(
      and(
        eq(contactSubmissions.email, email),
        gte(contactSubmissions.createdAt, new Date(Date.now() - 1000 * 60 * 60))
      )
    )
    .limit(3);

  if (recentSubmission.length >= 3) {
    return {
      success: false,
      error: "You've reached the limit of requests per hour. Please try again later.",
    };
  }

  const referenceNumber = `WV-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

  const userId = await getCurrentUserId();

  await db.insert(contactSubmissions).values({
    userId,
    fullName,
    email,
    subject,
    message,
    consent: true,
    status: "pending",
    referenceNumber,
  });

  const supportEmail = process.env.SUPPORT_EMAIL;
  if (!supportEmail) {
    throw new Error("SUPPORT_EMAIL environment variable is not set");
  }

  await sendEmail({
    to: supportEmail,
    subject: `[Support] ${subject} — ${referenceNumber}`,
    html: `
      <p><strong>New support request received.</strong></p>
      <p><strong>Reference:</strong> ${referenceNumber}</p>
      <p><strong>Name:</strong> ${fullName ?? "Not provided"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <pre style="white-space: pre-wrap; font-family: inherit;">${message}</pre>
    `,
  });

  await sendEmail({
    to: email,
    subject: `We've received your message — ${referenceNumber}`,
    html: `
      <p>Hi${fullName ? ` ${fullName}` : ""},</p>
      <p>Thanks for reaching out to WooVector. We've received your message and will get back to you within 24 hours.</p>
      <p><strong>Your reference number:</strong> ${referenceNumber}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p>If you need to add more details, just reply to this email and include your reference number.</p>
      <p>— WooVector Support Team</p>
    `,
  });

  return { success: true, referenceNumber };
}

