import { getSessionFromCookies } from "@/lib/auth";
import db from "@/lib/db";
import {
  KPIQueries,
  topSellingProducts,
} from "@/lib/seller-store/dashboardQueries";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

type TopSellingProductsProps = {
  params: Promise<{ lang: string }>;
};
export default async function TopSellingProducts({
  params,
}: TopSellingProductsProps) {
  const t = await getTranslations("SellerDashboard.topSelling");
  const { lang } = await params;
  setRequestLocale(lang);
  const payload = await getSessionFromCookies();
  if (!payload) redirect(`/${lang}/login`);
  if (payload.role !== "SELLER") redirect(`/${lang}`);

  const storeInfo = await db.store.findFirst({
    where: { userId: payload.id, status: true },
  });
  const storeId = storeInfo?.id;
  if (!storeId) return null;

  const { totalOrders } = await KPIQueries(storeId);
  const { topProducts } = await topSellingProducts(storeId);

  return (
    <div className="border border-secondary rounded-lg p-4 space-y-4 bg-background">
      <p className="font-semibold text-text">{t("title")}</p>
      <p className="text-sm text-text/60">{totalOrders} total orders</p>
      <div className="h-px w-full rounded-full bg-secondary"></div>
      {topProducts.length === 0 ? (
        <p className="text-sm text-text/60">No sales yet</p>
      ) : (
        topProducts.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center gap-4">
            <p className="text-sm text-text">{item.product.name}</p>
            <p className="text-sm font-medium text-text">
              {item.totalQuantity}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
