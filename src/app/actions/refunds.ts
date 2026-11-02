"use server";
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

export async function approveRefund(refundId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.financeRefund.update({
    where: { id: refundId },
    data: { status: "APPROVED", approvedBy: session.userId },
  });
  revalidatePath("/admin/finance/refunds");
}

export async function rejectRefund(refundId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  const refund = await prisma.financeRefund.findUnique({ where: { id: refundId } });
  if (!refund) throw new Error("Refund not found");

  await prisma.$transaction([
    prisma.financeRefund.update({
      where: { id: refundId },
      data: { status: "REJECTED", processedAt: new Date() },
    }),
    // Restore vendor order to DELIVERED (so it becomes payable again)
    prisma.financeVendorOrder.update({
      where: { id: refund.vendorOrderId! },
      data: { status: "DELIVERED" },
    }),
  ]);
  revalidatePath("/admin/finance/refunds");
}