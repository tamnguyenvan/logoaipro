import { z } from 'zod'

export const downloadSchema = z.object({
  generationId: z.string(),
})