"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function suggestCategory(name: string, parentId: string | null) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const cleanName = name.trim();
  if (cleanName.length < 3) return { error: "Category name is too short." };

  const slug = slugify(cleanName);

  // 1. Check for exact duplicate
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return { error: `A category with this name already exists. Please use "${existing.name}".` };
  }

  // 2. Check for similar names (fuzzy match)
  const similar = await prisma.category.findMany({
    where: { name: { contains: cleanName, mode: "insensitive" } },
    take: 1
  });
  if (similar.length > 0) {
    return { error: `Did you mean "${similar[0].name}"? Please check the existing categories before suggesting a new one.` };
  }

  // 3. Create the category as PENDING
  await prisma.category.create({
    data: {
      name: cleanName,
      shortName: cleanName.length > 30 ? cleanName.substring(0, 30) : cleanName,
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`, // Ensure unique slug even if name overlaps slightly
      parentId,
      status: "PENDING",
    }
  });

  return { success: true };
}