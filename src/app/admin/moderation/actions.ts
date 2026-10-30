"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import type { ProductApprovalStatus } from "@prisma/client";

export async function moderateProduct(productId: string, status: ProductApprovalStatus) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.product.update({
    where: { id: productId },
    data: {
      approvalStatus: status,
      isActive: status === "APPROVED",
    },
  });

  await logAudit("PRODUCT_MODERATED", "Product", productId, { status });
  revalidatePath("/admin/moderation");
  revalidatePath("/");
  revalidatePath("/vendor/products");
}