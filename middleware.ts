import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

function decodeTokenHandler(token: string) {
  try {
    const payload = token
      .split(".")[1]
      .replaceAll("-", "+")
      .replaceAll("_", "/");
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const payload = token ? decodeTokenHandler(token) : null;

  if (payload && payload.exp * 1000 < Date.now()) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const currentPath = request.nextUrl.pathname;

  // Let next-intl handle root and locale routes first
  if (currentPath === "/" || /^\/(en|ar|ja)/.test(currentPath)) {
    return intlMiddleware(request);
  }

  // Strip locale prefix to check the real path
  const pathWithoutLocale = currentPath.replace(/^\/(en|ar|ja)/, "") || "/";

  const isAdminRoute = pathWithoutLocale.startsWith("/admin");
  const isSellerRoute = pathWithoutLocale.startsWith("/seller");
  const isBuyerRoute =
    pathWithoutLocale.startsWith("/orders") ||
    pathWithoutLocale.startsWith("/cart");
  const isLoginRoute = pathWithoutLocale.startsWith("/login");
  const isRegisterRoute = pathWithoutLocale.startsWith("/register");

  if (isAdminRoute && payload?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (
    isSellerRoute &&
    payload?.role !== "SELLER" &&
    payload?.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (isBuyerRoute && !payload) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if ((isLoginRoute || isRegisterRoute) && payload) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(en|ar|ja)/:path*",
    "/admin/:path*",
    "/seller/:path*",
    "/cart",
    "/orders/:path*",
    "/login",
    "/register",
  ],
};
