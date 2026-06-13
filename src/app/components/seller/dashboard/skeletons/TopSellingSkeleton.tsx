import { Skeleton } from "../../../shared/Skeleton";

export function TopSellingSkeleton() {
  return (
    <div className="border border-gray-300 rounded-lg p-4 space-y-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-2 w-full rounded-full" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex justify-between items-center gap-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}
