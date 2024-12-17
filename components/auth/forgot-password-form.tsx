'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from 'next/link'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement forgot password logic
    console.log('Password reset requested for:', email)
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href="/login" className="text-sm text-primary hover:underline">
          Remember your password? Log in
        </Link>
        <Link href="/sign-up" className="text-sm text-primary hover:underline">
          Don't have an account? Sign up
        </Link>
      </CardFooter>
    </Card>
  )
}

