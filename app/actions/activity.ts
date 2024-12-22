'use server'

import { createClient } from "@/lib/supabase/server";
import { actionClient } from "@/lib/safe-action";

export const activityAction = actionClient
  .action(async () => {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Unauthorized');
      }

      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('free_generations_left,purchased_generations_left,last_free_generations_reset')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Fetch system configuration
      const { data: configData, error: configError } = await supabase
        .from('system_configurations')
        .select('config_value')
        .eq('config_key', 'FREE_GENERATIONS_DAILY_LIMIT')
        .single();
      
      if (configError) throw configError;

      // // Fetch usage history for the last 30 days
      // const thirtyDaysAgo = new Date();
      // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // const { data: usageHistory, error: usageError } = await supabase
      //   .from('generation_history')
      //   .select('created_at, count')
      //   .eq('user_id', user.id)
      //   .gte('created_at', thirtyDaysAgo.toISOString())
      //   .order('created_at', { ascending: true });

      // if (usageError) throw usageError;

      // // Process usage history into daily counts
      // const processedHistory = usageHistory?.reduce((acc: any[], entry) => {
      //   const date = new Date(entry.created_at).toISOString().split('T')[0];
      //   const existingEntry = acc.find(item => item.date === date);
        
      //   if (existingEntry) {
      //     existingEntry.count += entry.count;
      //   } else {
      //     acc.push({ date, count: entry.count });
      //   }
        
      //   return acc;
      // }, []) || [];

      // // Fill in missing dates with zero counts
      // const fullHistory = [];
      // const current = new Date(thirtyDaysAgo);
      // const end = new Date();
      
      // while (current <= end) {
      //   const dateStr = current.toISOString().split('T')[0];
      //   const existingEntry = processedHistory.find(entry => entry.date === dateStr);
        
      //   fullHistory.push({
      //     date: dateStr,
      //     count: existingEntry ? existingEntry.count : 0
      //   });
        
      //   current.setDate(current.getDate() + 1);
      // }

      return {
        success: true,
        freeGenerationsLeft: userData.free_generations_left,
        purchasedGenerationsLeft: userData.purchased_generations_left,
        lastFreeGenerationsReset: userData.last_free_generations_reset,
        freeGenerationsDailyLimit: configData?.config_value as number || 10,
      };
    } catch (error) {
      console.error('Activity fetch error:', error);
      throw error;
    }
  });