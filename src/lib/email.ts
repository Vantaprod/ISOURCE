import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendOrderConfirmation(email: string, orderNumber: string, totalKobo: number) {
  const formattedTotal = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(totalKobo / 100);

  if (!resend) {
    console.log(`\n📧 [EMAIL MOCK] Order Confirmation\nTo: ${email}\nOrder: ${orderNumber}\nTotal: ${formattedTotal}\n(Add RESEND_API_KEY to .env to send real emails)\n`);
    return;
  }

  try {
    await resend.emails.send({
      from: "Isource <orders@isource.ng>", // Replace with your verified domain later
      to: email,
      subject: `Order Confirmation — ${orderNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #F07824;">Thank you for your order!</h1>
          <p>We've received your order <strong>#${orderNumber}</strong> and are getting it ready for dispatch.</p>
          <p style="font-size: 20px; font-weight: bold;">Total: ${formattedTotal}</p>
          <p>You can track the status of your order by logging into your account.</p>
          <br/>
          <p>Best regards,<br/>The Isource Team</p>
        </div>
      `,
    });
    console.log(`✅ Order confirmation email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}