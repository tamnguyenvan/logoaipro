'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { SubmitButton } from './submit-button'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, loading } = useAuth()
  const router = useRouter() // Initialize the router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      // toast.error('Vui lòng nhập đầy đủ email và mật khẩu')
      return
    }

    const success = await signIn(email, password)
    
    if (success) {
      // toast.success('Đăng nhập thành công')
      router.push('/')
    }
  }


  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </div>
          <SubmitButton pendingText="Logging In..." className="w-full">
            Log In
          </SubmitButton>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
          Forgot password?
        </Link>
        <Link href="/sign-up" className="text-sm text-primary hover:underline">
          Don't have an account? Sign up
        </Link>
      </CardFooter>
    </Card>
  )
}

