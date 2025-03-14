import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard", "/plan", "/adddoc", "/signdoc"];
const publicRoutes = ["/signin"];

export default async function middleware(req: NextRequest) {
  // 2. Get the current request path
  const path = req.nextUrl.pathname;

  // 3. Check if the path includes any of the protected routes
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  // 4. Get session cookie
  const session = (await cookies()).get("session")?.value;

  console.log("Requested Path:", path);
  console.log("Protected Route:", isProtectedRoute);
  console.log("User Session:", session ? "Exists" : "Not Found");

  // 5. Redirect to /signin if trying to access a protected route without authentication
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  // 6. Redirect authenticated users away from public routes (except `/plan`)
  if (isPublicRoute && session && !path.startsWith("/plan")) {
    return NextResponse.redirect(new URL("/plan", req.nextUrl));
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
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
