'use client'

import { useState, useRef, useEffect } from 'react'
import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Button } from "@/components/ui/button"
import { Menu, LogOut, LayoutDashboard, User, CreditCard } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const { session, signOut, loading } = useAuth()

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const NavItems = () => (
    <>
      <Link href="/logo-generator" className="group relative">
        <span className="text-sm font-medium transition-colors hover:text-primary">
          AI Logo Generator
        </span>
        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 transition-transform group-hover:scale-x-100" />
      </Link>
      <Link href="/logo-editor" className="group relative">
        <span className="text-sm font-medium transition-colors hover:text-primary">
          Logo Editor
        </span>
        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 transition-transform group-hover:scale-x-100" />
      </Link>
      <Link href="/pricing" className="group relative">
        <span className="text-sm font-medium transition-colors hover:text-primary">
          Pricing
        </span>
        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 transition-transform group-hover:scale-x-100" />
      </Link>
      <Link href="/about" className="group relative">
        <span className="text-sm font-medium transition-colors hover:text-primary">
          About
        </span>
        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary scale-x-0 transition-transform group-hover:scale-x-100" />
      </Link>
    </>
  )

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Logo" width={36} height={36} className="mr-2" />
          <Link href="/" className="flex items-center">
            <span className="font-bold text-2xl">
              LogoAIPro
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8 mx-auto">
          <NavItems />
        </nav>

        <div className="hidden md:flex items-center space-x-4 ml-auto relative">
          {loading ? (
            <Skeleton className="w-10 h-10 rounded-full" />
          ) : session ? (
            <div ref={dropdownRef} className="relative">
              <Avatar 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className="cursor-pointer ring-2 ring-primary ring-offset-2 ring-offset-background transition-all hover:ring-4"
              >
                <AvatarImage src={'/'} />
                <AvatarFallback>{session.user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              {isDropdownOpen && (
                <div  className="absolute right-0 mt-2 w-56 rounded-xl border bg-card text-card-foreground shadow-lg">
                  <div className="p-2 space-y-1">
                    <Link href="/dashboard">
                      <Button variant="ghost" className="w-full justify-start">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/dashboard/profile">
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Link href="/dashboard/billing">
                      <Button variant="ghost" className="w-full justify-start">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Billing
                      </Button>
                    </Link>
                  </div>
                  <div className="border-t p-2">
                    <Button variant="ghost" onClick={signOut} className="w-full justify-start text-destructive hover:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
          <ModeToggle />
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden ml-auto">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96">
            <SheetHeader>
              <SheetTitle className="text-left">Menu</SheetTitle>
              <SheetDescription className="text-left">
                Welcome to LogoAIPro
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col space-y-4 mt-8">
              <NavItems />
              {loading ? (
                <Skeleton className="w-8 h-8" />
              ) : session ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 rounded-lg bg-accent">
                    <Avatar>
                      <AvatarImage src={'/'} />
                      <AvatarFallback>{session.user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{session.user.email}</span>
                      <span className="text-sm text-muted-foreground">Manage your account</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link href="/dashboard">
                      <Button variant="ghost" className="w-full justify-start">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/dashboard/profile">
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Link href="/dashboard/billing">
                      <Button variant="ghost" className="w-full justify-start">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Billing
                      </Button>
                    </Link>
                  </div>

                  <Button variant="ghost" onClick={signOut} className="w-full justify-start text-destructive hover:text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button asChild variant="default" className="w-full">
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              )}
              <div className="pt-4">
                <ModeToggle />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}