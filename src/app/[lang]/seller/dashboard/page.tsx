import { AddProductSkeleton } from "@/app/components/seller/dashboard/skeletons/AddProductSkeleton";
import { ChartSkeleton } from "@/app/components/seller/dashboard/skeletons/ChartSkeleton";
import { KPICardsSkeleton } from "@/app/components/seller/dashboard/skeletons/KPICardsSkeleton";
import { TodayPerformanceSkeleton } from "@/app/components/seller/dashboard/skeletons/TodayPerformanceSkeleton";
import { LiveOrdersSkeleton } from "@/app/components/seller/dashboard/skeletons/LiveOrdersSkeleton";
import { TopSellingSkeleton } from "@/app/components/seller/dashboard/skeletons/TopSellingSkeleton";
import { RecentOrdersSkeleton } from "@/app/components/seller/dashboard/skeletons/RecentOrdersSkeleton";

export default async function SellerDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <KPICardsSkeleton />
        <ChartSkeleton />
        <RecentOrdersSkeleton />
      </div>

      <div className="space-y-6">
        <AddProductSkeleton />
        <TodayPerformanceSkeleton />
        <LiveOrdersSkeleton />
        <TopSellingSkeleton />
      </div>
    </div>
  );
}
