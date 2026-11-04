import { createHash } from "node:crypto";

const SECRET = process.env.ADVERTISING_SECRET || "isource-advertising-default-secret";

export function hashIp(ip: string): string {
  return createHash("sha256").update(`${ip}:${SECRET}`).digest("hex").slice(0, 32);
}

export function hashUa(ua: string): string {
  return createHash("sha256").update(`${ua}:${SECRET}`).digest("hex").slice(0, 32);
}

export function minuteBucket(date = new Date()): number {
  return Math.floor(date.getTime() / 60000);
}

export function buildIdempotencyKey(args: {
  campaignId: string;
  eventType: "IMPRESSION" | "CLICK" | "CONVERSION";
  sessionId: string;
  productId?: string | null;
}): string {
  const bucket = minuteBucket();
  const raw = `${args.campaignId}:${args.eventType}:${args.sessionId}:${args.productId || "none"}:${bucket}`;
  return createHash("sha256").update(raw).digest("hex");
}

export function isValidSessionId(s: unknown): s is string {
  return typeof s === "string" && /^[a-zA-Z0-9_-]{8,64}$/.test(s);
}