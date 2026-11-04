"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function submitReview(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "You must be logged in to write a review." };

  const productId = formData.get("productId") as string;
  const productSlug = formData.get("productSlug") as string;
  const rating = parseInt(formData.get("rating") as string);
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  if (!rating || rating < 1 || rating > 5) return { error: "Please provide a star rating." };
  if (!title) return { error: "Please add a short title for your review." };

  try {
    await prisma.productReview.upsert({
      where: {
        productId_userId: { productId, userId: session.userId }
      },
      update: { rating, title, body },
      create: { productId, userId: session.userId, rating, title, body }
    });

    const aggregate = await prisma.productReview.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: aggregate._avg.rating || 0,
        reviewCount: aggregate._count.rating || 0,
      }
    });

    revalidatePath(`/product/${productSlug}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to submit review." };
  }
}
