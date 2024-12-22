"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Download, Pencil, Clock, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useAction } from "next-safe-action/hooks";
import { type GeneratedLogo } from "@/lib/validations/generation";
import { fetchGenerationsAction } from "@/app/actions/generation";
import { downloadLogoAction } from '@/app/actions/download'
import { checkoutAction } from "@/app/actions/checkout";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { PromptDisplay } from "@/components/prompt-display";

const ITEMS_PER_PAGE = 8; 

export function GenerationGallery() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'purchased' | 'not-purchased'>('newest');
  const [downloadingImages, setDownloadingImages] = useState<Record<string, boolean>>({});
  const [checkingOutImages, setCheckingOutImages] = useState<Record<string, boolean>>({});
  const initialGenerations: GeneratedLogo[] = [];
  const [generatedLogos, setGeneratedLogos] = useState<GeneratedLogo[]>(initialGenerations);

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

  const {
    execute: downloadLogo,
    isPending: isDownloading,
    result: downloadResult,
    hasErrored: hasDownloadError,
  } = useAction(downloadLogoAction, {
    onSuccess: (result) => {
      console.log('result', result)
      if (result.data?.downloadUrl) {
        console.log(result.data?.downloadUrl)
        // Create a link and trigger the download
        const link = document.createElement('a');
        link.href = result.data.downloadUrl; // Use the presigned URL
        link.download = 'generated-logo.png'; // Suggested file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Logo downloaded successfully!');
      } else {
        console.error('Error: No download URL found in the response');
        toast.error('Failed to download logo.');
      }
    }
  });

  const {
    execute: checkout,
    isPending: isCheckingOut,
    result: checkoutResult,
    hasErrored: hasCheckoutError,
  } = useAction(checkoutAction);

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

  const handlePurchase = async (generationId: string) => {
    try {
      setCheckingOutImages(prev => ({ ...prev, [generationId]: true }));
      checkout({
        variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_DOWNLOAD_HIRES_ID!,
        generationId,
      });

      if (hasCheckoutError) throw new Error(checkoutResult.serverError);
      if (!checkoutResult.data?.checkoutUrl) throw new Error('No checkout URL returned');

      router.push(checkoutResult.data?.checkoutUrl);
    } catch (error) {
      toast.error("Failed to checkout. Please try again.");
    } finally {
      setCheckingOutImages(prev => ({ ...prev, [generationId]: false }));
    }
  };

  const handleDownload = async (generationId: string) => {
    try {
      console.log('Downloading logo...', generationId)
      downloadLogo({ generationId })
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  };

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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Your Generations
        </h2>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
          <SelectTrigger className="w-[200px]">
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

      <AnimatePresence mode="wait">
        {isFetchingGenerations ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full rounded-lg" />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {currentGenerations.length === 0 ? (
              <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="text-xl text-gray-500 text-center px-4">
                  {sortBy === 'purchased'
                    ? "No purchased high-res logos yet. Start enhancing your designs!"
                    : sortBy === 'not-purchased'
                      ? "All your logos are purchased. Great job!"
                      : "No logos generated yet. Start creating your unique designs!"}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentGenerations.map((generation) => (
                  <motion.div
                    key={generation.generation_timestamp}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-0">
                        <div className="relative aspect-square">
                          <img
                            src={generation.id ? `/api/logo/${generation.id}` : '/placeholder-image.svg'}
                            alt="Generated logo"
                            onError={(e) => {
                              const imgElement = e.target as HTMLImageElement;
                              imgElement.onerror = null;
                              imgElement.src = '/placeholder.svg';
                            }}
                            className="w-full h-full object-contain p-4 rounded-t-lg"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge variant={generation.is_high_res_purchased ? "secondary" : "destructive"}>
                              {generation.is_high_res_purchased ? "Purchased" : "Not Purchased"}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          <PromptDisplay prompt={generation.generation_details ? JSON.parse(generation.generation_details).prompt : 'No prompt available'} />
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" />
                            {new Date(generation.generation_timestamp).toLocaleString()}
                          </div>
                          {generation.is_high_res_purchased ? (
                            <div className="flex flex-col sm:flex-row justify-between gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button className="w-full sm:flex-1" variant="outline" onClick={() => handleDownload(generation.id!)} disabled={downloadingImages[generation.id!]}>
                                      <Download className="mr-2 h-4 w-4" />
                                      Download
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Download high-resolution logo</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button className="w-full sm:flex-1" variant="default">
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Edit
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit your purchased logo</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row justify-between gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button className="w-full sm:flex-1" variant="outline" onClick={() => handleDownload(generation.id!)} disabled={downloadingImages[generation.id!]}>
                                      <Download className="mr-2 h-4 w-4" />
                                      Preview
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Download low-resolution preview</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      className="w-full sm:flex-1"
                                      variant="default"
                                      onClick={() => handlePurchase(generation.id)}
                                      disabled={checkingOutImages[generation.id!]}
                                    >
                                      {checkingOutImages[generation.id!] ? (
                                        <>Processing...</>
                                      ) : (
                                        <>
                                          <ShoppingCart className="mr-2 h-4 w-4" />
                                          Buy
                                        </>
                                      )}
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Purchase high-resolution logo</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => setPage(i + 1)}
                        isActive={page === i + 1}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

