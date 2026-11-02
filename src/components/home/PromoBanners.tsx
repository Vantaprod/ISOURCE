import { prisma } from "@/lib/prisma";
import { PromoSlider } from "./PromoSlider";

export async function PromoBanners() {
  let banners = [];
  try {
    banners = await prisma.promoBanner.findMany({
      where: { isActive: true },
      orderBy: { position: "asc" },
    });
  } catch (error) {
    console.error("Failed to load promo banners:", error);
    return null;
  }

  if (banners.length === 0) return null;

  return <PromoSlider banners={banners} />;
}