import { generateAccessToken, setAuthCookies, verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(refreshToken, JWT_REFRESH_SECRET);

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newAccessToken = generateAccessToken(payload.id, payload.role);
    await setAuthCookies(newAccessToken, refreshToken);

    return NextResponse.json(
      { message: "Access token refreshed." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Refresh error:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 },
    );
  }
}
