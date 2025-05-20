import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of public routes that don't require authentication
const publicRoutes = ["/auth/signin", "/auth/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Get the user's address from localStorage
  const userAddress = request.cookies.get("userAddress")?.value;

  // If no user address is found and trying to access protected routes
  if (!userAddress && !pathname.startsWith("/auth/")) {
    // Store the original URL to redirect back after login
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access auth pages
  if (userAddress && pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 