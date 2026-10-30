import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";

const secretKey = process.env.AUTH_SECRET || "default-secret-change-me-in-production";
const key = new TextEncoder().encode(secretKey);
const SESSION_COOKIE = "isource_session";

export type Workspace = { id: string; type: "CUSTOMER" | "VENDOR" | "BRAND"; name: string };

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  role: string;
  workspaces: Workspace[];
  activeWorkspaceId?: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, key, { algorithms: ["HS256"] });
    return payload as unknown as SessionPayload;
  } catch { return null; }
}

export async function createSession(payload: Omit<SessionPayload, "expiresAt">) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ ...payload, expiresAt });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session, { httpOnly: true, secure: process.env.NODE_ENV === "production", expires: expiresAt, sameSite: "lax", path: "/" });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (!session) return null;
  return await decrypt(session);
});