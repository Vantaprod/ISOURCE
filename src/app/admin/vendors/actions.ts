"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import type { VendorStatus } from "@prisma/client";

export async function updateVendorStatus(vendorId: string, status: VendorStatus) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.vendor.update({ where: { id: vendorId }, data: { status } });
  revalidatePath("/admin/vendors");
  revalidatePath("/admin");
}