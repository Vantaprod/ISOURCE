import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY is not set. Emails will not be sent.");
}

export const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Isource <onboarding@resend.dev>",
      to,
      subject,
      react,
    });
    console.log(`[Email Sent] ${subject} to ${to}`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`[Email Failed] ${subject} to ${to}`, error);
    return { success: false, error };
  }
}