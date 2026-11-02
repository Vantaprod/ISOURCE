import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { processSuccessfulPayment } from "@/lib/payments/process-payment";
import { postJournal } from "@/modules/ledger/ledger.service";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!).update(rawBody).digest("hex");
    if (hash !== signature) return NextResponse.json({ message: "Invalid signature" }, { status: 401 });

    const event = JSON.parse(rawBody);
    const eventId = event.data?.id?.toString() || event.data?.reference;
    if (!eventId) return NextResponse.json({ message: "No event ID" }, { status: 400 });

    // Idempotency: skip if already processed
    const existing = await prisma.paymentWebhookEvent.findUnique({
      where: { provider_eventId: { provider: "PAYSTACK", eventId } },
    });
    if (existing?.status === "PROCESSED") {
      return NextResponse.json({ message: "Already processed" }, { status: 200 });
    }

    await prisma.paymentWebhookEvent.upsert({
      where: { provider_eventId: { provider: "PAYSTACK", eventId } },
      update: { status: "PROCESSING", attempts: { increment: 1 } },
      create: {
        provider: "PAYSTACK", eventId, eventType: event.event,
        status: "PROCESSING", payload: event, signatureValid: true,
      },
    });

    // ═══════════ CHARGE SUCCESS (customer paid) ═══════════
    if (event.event === "charge.success") {
      await processSuccessfulPayment(event.data.reference);
    }

    // ═══════════ TRANSFER SUCCESS (payout to vendor) ═══════
    if (event.event === "transfer.success") {
      const settlement = await prisma.vendorSettlement.findFirst({
        where: { providerReference: event.data.reference },
      });

      if (settlement && settlement.status !== "SUCCESSFUL") {
        // 1. Mark settlement as successful
        await prisma.vendorSettlement.update({
          where: { id: settlement.id },
          data: { status: "SUCCESSFUL", completedAt: new Date() },
        });

        // 2. Post final ledger journal: In Transit → Gateway Clearing
        const accounts = await prisma.ledgerAccount.findMany({
          where: { code: { in: ["2020", "1000"] } },
        });
        const inTransitAcc = accounts.find(a => a.code === "2020")!;
        const clearingAcc = accounts.find(a => a.code === "1000")!;

        await postJournal({
          reference: `JRN-TRANSFER-OK-${settlement.reference}`,
          idempotencyKey: `TRANSFER-OK-${settlement.id}`,
          sourceType: "VENDOR_SETTLEMENT",
          sourceId: settlement.id,
          description: `Payout confirmed by Paystack: ${settlement.reference}`,
          entries: [
            { accountId: inTransitAcc.id, direction: "DEBIT", amountKobo: settlement.amountKobo },
            { accountId: clearingAcc.id, direction: "CREDIT", amountKobo: settlement.amountKobo },
          ],
        });
      }
    }

    // ═══════════ TRANSFER FAILED / REVERSED ═══════════
    if (event.event === "transfer.failed" || event.event === "transfer.reversed") {
      const settlement = await prisma.vendorSettlement.findFirst({
        where: { providerReference: event.data.reference },
      });

      if (settlement && settlement.status !== "FAILED") {
        await prisma.vendorSettlement.update({
          where: { id: settlement.id },
          data: { status: "FAILED", failureReason: event.data.reason || "Transfer failed" },
        });

        // Reverse ledger: In Transit → Available (restore vendor liability)
        const accounts = await prisma.ledgerAccount.findMany({
          where: { code: { in: ["2020", "2010"] } },
        });
        const inTransitAcc = accounts.find(a => a.code === "2020")!;
        const availableAcc = accounts.find(a => a.code === "2010")!;

        await postJournal({
          reference: `JRN-TRANSFER-FAIL-${settlement.reference}`,
          idempotencyKey: `TRANSFER-FAIL-${settlement.id}`,
          sourceType: "VENDOR_SETTLEMENT",
          sourceId: settlement.id,
          description: `Payout failed, restoring vendor balance: ${settlement.reference}`,
          entries: [
            { accountId: inTransitAcc.id, direction: "DEBIT", amountKobo: settlement.amountKobo },
            { accountId: availableAcc.id, direction: "CREDIT", amountKobo: settlement.amountKobo },
          ],
        });
      }
    }

    await prisma.paymentWebhookEvent.update({
      where: { provider_eventId: { provider: "PAYSTACK", eventId } },
      data: { status: "PROCESSED", processedAt: new Date() },
    });

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}