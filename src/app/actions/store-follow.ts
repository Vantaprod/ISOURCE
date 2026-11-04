"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function toggleFollowStore(vendorId: string, vendorSlug: string) {
  const session = await getSession();
  if (!session) return { error: "You must be logged in to follow a store." };

  const existing = await prisma.storeFollower.findUnique({
    where: { vendorId_userId: { vendorId, userId: session.userId } },
  });

  if (existing) {
    await prisma.storeFollower.delete({ where: { id: existing.id } });
    revalidatePath(`/brand/${vendorSlug}`);
    return { success: true, followed: false };
  } else {
    await prisma.storeFollower.create({
      data: { vendorId, userId: session.userId },
    });
    revalidatePath(`/brand/${vendorSlug}`);
    return { success: true, followed: true };
  }
}

export async function isFollowingStore(vendorId: string) {
  const session = await getSession();
  if (!session) return false;
  const existing = await prisma.storeFollower.findUnique({
    where: { vendorId_userId: { vendorId, userId: session.userId } },
  });
  return !!existing;
}