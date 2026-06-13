import { Skeleton } from "../../../shared/Skeleton";

export function RecentOrdersSkeleton() {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="grid grid-cols-5 gap-4 bg-gray-50 p-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>

      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="grid grid-cols-5 gap-4 p-4 border-t border-gray-100"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
