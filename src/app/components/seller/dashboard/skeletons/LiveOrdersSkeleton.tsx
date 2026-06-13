import { Skeleton } from "../../../shared/Skeleton";

export function LiveOrdersSkeleton() {
  return (
    <div className="border border-gray-300 rounded-lg p-4 space-y-4">
      <Skeleton className="h-5 w-32" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex justify-between items-center gap-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}
