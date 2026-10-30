"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export async function createCollection(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const c = await prisma.collection.create({
    data: { name, slug: slugify(name) + "-" + Date.now().toString().slice(-4), description: description || null, imageUrl: imageUrl || null },
  });
  await logAudit("COLLECTION_CREATED", "Collection", c.id, { name });
  revalidatePath("/admin/collections");
}

export async function updateCollection(id: string, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const isActive = formData.get("isActive") === "on";
  await prisma.collection.update({ where: { id }, data: { name, description: description || null, imageUrl: imageUrl || null, isActive } });
  await logAudit("COLLECTION_UPDATED", "Collection", id, { name });
  revalidatePath("/admin/collections");
  revalidatePath(`/admin/collections/${id}/edit`);
  revalidatePath("/collection", "layout");
  revalidatePath("/");
}

export async function deleteCollection(id: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.collection.delete({ where: { id } });
  await logAudit("COLLECTION_DELETED", "Collection", id);
  revalidatePath("/admin/collections");
  revalidatePath("/collection", "layout");
}

export async function addProductToCollection(collectionId: string, productId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.collection.update({
    where: { id: collectionId },
    data: { products: { connect: { id: productId } } },
  });
  revalidatePath(`/admin/collections/${collectionId}/edit`);
  revalidatePath("/collection", "layout");
}

export async function removeProductFromCollection(collectionId: string, productId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.collection.update({
    where: { id: collectionId },
    data: { products: { disconnect: { id: productId } } },
  });
  revalidatePath(`/admin/collections/${collectionId}/edit`);
  revalidatePath("/collection", "layout");
}