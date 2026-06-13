import { useTranslations } from "next-intl";
import Link from "next/link";

export function AddProductCard() {
  const t = useTranslations("SellerDashboard.addProduct");
  return (
    <div className="flex justify-between items-center gap-4 border border-secondary rounded-lg p-4 bg-background">
      <p className="text-text">{t("label")}</p>
      <Link
        href="/en/seller/products/new"
        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        {t("button")} +
      </Link>
    </div>
  );
}
