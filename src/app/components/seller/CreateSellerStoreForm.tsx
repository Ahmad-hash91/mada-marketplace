"use client";

import {
  type sellerStoreSchemaProps,
  sellerStoreSchema,
} from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function CreateSellerStore() {
  const router = useRouter();
  const t = useTranslations("CreateStore");
  const [serverError, setServerError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<sellerStoreSchemaProps>({
    resolver: zodResolver(sellerStoreSchema),
  });

  const onSubmit = async (data: sellerStoreSchemaProps) => {
    setLoading(true);
    setServerError("");
    try {
      const response = await fetch("/api/stores", {
        method: "POST",
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
              type="text"
              className={inputClass(!!errors.description)}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="location" className="text-sm font-medium text-text">
              {t("location")}{" "}
              <span className="text-text/40">{t("optional")}</span>
            </label>
            <input
              {...register("location")}
              id="location"
              type="text"
              className={inputClass(!!errors.location)}
            />
            {errors.location && (
              <p className="text-xs text-red-500">{errors.location.message}</p>
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
