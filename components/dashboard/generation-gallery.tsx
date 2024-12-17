"use client";

import { useState, useEffect } from "react";
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

export function GenerationGallery() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const { generatedLogos, loading } = useGeneratedLogos();

  const totalPages = Math.ceil(generatedLogos.length / itemsPerPage);

  const currentGenerations = generatedLogos.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Generations</h2>
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
              <div className="flex items-center justify-center h-64 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No logos generated yet. Start creating your logos!</p>
              </div>
            ) :
              currentGenerations.map((generation) => (
                <Card key={generation.generation_timestamp}>
                  <CardContent className="p-4">
                    <img
                      src={generation.preview_image_url}
                      alt="Generated image"
                      width={300}
                      height={300}
                      className="rounded-lg object-cover mx-auto"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      {new Date(generation.generation_timestamp).toLocaleString()}
                    </p>
                    {!generation.is_high_res_purchased && (
                      <Button className="mt-2 w-full" variant="default">
                        Purchase High-Res
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
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
