"use client";
import { useForm } from "react-hook-form";
import {
  type inputSearchSchemaProps,
  inputSearchSchema,
} from "@/lib/seller-store/storeValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchInputForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<inputSearchSchemaProps>({
    resolver: zodResolver(inputSearchSchema),
  });
  const t = useTranslations("SellerDashboard.topBar");
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split("/")[1];

  const onSearchHandler = (data: inputSearchSchemaProps) => {
    if (!data.searchQuery.trim()) return;
    router.push(`/${lang}/seller/products?search=${data.searchQuery}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSearchHandler)}
      className="w-full max-w-xs font-sans"
    >
      <div
        className={`flex items-center h-9 w-full rounded-full border px-4 transition-all ${
          errors.searchQuery
            ? "border-red-500 bg-red-50/10 focus-within:ring-2 focus-within:ring-red-500/30"
            : "border-secondary bg-secondary/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30"
        }`}
      >
        <input
          {...register("searchQuery")}
          type="search"
          placeholder={t("search")}
          className="flex-1 min-w-0 bg-transparent text-sm text-text placeholder:text-text/40 focus:outline-none"
        />
        <button
          type="submit"
          className="ps-2 text-text/50 hover:text-primary cursor-pointer transition-colors shrink-0"
          aria-label="Search"
        >
          <Search className="size-4" />
        </button>
      </div>

      {errors.searchQuery && (
        <p className="text-xs text-red-500 mt-1 absolute font-medium ps-4">
          {errors.searchQuery.message}
        </p>
      )}
    </form>
  );
}
