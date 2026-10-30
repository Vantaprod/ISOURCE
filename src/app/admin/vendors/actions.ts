"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import type { VendorStatus } from "@prisma/client";

export async function updateVendorStatus(vendorId: string, status: VendorStatus) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.vendor.update({ where: { id: vendorId }, data: { status } });
  
  if (status === "SUSPENDED" || status === "REJECTED" || status === "CLOSED") {
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (vendor) {
       await prisma.user.update({ where: { id: vendor.userId }, data: { role: "CUSTOMER" } });
    }
  }

  revalidatePath("/admin/vendors");
  revalidatePath("/admin");
  revalidatePath("/", "layout");
}