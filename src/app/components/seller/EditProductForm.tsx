"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addNewProductSchema,
  type addNewProductSchemaProps,
} from "@/lib/seller-store/products";

type Category = {
  name: string;
  id: number;
  slug: string;
  created_at: Date;
  name_ar: string | null;
  name_ja: string | null;
};
type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  categoryId: number;
};
type EditProductFormProps = {
  categories: Category[];
  product: Product;
  lang: string;
  productId: string;
};

export default function EditProductForm({
  categories,
  productId,
  product,
  lang,
}: EditProductFormProps) {
  const [serverError, setServerError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations("AddProduct");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<addNewProductSchemaProps>({
    resolver: zodResolver(addNewProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
    },
  });

  const getCategoryName = (category: Category) => {
    if (lang === "ar") return category.name_ar ?? category.name;
    if (lang === "ja") return category.name_ja ?? category.name;
    return category.name;
  };

  const onSubmit = async (data: addNewProductSchemaProps) => {
    setLoading(true);
    setServerError("");
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      });
      const result = await response.json();
      if (!response.ok) {
        setServerError(result.error || "Something went wrong.");
        return;
      }
      router.push(`/${lang}/seller/dashboard`);
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-lg border px-3 py-2 text-sm text-text bg-background focus:outline-none focus:ring-2 transition-colors ${
      hasError
        ? "border-red-400 focus:ring-red-200"
        : "border-secondary focus:ring-primary/30 focus:border-primary"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20 px-4 py-12">
      <div className="w-full max-w-md bg-background border border-secondary rounded-2xl shadow-sm p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
          <p className="text-sm text-text/60 mt-1">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium text-text">
              {t("name")}
            </label>
            <input
              {...register("name")}
              id="name"
              type="text"
              defaultValue={product.name}
              autoComplete="name"
              className={inputClass(!!errors.name)}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="description"
              className="text-sm font-medium text-text"
            >
              {t("description")}{" "}
              <span className="text-text/40">{t("optional")}</span>
            </label>
            <input
              {...register("description")}
              id="description"
              defaultValue={product.description ?? ""}
              type="text"
              className={inputClass(!!errors.description)}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="price" className="text-sm font-medium text-text">
                {t("price")}
              </label>
              <input
                {...register("price", { valueAsNumber: true })}
                defaultValue={product.price}
                id="price"
                type="number"
                step="0.01"
                min="0"
                className={inputClass(!!errors.price)}
              />
              {errors.price && (
                <p className="text-xs text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="stock" className="text-sm font-medium text-text">
                {t("stock")}
              </label>
              <input
                {...register("stock", { valueAsNumber: true })}
                defaultValue={product.stock}
                id="stock"
                type="number"
                min="0"
                className={inputClass(!!errors.stock)}
              />
              {errors.stock && (
                <p className="text-xs text-red-500">{errors.stock.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="categoryId"
              className="text-sm font-medium text-text"
            >
              {t("categories")}
            </label>
            <select
              {...register("categoryId", { valueAsNumber: true })}
              defaultValue={product.categoryId}
              id="categoryId"
              className={inputClass(!!errors.categoryId)}
            >
              <option value="" disabled>
                {t("categories")}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryName(category)}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="text-sm text-red-500 text-center">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {loading ? t("submitting") : t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
