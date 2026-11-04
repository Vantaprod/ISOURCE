"use server";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { error: "Email and password are required" };

  let userRole = "CUSTOMER";

  try {
    // Fetch user — no relations (User model has no `vendor` or `brand` relation)
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { error: "Invalid email or password" };

    const isValid = await compare(password, user.passwordHash);
    if (!isValid) return { error: "Invalid email or password" };

    // Build workspaces (empty for ADMIN — role check passes directly)
    const workspaces: any[] = [];
    
    // If user has memberships, add vendor/brand workspaces
    if (user.role === "VENDOR" || user.role === "BRAND") {
      try {
        const memberships = await prisma.membership.findMany({ where: { userId: user.id } });
        memberships.forEach((m: any) => {
          if (m.brandId) workspaces.push({ id: m.brandId, type: "BRAND", name: "Brand Store" });
          if (m.vendorId) workspaces.push({ id: m.vendorId, type: "VENDOR", name: "Vendor Store" });
        });
      } catch (e) {
        // Membership relation may differ — skip gracefully
      }
    }

    // Track this login for vendor analytics

    await prisma.user.update({

      where: { id: user.id },

      data: { lastLoginAt: new Date() },

    }).catch(() => {});

    

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name || "User",
      role: user.role,
      workspaces: workspaces,
    });
    
    userRole = user.role; 
  } catch (err: any) {
    console.error("Login error details:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }

  // Redirects OUTSIDE try/catch
  if (userRole === "ADMIN") redirect("/admin");
  if (userRole === "VENDOR") redirect("/vendor");
  if (userRole === "BRAND") redirect("/brand");
  
  redirect("/account");
}

export async function registerAction(prevState: any, formData: FormData) {
  const firstName = ((formData.get("firstName") as string) || "").trim();
  const lastName  = ((formData.get("lastName")  as string) || "").trim();
  const email     = ((formData.get("email")     as string) || "").trim().toLowerCase();
  const phone     = ((formData.get("phone")     as string) || "").trim();
  const password  = (formData.get("password") as string) || "";

  if (!firstName || !lastName || !email || !phone || !password) {
    return { error: "All fields are required" };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "An account with this email already exists" };

    const passwordHash = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        phone,
        passwordHash,
        role: "CUSTOMER",
      },
    });

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name || "User",
      role: user.role,
      workspaces: [],
    });
  } catch (err: any) {
    console.error("Register error:", err);
    return { error: "An unexpected error occurred. Please try again." };
  }

  redirect("/account");
}
export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}