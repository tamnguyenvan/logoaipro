'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGenerations } from "@/hooks/useGenerations";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Clock, Zap, Package } from 'lucide-react';

export function UsageActivity() {
  const { 
    freeGenerationsRemaining, 
    purchasedGenerationsRemaining, 
    lastFreeGenerationsReset, 
    freeGenerationsLimit 
  } = useGenerations();

  const [timeUntilReset, setTimeUntilReset] = useState<string>('');

  const freeUsagePercentage = ((freeGenerationsRemaining) / freeGenerationsLimit) * 100;
  const purchasedUsagePercentage = purchasedGenerationsRemaining > 0 
    ? ((purchasedGenerationsRemaining - 1) / purchasedGenerationsRemaining) * 100 
    : 0;

  useEffect(() => {
    const updateTimeUntilReset = () => {
      if (lastFreeGenerationsReset) {
        const now = new Date();
        const nextReset = new Date(lastFreeGenerationsReset);
        nextReset.setDate(nextReset.getDate() + 30); // Assuming reset is every 30 days
        
        const timeDiff = nextReset.getTime() - now.getTime();
        
        if (timeDiff > 0) {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          setTimeUntilReset(`${days}d ${hours}h`);
        } else {
          setTimeUntilReset('Resetting soon');
        }
      }
    };

    updateTimeUntilReset();
    const interval = setInterval(updateTimeUntilReset, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lastFreeGenerationsReset]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Zap className="mr-2 h-6 w-6 text-yellow-500" />
          Usage Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Free Generations</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <AlertCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Free generations reset monthly</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Progress value={freeUsagePercentage} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{freeGenerationsRemaining} left</span>
              <span>{freeGenerationsLimit} total</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Purchased Generations</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Package className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Purchased generations never expire</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Progress value={purchasedUsagePercentage} className="h-2" />
            <p className="mt-2 text-sm text-muted-foreground">
              {purchasedGenerationsRemaining} generations left
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-muted p-4 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-medium">Next Reset</p>
              </div>
              <AnimatePresence>
                <motion.p
                  key={timeUntilReset}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-bold"
                >
                  {timeUntilReset}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Last reset: {lastFreeGenerationsReset?.toLocaleString()}
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}

