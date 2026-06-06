import { clearAuthCookies } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  await clearAuthCookies();
  return NextResponse.json(
    { message: "Logged out successfully." },
    { status: 200 },
  );
}
