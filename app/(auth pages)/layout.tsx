import { getUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getUser();

  if (user) {
    redirect('/logo-generator')
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}