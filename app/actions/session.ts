'use server'

import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

export const getUserAction = actionClient
  .action(async () => {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      return { user }
    } catch (error) {
      throw error
    }
  })