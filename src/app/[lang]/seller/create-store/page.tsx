"use client";

import { CreateStore, sellerStoreSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateSellerStore() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStore>({
    resolver: zodResolver(sellerStoreSchema),
  });

  const onSubmit = async (data: CreateStore) => {
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
      router.push("/en/seller/dashboard");
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
          <label htmlFor="name">Store Name</label>
          <input
            {...register("name")}
            id="name"
            type="text"
            autoComplete="name"
            className="border rounded-lg"
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="description">Description (optional)</label>
          <input
            {...register("description")}
            id="description"
            type="text"
            className="border rounded-lg"
          />
          {errors.description && <p>{errors.description.message}</p>}
        </div>
        <div className="flex flex-col items-start">
          <label htmlFor="location">Location (optional)</label>
          <input
            {...register("location")}
            id="location"
            type="text"
            className="border rounded-lg"
          />
          {errors.location && <p>{errors.location.message}</p>}
        </div>
        {serverError && <p className="text-red-500">{serverError}</p>}
        <div className="border rounded-lg">
          <button type="submit" disabled={loading}>
            {loading ? "Creating Your Store..." : "Create Your Store"}
          </button>
        </div>
      </div>
    </form>
  );
}
