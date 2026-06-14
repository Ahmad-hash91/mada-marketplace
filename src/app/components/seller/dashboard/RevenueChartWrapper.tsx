// RevenueChartWrapper.tsx
import { getSessionFromCookies } from "@/lib/auth";
import db from "@/lib/db";
import { revenueChartQuery } from "@/lib/seller-store/dashboardQueries";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { RevenueChart } from "./RevenueChart";

export async function RevenueChartWrapper() {
  const t = await getTranslations("SellerDashboard.chart");
  const payload = await getSessionFromCookies();

  if (!payload) redirect("/en/login");
  if (payload.role !== "SELLER") redirect("/en");

  const storeInfo = await db.store.findFirst({
    where: { userId: payload.id, status: true },
  });
  const storeId = storeInfo?.id;
  if (!storeId) return null;

  const data = await revenueChartQuery(storeId);

  return (
    <div className="border border-secondary rounded-lg p-4 bg-background">
      <p className="font-semibold text-text mb-8">{t("title")}</p>
      <RevenueChart data={data} />
    </div>
  );
}
