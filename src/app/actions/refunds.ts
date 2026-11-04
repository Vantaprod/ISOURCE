"use server";
import { notify } from "@/lib/notify";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function requestRefund(vendorOrderId: string, reason: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const order = await prisma.financeVendorOrder.findUnique({
    where: { id: vendorOrderId },
    include: { paymentAllocations: true },
  });
  if (!order) throw new Error("Order not found");

  // Ensure a payment allocation exists
  if (order.paymentAllocations.length === 0) {
    throw new Error("This order has not been paid");
  }
  const paymentId = order.paymentAllocations[0].paymentId;

  // Check for existing refund
  const existing = await prisma.financeRefund.findFirst({
    where: { vendorOrderId, status: { notIn: ["FAILED", "REJECTED"] } },
  });
  if (existing) throw new Error("A refund request already exists for this order");

  // Create the refund request
  const refund = await prisma.financeRefund.create({
    data: {
      paymentId,
      vendorOrderId,
      reference: `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      amountKobo: order.vendorNetKobo,
      currency: "NGN",
      reason,
      status: "REQUESTED",
    },
  });

  // Put the vendor order into DISPUTED (this blocks the vendor from being paid)
  await prisma.financeVendorOrder.update({
    where: { id: vendorOrderId },
    data: { status: "DISPUTED" },
  });

  revalidatePath("/account/orders");
  revalidatePath("/admin/finance/refunds");
  return { success: true, refundId: refund.id };
}
// ─── ADMIN: Approve Refund ─────────────────────────────────
export async function approveRefund(refundId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  const refund = await prisma.financeRefund.findUnique({
    where: { id: refundId },
    include: { vendorOrder: true }
  });
  if (!refund) throw new Error("Refund not found");
  if (refund.status === "SUCCESSFUL") throw new Error("Refund already processed");

  // 1. Mark refund as successful (in production, this would trigger Paystack Refund API)
  await prisma.financeRefund.update({
    where: { id: refundId },
    data: { status: "SUCCESSFUL", approvedBy: session.userId, processedAt: new Date() },
  });

  // 2. Post reversal ledger entries
  // Original: Debit Clearing / Credit Pending / Credit Commission
  // Reversal: Debit Pending / Debit Commission / Credit Clearing
  const accounts = await prisma.ledgerAccount.findMany({
    where: { code: { in: ["1000", "2000", "4000"] } },
  });
  const clearing = accounts.find(a => a.code === "1000")!;
  const pending = accounts.find(a => a.code === "2000")!;
  const commission = accounts.find(a => a.code === "4000")!;

  try {
    const { postJournal } = await import("@/modules/ledger/ledger.service");
    await postJournal({
      reference: `REF-${refund.reference}`,
      idempotencyKey: `REFUND-APPROVED-${refund.id}`,
      sourceType: "FINANCE_REFUND",
      sourceId: refund.id,
      description: `Refund approved for order ${refund.vendorOrder?.orderNumber}`,
      entries: [
        { accountId: pending.id, direction: "DEBIT", amountKobo: refund.amountKobo },
        { accountId: commission.id, direction: "DEBIT", amountKobo: BigInt(0) }, // Simplified - would need commission split
        { accountId: clearing.id, direction: "CREDIT", amountKobo: refund.amountKobo },
      ].filter(e => e.amountKobo > 0n),
    });
  } catch (err) {
    console.error("Ledger posting failed:", err);
    // We don't throw - the refund status change is the critical part
  }

  revalidatePath("/admin/refunds");
  // Notify the customer their refund was approved
  try {
    const payment = await prisma.financePayment.findUnique({ where: { id: refund.paymentId } });
    if (payment?.customerId) {
      await notify({
        userId: payment.customerId,
        title: "Refund Approved ✅",
        message: `Your refund of ₦${(Number(refund.amountKobo) / 100).toLocaleString()} has been approved and will be processed within 3-5 business days.`,
        type: "REFUND",
        linkUrl: "/account/refunds",
      });
    }
  } catch (e) { console.error("Refund notify failed:", e); }
  revalidatePath("/admin/finance");
  return { success: true };
}

// ─── ADMIN: Reject Refund ──────────────────────────────────
export async function rejectRefund(refundId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  const refund = await prisma.financeRefund.findUnique({ where: { id: refundId } });
  if (!refund) throw new Error("Refund not found");

  await prisma.$transaction([
    prisma.financeRefund.update({
      where: { id: refundId },
      data: { status: "REJECTED", approvedBy: session.userId, processedAt: new Date() },
    }),
    // Restore the vendor order to DELIVERED so vendor can be paid
    prisma.financeVendorOrder.update({
      where: { id: refund.vendorOrderId! },
      data: { status: "DELIVERED" },
    }),
  ]);

  revalidatePath("/admin/refunds");
  try {
    const payment = await prisma.financePayment.findUnique({ where: { id: refund.paymentId } });
    if (payment?.customerId) {
      await notify({
        userId: payment.customerId,
        title: "Refund Rejected ❌",
        message: `Your refund request was reviewed and rejected. Please check your email or contact support for details.`,
        type: "REFUND",
        linkUrl: "/account/refunds",
      });
    }
  } catch (e) { console.error("Refund notify failed:", e); }
  return { success: true };
}