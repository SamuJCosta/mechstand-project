import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;


  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("accessToken")?.value;


    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const decoded = verifyAccessToken(token);

      if (!decoded || typeof decoded !== "object" || decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};