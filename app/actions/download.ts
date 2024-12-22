'use server'

import { actionClient } from '@/lib/safe-action'
import { createClient } from '@/lib/supabase/server'
import { downloadSchema } from '@/lib/validations/download'

export const downloadLogoAction = actionClient
  .schema(downloadSchema)
  .action(async ({ parsedInput: { generationId }}) => {
    try {

      // Validate auth
      const supabase = await createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (!user) {
        throw error
      }
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      return { success: true, downloadUrl: `${baseUrl}/api/logo/${generationId}` }

    } catch(error) {
      console.log('error', error)
      throw error
    }
  })