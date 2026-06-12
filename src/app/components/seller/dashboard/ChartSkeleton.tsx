import { Skeleton } from "../../shared/Skeleton";

export function ChartSkeleton() {
  return (
    <div className="border border-gray-300 rounded-lg p-6 space-y-6 max-w-xl">
      <div className="flex justify-between items-center  border-gray-100 pb-4">
        <Skeleton className="h-5 w-40" />
        <div className="flex space-x-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>

      <div className="flex items-end justify-between h-48 pt-4 px-2 border-b border-l border-gray-200">
        <Skeleton className="h-[40%] w-8 rounded-t" />
        <Skeleton className="h-[75%] w-8 rounded-t" />
        <Skeleton className="h-[55%] w-8 rounded-t" />
        <Skeleton className="h-[90%] w-8 rounded-t" />
        <Skeleton className="h-[30%] w-8 rounded-t" />
        <Skeleton className="h-[65%] w-8 rounded-t" />
      </div>

      <div className="flex justify-between px-2">
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
        <Skeleton className="h-3 w-8" />
      </div>
    </div>
  );
}
