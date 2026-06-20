import { verifyToken } from "@/lib/auth";
import db from "@/lib/db";
import { addNewProductSchema } from "@/lib/seller-store/products";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import z from "zod";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;
    const { name, description, price, stock, categoryId } =
      await request.json();

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
    const parsedProductData = addNewProductSchema.safeParse({
      name,
      description,
      price,
      stock,
      categoryId,
    });
    if (!parsedProductData.success) {
      return NextResponse.json(
        { error: z.treeifyError(parsedProductData.error) },
        { status: 400 },
      );
    }
    const sellerStore = await db.store.findFirst({
      where: { userId: payload.id, status: true },
    });
    if (!sellerStore) {
      return NextResponse.json(
        {
          error: "No Store was found for this Seller, cannot create a product.",
        },
        { status: 403 },
      );
    }

    const productData = parsedProductData.data;
    const slug = productData.name
      .toLocaleLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    let finalSlug = slug;
    const slugExists = await db.product.findUnique({ where: { slug } });
    if (slugExists) {
      finalSlug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }
    const newProduct = await db.product.create({
      data: {
        storeId: sellerStore.id,
        slug: finalSlug,
        status: true,
        ...productData,
      },
    });

    return NextResponse.json(
      {
        message: "New Product has been added to Store",
        product: newProduct,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create new Product error:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 },
    );
  }
}
