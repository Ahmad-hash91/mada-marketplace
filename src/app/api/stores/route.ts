import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";
import { sellerStoreSchema } from "@/lib/validators";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import z from "zod";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, location } = body;

    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;

    if (!access_token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(access_token, JWT_SECRET);

    if (!payload || !payload.exp || payload.exp * 1000 < Date.now()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (payload.role !== "SELLER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parsedSellerData = sellerStoreSchema.safeParse({
      name,
      description,
      location,
    });

    if (!parsedSellerData.success) {
      return NextResponse.json(
        { errors: z.treeifyError(parsedSellerData.error) },
        { status: 400 },
      );
    }

    const sellerData = parsedSellerData.data;

    const slug = sellerData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    let finalSlug = slug;
    const slugExists = await db.store.findUnique({ where: { slug } });
    if (slugExists) {
      finalSlug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    const newStore = await db.store.create({
      data: {
        userId: payload.id,
        status: true,
        slug: finalSlug,
        ...sellerData,
      },
    });

    return NextResponse.json(
      { message: "Store created successfully.", store: newStore },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create store error:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 },
    );
  }
}
