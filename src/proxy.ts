// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // Get NextAuth session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  console.log(`[Middleware] Path: ${path}, Token exists: ${!!token}`);

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !token) {
    console.log(`[Middleware] Redirecting to /login (protected route without token)`);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isPublicRoute && token) {
    console.log(`[Middleware] Redirecting to /dashboard (public route with token)`);
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
