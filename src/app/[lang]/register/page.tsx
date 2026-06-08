"use client";

import { userAuthSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod/v4";

const registerFormSchema = userAuthSchema.extend({
  confirm_password: z.string().min(1, "Please confirm your password"),
});

type RegisterFormInput = z.infer<typeof registerFormSchema>;

export default function RegisterBuyer() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      role: "BUYER",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormInput) => {
    console.log("Form submitted", data);
    setLoading(true);
    setServerError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: "BUYER" }),
      });
      const result = await response.json();
      if (!response.ok) {
        setServerError(result.error || "Something went wrong.");
        return;
      }
      router.push("/en");
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) =>
        console.log("Validation errors:", errors),
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-row gap-4">
          <div className="flex flex-col items-start">
            <label htmlFor="first_name">First Name</label>
            <input
              {...register("first_name")}
              id="first_name"
              className="border rounded-lg"
            />
            {errors.first_name && <p>{errors.first_name.message}</p>}
          </div>
          <div className="flex flex-col items-start">
            <label htmlFor="last_name">Last Name</label>
            <input
              {...register("last_name")}
              id="last_name"
              className="border rounded-lg"
            />
            {errors.last_name && <p>{errors.last_name.message}</p>}
          </div>
        </div>
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
        <div className="flex flex-col items-start">
          <label htmlFor="confirm_password">Confirm Password</label>
          <input
            {...register("confirm_password", {
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            id="confirm_password"
            type="password"
            className="border rounded-lg"
          />
          {errors.confirm_password && <p>{errors.confirm_password.message}</p>}
        </div>
        {serverError && <p className="text-red-500">{serverError}</p>}
        <div className="border rounded-lg">
          <button
            onClick={() => console.log("button clicked")}
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </div>
      </div>
    </form>
  );
}
