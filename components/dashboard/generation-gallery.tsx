"use client";
import { useState, useEffect, useMemo } from "react";
import { useGeneratedLogos } from "@/hooks/useGenerations";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export function GenerationGallery() {
  // Pagination and sorting states
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'purchased' | 'not-purchased'>('newest');
  const itemsPerPage = 12;

  // Fetch generations
  const { generatedLogos, loading } = useGeneratedLogos();

  // Memoized and sorted generations
  const sortedGenerations = useMemo(() => {
    let sorted = [...generatedLogos];

    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) =>
          new Date(b.generation_timestamp).getTime() -
          new Date(a.generation_timestamp).getTime()
        );
        break;
      case 'oldest':
        sorted.sort((a, b) =>
          new Date(a.generation_timestamp).getTime() -
          new Date(b.generation_timestamp).getTime()
        );
        break;
      case 'purchased':
        sorted = sorted.filter(gen => gen.is_high_res_purchased);
        break;
      case 'not-purchased':
        sorted = sorted.filter(gen => !gen.is_high_res_purchased);
        break;
    }

    return sorted;
  }, [generatedLogos, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedGenerations.length / itemsPerPage);
  const currentGenerations = sortedGenerations.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Reset page when sorting changes
  useEffect(() => {
    setPage(1);
  }, [sortBy]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Generations</h2>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="purchased">Purchased</SelectItem>
            <SelectItem value="not-purchased">Not Purchased</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentGenerations.length === 0 ? (
              <div className="col-span-full flex items-center justify-center h-64 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">
                  {sortBy === 'purchased'
                    ? "No purchased high-res logos"
                    : sortBy === 'not-purchased'
                      ? "No logos available for purchase"
                      : "No logos generated yet. Start creating your logos!"}
                </p>
              </div>
            ) : (
              currentGenerations.map((generation) => (
                <Card key={generation.generation_timestamp}>
                  <CardContent className="p-4">
                    <div className="relative w-full aspect-square">
                      <img
                        src={generation.preview_image_url}
                        alt="Generated image"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(generation.generation_timestamp).toLocaleString()}
                    </p>
                    {!generation.is_high_res_purchased && (
                      <Button className="w-full" variant="default">
                        Purchase High-Res
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setPage(i + 1)}
                      isActive={page === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}