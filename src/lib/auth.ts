import "server-only";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET: string | undefined = process.env.JWT_REFRESH_SECRET;

export function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error("Password is Required");
  }
  return bcrypt.hash(password, 12);
}
export function comparePassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  if (!password || !storedHash) {
    throw new Error("Password or Hash is required");
  }
  return bcrypt.compare(password, storedHash);
}

export function generateAccessToken(id: number, role: string): string {
  if (!JWT_SECRET) {
    throw new Error("JWT SECRET is undefined.");
  }
  if (!id || !role) {
    throw new Error("Id and role are required");
  }
  return jsonwebtoken.sign({ id, role }, JWT_SECRET, {
    expiresIn: "15m",
    algorithm: "HS256",
  });
}
export function generateRefreshToken(id: number): string {
  if (!JWT_REFRESH_SECRET) {
    throw new Error("JWT Refresh SECRET is undefined.");
  }
  if (!id) {
    throw new Error("Id is required");
  }
  return jsonwebtoken.sign({ id }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
}

export function verifyToken(
  token: string,
  secret: string,
): jsonwebtoken.JwtPayload | null {
  try {
    return jsonwebtoken.verify(token, secret) as jsonwebtoken.JwtPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "access_token",
    value: accessToken,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 900,
    path: "/",
  });
  cookieStore.set({
    name: "refresh_token",
    value: refreshToken,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 604800,
    path: "/",
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}
