import { AddProductSkeleton } from "@/app/components/seller/dashboard/skeletons/AddProductSkeleton";
import { ChartSkeleton } from "@/app/components/seller/dashboard/skeletons/ChartSkeleton";
import { KPICardsSkeleton } from "@/app/components/seller/dashboard/skeletons/KPICardsSkeleton";
import { TodayPerformanceSkeleton } from "@/app/components/seller/dashboard/skeletons/TodayPerformanceSkeleton";
import { LiveOrdersSkeleton } from "@/app/components/seller/dashboard/skeletons/LiveOrdersSkeleton";
import { TopSellingSkeleton } from "@/app/components/seller/dashboard/skeletons/TopSellingSkeleton";
import { RecentOrdersSkeleton } from "@/app/components/seller/dashboard/skeletons/RecentOrdersSkeleton";
import { Suspense } from "react";
import { AddProductCard } from "@/app/components/seller/dashboard/AddProductCard";
import { setRequestLocale } from "next-intl/server";
import { KPICards } from "@/app/components/seller/dashboard/KPICards";
import TodayPerformance from "@/app/components/seller/dashboard/TodayPerformance";
import LiveOrders from "@/app/components/seller/dashboard/LiveOrders";
import TopSellingProducts from "@/app/components/seller/dashboard/TopSellingProducts";
import RecentOrders from "@/app/components/seller/dashboard/RecentOrders";
import { RevenueChartWrapper } from "@/app/components/seller/dashboard/RevenueChartWrapper";
import { getSessionFromCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";

export default async function SellerDashboard({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  setRequestLocale(lang);

  const payload = await getSessionFromCookies();
  if (!payload) redirect(`/${lang}/login`);
  if (payload.role !== "SELLER") redirect(`/${lang}`);

  const sellerStore = await db.store.findFirst({
    where: { userId: payload.id, status: true },
  });

  if (!sellerStore) redirect(`/${lang}/seller/create-store`);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <Suspense fallback={<KPICardsSkeleton />}>
          <KPICards params={params} />
        </Suspense>
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChartWrapper params={params} />
        </Suspense>

        <Suspense fallback={<RecentOrdersSkeleton />}>
          <RecentOrders params={params} />
        </Suspense>
      </div>

      <div className="space-y-6">
        <Suspense fallback={<AddProductSkeleton />}>
          <AddProductCard params={params} />
        </Suspense>
        <Suspense fallback={<TodayPerformanceSkeleton />}>
          <TodayPerformance params={params} />
        </Suspense>
        <Suspense fallback={<LiveOrdersSkeleton />}>
          <LiveOrders params={params} />
        </Suspense>
        <Suspense fallback={<TopSellingSkeleton />}>
          <TopSellingProducts params={params} />
        </Suspense>
      </div>
    </div>
  );
}
