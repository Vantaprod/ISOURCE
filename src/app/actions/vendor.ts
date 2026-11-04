"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  shortDescription: z.string().min(10, "Short description too short"),
  description: z.string().min(20, "Full description too short"),
  categorySlug: z.string().min(1, "Category is required"),
  sku: z.string().min(1, "SKU is required"),
  priceNaira: z.coerce.number().min(1, "Price must be greater than 0"),
  originalPriceNaira: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  brandId: z.string().min(1, 'Brand is required'),
  warrantyRepair: z.boolean().default(false),
  warrantyReplacement: z.boolean().default(false),
  });

async function getVendorProfile() {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") {
    throw new Error("Unauthorized");
  }
  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.userId },
  });
  if (!vendor) {
    throw new Error("Vendor profile not found");
  }
  return vendor;
}

export async function createProduct(prevState: unknown, formData: FormData) {
  try {
    const vendor = await getVendorProfile();
    // Handle optional image uploads (max 10, min 6 per requirement)
    const imageFiles = formData.getAll("imageFiles") as File[];
    const validFiles = imageFiles.filter(f => f instanceof File && f.size > 0);
    let uploadedUrls: string[] = [];

    if (validFiles.length > 0) {
      if (validFiles.length < 6) return { error: "Please upload at least 6 images." };
      if (validFiles.length > 10) return { error: "You can upload a maximum of 10 images." };
      for (const file of validFiles) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString("base64");
        const dataURI = `data:${file.type};base64,${base64}`;
        const uploadRes = await cloudinary.uploader.upload(dataURI, { folder: "isource/products" });
        uploadedUrls.push(uploadRes.secure_url);
      }
    } else {
      uploadedUrls.push("/images/placeholder.svg");
    }
    
    const rawData = {
      name: formData.get("name"),
      shortDescription: formData.get("shortDescription"),
      description: formData.get("description"),
      categorySlug: formData.get("categorySlug"),
      sku: formData.get("sku"),
      priceNaira: formData.get("priceNaira"),
      originalPriceNaira: formData.get("originalPriceNaira") || undefined,
      stock: formData.get("stock"),
    };

    const parsed = productSchema.safeParse(rawData);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const data = parsed.data;
    const category = await prisma.category.findUnique({ where: { slug: data.categorySlug } });
    if (!category) throw new Error("Category not found");

    // Generate a unique slug
    const baseSlug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    await prisma.product.create({
      data: {
        slug,
        name: data.name,
        shortDescription: data.shortDescription,
        description: data.description,
        categoryId: category.id,
        vendorId: vendor.id,
        sku: data.sku,
        priceKobo: data.priceNaira * 100,
        originalPriceKobo: data.originalPriceNaira ? data.originalPriceNaira * 100 : null,
        stock: data.stock,
        specs: [],
        tags: [],
        images: { create: uploadedUrls.map((url, index) => ({ url, sortOrder: index })) },
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/vendor");
  } catch (err: unknown) {
    console.error(err);
    return { error: err instanceof Error ? err.message : "Failed to create product" };
  }
  redirect("/vendor");
}

export async function updateProduct(id: string, prevState: unknown, formData: FormData) {
  try {
    const vendor = await getVendorProfile();
    
    // Ensure vendor owns this product
    const existing = await prisma.product.findFirst({ where: { id, vendorId: vendor.id } });
    if (!existing) throw new Error("Product not found or unauthorized");
    // Handle optional image uploads (min 6, max 10)
    const imageFiles = formData.getAll("imageFiles") as File[];
    const validFiles = imageFiles.filter(f => f instanceof File && f.size > 0);
    let uploadedUrls: string[] = [];

    if (validFiles.length > 0) {
      if (validFiles.length < 6) return { error: "Please upload at least 6 images." };
      if (validFiles.length > 10) return { error: "You can upload a maximum of 10 images." };
      for (const file of validFiles) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString("base64");
        const dataURI = `data:${file.type};base64,${base64}`;
        const uploadRes = await cloudinary.uploader.upload(dataURI, { folder: "isource/products" });
        uploadedUrls.push(uploadRes.secure_url);
      }
    }

    const rawData = {
      name: formData.get("name"),
      shortDescription: formData.get("shortDescription"),
      description: formData.get("description"),
      categorySlug: formData.get("categorySlug"),
      sku: formData.get("sku"),
      priceNaira: formData.get("priceNaira"),
      originalPriceNaira: formData.get("originalPriceNaira") || undefined,
      stock: formData.get("stock"),

    };

    const parsed = productSchema.safeParse(rawData);
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    const data = parsed.data;
    const category = await prisma.category.findUnique({ where: { slug: data.categorySlug } });
    if (!category) throw new Error("Category not found");

    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        shortDescription: data.shortDescription,
        description: data.description,
        categoryId: category.id,
        sku: data.sku,
        priceKobo: data.priceNaira * 100,
        originalPriceKobo: data.originalPriceNaira ? data.originalPriceNaira * 100 : null,
        stock: data.stock,
        brandId: data.brandId,
        warrantyRepair: data.warrantyRepair,
        warrantyReplacement: data.warrantyReplacement,
        images: { deleteMany: {}, create: uploadedUrls.map((url, index) => ({ url, sortOrder: index })) },
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/vendor");
    revalidatePath(`/product/${existing.slug}`);
  } catch (err: unknown) {
    console.error(err);
    return { error: err instanceof Error ? err.message : "Failed to update product" };
  }
  redirect("/vendor");
}

export async function deleteProduct(id: string) {
  try {
    const vendor = await getVendorProfile();
    const existing = await prisma.product.findFirst({ where: { id, vendorId: vendor.id } });
    if (!existing) throw new Error("Unauthorized");

    await prisma.product.delete({ where: { id } });
    revalidatePath("/", "layout");
    revalidatePath("/vendor");
  } catch (err) {
    console.error(err);
  }
}
export async function updateVendorSettings(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") return { error: "Unauthorized" };

  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) return { error: "Vendor not found" };

  const afterSalesPhone = formData.get("afterSalesPhone") as string;
  
  if (!afterSalesPhone) return { error: "After-sales contact is required." };

  try {
    await prisma.vendor.update({
      where: { id: vendor.id },
      data: { afterSalesPhone },
    });
    revalidatePath("/vendor/settings");
    return { success: true };
  } catch (err) {
    return { error: "Failed to update settings" };
  }
}