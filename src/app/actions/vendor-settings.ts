"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { compare, hash } from "bcryptjs";

async function getVendorAndUser() {
  const session = await getSession();
  if (!session || session.role !== "VENDOR") throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) throw new Error("User not found");

  const vendor = await prisma.vendor.findUnique({ where: { userId: user.id } });
  if (!vendor) throw new Error("Vendor profile not found");

  return { user, vendor };
}

export async function updateVendorProfile(prevState: any, formData: FormData) {
  try {
    const { vendor } = await getVendorAndUser();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const afterSalesPhone = formData.get("afterSalesPhone") as string;

    if (!name || name.trim().length < 2) {
      return { error: "Store name must be at least 2 characters." };
    }

    await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        name,
        description,
        afterSalesPhone,
      },
    });

    revalidatePath("/vendor/settings");
    return { success: "Profile updated successfully!" };
  } catch (err: any) {
    return { error: err.message || "Failed to update profile." };
  }
}

export async function updateVendorPassword(prevState: any, formData: FormData) {
  try {
    const { user } = await getVendorAndUser();

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { error: "All password fields are required." };
    }

    if (newPassword.length < 8) {
      return { error: "New password must be at least 8 characters." };
    }

    if (newPassword !== confirmPassword) {
      return { error: "New passwords do not match." };
    }

    const isValid = await compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return { error: "Incorrect current password." };
    }

    const newHash = await hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return { success: "Password changed successfully!" };
  } catch (err: any) {
    return { error: err.message || "Failed to change password." };
  }
}