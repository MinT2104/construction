import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /admin/bai-viet)
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/admin";

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value;

  // If the path starts with /admin, is not the root /admin path itself, and no token
  if (path.startsWith("/admin/") && path !== "/admin" && !token) {
    const url = new URL("/admin", request.url);
    url.searchParams.set("from", path);
    return NextResponse.redirect(url);
  }

  // If trying to access a sub-path of /admin (e.g. /admin/bai-viet) without a token, redirect to /admin
  if (path.startsWith("/admin/") && !token) {
    const url = new URL("/admin", request.url);
    url.searchParams.set("from", path);
    return NextResponse.redirect(url);
  }

  // If on /admin (login page) and have a token, redirect to /admin/bai-viet
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/admin/bai-viet", request.url));
  }

  return NextResponse.next();
}

// Configure the paths that the middleware should run on
export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
