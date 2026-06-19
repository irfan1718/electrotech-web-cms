import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const token =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");

  // ── ADMIN PAGES (except login) → require auth ──
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // ── ALREADY LOGGED IN → skip login page ──
  if (pathname === "/admin/login" && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // ── API ROUTES PROTECTION ──
  if (pathname.startsWith("/api/")) {
    // Always allow auth routes
    if (pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    // Allow public POST routes (no auth needed)
    if (pathname === "/api/contact" && method === "POST") {
      return NextResponse.next();
    }
    if (pathname === "/api/careers/apply" && method === "POST") {
      return NextResponse.next();
    }

    // Everything else requires auth
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
