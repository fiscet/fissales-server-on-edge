import nodemailer from "nodemailer";
import { env } from "@/lib/env";

// Create transporter instance
function createTransporter() {
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });
}

/**
 * Send an email verification link
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  fullName?: string
): Promise<void> {
  const transporter = createTransporter();
  const verificationUrl = `${env.NEXT_PUBLIC_APP_URL}/auth/confirm?token=${token}&type=email_verification`;

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: email,
    subject: "Verify your email address",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f9fafb; border-radius: 8px; padding: 30px; margin-top: 20px;">
          <h1 style="color: #111827; font-size: 24px; margin-bottom: 20px;">Verify your email address</h1>
          <p style="margin-bottom: 16px;">Hello${fullName ? ` ${fullName}` : ""},</p>
          <p style="margin-bottom: 24px;">Thank you for signing up! Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Verify Email</a>
          <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #3b82f6; word-break: break-all; font-size: 14px;">${verificationUrl}</p>
          <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">This link will expire in 24 hours.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
          <p style="color: #9ca3af; font-size: 12px;">If you didn't create an account, you can safely ignore this email.</p>
        </div>
      </body>
      </html>
    `,
  });
}

/**
 * Send a password reset link
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  fullName?: string
): Promise<void> {
  const transporter = createTransporter();
  const resetUrl = `${env.NEXT_PUBLIC_APP_URL}/auth/confirm?token=${token}&type=password_reset&next=/auth/update-password`;

  await transporter.sendMail({
    from: env.SMTP_FROM,
    to: email,
    subject: "Reset your password",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your password</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f9fafb; border-radius: 8px; padding: 30px; margin-top: 20px;">
          <h1 style="color: #111827; font-size: 24px; margin-bottom: 20px;">Reset your password</h1>
          <p style="margin-bottom: 16px;">Hello${fullName ? ` ${fullName}` : ""},</p>
          <p style="margin-bottom: 24px;">We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">Reset Password</a>
          <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #3b82f6; word-break: break-all; font-size: 14px;">${resetUrl}</p>
          <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">This link will expire in 1 hour.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
          <p style="color: #9ca3af; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      </body>
      </html>
    `,
  });
}
