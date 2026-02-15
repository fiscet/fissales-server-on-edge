import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";


export const env = createEnv({
  server: {
    // Drizzle
    DATABASE_URL: z.string().url(),

    // JWT Authentication
    JWT_SECRET: z.string().min(32), // At least 32 characters for security

    // SMTP Configuration
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.coerce.number().int().positive(),
    SMTP_USER: z.string().min(1),
    SMTP_PASSWORD: z.string().min(1),
    SMTP_FROM: z.string().email(),

    // Stripe - simplified to single paid tier
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    STRIPE_PAID_PRICE_ID: z.string().min(1), // Single $9.99/month price ID

    // Google AI - for Gemini 2.5 Pro
    GEMINI_API_KEY: z.string().min(1),


    // Optional: Fallback customer portal URL when automated session creation fails
    STRIPE_CUSTOMER_PORTAL_URL: z.string().url().optional(),
  },
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    // Server variables
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM: process.env.SMTP_FROM,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PAID_PRICE_ID: process.env.STRIPE_PAID_PRICE_ID,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,

    STRIPE_CUSTOMER_PORTAL_URL: process.env.STRIPE_CUSTOMER_PORTAL_URL,

    // Client variables
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
