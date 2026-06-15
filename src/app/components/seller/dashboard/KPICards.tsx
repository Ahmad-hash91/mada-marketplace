import { getSessionFromCookies } from "@/lib/auth";
import db from "@/lib/db";
import { KPIQueries } from "@/lib/seller-store/dashboardQueries";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export async function KPICards() {
  const payload = await getSessionFromCookies();
  const t = await getTranslations("SellerDashboard.kpi");
  if (!payload) redirect("/en/login");
  if (payload.role !== "SELLER") redirect("/en");

  const storeInfo = await db.store.findFirst({
    where: { userId: payload.id, status: true },
  });
  const storeId = storeInfo?.id;
  if (!storeId) return null;

  const { totalCustomers, totalOrders, conversionRate, totalRevenue } =
    await KPIQueries(storeId);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="border border-secondary rounded-lg p-4 space-y-2 bg-background">
        <p className="text-sm text-text/60">{t("totalRevenue")}</p>
        <p className="text-md lg:text-2xl font-bold text-text">
          ${totalRevenue.toFixed(2)}
        </p>
      </div>
      <div className="border border-secondary rounded-lg p-4 space-y-2 bg-background">
        <p className="text-sm text-text/60">{t("totalOrders")}</p>
        <p className="text-md lg:text-2xl font-bold text-text">{totalOrders}</p>
      </div>
      <div className="border border-secondary rounded-lg p-4 space-y-2 bg-background">
        <p className="text-sm text-text/60">{t("totalCustomers")}</p>
        <p className="text-md lg:text-2xl font-bold text-text">
          {totalCustomers}
        </p>
      </div>
      <div className="border border-secondary rounded-lg p-4 space-y-2 bg-background">
        <p className="text-sm text-text/60">{t("conversionRate")}</p>
        <p className="text-md lg:text-2xl font-bold text-text">
          {conversionRate.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
