import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default async function middleware(req: Request & { nextUrl: URL }) {
  const { nextUrl } = req;
  const secureCookie =
    process.env.VERCEL === "1" || process.env.NEXTAUTH_URL?.startsWith("https://");
  const sessionCookieName = secureCookie
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  // Auth.js v5 uses authjs.session-token (and the __Secure- prefix on HTTPS).
  // The previous middleware used getToken() with its old default cookie name,
  // so the server-side auth() call could see a session while middleware could not.
  const token = await getToken({
    req: req as never,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie,
    cookieName: sessionCookieName,
    salt: sessionCookieName,
  });

  const isLoggedIn = !!token;
  const role = token?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
    }
  }

  if (isDashboardRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
