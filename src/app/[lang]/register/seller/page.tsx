"use client";

import { userAuthSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod/v4";
import Link from "next/link";
import { useTranslations } from "next-intl";

const registerFormSchema = userAuthSchema.extend({
  confirm_password: z.string().min(1, "Please confirm your password"),
});

type RegisterFormInput = z.infer<typeof registerFormSchema>;

export default function RegisterSeller() {
  const router = useRouter();
  const t = useTranslations("RegisterSeller");
  const tBuyer = useTranslations("RegisterBuyer");
  const [serverError, setServerError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      role: "SELLER",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormInput) => {
    setLoading(true);
    setServerError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: "SELLER" }),
      });
      const result = await response.json();
      if (!response.ok) {
        setServerError(result.error || "Something went wrong.");
        return;
      }
      router.push(`/${lang}/seller/dashboard`);
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
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label
                htmlFor="first_name"
                className="text-sm font-medium text-text"
              >
                {tBuyer("firstName")}
              </label>
              <input
                {...register("first_name")}
                id="first_name"
                className={inputClass(!!errors.first_name)}
              />
              {errors.first_name && (
                <p className="text-xs text-red-500">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label
                htmlFor="last_name"
                className="text-sm font-medium text-text"
              >
                {tBuyer("lastName")}
              </label>
              <input
                {...register("last_name")}
                id="last_name"
                className={inputClass(!!errors.last_name)}
              />
              {errors.last_name && (
                <p className="text-xs text-red-500">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm font-medium text-text">
              {tBuyer("phone")}
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
              {tBuyer("email")}{" "}
              <span className="text-text/40">{tBuyer("optional")}</span>
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
              {tBuyer("password")}
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

          <div className="flex flex-col gap-1">
            <label
              htmlFor="confirm_password"
              className="text-sm font-medium text-text"
            >
              {tBuyer("confirmPassword")}
            </label>
            <input
              {...register("confirm_password", {
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              id="confirm_password"
              type="password"
              className={inputClass(!!errors.confirm_password)}
            />
            {errors.confirm_password && (
              <p className="text-xs text-red-500">
                {errors.confirm_password.message}
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
            {loading ? tBuyer("submitting") : t("submit")}
          </button>
        </form>

        <div className="flex flex-col items-center gap-2 text-sm mt-6">
          <p className="text-text/70">
            {t("haveAccount")}{" "}
            <Link
              href={`/${lang}/login`}
              className="text-primary font-medium hover:underline"
            >
              {t("loginLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
