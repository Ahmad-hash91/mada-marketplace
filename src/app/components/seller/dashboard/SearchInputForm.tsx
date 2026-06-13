"use client";
import { useForm } from "react-hook-form";
import {
  type SellerSearchInput,
  inputSearchSchema,
} from "@/lib/seller-store/storeValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function SearchInputForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SellerSearchInput>({
    resolver: zodResolver(inputSearchSchema),
  });
  const t = useTranslations("SellerDashboard.topBar");
  const route = useRouter();
  const pathname = usePathname();
  const lang = pathname.split("/")[1];

  const onSearchHandler = (data: SellerSearchInput) => {
    if (!data.searchQuery.trim()) return;
    route.push(`/${lang}/seller/products?search=${data.searchQuery}`);
  };

  return (
    <form onSubmit={handleSubmit(onSearchHandler)}>
      <input
        type="search"
        placeholder={t("search")}
        {...register("searchQuery")}
        className={`h-9 w-64 rounded-full border border-secondary px-4 text-sm focus:border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 
        ${
          errors.searchQuery
            ? "border-red-500 focus:border-red-500 bg-red-50/10"
            : "border-secondary focus:border-primary"
        }`}
      />
    </form>
  );
}
