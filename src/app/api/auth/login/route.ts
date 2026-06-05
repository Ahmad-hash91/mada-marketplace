import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
} from "@/lib/auth";
import db from "@/lib/db";
import { loginSchema } from "@/lib/validators";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, phone, email } = body;

    const parsedLoginInput = loginSchema.safeParse({ password, phone, email });

    if (!parsedLoginInput.success) {
      return NextResponse.json(
        { errors: z.treeifyError(parsedLoginInput.error) },
        { status: 400 },
      );
    }
    const data = parsedLoginInput.data;
    const user = await db.user.findFirst({
      where: { phone: data.phone },
      select: { id: true, role: true, password: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 },
      );
    }

    const passwordMatch = await comparePassword(data.password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 },
      );
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    await setAuthCookies(accessToken, refreshToken);

    return NextResponse.json(
      { message: "Login successful.", role: user.role },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 },
    );
  }
}
