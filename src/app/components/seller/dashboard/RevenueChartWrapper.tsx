// RevenueChartWrapper.tsx
import { getSessionFromCookies } from "@/lib/auth";
import db from "@/lib/db";
import { revenueChartQuery } from "@/lib/seller-store/dashboardQueries";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { RevenueChart } from "./RevenueChart";

type RevenueChartWrapperProps = {
  params: Promise<{ lang: string }>;
};

export async function RevenueChartWrapper({
  params,
}: RevenueChartWrapperProps) {
  const t = await getTranslations("SellerDashboard.chart");
  const payload = await getSessionFromCookies();
  const { lang } = await params;
  setRequestLocale(lang);
  if (!payload) redirect(`/${lang}/login`);
  if (payload.role !== "SELLER") redirect(`/${lang}`);

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
