'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { activityAction } from '@/app/actions/activity';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-hot-toast';

export function UsageActivity() {
  const [timeUntilReset, setTimeUntilReset] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    execute: fetchActivity,
    result: activityResult,
    isPending: isFetchingActivity,
    hasErrored: hasFetchingActivityError,
  } = useAction(activityAction, {
    onSuccess: (data) => {
      setIsRefreshing(false);
    },
    onError: (error) => {
      toast.error('Failed to fetch activity data');
      setIsRefreshing(false);
    }
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    fetchActivity();
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  // Calculate time until next reset
  useEffect(() => {
    const updateTimeUntilReset = () => {
      if (activityResult.data?.lastFreeGenerationsReset) {
        const now = new Date();
        const lastReset = new Date(activityResult.data.lastFreeGenerationsReset);
        const nextReset = new Date(lastReset);
        nextReset.setDate(nextReset.getDate() + 1);

        const timeDiff = nextReset.getTime() - now.getTime();
        
        if (timeDiff > 0) {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeUntilReset(`${days}d ${hours}h ${minutes}m`);
        } else {
          setTimeUntilReset('Resetting soon');
        }
      }
    };

    updateTimeUntilReset();
    const interval = setInterval(updateTimeUntilReset, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [activityResult.data?.lastFreeGenerationsReset]);

  const freeUsagePercentage = useMemo(() => {
    if (!activityResult.data?.freeGenerationsLeft) return 0;
    return (activityResult.data.freeGenerationsLeft / activityResult.data.freeGenerationsDailyLimit) * 100;
  }, [activityResult.data?.freeGenerationsLeft, activityResult.data?.freeGenerationsDailyLimit]);

  const totalGenerations = useMemo(() => {
    if (!activityResult.data?.freeGenerationsLeft) return 0;
    return activityResult.data.freeGenerationsLeft + activityResult.data.purchasedGenerationsLeft;
  }, [activityResult.data?.freeGenerationsLeft, activityResult.data?.purchasedGenerationsLeft]);

  if (isFetchingActivity && !activityResult.data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasFetchingActivityError) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <p className="text-red-500">Failed to load activity data</p>
            <Button onClick={() => fetchActivity()} variant="outline">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold flex items-center">
            Usage Activity
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="hover:bg-gray-100"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>
          Total Generations: {totalGenerations}
        </CardDescription>
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
            <Progress 
              value={freeUsagePercentage} 
              className="h-2"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{activityResult.data?.freeGenerationsLeft || 0} left</span>
              <span>{activityResult.data?.freeGenerationsDailyLimit || 0} total</span>
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
                      <AlertCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Purchased generations never expire</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {activityResult.data?.purchasedGenerationsLeft || 0} generations left
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
              <AnimatePresence mode="wait">
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
              Last reset: {activityResult.data?.lastFreeGenerationsReset
                ? new Date(activityResult.data.lastFreeGenerationsReset).toLocaleString()
                : 'Unknown'}
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}