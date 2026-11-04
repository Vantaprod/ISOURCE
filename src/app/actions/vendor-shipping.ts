"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function getVendorDeliveries() {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") throw new Error("Unauthorized");
  const v = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!v) throw new Error("Vendor not found");

  return prisma.financeDelivery.findMany({
    where: { vendorOrder: { vendorId: v.id } },
    include: {
      vendorOrder: { select: { orderNumber: true, totalKobo: true, vendorId: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function markReadyForPickup(deliveryId: string) {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") throw new Error("Unauthorized");
  const v = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!v) throw new Error("Vendor not found");

  const d = await prisma.financeDelivery.findUnique({
    where: { id: deliveryId },
    include: { vendorOrder: true },
  });
  if (!d || d.vendorOrder.vendorId !== v.id) throw new Error("Unauthorized");

  await prisma.financeDelivery.update({
    where: { id: deliveryId },
    data: { status: "PICKUP_REQUESTED" },
  });
}