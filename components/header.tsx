'use client'

import { useState, useRef, useEffect } from 'react'
import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { Menu, Settings, LogOut, LayoutDashboard, User, CreditCard } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from './ui/skeleton'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const { session, signOut, loading } = useAuth()

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false)
    }
  }

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
      <Link href="/logo-generator" className="text-sm font-medium hover:text-primary transition-colors">
        AI Logo Generator
      </Link>
      <Link href="/logo-editor" className="text-sm font-medium hover:text-primary transition-colors">
        Logo Editor
      </Link>
      <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
        Pricing
      </Link>
      <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
        About
      </Link>
      <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
        Contact
      </Link>
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Image src="/logo.png" alt="Logo" width={36} height={36} className="mr-2" />
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl">LogoAIPro</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 mx-auto">
          <NavItems />
        </nav>
        <div className="hidden md:flex items-center space-x-4 ml-auto relative">
          {loading && (
            <Avatar onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="cursor-pointer">
              <AvatarImage src={'/'} />
              <AvatarFallback>
                <Skeleton className="w-8 h-8 rounded-full" />
              </AvatarFallback>
            </Avatar>
          )}
          {!loading && (session ? (
            <>
              <div ref={dropdownRef}>
                <Avatar onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="cursor-pointer">
                  <AvatarImage src={'/'} />
                  <AvatarFallback>{session.user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-md">
                    <Link href="/dashboard" className="block px-4 py-2">
                      <Button variant="ghost" className="justify-start w-full text-left">
                        <LayoutDashboard className="w-4 h-4 mr-2 inline-block" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/dashboard/profile" className="block px-4 py-2">
                      <Button variant="ghost" className="justify-start w-full text-left">
                        <User className="w-4 h-4 mr-2 inline-block" />
                        Profile
                      </Button>
                    </Link>
                    <Link href="/dashboard/billing" className="block px-4 py-2">
                      <Button variant="ghost" className="justify-start w-full text-left">
                        <CreditCard className="w-4 h-4 mr-2 inline-block" />
                        Billing
                      </Button>
                    </Link>
                    <Link href="/dashboard/settings" className="block px-4 py-2">
                      <Button variant="ghost" className="justify-start w-full text-left">
                        <Settings className="w-4 h-4 mr-2 inline-block" />
                        Settings
                      </Button>
                    </Link>
                    <div className="h-0.5 w-full px-4">
                      <div className="border-b border-gray-200"></div>
                    </div>
                    <div className="block px-4 py-2">
                      <Button variant="ghost" onClick={signOut} className="justify-start w-full text-left">
                        <LogOut className="w-4 h-4 mr-2 inline-block" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          ))}
          <ModeToggle />
        </div>

        {/* Mobile navbar */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden ml-auto">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetDescription>LogoAIPro</SheetDescription>
            </SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <nav className="flex flex-col space-y-4 mt-4">
              <NavItems />
              {loading && <Skeleton className="w-8 h-8" />}
              {!loading && (session ? (
                <>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={'/'} />
                      <AvatarFallback>{session.user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{session.user.email}</span>
                  </div>

                  <Link href="/dashboard" className="block w-full">
                    <Button variant="ghost" className="justify-start w-full text-left">
                      <Settings className="w-4 h-4 mr-2 inline-block" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={signOut} className="justify-start w-full text-left">
                    <LogOut className="w-4 h-4 mr-2 inline-block" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild className="justify-start">
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </>
              ))}
              <ModeToggle />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
