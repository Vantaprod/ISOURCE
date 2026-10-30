"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function registerBrand(formData: FormData) {
  const session = await getSession();
  if (!session) return { success: false, error: "Please log in first" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const website = formData.get("website") as string;

  try {
    const existing = await prisma.brand.findFirst({ where: { ownerId: session.userId } });
    if (existing) return { success: false, error: "You already own a brand" };

    await prisma.$transaction([
      prisma.user.update({ where: { id: session.userId }, data: { role: "BRAND" } }),
      prisma.brand.create({
        data: {
          name, description, website: website || null,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4),
          ownerId: session.userId,
          status: "PENDING",
        },
      }),
    ]);

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to register brand" };
  }
}