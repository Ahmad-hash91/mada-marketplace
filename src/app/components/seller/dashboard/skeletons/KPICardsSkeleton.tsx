import { Skeleton } from "../../../shared/Skeleton";

export function KPICardsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((card) => (
        <div
          key={card}
          className="border border-gray-300 rounded-lg p-4 space-y-2"
        >
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-3/4" />
        </div>
      ))}
    </div>
  );
}
