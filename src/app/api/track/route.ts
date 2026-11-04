import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Pages we don't track (internal/admin/staff areas)
const SKIP_PREFIXES = [
  "/admin", "/vendor", "/brand", "/_next",
  "/api", "/favicon", "/icon", "/robots", "/sitemap",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = (body.path || "/") as string;

    // Skip internal pages
    if (SKIP_PREFIXES.some(p => path.startsWith(p))) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Hash the IP for privacy (never store raw IPs)
    const rawIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "0.0.0.0";
    const ipHash = crypto
      .createHash("sha256")
      .update(rawIp + "isource-salt-v1")
      .digest("hex")
      .slice(0, 20);

    // Geo location from Vercel headers (free, only on Vercel)
    const country = req.headers.get("x-vercel-ip-country") || null;

    await prisma.pageVisit.create({
      data: {
        path: path.slice(0, 255),
        ipHash,
        userAgent: req.headers.get("user-agent")?.slice(0, 200) || null,
        referrer: req.headers.get("referer")?.slice(0, 300) || null,
        country,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Never fail a request because tracking failed
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}