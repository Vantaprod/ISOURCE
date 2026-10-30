"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import type { BrandStatus } from "@prisma/client";

export async function updateBrandStatus(brandId: string, status: BrandStatus) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.brand.update({ where: { id: brandId }, data: { status } });
  revalidatePath("/admin/brands");
  revalidatePath("/admin");
}