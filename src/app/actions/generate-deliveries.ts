"use server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "node:crypto";

export async function generateFinanceDeliveriesForOrder(orderId: string) {
  // Fetch all vendor orders for this order
  const vendorOrders = await prisma.financeVendorOrder.findMany({
    where: { orderId },
    include: { delivery: true, items: true },
  });

  const created: string[] = [];

  for (const vo of vendorOrders) {
    // Skip if delivery already exists (idempotency)
    if (vo.delivery) continue;

    const tracking = `ISRC-${Date.now()}-${randomBytes(3).toString("hex").toUpperCase()}`;

    await prisma.financeDelivery.create({
      data: {
        vendorOrderId: vo.id,
        status: "PENDING",
        trackingNumber: tracking,
        deliveryMethod: vo.deliveryMethod || "HOME_DELIVERY",
        shippingFeeKobo: vo.shippingFeeKobo || BigInt(0),
        weightGrams: 0,
        carrierCode: "ISOURCE_INTERNAL",
      },
    });

    created.push(tracking);
  }

  return { created, count: created.length };
}