'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Pencil, Clock, ShoppingCart, MoreVertical, Trash } from 'lucide-react';
import { PromptDisplay } from "@/components/misc/prompt-display";
import { motion } from "framer-motion";
import { useAction } from "next-safe-action/hooks";
import { downloadLogoAction } from "@/app/actions/download";
import { checkoutAction } from "@/app/actions/checkout";
import { GeneratedLogo } from "@/lib/validations/generation";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface GenerationCardProps {
  generation: GeneratedLogo;
  onDelete: (generationId: string) => void;
}

export function GenerationCard({
  generation,
  onDelete,
}: GenerationCardProps) {
  const router = useRouter();

  const {
    execute: downloadLogo,
    isPending: isDownloading,
  } = useAction(downloadLogoAction, {
    onSuccess: (result) => {
      if (result.data?.downloadUrl) {
        const link = document.createElement('a');
        link.href = result.data.downloadUrl;
        link.download = 'generated-logo.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Logo downloaded successfully!');
      } else {
        toast.error('Failed to download logo.');
      }
    }
  });

  const {
    execute: checkout,
    result: checkoutResult,
    isPending: isCheckingOut,
  } = useAction(checkoutAction);

  const handlePurchase = async (generationId: string) => {
    try {
      checkout({
        variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_DOWNLOAD_HIRES_ID!,
        generationId,
      });

      if (checkoutResult.data?.checkoutUrl) {
        router.push(checkoutResult.data.checkoutUrl);
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      toast.error("Failed to checkout. Please try again.");
    }
  };

  const handleDownload = async (generationId: string) => {
    try {
      downloadLogo({ generationId });
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleDelete = () => {
    if (generation.id) {
      onDelete(generation.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="relative w-full pt-[100%]">
            <div className="absolute inset-0 p-2">
              <img
                src={generation.id ? `/api/logo/${generation.id}` : '/placeholder-image.svg'}
                alt="Generated logo"
                className="w-full h-full object-contain rounded-t-lg"
                onError={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  imgElement.onerror = null;
                  imgElement.src = '/placeholder.svg';
                }}
              />
              <div className="absolute top-3 left-3">
                <Badge variant={generation.is_high_res_purchased ? "secondary" : "destructive"}>
                  {generation.is_high_res_purchased ? "Purchased" : "Not Purchased"}
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-500 focus:text-red-500 focus:bg-red-50"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="p-3 flex flex-col gap-2 flex-1">
            <div className="text-sm line-clamp-2">
              <PromptDisplay
                prompt={generation.generation_details
                  ? JSON.parse(generation.generation_details).prompt
                  : 'No prompt available'}
              />
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              {new Date(generation.generation_timestamp).toLocaleString()}
            </div>

            <div className="flex flex-col gap-2 mt-auto pt-2">
              {generation.is_high_res_purchased ? (
                <>
                  <Button
                    className="w-full text-xs h-8"
                    variant="outline"
                    onClick={() => handleDownload(generation.id!)}
                    disabled={isDownloading}
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Download
                  </Button>
                  <Button
                    className="w-full text-xs h-8"
                    variant="default"
                  >
                    <Pencil className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="w-full text-xs h-8"
                    variant="outline"
                    onClick={() => handleDownload(generation.id!)}
                    disabled={isDownloading}
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Preview
                  </Button>
                  <Button
                    className="w-full text-xs h-8"
                    variant="default"
                    onClick={() => handlePurchase(generation.id!)}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? (
                      "Processing..."
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-3 w-3" />
                        Buy
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

