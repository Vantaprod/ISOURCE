import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith("/account") || path.startsWith("/vendor") || path.startsWith("/brand") || path.startsWith("/admin");
  const isPublicRoute = path.startsWith("/login") || path.startsWith("/register");

  const cookie = req.cookies.get("isource_session")?.value;
  const session = await decrypt(cookie);

  // If trying to access protected routes without session, go to login
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  
  // Role-specific route protection
  if (path.startsWith("/admin") && session?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  if (path.startsWith("/vendor") && session?.role !== "VENDOR" && session?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/account", req.nextUrl));
  }
  if (path.startsWith("/brand") && session?.role !== "BRAND" && session?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/account", req.nextUrl));
  }

  // Do NOT redirect them away from /login if they just logged in, 
  // let the server action finish its redirect.
  // We only redirect away from public routes if they are already logged in AND going to /register
  if (path.startsWith("/register") && session?.userId) {
    return NextResponse.redirect(new URL("/account", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"] };