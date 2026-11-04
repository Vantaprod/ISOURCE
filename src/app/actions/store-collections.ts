"use server";

import { logAudit } from "@/lib/audit";
import { cloudinary } from "@/lib/cloudinary";
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

export async function createCollection(prevState: any, formData: FormData) {
  try {
    const vendor = await getVendor();
    const name = (formData.get("name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;
    
    // Handle optional image upload
    let imageUrl: string | null = null;
    const imageFile = formData.get("imageFile") as File | null;
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const base64 = buffer.toString("base64");
      const dataURI = `data:${imageFile.type};base64,${base64}`;
      const uploadRes = await cloudinary.uploader.upload(dataURI, { folder: "isource/store-collections" });
      imageUrl = uploadRes.secure_url;
    } else {
      const fallbackUrl = (formData.get("imageUrl") as string)?.trim() || null;
      imageUrl = fallbackUrl;
    }

    if (!name || name.length < 2) return { error: "Collection name is required." };

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const existing = await prisma.storeCollection.findUnique({
      where: { vendorId_slug: { vendorId: vendor.id, slug } }
    });
    if (existing) return { error: "You already have a collection with this name." };

    await prisma.storeCollection.create({
      data: { vendorId: vendor.id, name, slug, description, imageUrl, approvalStatus: "PENDING" }
    });

    revalidatePath("/vendor/store/collections");
    revalidatePath(`/brand/${vendor.slug}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to create collection" };
  }
}

export async function updateCollection(id: string, prevState: any, formData: FormData) {
  try {
    const vendor = await getVendor();
    const collection = await prisma.storeCollection.findFirst({ where: { id, vendorId: vendor.id } });
    if (!collection) return { error: "Collection not found" };

    const name = (formData.get("name") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;
    
    // Handle optional image upload
    let imageUrl: string | null = collection.imageUrl;
    const imageFile = formData.get("imageFile") as File | null;
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const base64 = buffer.toString("base64");
      const dataURI = `data:${imageFile.type};base64,${base64}`;
      const uploadRes = await cloudinary.uploader.upload(dataURI, { folder: "isource/store-collections" });
      imageUrl = uploadRes.secure_url;
    }

    if (!name || name.length < 2) return { error: "Collection name is required." };

    await prisma.storeCollection.update({
      where: { id },
      data: { name, description, imageUrl }
    });

    revalidatePath("/vendor/store/collections");
    revalidatePath(`/vendor/store/collections/${id}`);
    revalidatePath(`/brand/${vendor.slug}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update collection" };
  }
}

export async function deleteCollection(id: string) {
  const vendor = await getVendor();
  await prisma.storeCollection.deleteMany({ where: { id, vendorId: vendor.id } });
  revalidatePath("/vendor/store/collections");
  revalidatePath(`/brand/${vendor.slug}`);
}

export async function updateCollectionProducts(collectionId: string, productIds: string[]) {
  const vendor = await getVendor();
  const collection = await prisma.storeCollection.findFirst({ where: { id: collectionId, vendorId: vendor.id } });
  if (!collection) throw new Error("Collection not found");

  if (productIds.length > 0) {
    const validProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, vendorId: vendor.id },
      select: { id: true }
    });
    if (validProducts.length !== productIds.length) throw new Error("Some products don't belong to your store.");
  }

  if (productIds.length === 0) {
    await prisma.storeCollectionProduct.deleteMany({ where: { collectionId } });
  } else {
    await prisma.storeCollectionProduct.deleteMany({
      where: { collectionId, productId: { notIn: productIds } }
    });
  }

  for (let i = 0; i < productIds.length; i++) {
    await prisma.storeCollectionProduct.upsert({
      where: { collectionId_productId: { collectionId, productId: productIds[i] } },
      update: { sortOrder: i },
      create: { collectionId, productId: productIds[i], sortOrder: i }
    });
  }

  revalidatePath(`/vendor/store/collections/${collectionId}`);
  revalidatePath(`/brand/${vendor.slug}`);
  await logAudit({
      action: "collection.products.update",
      entityType: "StoreCollection",
      entityId: collectionId,
      vendorId: vendor.id,
      metadata: { productCount: productIds.length },
    });
    return { success: true };
}