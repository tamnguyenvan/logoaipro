import { z } from 'zod'

export const transactionSchema = z.object({
  id: z.string(),
  transaction_type: z.string(),
  amount: z.number(),
  transaction_timestamp: z.string().datetime(),
})

export type Transaction = z.infer<typeof transactionSchema>