'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { forgotPasswordSchema } from '@/lib/validations/auth'
import Link from 'next/link'
import { LoaderCircle } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { forgotPasswordAction } from '@/app/actions/auth'
import { useState } from 'react'

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

// Rate limiting configuration
const RATE_LIMIT = {
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
}

export function ForgotPasswordForm() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockExpiry, setBlockExpiry] = useState<Date | null>(null)

  const {
    execute: sendResetLink,
    result,
    isPending
  } = useAction(forgotPasswordAction, {
    onSuccess: (data) => {
      // Clear any stored attempt data on successful submission
      localStorage.removeItem('resetAttempts')
      localStorage.removeItem('resetBlockExpiry')
    },
    onError: (error) => {
      handleFailedAttempt()
    }
  })

  // Initialize rate limiting state from localStorage
  React.useEffect(() => {
    const storedAttempts = localStorage.getItem('resetAttempts')
    const storedBlockExpiry = localStorage.getItem('resetBlockExpiry')
    
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts))
    }
    
    if (storedBlockExpiry) {
      const expiry = new Date(storedBlockExpiry)
      if (expiry > new Date()) {
        setIsBlocked(true)
        setBlockExpiry(expiry)
      } else {
        // Clear expired block
        localStorage.removeItem('resetAttempts')
        localStorage.removeItem('resetBlockExpiry')
      }
    }
  }, [])

  const handleFailedAttempt = () => {
    const newAttempts = attempts + 1
    setAttempts(newAttempts)
    localStorage.setItem('resetAttempts', newAttempts.toString())

    if (newAttempts >= RATE_LIMIT.maxAttempts) {
      const expiry = new Date(Date.now() + RATE_LIMIT.windowMs)
      setIsBlocked(true)
      setBlockExpiry(expiry)
      localStorage.setItem('resetBlockExpiry', expiry.toISOString())
    }
  }

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    if (isBlocked) return
    sendResetLink(data)
  }

  // Timer for blocked status
  React.useEffect(() => {
    let timer: NodeJS.Timeout
    if (isBlocked && blockExpiry) {
      timer = setInterval(() => {
        if (blockExpiry < new Date()) {
          setIsBlocked(false)
          setBlockExpiry(null)
          setAttempts(0)
          localStorage.removeItem('resetAttempts')
          localStorage.removeItem('resetBlockExpiry')
        }
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isBlocked, blockExpiry])

  // Show success message if the action was successful
  if (result.data?.success) {
    return (
      <Alert>
        <AlertDescription>
          If an account exists with that email, you will receive a password reset link shortly.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-6">
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {result.serverError && (
        <Alert variant="destructive">
          <AlertDescription>{result.serverError}</AlertDescription>
        </Alert>
      )}
      {isBlocked && (
        <Alert variant="destructive">
          <AlertDescription>
            Too many reset attempts. Please try again in{' '}
            {blockExpiry && Math.ceil((blockExpiry.getTime() - Date.now()) / 60000)}{' '}
            minutes.
          </AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isPending || isBlocked}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isPending || isBlocked}
          >
            {isPending && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send reset link
          </Button>
        </form>
      </Form>
      <p className="px-8 text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link
          href="/login"
          className="hover:text-brand underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}