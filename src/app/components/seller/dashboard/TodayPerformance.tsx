import { getSessionFromCookies } from "@/lib/auth";
import db from "@/lib/db";
import { todaysPerformanceQueries } from "@/lib/seller-store/dashboardQueries";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function TodayPerformance() {
  const t = await getTranslations("SellerDashboard.todayPerformance");
  const payload = await getSessionFromCookies();

  if (!payload) redirect("/en/login");
  if (payload.role !== "SELLER") redirect("/en");

  const storeInfo = await db.store.findFirst({
    where: { userId: payload.id, status: true },
  });
  const storeId = storeInfo?.id;
  if (!storeId) return null;

  const { todayRevenue, yesterdayRevenue } =
    await todaysPerformanceQueries(storeId);

  return (
    <div className="border border-secondary rounded-lg p-4 space-y-4 bg-background">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-text">{t("title")}</p>
        <Link
          href="/en/seller/store-performance"
          className="text-sm text-primary hover:underline"
        >
          {t("details")}
        </Link>
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-bold text-text">
          ${todayRevenue.toFixed(2)}
        </p>
        <p className="text-sm text-text/60">{t("todaysRevenue")}</p>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-secondary">
        <p className="text-sm text-text/60">{t("yesterday")}</p>
        <p className="font-semibold text-text">
          ${yesterdayRevenue.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
