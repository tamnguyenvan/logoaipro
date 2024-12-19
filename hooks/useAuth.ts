'use client'
import { z } from 'zod'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Session, AuthError } from '@supabase/supabase-js'
import { SignUpInput, SignInInput, SignUpSchema, SignInSchema } from '@/types/auth'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        if (mounted) setSession(data.session)
      } catch (err) {
        console.error('Session check error:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (mounted) {
          setSession(newSession)
          if (event === 'SIGNED_IN') {
            // Create or update user profile
            if (newSession?.user) {
              await updateUserProfile(newSession.user.id)
            }
          }
        }
      }
    )

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [router])

  const handleAuthError = (error: AuthError | null) => {
    if (!error) return null
    
    // Map Supabase error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      'auth/invalid-email': 'Invalid email address',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'Email already in use',
      // Add more error mappings as needed
    }

    return errorMessages[error.message] || error.message
  }

  const validateSignUp = async (input: SignUpInput) => {
    try {
      await SignUpSchema.parseAsync(input)
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      }
      return false
    }
  }

  const validateSignIn = async (input: SignInInput) => {
    try {
      await SignInSchema.parseAsync(input)
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      }
      return false
    }
  }

  const signIn = async ({ email, password }: SignInInput) => {
    setError(null)
    setLoading(true)

    try {
      if (!await validateSignIn({ email, password })) {
        return false
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      return true
    } catch (err) {
      const errorMessage = handleAuthError(err as AuthError)
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  const signUp = async ({ email, password, name }: SignUpInput) => {
    setError(null)
    setLoading(true)

    try {
      if (!await validateSignUp({ email, password, name })) {
        return false
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      })

      if (signUpError) throw signUpError

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert([{ id: session?.user.id, name, email }])

      if (profileError) throw profileError

      return true
    } catch (err) {
      const errorMessage = handleAuthError(err as AuthError)
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setSession(null)
      return true
    } catch (err) {
      const errorMessage = handleAuthError(err as AuthError)
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      // If user profile doesn't exist, create it
      if (!data && !error) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ id: userId }])

        if (insertError) throw insertError
      }
    } catch (err) {
      console.error('Error updating user profile:', err)
    }
  }

  const updateUserName = async (name: string) => {
    setError(null)
    try {
      if (!session?.user.id) throw new Error('No user session')

      const { error } = await supabase
        .from('users')
        .update({ name })
        .eq('id', session.user.id)

      if (error) throw error
      return true
    } catch (err) {
      const errorMessage = handleAuthError(err as AuthError)
      setError(errorMessage)
      return false
    }
  }

  const getUserName = async () => {
    try {
      if (!session?.user.id) return null

      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', session.user.id)
        .single()

      if (error) throw error
      return data?.name
    } catch (err) {
      console.error('Error fetching user name:', err)
      return null
    }
  }

  return {
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateUserName,
    getUserName,
    isAuthenticated: !!session
  }
}