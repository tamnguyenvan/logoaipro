import { z } from 'zod'

export const promptSchema = z.object({
  prompt: z.string(),
})

export const generatedLogoSchema = z.object({
  id: z.string(),
  is_free_generation: z.boolean(),
  is_high_res_purchased: z.boolean(),
  generation_timestamp: z.string().datetime(),
  generation_details: z.string(),
})

export type GeneratedLogo = z.infer<typeof generatedLogoSchema>