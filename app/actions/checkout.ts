'use server'

import axios from 'axios'
import { createClient } from '@/lib/supabase/server'
import { actionClient } from '@/lib/safe-action'
import { checkoutSchema } from '@/lib/validations/checkout'

export const checkoutAction = actionClient
  .schema(checkoutSchema)
  .action(async ({ parsedInput: { variantId, generationId } }) => {
    try {
      const supabase = await createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Unauthorized')
      }

      const lemonsqueezyCheckoutUrl = process.env.LEMONSQUEEZY_CHECKOUT_URL || 'https://api.lemonsqueezy.com/v1/checkouts'
      const redirectUrl = process.env.LEMONSQUEEZY_REDIRECT_URL
      const response = await axios.post(
        lemonsqueezyCheckoutUrl,
        {
          data: {
            type: "checkouts",
            attributes: {
              checkout_data: {
                email: user.email,
                custom: { user_id: user.id, generation_id: generationId }
              },
              product_options: {
                redirect_url: redirectUrl,
              }
            },
            relationships: {
              store: { data: { type: "stores", id: process.env.LEMONSQUEEZY_STORE_ID } },
              variant: { data: { type: "variants", id: variantId } },
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`
          }
        }
      )

      if (!response.data || !response.data.data || !response.data.data.attributes || !response.data.data.attributes.url) {
        throw new Error('Failed to create checkout session')
      }

      const checkoutUrl = response.data.data.attributes.url;
      return { checkoutUrl }
    } catch (error) {
      if (error instanceof Error) {
        return { serverError: error.message }
      }
    }
  })