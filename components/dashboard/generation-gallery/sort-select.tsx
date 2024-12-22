import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SortByType } from "./types";

interface SortSelectProps {
  value: SortByType;
  onChange: (value: SortByType) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={(value) => onChange(value as SortByType)}>
      <SelectTrigger>
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="oldest">Oldest First</SelectItem>
        <SelectItem value="purchased">Purchased</SelectItem>
        <SelectItem value="not-purchased">Not Purchased</SelectItem>
      </SelectContent>
    </Select>
  );
}

// components/generation-gallery/gallery-header.tsx
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