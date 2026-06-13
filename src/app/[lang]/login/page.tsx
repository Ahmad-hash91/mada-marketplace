"use client";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const [serverError, setServerError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
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
        router.push("/en/seller/dashboard");
      } else if (result.role === "ADMIN") {
        router.push("/en/admin/dashboard");
      } else {
        router.push("/en");
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-start">
          <label htmlFor="phone">Phone Number</label>
          <input
            {...register("phone")}
            id="phone"
            className="border rounded-lg"
          />
          {errors.phone && <p>{errors.phone.message}</p>}
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="email">Email (optional)</label>
          <input
            {...register("email")}
            id="email"
            type="email"
            autoComplete="email"
            className="border rounded-lg"
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="password">Password</label>
          <input
            {...register("password")}
            id="password"
            type="password"
            className="border rounded-lg"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        {serverError && <p className="text-red-500">{serverError}</p>}
        <div className="border rounded-lg">
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </form>
  );
}
