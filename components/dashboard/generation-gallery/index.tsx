"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fetchGenerationsAction } from "@/app/actions/generation";
import { GalleryHeader } from './gallery-header';
import { GalleryPagination } from './gallery-pagination';
import { GenerationCard } from './generation-card';
import { EmptyState } from './empty-state';
import { LoadingState } from './loading-state';
import type { SortByType } from './types';
import type { GeneratedLogo } from "@/lib/validations/generation";

const ITEMS_PER_PAGE = 8;

export function GenerationGallery() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortByType>('newest');
  const [generatedLogos, setGeneratedLogos] = useState<GeneratedLogo[]>([]);

  const {
    execute: fetchGenerations,
    result: generationsResult,
    isPending: isFetchingGenerations,
    hasErrored: hasFetchingGenerationsError,
  } = useAction(fetchGenerationsAction, {
    onSuccess: (data) => {
      if (data.data?.generations) {
        setGeneratedLogos(data.data.generations);
      }
    }
  });

  useEffect(() => {
    fetchGenerations();
  }, []);

  useEffect(() => {
    if (generationsResult.data?.generations) {
      setGeneratedLogos(generationsResult.data.generations);
    }
  }, [generationsResult]);

  const sortedGenerations = useMemo(() => {
    let sorted = [...generatedLogos];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) =>
          new Date(b.generation_timestamp).getTime() - new Date(a.generation_timestamp).getTime()
        );
      case 'oldest':
        return sorted.sort((a, b) =>
          new Date(a.generation_timestamp).getTime() - new Date(b.generation_timestamp).getTime()
        );
      case 'purchased':
        return sorted.filter(gen => gen.is_high_res_purchased);
      case 'not-purchased':
        return sorted.filter(gen => !gen.is_high_res_purchased);
      default:
        return sorted;
    }
  }, [generatedLogos, sortBy]);

  const totalPages = Math.ceil(sortedGenerations.length / ITEMS_PER_PAGE);
  const currentGenerations = sortedGenerations.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [sortBy]);

  if (hasFetchingGenerationsError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load generations. Please try again.</p>
        <Button
          onClick={() => fetchGenerations()}
          className="mt-4"
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <GalleryHeader sortBy={sortBy} onSortChange={setSortBy} />

      <AnimatePresence mode="wait">
        {isFetchingGenerations ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingState count={ITEMS_PER_PAGE} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {currentGenerations.length === 0 ? (
              <EmptyState sortBy={sortBy} />
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 sm:p-6 auto-rows-fr">
                {currentGenerations.map((generation) => (
                  <GenerationCard
                    key={generation.generation_timestamp}
                    generation={generation}
                    onDelete={() => {}}
                  />
                ))}
              </div>
            )}

            <GalleryPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}