'use client'

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { SubmitButton } from './submit-button'

export default function SignUpForm() {
  const { signUp } = useAuth()

  const handleSignUp = async (formData: FormData): Promise<void> => {
    const email = formData.get('email')?.toString()
    const password = formData.get('password')?.toString()
    const name = formData.get('name')?.toString()

    console.log('Form data:', formData)
    if (!email || !password || !name) {
      return
    }

    console.log('Signing up with email:', email)
    await signUp(email, password)
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              name="name"
              placeholder="Your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              minLength={8}
              required
            />
          </div>
          <SubmitButton pendingText="Signing Up..." formAction={handleSignUp} className="w-full">
            Sign Up
          </SubmitButton>
        </form>
      </CardContent>
      <CardFooter>
        <Link href="/login" className="text-sm text-primary hover:underline">
          Already have an account? Log in
        </Link>
      </CardFooter>
    </Card>
  )
}

