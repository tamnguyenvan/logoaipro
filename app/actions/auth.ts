'use server'

import { actionClient } from '@/lib/safe-action'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { 
  loginSchema, 
  signUpSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from '@/lib/validations/auth'
// import { redirect } from 'next/navigation'
import { InvalidCredentialsError, UserAlreadyExistsError } from '@/utils/errors/auth'

// Helpers
const setSessionCookie = (session: any) => {
  const cookieStore = cookies()
  cookieStore.set('session', JSON.stringify(session), {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })
}

const handleAuthError = (error: any) => {
  // Log error for monitoring
  console.error('Auth error:', error)
  
  // // Map Supabase error messages to user-friendly messages
  // const errorMessages: Record<string, string> = {
  //   'Invalid login credentials': 'Invalid email or password',
  //   'Email rate limit exceeded': 'Too many attempts. Please try again later',
  //   // Add more error mappings as needed
  // }

  // const message = errorMessages[error.message] || error.message
  // throw new Error(message)
  throw error;
}

export const signUpAction = actionClient
  .schema(signUpSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    try {
      const supabase = await createClient()
      
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase())
        .single()

      if (existingUser) {
        throw new UserAlreadyExistsError()
      }

      // Create user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim(),
            created_at: new Date().toISOString(),
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
        },
      })

      if (signUpError) throw signUpError

      // Set session cookie if auto-confirm is enabled
      if (data.session) {
        setSessionCookie(data.session)
      }

      return { 
        success: true,
        message: 'Please check your email to verify your account'
      }

    } catch (error) {
      handleAuthError(error)
    }
  })

export const signInAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      })

      if (error) throw InvalidCredentialsError

      // Set session cookie
      if (data.session) {
        setSessionCookie(data.session)
      }

      return { 
        success: true,
        user: data.user
      }

    } catch (error) {
      handleAuthError(error)
    }
  })

export const signOutAction = actionClient
  .action(async () => {
    try {
      const supabase = await createClient()
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Clear session cookie
      cookies().delete('session')
      
      // redirect('/login')
    } catch (error) {
      handleAuthError(error)
    }
  })

export const forgotPasswordAction = actionClient
  .schema(forgotPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    try {
      const supabase = await createClient()

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.toLowerCase(),
        {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
        }
      )

      if (error) throw error

      return { 
        success: true,
        message: 'Password reset instructions have been sent to your email'
      }

    } catch (error) {
      handleAuthError(error)
    }
  })

export const resetPasswordAction = actionClient
  .schema(resetPasswordSchema)
  .action(async ({ parsedInput: { password } }) => {
    try {
      const supabase = await createClient()

      const { error } = await supabase.auth.updateUser({ 
        password,
      },)

      if (error) throw error

      // Update session if it exists
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSessionCookie(session)
      }

      return { 
        success: true,
        message: 'Password has been successfully reset'
      }

    } catch (error) {
      handleAuthError(error)
    }
  })

// Optional: Verify email change action
export const updateEmailAction = actionClient
  .schema(forgotPasswordSchema) // Reuse email schema
  .action(async ({ parsedInput: { email } }) => {
    try {
      const supabase = await createClient()

      const { error } = await supabase.auth.updateUser({ 
        email: email.toLowerCase(),
        // options: {
        //   emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
        // }
      })

      if (error) throw error

      return { 
        success: true,
        message: 'Please check your new email for verification'
      }

    } catch (error) {
      handleAuthError(error)
    }
  })