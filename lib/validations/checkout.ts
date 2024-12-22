import { z } from 'zod'

export const checkoutSchema = z.object({
  variantId: z.string(),
  generationId: z.string().optional(),
})