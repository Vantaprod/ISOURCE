"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import type { ShipmentCarrier } from "@prisma/client";

export async function createShipment(orderId: string, carrier: ShipmentCarrier, trackingNumber: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.$transaction([
    prisma.shipment.create({
      data: {
        orderId,
        carrier,
        trackingNumber,
        status: "DISPATCHED",
        dispatchedAt: new Date(),
      },
    }),
    prisma.order.update({
      where: { id: orderId },
      data: { status: "SHIPPED" },
    }),
    prisma.orderItem.updateMany({
      where: { orderId },
      data: { fulfillmentStatus: "DISPATCHED" },
    }),
  ]);

  revalidatePath("/admin/orders");
  revalidatePath("/account");
}