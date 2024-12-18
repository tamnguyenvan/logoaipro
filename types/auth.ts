import { z } from "zod"

export const SignUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(2, "Name must be at least 2 characters"),
})

export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export type SignUpInput = z.infer<typeof SignUpSchema>
export type SignInInput = z.infer<typeof SignInSchema>

export interface AuthError {
  message: string
  code?: string
}