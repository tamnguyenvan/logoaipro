import { SortByType } from './types';

interface EmptyStateProps {
  sortBy: SortByType;
}

export function EmptyState({ sortBy }: EmptyStateProps) {
  return (
    <div className="mx-4 sm:mx-6">
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-base sm:text-lg text-gray-500 text-center p-4">
          {sortBy === 'purchased'
            ? "No purchased high-res logos yet"
            : sortBy === 'not-purchased'
              ? "All logos purchased"
              : "No logos generated yet"}
        </p>
      </div>
    </div>
  );
}