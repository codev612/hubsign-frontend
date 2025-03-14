import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { protectedRoutes, publicRoutes } from "./constants/middlware";

export default async function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const session = (await cookies()).get("session")?.value;

  console.log("Requested Path:", path);
  console.log("Protected Route:", isProtectedRoute);
  console.log("User Session:", session ? "Exists" : "Not Found");

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

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
