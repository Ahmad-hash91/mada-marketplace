import { Skeleton } from "../../../shared/Skeleton";

export function TodayPerformanceSkeleton() {
  return (
    <div className="border border-gray-300 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="space-y-1">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-3 w-28" />
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
