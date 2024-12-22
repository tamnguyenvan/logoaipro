'use server'

import { createClient } from "@/lib/supabase/server";
import { actionClient } from "@/lib/safe-action";

export const fetchTransactionsAction = actionClient
  .action(async () => {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Unauthorized')
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('id,transaction_type,amount,transaction_timestamp')
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      console.log('transactions', data)
      return {
        success: true,
        transactions: data
      }
    } catch (error) {
      throw error
    }
  })