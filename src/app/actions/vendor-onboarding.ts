"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function applyToSell(formData: FormData) {
  const session = await getSession();
  if (!session) return { success: false, error: "You must be logged in to apply." };

  const storeName = formData.get("storeName") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;

  try {
    const existing = await prisma.vendor.findUnique({ where: { userId: session.userId } });
    if (existing) return { success: false, error: "You already have a vendor profile." };

    await prisma.$transaction([
      prisma.user.update({ where: { id: session.userId }, data: { role: "VENDOR" } }),
      prisma.vendor.create({
        data: {
          userId: session.userId,
          name: storeName,
          slug: storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4),
          description,
          location,
          status: "PENDING", // Requires admin approval
        },
      }),
    ]);

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to submit application." };
  }
}