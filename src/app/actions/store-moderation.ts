"use server";

import { logAudit } from "@/lib/audit";
import { notify, getVendorUserId } from "@/lib/notify";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  return session;
}

export async function approveBanner(bannerId: string) {
  await requireAdmin();
  const banner = await prisma.storeBanner.update({
    where: { id: bannerId },
    data: { approvalStatus: "APPROVED", rejectionReason: null },
    include: { vendor: true },
  });
  const b = await prisma.storeBanner.findUnique({ where: { id: bannerId } });
  if (b) await logAudit({ action: "admin.banner.approve", entityType: "StoreBanner", entityId: bannerId, vendorId: b.vendorId, metadata: null });
  revalidatePath("/admin/store-moderation");
  revalidatePath(`/brand/${banner.vendor.slug}`);
  const userId = await getVendorUserId(banner.vendorId);
  if (userId) await notify({
    userId,
    title: "Banner Approved ✅",
    message: `Your banner "${banner.heading || "Untitled"}" is now live on your storefront.`,
    type: "MODERATION",
    linkUrl: "/vendor/store/banners",
  });
  return { success: true };
}

export async function rejectBanner(bannerId: string, reason: string) {
  await requireAdmin();
  const banner = await prisma.storeBanner.update({
    where: { id: bannerId },
    data: { approvalStatus: "REJECTED", rejectionReason: reason },
    include: { vendor: true },
  });
  const b = await prisma.storeBanner.findUnique({ where: { id: bannerId } });
  if (b) await logAudit({ action: "admin.banner.reject", entityType: "StoreBanner", entityId: bannerId, vendorId: b.vendorId, metadata: { reason } });
  revalidatePath("/admin/store-moderation");
  revalidatePath(`/brand/${banner.vendor.slug}`);
  const userId = await getVendorUserId(banner.vendorId);
  if (userId) await notify({
    userId,
    title: "Banner Rejected ❌",
    message: `Your banner was rejected. Reason: ${reason}`,
    type: "MODERATION",
    linkUrl: "/vendor/store/banners",
  });
  return { success: true };
}

export async function approveCollection(collectionId: string) {
  await requireAdmin();
  const col = await prisma.storeCollection.update({
    where: { id: collectionId },
    data: { approvalStatus: "APPROVED", rejectionReason: null },
    include: { vendor: true },
  });
  const c = await prisma.storeCollection.findUnique({ where: { id: collectionId } });
  if (c) await logAudit({ action: "admin.collection.approve", entityType: "StoreCollection", entityId: collectionId, vendorId: c.vendorId, metadata: null });
  revalidatePath("/admin/store-moderation");
  revalidatePath(`/brand/${col.vendor.slug}`);
  const userId = await getVendorUserId(col.vendorId);
  if (userId) await notify({
    userId,
    title: "Collection Approved ✅",
    message: `Your collection "${col.name}" is now live on your storefront.`,
    type: "MODERATION",
    linkUrl: "/vendor/store/collections",
  });
  return { success: true };
}

export async function rejectCollection(collectionId: string, reason: string) {
  await requireAdmin();
  const col = await prisma.storeCollection.update({
    where: { id: collectionId },
    data: { approvalStatus: "REJECTED", rejectionReason: reason },
    include: { vendor: true },
  });
  const c = await prisma.storeCollection.findUnique({ where: { id: collectionId } });
  if (c) await logAudit({ action: "admin.collection.reject", entityType: "StoreCollection", entityId: collectionId, vendorId: c.vendorId, metadata: { reason } });
  revalidatePath("/admin/store-moderation");
  revalidatePath(`/brand/${col.vendor.slug}`);
  const userId = await getVendorUserId(col.vendorId);
  if (userId) await notify({
    userId,
    title: "Collection Rejected ❌",
    message: `Your collection "${col.name}" was rejected. Reason: ${reason}`,
    type: "MODERATION",
    linkUrl: "/vendor/store/collections",
  });
  return { success: true };
}