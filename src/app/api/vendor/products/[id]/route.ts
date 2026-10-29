import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") return new NextResponse("Unauthorized", { status: 401 });
  
  const { id } = await params;
  const vendor = await prisma.vendor.findUnique({ where: { userId: session.userId } });
  if (!vendor) return new NextResponse("Vendor not found", { status: 404 });

  const product = await prisma.product.findFirst({
    where: { id, vendorId: vendor.id },
    include: { images: true, category: true }
  });
  
  if (!product) return new NextResponse("Not found", { status: 404 });

  return NextResponse.json({
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    categorySlug: product.category.slug,
    sku: product.sku,
    priceNaira: product.priceKobo / 100,
    originalPriceNaira: product.originalPriceKobo ? product.originalPriceKobo / 100 : undefined,
    stock: product.stock,
    imageUrl: product.images[0]?.url || "/images/placeholder.svg",
  });
}