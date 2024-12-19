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
import { useCheckout } from "@/hooks/usePayment";
import { useDownload } from "@/hooks/useDownload";
import { usePrice } from "@/hooks/usePrice";
import { Download, Pencil, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function GenerationGallery() {
  // States and hooks (unchanged)
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'purchased' | 'not-purchased'>('newest');
  const itemsPerPage = 12;
  const { checkout } = useCheckout();
  const { downloadImage } = useDownload();
  const [checkingOutImages, setCheckingOutImages] = useState<{ [key: string]: boolean }>({});
  const [downloadingImages, setDownloadingImages] = useState<{ [key: string]: boolean }>({});
  const { hiresPrice, isPriceLoading } = usePrice();
  const { generatedLogos, loading } = useGeneratedLogos();

  // Memoized and sorted generations (unchanged)
  const sortedGenerations = useMemo(() => {
    let sorted = [...generatedLogos];
    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.generation_timestamp).getTime() - new Date(a.generation_timestamp).getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.generation_timestamp).getTime() - new Date(b.generation_timestamp).getTime());
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

  // Pagination calculations (unchanged)
  const totalPages = Math.ceil(sortedGenerations.length / itemsPerPage);
  const currentGenerations = sortedGenerations.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [sortBy]);

  const handlePurchase = async (generationId: string) => {
    try {
      setCheckingOutImages(prev => ({ ...prev, [generationId]: true }));
      const variantId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_DOWNLOAD_HIRES_ID as string;
      const checkoutUrl = await checkout(variantId, generationId);
      if (!checkoutUrl) {
        throw new Error('Failed to create checkout session');
      }
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to create checkout session. Please try again.');
    } finally {
      setCheckingOutImages(prev => ({ ...prev, [generationId]: false }));
    }
  }

  const handleDownload = async (imageId: string) => {
    try {
      setDownloadingImages(prev => ({ ...prev, [imageId]: true }))
      await downloadImage(imageId);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setDownloadingImages(prev => ({ ...prev, [imageId]: false }))
    }
  };

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
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {Array.from({ length: itemsPerPage }).map((_, index) => (
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
                        <div className="relative">
                          <img
                            src={generation.id ? `/api/logo/${generation.id}` : '/placeholder-image.svg'}
                            alt="Generated logo"
                            onError={(e) => {
                              const imgElement = e.target as HTMLImageElement;
                              imgElement.onerror = null;
                              imgElement.src = '/placeholder.svg';
                            }}
                            className="w-full aspect-square object-cover rounded-t-lg"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant={generation.is_high_res_purchased ? "secondary" : "destructive"}>
                              {generation.is_high_res_purchased ? "Purchased" : "Not Purchased"}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-4 w-4" />
                            {new Date(generation.generation_timestamp).toLocaleString()}
                          </div>
                          {generation.is_high_res_purchased ? (
                            <div className="flex justify-between gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button className="w-full" variant="outline" onClick={() => handleDownload(generation.id!)} disabled={downloadingImages[generation.id!]}>
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
                                    <Button className="w-full" variant="default">
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
                            <div className="flex justify-between gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button className="w-full" variant="outline" onClick={() => handleDownload(generation.id!)} disabled={downloadingImages[generation.id!]}>
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
                                      className="w-full" 
                                      variant="default" 
                                      onClick={() => handlePurchase(generation.id)}
                                      disabled={checkingOutImages[generation.id!]}
                                    >
                                      {checkingOutImages[generation.id!] ? (
                                        <>Processing...</>
                                      ) : (
                                        <>
                                          <CheckCircle className="mr-2 h-4 w-4" />
                                          Buy (${isPriceLoading ? '...' : hiresPrice})
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

