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

export default async function SellerDashboard({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  setRequestLocale(lang);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <Suspense fallback={<KPICardsSkeleton />}>
          <KPICards />
        </Suspense>
        <ChartSkeleton />
        <RecentOrdersSkeleton />
      </div>

      <div className="space-y-6">
        <Suspense fallback={<AddProductSkeleton />}>
          <AddProductCard />
        </Suspense>
        <Suspense fallback={<TodayPerformanceSkeleton />}>
          <TodayPerformance />
        </Suspense>
        <LiveOrdersSkeleton />
        <TopSellingSkeleton />
      </div>
    </div>
  );
}
