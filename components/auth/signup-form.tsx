'use client'

import * as React from 'react'
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
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { signUpSchema } from '@/lib/validations/auth'
import Link from 'next/link'
import { Icons } from '@/components/icons'
import { Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PasswordStrengthMeter } from '@/components/password-strength-meter'
import { useAction } from 'next-safe-action/hooks'
import { signUpAction } from '@/app/actions/auth'

type SignUpFormValues = z.infer<typeof signUpSchema>

// Rate limiting configuration
const RATE_LIMIT = {
  maxAttempts: 100,
  windowMs: 30 * 60 * 1000, // 30 minutes
}

export function SignUpForm() {
  const router = useRouter()
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockExpiry, setBlockExpiry] = useState<Date | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    execute: signUp,
    status,
    result,
    isPending
  } = useAction(signUpAction, {
    onSuccess: () => {
      // Clear any stored attempt data on successful signup
      localStorage.removeItem('signupAttempts')
      localStorage.removeItem('signupBlockExpiry')
      router.push('/verify-email')
    },
    onError: (error) => {
      console.log('1111111111111111111111', error)
      handleFailedAttempt()
    }
  })

  // Initialize rate limiting state
  useEffect(() => {
    const storedAttempts = localStorage.getItem('signupAttempts')
    const storedBlockExpiry = localStorage.getItem('signupBlockExpiry')
    
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
        localStorage.removeItem('signupAttempts')
        localStorage.removeItem('signupBlockExpiry')
      }
    }
  }, [])

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange', // Enable real-time validation
  })

  const handleFailedAttempt = () => {
    const newAttempts = attempts + 1
    setAttempts(newAttempts)
    localStorage.setItem('signupAttempts', newAttempts.toString())

    if (newAttempts >= RATE_LIMIT.maxAttempts) {
      const expiry = new Date(Date.now() + RATE_LIMIT.windowMs)
      setIsBlocked(true)
      setBlockExpiry(expiry)
      localStorage.setItem('signupBlockExpiry', expiry.toISOString())
    }
  }

  // Timer for blocked status
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isBlocked && blockExpiry) {
      timer = setInterval(() => {
        if (blockExpiry < new Date()) {
          setIsBlocked(false)
          setBlockExpiry(null)
          setAttempts(0)
          localStorage.removeItem('signupAttempts')
          localStorage.removeItem('signupBlockExpiry')
        }
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isBlocked, blockExpiry])

  async function onSubmit(data: SignUpFormValues) {
    if (isBlocked) return

    // Normalize email and name before sending to server
    const normalizedData = {
      ...data,
      email: data.email.toLowerCase().trim(),
      name: data.name.trim()
    }

    await signUp(normalizedData)
  }

  return (
    <div className="grid gap-6">
      {result?.serverError && (
        <Alert variant="destructive">
          <AlertDescription>{result.serverError}</AlertDescription>
        </Alert>
      )}
      {isBlocked && (
        <Alert variant="destructive">
          <AlertDescription>
            Too many signup attempts. Please try again in{' '}
            {blockExpiry && Math.ceil((blockExpiry.getTime() - Date.now()) / 60000)}{' '}
            minutes.
          </AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="John Doe"
                    autoCapitalize="words"
                    autoComplete="name"
                    autoCorrect="off"
                    disabled={isPending || isBlocked}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is how you'll appear on the platform
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
                <FormDescription>
                  You'll need to verify this email
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input 
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      disabled={isPending || isBlocked}
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <PasswordStrengthMeter password={field.value} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input 
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      disabled={isPending || isBlocked}
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isPending || isBlocked || !form.formState.isValid}
          >
            {isPending && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create account
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid gap-2">
        <Button 
          variant="outline" 
          type="button" 
          disabled={isPending || isBlocked}
          onClick={() => {
            // Implement Google OAuth signup
          }}
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        By creating an account, you agree to our{' '}
        <Link
          href="/terms"
          className="hover:text-brand underline underline-offset-4"
        >
          Terms of Service
        </Link>
        {' '}and{' '}
        <Link
          href="/privacy"
          className="hover:text-brand underline underline-offset-4"
        >
          Privacy Policy
        </Link>
      </p>
      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
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