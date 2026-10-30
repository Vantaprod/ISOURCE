"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function createSponsoredCampaign(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  const productId = formData.get("productId") as string;
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = new Date(formData.get("endDate") as string);
  const budgetKobo = Number(formData.get("budgetNaira") || 0) * 100;
  const costPerClickKobo = Number(formData.get("costPerClickNaira") || 0) * 100;
  const priority = Number(formData.get("priority") || 0);

  const c = await prisma.sponsoredCampaign.create({
    data: { productId, budgetKobo, costPerClickKobo, startDate, endDate, priority, isActive: true },
  });
  await logAudit("SPONSORED_CAMPAIGN_CREATED", "SponsoredCampaign", c.id, { productId, budgetKobo });
  revalidatePath("/admin/sponsored");
}

export async function toggleSponsored(id: string, isActive: boolean) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.sponsoredCampaign.update({ where: { id }, data: { isActive } });
  await logAudit("SPONSORED_CAMPAIGN_TOGGLED", "SponsoredCampaign", id, { isActive });
  revalidatePath("/admin/sponsored");
}

export async function deleteSponsored(id: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.sponsoredCampaign.delete({ where: { id } });
  await logAudit("SPONSORED_CAMPAIGN_DELETED", "SponsoredCampaign", id);
  revalidatePath("/admin/sponsored");
}