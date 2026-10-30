"use server";
import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/auth-schema";
import { createSession, deleteSession, type Workspace } from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

async function getUserWorkspaces(userId: string): Promise<Workspace[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { vendor: true, brands: true, memberships: { include: { vendor: true, brand: true } } },
  });
  if (!user) return [];

  const workspaces: Workspace[] = [{ id: "customer", type: "CUSTOMER", name: "My Account" }];
  if (user.vendor) workspaces.push({ id: user.vendor.id, type: "VENDOR", name: user.vendor.name });
  user.brands.forEach(b => workspaces.push({ id: b.id, type: "BRAND", name: b.name }));
  user.memberships.forEach(m => {
    if (m.vendor) workspaces.push({ id: m.vendor.id, type: "VENDOR", name: m.vendor.name });
    if (m.brand) workspaces.push({ id: m.brand.id, type: "BRAND", name: m.brand.name });
  });

  return workspaces;
}

export async function loginAction(_prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) return { error: "Invalid email or password" };

  try {
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user || !user.passwordHash) return { error: "Invalid email or password" };
    const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!isValid) return { error: "Invalid email or password" };

    const workspaces = await getUserWorkspaces(user.id);
    const activeWorkspaceId = workspaces[0]?.id || "customer";

    await createSession({
      userId: user.id, email: user.email, name: user.name || "Customer",
      role: user.role, workspaces, activeWorkspaceId,
    });
  } catch (err) {
    console.error("Login error:", err);
    return { error: "An unexpected error occurred" };
  }
  redirect("/account");
}

export async function registerAction(_prevState: unknown, formData: FormData) {
  const rawData = {
    firstName: formData.get("firstName") as string, lastName: formData.get("lastName") as string,
    email: formData.get("email") as string, phone: formData.get("phone") as string,
    password: formData.get("password") as string,
  };
  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) return { error: "Invalid input data" };

  try {
    const existingUser = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existingUser) return { error: "An account with this email already exists" };

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: { email: parsed.data.email, name: `${parsed.data.firstName} ${parsed.data.lastName}`, phone: parsed.data.phone, passwordHash, role: "CUSTOMER" },
    });

    const workspaces = await getUserWorkspaces(user.id);
    await createSession({
      userId: user.id, email: user.email, name: user.name || "Customer",
      role: user.role, workspaces, activeWorkspaceId: "customer",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return { error: "Failed to create account" };
  }
  redirect("/account");
}

export async function logoutAction() { await deleteSession(); redirect("/"); }