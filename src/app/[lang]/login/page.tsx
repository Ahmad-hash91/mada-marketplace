"use client";
import { loginSchema, type LoginSchemaProps } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const [serverError, setServerError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaProps>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaProps) => {
    setLoading(true);
    setServerError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      });
      const result = await response.json();
      if (!response.ok) {
        setServerError(result.error || "Something went wrong.");
        return;
      }
      if (result.role === "SELLER") {
        router.push(`/${lang}/seller/dashboard`);
      } else if (result.role === "ADMIN") {
        router.push(`/${lang}/admin/dashboard`);
      } else {
        router.push(`/${lang}`);
      }
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
            <label htmlFor="phone" className="text-sm font-medium text-text">
              {t("phone")}
            </label>
            <input
              {...register("phone")}
              id="phone"
              className={inputClass(!!errors.phone)}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-text">
              {t("email")} <span className="text-text/40">{t("optional")}</span>
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              autoComplete="email"
              className={inputClass(!!errors.email)}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-text">
              {t("password")}
            </label>
            <input
              {...register("password")}
              id="password"
              type="password"
              className={inputClass(!!errors.password)}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
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

        <div className="flex flex-col items-center gap-2 text-sm mt-6">
          <p className="text-text/70">
            {t("noAccount")}{" "}
            <Link
              href={`/${lang}/register`}
              className="text-primary font-medium hover:underline"
            >
              {t("registerLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
