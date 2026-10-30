"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function createBanner(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const ctaLabel = formData.get("ctaLabel") as string;
  const ctaUrl = formData.get("ctaUrl") as string;
  const position = Number(formData.get("position") || 0);
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;

  const banner = await prisma.heroBanner.create({
    data: {
      title, subtitle: subtitle || null, description: description || null,
      imageUrl, ctaLabel: ctaLabel || null, ctaUrl: ctaUrl || null,
      position,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      isActive: true,
    },
  });

  await logAudit("BANNER_CREATED", "HeroBanner", banner.id, { title });
  revalidatePath("/");
  revalidatePath("/admin/studio/hero");
}

export async function toggleBanner(id: string, isActive: boolean) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.heroBanner.update({ where: { id }, data: { isActive } });
  await logAudit("BANNER_TOGGLED", "HeroBanner", id, { isActive });
  revalidatePath("/");
  revalidatePath("/admin/studio/hero");
}

export async function deleteBanner(id: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.heroBanner.delete({ where: { id } });
  await logAudit("BANNER_DELETED", "HeroBanner", id);
  revalidatePath("/");
  revalidatePath("/admin/studio/hero");
}