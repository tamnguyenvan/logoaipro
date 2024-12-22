import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/api/logo']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname + request.nextUrl.search)
    return NextResponse.redirect(redirectUrl)
  }

  // // Store the current URL in searchParams if not logged in and accessing a protected route
  // if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
  //   const redirectUrl = new URL('/login', request.url)
  //   redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname + request.nextUrl.search)
  //   return NextResponse.redirect(redirectUrl)
  // }

  // // If logged in and accessing login/signup page, redirect to the page in redirectTo or dashboard
  // if (user && ['/login', '/signup'].includes(request.nextUrl.pathname)) {
  //   const redirectTo = request.nextUrl.searchParams.get('redirectTo')
  //   if (redirectTo) {
  //     if (redirectTo.startsWith('/login') || redirectTo.startsWith('/signup')) {
  //       return NextResponse.redirect(new URL('/', request.url))
  //     }
  //     return NextResponse.redirect(new URL(redirectTo, request.url))
  //   }
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}