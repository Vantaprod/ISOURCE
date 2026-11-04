"use server";
import { prisma } from "@/lib/prisma";

export async function getInfiniteProducts(page: number = 0, limit: number = 10) {
  try {
    const products = await prisma.product.findMany({
      where: { 
        isActive: true, 
        approvalStatus: "APPROVED" 
      },
      include: { 
        images: { take: 1 }, 
        vendor: true, 
        category: true, 
        variants: true, 
        reviews: true 
      },
      // Simple, safe sort (Highest rating first)
      orderBy: [
        { rating: "desc" },
        { createdAt: "desc" }
      ],
      take: limit,
      skip: page * limit,
    });

    return products.map((p) => ({
      ...p,
      category: p.category?.slug || "uncategorized",
      vendorSlug: p.vendor?.slug || "isource",
      images: p.images.map((i) => i.url),
      specs: (p.specs as unknown) as { label: string; value: string }[],
      tags: (p.tags as string[]) || [],
    }));
  } catch (error) {
    console.error("Infinite feed error:", error);
    return [];
  }
}