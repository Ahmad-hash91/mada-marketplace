import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  setAuthCookies,
} from "@/lib/auth";
import db from "@/lib/db";
import { userAuthSchema } from "@/lib/validators";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { first_name, last_name, password, phone, email, role } = body;
    const parsedUserInput = userAuthSchema.safeParse({
      first_name,
      last_name,
      password,
      phone,
      email,
      role,
    });
    if (!parsedUserInput.success) {
      return NextResponse.json(
        { errors: z.treeifyError(parsedUserInput.error) },
        { status: 400 },
      );
    }
    const existingPhone = await db.user.findFirst({
      where: { phone },
    });
    if (existingPhone) {
      return NextResponse.json(
        { error: "Phone Number already exists." },
        { status: 400 },
      );
    }
    const existingEmail = await db.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 400 },
      );
    }

    // Add user to DB
    const hashedPassword = await hashPassword(parsedUserInput.data.password);
    const newUser = await db.user.create({
      data: {
        ...parsedUserInput.data,
        password: hashedPassword,
      },
    });
    const userId = newUser.id;
    const accessToken = generateAccessToken(userId, parsedUserInput.data.role);
    const refreshToken = generateRefreshToken(userId);
    await setAuthCookies(accessToken, refreshToken);
    return NextResponse.json(
      { message: "Registration successful", role: newUser.role },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error.",
      },
      { status: 500 },
    );
  }
}
