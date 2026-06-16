import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";

type AddProductCardProps = {
  params: Promise<{ lang: string }>;
};
export async function AddProductCard({ params }: AddProductCardProps) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations("SellerDashboard.addProduct");
  return (
    <div className="flex justify-between items-center gap-4 border border-secondary rounded-lg p-4 bg-background">
      <p className="text-text">{t("label")}</p>
      <Link
        href={`/${lang}/seller/products/new`}
        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        {t("button")} +
      </Link>
    </div>
  );
}
