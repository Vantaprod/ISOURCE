"use server";

import { prisma } from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/auth-schema";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function loginAction(_prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { error: "Invalid email or password format" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user || !user.passwordHash) {
      return { error: "Invalid email or password" };
    }

    const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!isValid) {
      return { error: "Invalid email or password" };
    }

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name || "Customer",
      role: user.role,
    });

  } catch (err: unknown) {
    console.error("Login error:", err);
    return { error: "An unexpected error occurred" };
  }

  redirect("/account");
}

export async function registerAction(_prevState: unknown, formData: FormData) {
  const rawData = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    password: formData.get("password") as string,
  };

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "Invalid input data" };
  }

  const { firstName, lastName, email, phone, password } = parsed.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "An account with this email already exists" };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        phone,
        passwordHash,
        role: "CUSTOMER",
      },
    });

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name || firstName,
      role: user.role,
    });

  } catch (err: unknown) {
    console.error("Register error:", err);
    return { error: "Failed to create account" };
  }

  redirect("/account");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/");
}