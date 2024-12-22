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
import { loginSchema } from '@/lib/validations/auth'
import Link from 'next/link'
import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { Icons } from '@/components/icons'
import { useAction } from 'next-safe-action/hooks'
import { signInAction } from '@/app/actions/auth'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type LoginFormValues = z.infer<typeof loginSchema>

// Rate limiting configuration
const RATE_LIMIT = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockExpiry, setBlockExpiry] = useState<Date | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    execute: signIn,
    result,
    isPending
  } = useAction(signInAction, {
    onSuccess: (data) => {
      // Clear any stored attempt data on successful login
      localStorage.removeItem('loginAttempts')
      localStorage.removeItem('blockExpiry')
      router.push('/logo-generator')
    },
    onError: (error) => {
      handleFailedAttempt()
    }
  })

  // Initialize rate limiting state from localStorage
  useEffect(() => {
    const storedAttempts = localStorage.getItem('loginAttempts')
    const storedBlockExpiry = localStorage.getItem('blockExpiry')
    
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
        localStorage.removeItem('loginAttempts')
        localStorage.removeItem('blockExpiry')
      }
    }
  }, [])

  const handleFailedAttempt = () => {
    const newAttempts = attempts + 1
    setAttempts(newAttempts)
    localStorage.setItem('loginAttempts', newAttempts.toString())

    if (newAttempts >= RATE_LIMIT.maxAttempts) {
      const expiry = new Date(Date.now() + RATE_LIMIT.windowMs)
      setIsBlocked(true)
      setBlockExpiry(expiry)
      localStorage.setItem('blockExpiry', expiry.toISOString())
    }
  }

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    if (isBlocked) return
    await signIn(data)
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
          localStorage.removeItem('loginAttempts')
          localStorage.removeItem('blockExpiry')
        }
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isBlocked, blockExpiry])

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
            Too many failed attempts. Please try again in{' '}
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
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isPending || isBlocked}
                    {...field} 
                  />
                </FormControl>
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
                      autoComplete="current-password"
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
                  >
                    {showPassword ? (
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
          <div className="flex items-center justify-between">
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Forgot password?
            </Link>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isPending || isBlocked}
          >
            {isPending && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign in
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
            // Implement Google OAuth login
          }}
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
      <p className="px-8 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link
          href="/signup"
          className="hover:text-brand underline underline-offset-4"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}