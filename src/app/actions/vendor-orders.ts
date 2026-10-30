"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import type { FulfillmentStatus } from "@prisma/client";

export async function updateItemFulfillment(itemId: string, status: FulfillmentStatus) {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") throw new Error("Unauthorized");

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) throw new Error("Vendor not found");

  const item = await prisma.orderItem.findUnique({ where: { id: itemId } });
  if (!item || item.vendorId !== vendor.id) throw new Error("Unauthorized item");

  await prisma.orderItem.update({ where: { id: itemId }, data: { fulfillmentStatus: status } });
  revalidatePath("/vendor/orders");
}