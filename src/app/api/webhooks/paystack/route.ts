import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";
import { generateFinanceDeliveriesForOrder } from "@/app/actions/generate-deliveries";
import { sendEmail } from "@/lib/email";
import { OrderConfirmation } from "@/emails/OrderConfirmation";
import { VendorNewOrder } from "@/emails/VendorNewOrder";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY || "")
      .update(body)
      .digest("hex");

    const signature = req.headers.get("x-paystack-signature");

    // 1. Verify the request actually came from Paystack
    if (hash !== signature) {
      console.warn("[Paystack Webhook] Invalid signature detected");
      return NextResponse.json({ status: "unauthorized" }, { status: 401 });
    }

    const event = JSON.parse(body);

    // 2. Handle successful charge
    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const amountKobo = BigInt(event.data.amount);

      // Find the payment record created during checkout
      const payment = await prisma.financePayment.findUnique({
        where: { reference },
      });

      // Idempotency: If payment doesn't exist or is already successful, ignore
      if (!payment || payment.status === "SUCCESSFUL") {
        return NextResponse.json({ status: "success" });
      }

      // 3. Update Payment Status
      await prisma.financePayment.update({
        where: { id: payment.id },
        data: {
          status: "SUCCESSFUL",
          paidAt: new Date(),
          rawResponse: event.data,
        },
      });

      // 4. Update the FinanceVendorOrders to PAID
      await prisma.financeVendorOrder.updateMany({
        where: { orderId: payment.orderId },
        data: { status: "PROCESSING" }, // or whatever status means "paid and ready to ship"
      });

      // 5. Generate Deliveries
      await generateFinanceDeliveriesForOrder(payment.orderId);

      // 6. Send Emails
      try {
        const customer = await prisma.user.findUnique({ where: { id: payment.customerId } });
        const vendorOrders = await prisma.financeVendorOrder.findMany({
          where: { orderId: payment.orderId },
          include: { vendor: { include: { user: true } } },
        });

        // Email Customer
        if (customer?.email) {
          await sendEmail({
            to: customer.email,
            subject: `Order Confirmed - ${payment.orderId}`,
            react: OrderConfirmation({
              customerName: customer.name || "Customer",
              orderId: payment.orderId,
              totalKobo: Number(amountKobo),
            }),
          });
        }

        // Email Vendors
        for (const vo of vendorOrders) {
          if (vo.vendor?.user?.email) {
            await sendEmail({
              to: vo.vendor.user.email,
              subject: `New Order Received - ${vo.orderNumber}`,
              react: VendorNewOrder({
                vendorName: vo.vendor.name,
                orderNumber: vo.orderNumber,
                vendorNetKobo: Number(vo.vendorNetKobo),
              }),
            });
          }
        }
      } catch (emailErr) {
        console.error("Failed to send post-payment emails:", emailErr);
        // We don't throw, so the webhook still returns 200 OK
      }
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("[Paystack Webhook] Error:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}