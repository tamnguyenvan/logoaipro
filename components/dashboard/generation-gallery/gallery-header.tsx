import { SortSelect } from "./sort-select";
import { SortByType } from "./types";

interface GalleryHeaderProps {
  sortBy: SortByType;
  onSortChange: (value: SortByType) => void;
}

export function GalleryHeader({ sortBy, onSortChange }: GalleryHeaderProps) {
  return (
    <div className="flex flex-col gap-3 w-full p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Your Generations
      </h2>
      <div className="w-full max-w-xs">
        <SortSelect value={sortBy} onChange={onSortChange} />
      </div>
    </div>
  );
}