import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith("/account") || path.startsWith("/vendor") || path.startsWith("/brand") || path.startsWith("/admin");
  const isPublicRoute = path.startsWith("/login") || path.startsWith("/register");

  const cookie = req.cookies.get("isource_session")?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.userId) return NextResponse.redirect(new URL("/login", req.nextUrl));
  
  if (path.startsWith("/admin") && session?.role !== "ADMIN") return NextResponse.redirect(new URL("/", req.nextUrl));
  if (path.startsWith("/vendor") && !session?.workspaces.some(w => w.type === "VENDOR")) return NextResponse.redirect(new URL("/account", req.nextUrl));
  if (path.startsWith("/brand") && !session?.workspaces.some(w => w.type === "BRAND")) return NextResponse.redirect(new URL("/account", req.nextUrl));

  if (isPublicRoute && session?.userId) return NextResponse.redirect(new URL("/account", req.nextUrl));

  return NextResponse.next();
}
export const config = { matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"] };