"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function createPromo(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.promoBanner.create({
    data: {
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string,
      ctaLabel: formData.get("ctaLabel") as string,
      ctaUrl: formData.get("ctaUrl") as string,
      imageUrl: formData.get("imageUrl") as string || null,
      theme: formData.get("theme") as string || "orange",
      position: Number(formData.get("position") || 0),
      isActive: true,
    },
  });

  await logAudit("PROMO_CREATED", "PromoBanner", undefined, { title: formData.get("title") });
  revalidatePath("/");
  revalidatePath("/admin/studio/promos");
}

export async function updatePromo(id: string, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.promoBanner.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string,
      ctaLabel: formData.get("ctaLabel") as string,
      ctaUrl: formData.get("ctaUrl") as string,
      imageUrl: formData.get("imageUrl") as string || null,
      theme: formData.get("theme") as string || "orange",
      position: Number(formData.get("position") || 0),
      isActive: formData.get("isActive") === "on",
    },
  });

  await logAudit("PROMO_UPDATED", "PromoBanner", id);
  revalidatePath("/");
  revalidatePath("/admin/studio/promos");
}

export async function deletePromo(id: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.promoBanner.delete({ where: { id } });
  await logAudit("PROMO_DELETED", "PromoBanner", id);
  revalidatePath("/");
  revalidatePath("/admin/studio/promos");
}