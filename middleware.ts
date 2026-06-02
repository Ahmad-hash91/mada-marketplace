import { NextRequest, NextResponse } from "next/server";

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
  //Checking if payload is expired
  if (payload && payload.exp * 1000 < Date.now()) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const currentPath = request.nextUrl.pathname;
  const isAdminRoute = currentPath.startsWith("/admin");
  const isSellerRoute = currentPath.startsWith("/seller");
  const isBuyerRoute =
    currentPath.startsWith("/orders") || currentPath.startsWith("/cart");
  const isLoginRoute = currentPath.startsWith("/login");
  const isRegisterRoute = currentPath.startsWith("/register");

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
  if (isBuyerRoute && !payload?.role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if ((isLoginRoute || isRegisterRoute) && payload) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",
    "/cart",
    "/orders/:path*",
    "/login",
    "/register",
  ],
};
