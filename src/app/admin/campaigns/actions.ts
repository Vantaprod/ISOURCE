"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export async function createCampaign(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  const c = await prisma.campaign.create({
    data: {
      name: formData.get("name") as string,
      slug: slugify(formData.get("name") as string) + "-" + Date.now().toString().slice(-4),
      description: (formData.get("description") as string) || null,
      themeColor: (formData.get("themeColor") as string) || "#F07824",
      bannerId: (formData.get("bannerId") as string) || null,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      isActive: true,
    },
  });
  await logAudit("CAMPAIGN_CREATED", "Campaign", c.id, { name: c.name });
  revalidatePath("/admin/campaigns");
  revalidatePath("/");
}

export async function updateCampaign(id: string, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.campaign.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      themeColor: (formData.get("themeColor") as string) || "#F07824",
      bannerId: (formData.get("bannerId") as string) || null,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      isActive: formData.get("isActive") === "on",
    },
  });
  await logAudit("CAMPAIGN_UPDATED", "Campaign", id);
  revalidatePath("/admin/campaigns");
  revalidatePath(`/admin/campaigns/${id}/edit`);
  revalidatePath("/");
}

export async function deleteCampaign(id: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.campaign.delete({ where: { id } });
  await logAudit("CAMPAIGN_DELETED", "Campaign", id);
  revalidatePath("/admin/campaigns");
  revalidatePath("/");
}