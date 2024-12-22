import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  count: number;
}

export function LoadingState({ count }: LoadingStateProps) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 sm:p-6 auto-rows-fr">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="aspect-[3/4] w-full rounded-lg" />
      ))}
    </div>
  );
}