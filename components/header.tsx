'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { AvatarDropdown } from './misc/avatar-dropdown';
import { ThemeToggle } from './misc/theme-toggle';
import { useAction } from 'next-safe-action/hooks';
import { getUserAction } from '@/app/actions/session';
import { signOutAction } from '@/app/actions/auth';
import { useEffect } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    execute: getUser,
    result: userResult,
    isPending
  } = useAction(getUserAction, {});

  const {execute: signOut} = useAction(signOutAction);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleSignOut = async () => {
    signOut();
    getUser()
  }

  const NavLinks = () => (
    <>
      <Link href="/logo-generator" className="block text-sm font-medium hover:text-primary transition-colors">
        AI Logo Generator
      </Link>
      <Link href="/logo-editor" className="block text-sm font-medium hover:text-primary transition-colors">
        Logo Editor
      </Link>
      <Link href="/pricing" className="block text-sm font-medium hover:text-primary transition-colors">
        Pricing
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <Link href="/" className="text-lg font-bold">
              LogoAIPro
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {!userResult.data?.user ? (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Login
              </Link>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          ) : (
            <AvatarDropdown user={userResult.data.user} onSignOut={handleSignOut} />
          )}
          
          <ThemeToggle />

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <SheetTitle>Menu</SheetTitle>
              <SheetHeader>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <NavLinks />
                {!userResult.data?.user && (
                  <div className="flex flex-col gap-4 mt-4">
                    <Link 
                      href="/login" 
                      className="text-sm font-medium hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Button asChild>
                      <Link 
                        href="/signup"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign up
                      </Link>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}