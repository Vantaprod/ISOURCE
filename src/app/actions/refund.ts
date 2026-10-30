"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function requestRefund(orderId: string, reason: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order || order.userId !== session.userId) throw new Error("Order not found");

  // Check if refund already requested
  const existing = await prisma.refund.findFirst({ where: { orderId } });
  if (existing) throw new Error("Refund already requested for this order");

  await prisma.refund.create({
    data: {
      orderId,
      amountKobo: order.totalKobo,
      reason,
      status: "REQUESTED",
      requestedBy: session.userId,
    },
  });

  revalidatePath("/account");
}