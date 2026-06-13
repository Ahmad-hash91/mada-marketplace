import { Skeleton } from "../../../shared/Skeleton";

export function AddProductSkeleton() {
  return (
    <div className="flex justify-between items-center gap-4 border border-gray-300 rounded-lg p-4">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-10" />
    </div>
  );
}
