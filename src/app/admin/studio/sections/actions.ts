"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import type { HomepageSectionType } from "@prisma/client";

export async function createSection(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const type = formData.get("type") as HomepageSectionType;
  const position = Number(formData.get("position") || 0);

  const section = await prisma.homepageSection.create({
    data: { title, subtitle: subtitle || null, type, position, isVisible: true },
  });

  await logAudit("SECTION_CREATED", "HomepageSection", section.id, { title, type });
  revalidatePath("/");
  revalidatePath("/admin/studio/sections");
}

export async function toggleSection(id: string, isVisible: boolean) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.homepageSection.update({ where: { id }, data: { isVisible } });
  await logAudit("SECTION_TOGGLED", "HomepageSection", id, { isVisible });
  revalidatePath("/");
  revalidatePath("/admin/studio/sections");
}

export async function deleteSection(id: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.homepageSection.delete({ where: { id } });
  await logAudit("SECTION_DELETED", "HomepageSection", id);
  revalidatePath("/");
  revalidatePath("/admin/studio/sections");
}

export async function moveSection(id: string, direction: "up" | "down") {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");
  const current = await prisma.homepageSection.findUnique({ where: { id } });
  if (!current) return;
  const newPos = direction === "up" ? current.position - 1 : current.position + 1;
  await prisma.homepageSection.update({ where: { id }, data: { position: newPos } });
  revalidatePath("/");
  revalidatePath("/admin/studio/sections");
}