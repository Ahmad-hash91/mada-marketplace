import { Skeleton } from "../../../shared/Skeleton";

export function TopBarSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-t border-x rounded-t-2xl border-gray-200">
      <Skeleton className="h-6 w-24" />

      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-64 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}
