import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const supportEmail = process.env.SUPPORT_EMAIL;

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not set");
}

if (!supportEmail) {
  throw new Error("SUPPORT_EMAIL is not set");
}

export const resend = new Resend(resendApiKey);

interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailPayload): Promise<void> {
  await resend.emails.send({
    from: `WooVector Support <${supportEmail}>`,
    to,
    subject,
    html,
  });
}

