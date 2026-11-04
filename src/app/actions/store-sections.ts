"use server";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

async function getVendor() {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") throw new Error("Unauthorized");
  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) throw new Error("Vendor not found");
  return vendor;
}

// â”€â”€â”€ Section management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function initializeStoreSections() {
  const vendor = await getVendor();
  const existing = await prisma.storeSection.findMany({ where: { vendorId: vendor.id } });
  if (existing.length > 0) return;

  const defaults: any[] = [
    { type: "HERO", sortOrder: 0 },
    { type: "COLLECTIONS", sortOrder: 1 },
    { type: "ALL_PRODUCTS", sortOrder: 2 },
    { type: "BRAND_STORY", sortOrder: 3 },
  ];

  await prisma.storeSection.createMany({
    data: defaults.map(d => ({ ...d, vendorId: vendor.id, isActive: true })),
  });

  revalidatePath("/vendor/store/sections");
}

export async function reorderSections(orderedIds: string[]) {
  const vendor = await getVendor();
  for (let i = 0; i < orderedIds.length; i++) {
    await prisma.storeSection.updateMany({
      where: { id: orderedIds[i], vendorId: vendor.id },
      data: { sortOrder: i },
    });
  }
  revalidatePath("/vendor/store/sections");
  revalidatePath(`/brand/${vendor.slug}`);
  await logAudit({
    action: "sections.reorder",
    entityType: "StoreSection",
    entityId: vendor.id,
    vendorId: vendor.id,
    metadata: { sectionCount: orderedIds.length },
  });

  return { success: true };
}

export async function toggleSection(id: string, currentActive: boolean) {
  const vendor = await getVendor();
  await prisma.storeSection.updateMany({
    where: { id, vendorId: vendor.id },
    data: { isActive: !currentActive },
  });
  revalidatePath("/vendor/store/sections");
  revalidatePath(`/brand/${vendor.slug}`);
  return { success: true };
}

// â”€â”€â”€ Theme â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function updateStoreTheme(prevState: any, formData: FormData) {
  const vendor = await getVendor();
  const accentColor = formData.get("accentColor") as string;
  const backgroundColor = formData.get("backgroundColor") as string;
  const buttonStyle = formData.get("buttonStyle") as string;

  // Simple hex validation
  const hexRegex = /^#[0-9A-Fa-f]{6}$/;
  if (!hexRegex.test(accentColor) || !hexRegex.test(backgroundColor)) {
    return { error: "Colors must be valid hex codes (e.g., #F58220)" };
  }
  const allowedStyles = ["rounded-none", "rounded-md", "rounded-lg", "rounded-xl", "rounded-full"];
  if (!allowedStyles.includes(buttonStyle)) {
    return { error: "Invalid button style" };
  }

  await prisma.storeTheme.upsert({
    where: { vendorId: vendor.id },
    update: { accentColor, backgroundColor, buttonStyle },
    create: { vendorId: vendor.id, accentColor, backgroundColor, buttonStyle },
  });

  revalidatePath("/vendor/store/theme");
  revalidatePath(`/brand/${vendor.slug}`);
  return { success: true };
}