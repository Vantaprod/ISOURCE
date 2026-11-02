"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const bundleSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  priceNaira: z.coerce.number().min(1),
  originalPriceNaira: z.coerce.number().optional(),
  imageUrl: z.string().url().default("/images/placeholder.svg"),
});

export async function createBundle(prevState: { error?: string } | null, formData: FormData) {
  const session = await getSession();
  if (!session || (session.role !== "VENDOR" && session.role !== "BRAND" && session.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    priceNaira: formData.get("priceNaira"),
    originalPriceNaira: formData.get("originalPriceNaira") || undefined,
    imageUrl: formData.get("imageUrl") || "/images/placeholder.svg",
  };

  const parsed = bundleSchema.safeParse(rawData);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;

  try {
    let vendorId = null;
    let brandId = null;

    if (session.role === "VENDOR") {
      const v = await prisma.vendor.findUnique({ where: { userId: session.userId } });
      if (v) vendorId = v.id;
    } else if (session.role === "BRAND") {
      const b = await prisma.brand.findFirst({ where: { ownerId: session.userId } });
      if (b) brandId = b.id;
    }

    const baseSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const productIds = formData.getAll("productIds[]") as string[];
    if (productIds.length === 0) return { error: "Please select at least one product for the bundle." };

    await prisma.bundle.create({
      data: {
        slug,
        title: data.title,
        description: data.description,
        category: data.category,
        priceKobo: data.priceNaira * 100,
        originalPriceKobo: data.originalPriceNaira ? data.originalPriceNaira * 100 : null,
        imageUrl: data.imageUrl,
        vendorId,
        brandId,
        items: {
          create: productIds.map(id => ({ productId: id }))
        }
      },
    });

    revalidatePath("/");
    revalidatePath("/bundles");

    if (session.role === "VENDOR") redirect("/vendor/bundles");
    if (session.role === "BRAND") redirect("/brand/bundles");
    redirect("/admin/studio/bundles");
  } catch (err) {
    console.error(err);
    return { error: "Failed to create bundle" };
  }
}