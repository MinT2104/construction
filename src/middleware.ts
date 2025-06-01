import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /admin/bai-viet)
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/admin";
  const isAdminPath = path.startsWith("/admin/");

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value;

  // Tạo response headers mặc định
  const requestHeaders = new Headers(request.headers);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Xử lý authentication cho admin routes
  if (isAdminPath && path !== "/admin" && !token) {
    const url = new URL("/admin", request.url);
    url.searchParams.set("from", path);
    return NextResponse.redirect(url);
  }

  // If on /admin (login page) and have a token, redirect to /admin/bai-viet
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/admin/bai-viet", request.url));
  }

  // Thêm cache control headers để cải thiện hiệu suất
  // Các tài nguyên tĩnh có thể cache lâu hơn
  if (
    path.includes("/images/") ||
    path.includes("/_next/static/") ||
    path.endsWith(".jpg") ||
    path.endsWith(".png") ||
    path.endsWith(".gif") ||
    path.endsWith(".svg") ||
    path.endsWith(".woff2") ||
    path.endsWith(".css") ||
    path.endsWith(".js")
  ) {
    // Cache cho 30 ngày
    response.headers.set(
      "Cache-Control",
      "public, max-age=2592000, stale-while-revalidate=86400"
    );
  } else if (
    // Các trang tĩnh có thể cache nhưng với thời gian ngắn hơn
    path === "/" ||
    path.includes("/xay-nha/") ||
    path.includes("/mau-nha-dep/")
  ) {
    // Cache cho 1 giờ, cho phép revalidate sau 5 phút
    response.headers.set(
      "Cache-Control",
      "public, max-age=3600, stale-while-revalidate=300"
    );
  } else {
    // Các trang động không nên cache quá lâu
    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  }

  return response;
}

// Configure the paths that the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
