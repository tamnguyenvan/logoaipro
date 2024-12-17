'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Session } from '@supabase/supabase-js'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
    }

    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // toast.error(error.message)
      setLoading(false)
      return false
    }

    return true
  }

  const signUp = async (email: string, password: string, metadata?: object) => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    })

    if (error) {
      // toast.error(error.message)
      console.log(error)
      setLoading(false)
      return false
    }

    return true
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      // toast.error('Đăng xuất thất bại')
      return false
    }
    setSession(null)

    return true
  }

  return {
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!session
  }
}