"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { cloudinary, type UploadApiResponse } from "@/lib/cloudinary";
import type { BrandStatus } from "@prisma/client";

async function uploadToCloudinary(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "isource/brands", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Upload failed with no result"));
        }
      ).end(buffer);
    });
    
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return null;
  }
}

export async function updateBrandStatus(brandId: string, status: BrandStatus) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.brand.update({ where: { id: brandId }, data: { status } });
  await logAudit("BRAND_STATUS_UPDATED", "Brand", brandId, { status });
  revalidatePath("/admin/brands");
  revalidatePath("/");
}

export async function updateBrandDetails(id: string, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  const file = formData.get("logoFile") as File | null;
  const isFeatured = formData.get("isFeatured") === "on";
  const existingLogoUrl = formData.get("existingLogoUrl") as string;

  let logoUrl = existingLogoUrl || null;

  if (file && file.size > 0) {
    const uploadedUrl = await uploadToCloudinary(file);
    if (uploadedUrl) logoUrl = uploadedUrl;
  }

  await prisma.brand.update({
    where: { id },
    data: { logoUrl, isFeatured },
  });

  await logAudit("BRAND_DETAILS_UPDATED", "Brand", id, { isFeatured, logoUrl });
  revalidatePath("/admin/brands");
  revalidatePath(`/admin/brands/${id}/edit`);
  revalidatePath("/");
}