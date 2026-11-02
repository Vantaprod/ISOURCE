"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { postJournal } from "@/modules/ledger/ledger.service";
import { revalidatePath } from "next/cache";

export async function markVendorOrderDelivered(vendorOrderId: string, trackingNumber?: string) {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") throw new Error("Unauthorized");

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) throw new Error("Vendor not found");

  const order = await prisma.financeVendorOrder.findFirst({
    where: { id: vendorOrderId, vendorId: vendor.id },
  });
  if (!order) throw new Error("Order not found");

  // 1. Update order + delivery status
  await prisma.$transaction([
    prisma.financeVendorOrder.update({
      where: { id: vendorOrderId },
      data: { status: "DELIVERED", deliveredAt: new Date() },
    }),
    prisma.financeDelivery.upsert({
      where: { vendorOrderId },
      update: { status: "DELIVERED", deliveredAt: new Date(), trackingNumber: trackingNumber || undefined },
      create: {
        vendorOrderId,
        status: "DELIVERED",
        deliveredAt: new Date(),
        trackingNumber: trackingNumber || null,
      },
    }),
  ]);

  // 2. Post ledger: Pending → Available (this is the missing critical step)
  const accounts = await prisma.ledgerAccount.findMany({
    where: { code: { in: ["2000", "2010"] } },
  });
  const pendingAcc = accounts.find(a => a.code === "2000")!;
  const availableAcc = accounts.find(a => a.code === "2010")!;

  await postJournal({
    reference: `JRN-DELIVERED-${order.orderNumber}`,
    idempotencyKey: `DELIVERED-${order.id}`,
    sourceType: "VENDOR_ORDER",
    sourceId: order.id,
    description: `Delivery confirmed, earnings unlocked: ${order.orderNumber}`,
    entries: [
      { accountId: pendingAcc.id, direction: "DEBIT", amountKobo: order.vendorNetKobo },
      { accountId: availableAcc.id, direction: "CREDIT", amountKobo: order.vendorNetKobo },
    ],
  });

  revalidatePath("/vendor/orders");
  revalidatePath("/vendor/finance");
  return { success: true };
}
// Compatibility shim for legacy VendorOrderRow component
export async function updateItemFulfillment(itemId: string, newStatus: string) {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") throw new Error("Unauthorized");

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) throw new Error("Vendor not found");

  const item = await prisma.financeOrderItem.findUnique({
    where: { id: itemId },
    include: { vendorOrder: true },
  });
  
  if (!item || item.vendorOrder.vendorId !== vendor.id) {
    throw new Error("Unauthorized");
  }

  if (newStatus === "DELIVERED" || newStatus === "delivered") {
    return await markVendorOrderDelivered(item.vendorOrderId);
  }

  await prisma.financeVendorOrder.update({
    where: { id: item.vendorOrderId },
    data: { status: newStatus as any },
  });

  revalidatePath("/vendor/orders");
  revalidatePath("/vendor/finance");
  return { success: true };
}