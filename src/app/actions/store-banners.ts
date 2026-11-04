"use server";

import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { cloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

async function getVendor() {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") throw new Error("Unauthorized");
  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) throw new Error("Vendor not found");
  return vendor;
}

async function uploadImage(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const dataURI = `data:${file.type};base64,${base64}`;
  const res = await cloudinary.uploader.upload(dataURI, { folder: "isource/store-banners" });
  return res.secure_url;
}

export async function addStoreBanner(prevState: any, formData: FormData) {
  try {
    const vendor = await getVendor();
    
    const desktopFile = formData.get("desktopImage") as File;
    const mobileFile = formData.get("mobileImage") as File;
    
    if (!desktopFile || desktopFile.size === 0) return { error: "Desktop image is required." };

    const desktopUrl = await uploadImage(desktopFile);
    let mobileUrl = null;

    const startsAtRaw = formData.get("startsAt") as string;
    const endsAtRaw = formData.get("endsAt") as string;
    const startsAt = startsAtRaw ? new Date(startsAtRaw) : null;
    const endsAt = endsAtRaw ? new Date(endsAtRaw) : null;

    // Validation: endsAt must be after startsAt if both set
    if (startsAt && endsAt && endsAt <= startsAt) {
      return { error: "End date must be after start date." };
    }
    if (mobileFile && mobileFile.size > 0) {
      mobileUrl = await uploadImage(mobileFile);
    }

    await prisma.storeBanner.create({
      data: {
        vendorId: vendor.id,
        desktopUrl,
        mobileUrl,
        heading: formData.get("heading") as string || null,
        description: formData.get("description") as string || null,
        ctaLabel: formData.get("ctaLabel") as string || null,
        ctaUrl: formData.get("ctaUrl") as string || null,
        isActive: true,
        startsAt,
        endsAt,
        approvalStatus: "PENDING",
        startsAt,
        endsAt,
      }
    });

    revalidatePath("/vendor/store/banners");
    revalidatePath(`/brand/${vendor.slug}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to upload banner" };
  }
}

export async function toggleBannerStatus(id: string, currentStatus: boolean) {
  const vendor = await getVendor();
  const bannerForLog = await prisma.storeBanner.findUnique({ where: { id } });
  if (bannerForLog) {
    await logAudit({
      action: "banner.toggle",
      entityType: "StoreBanner",
      entityId: id,
      vendorId: bannerForLog.vendorId,
      metadata: { wasActive: currentStatus, nowActive: !currentStatus },
    });
  }
  await prisma.storeBanner.updateMany({
    where: { id, vendorId: vendor.id },
    data: { isActive: !currentStatus }
  });
  revalidatePath("/vendor/store/banners");
  revalidatePath(`/brand/${vendor.slug}`);
}

export async function deleteStoreBanner(id: string) {
  const vendor = await getVendor();
  await prisma.storeBanner.deleteMany({
    where: { id, vendorId: vendor.id }
  });
  revalidatePath("/vendor/store/banners");
  revalidatePath(`/brand/${vendor.slug}`);
}