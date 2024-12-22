import { z } from 'zod'
import { promptSchema } from '@/lib/validations/generation'
import { type LogoStyle } from '@/types/generation'

export type PromptFormData = z.infer<typeof promptSchema>
