"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Image, CreditCard, User, Home, LogOut, Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "../mode-toggle"

const links = [
  { name: "Home", href: "/", icon: Home },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Generations", href: "/dashboard/generations", icon: Image },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <h1 className="text-2xl font-bold">LogoAIPro</h1>
      </div>
      <div className="flex-1 space-y-1 p-4">
        {links.map((link) => (
          <Button
            key={link.name}
            asChild
            variant="ghost"
            className={cn(
              "w-full justify-start",
              pathname === link.href
                ? "bg-gray-900 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            )}
          >
            <Link href={link.href}>
              <link.icon className="mr-3 h-5 w-5" />
              {link.name}
            </Link>
          </Button>
        ))}

        <div className="flex-1 space-y-1 p-4">
        <ModeToggle />
        </div>
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="outline"
          className="w-full justify-start text-gray-400 hover:bg-gray-700 hover:text-white"
          onClick={() => {
            // Add logout logic here
            console.log("Logout clicked")
          }}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Log out
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden h-screen w-64 flex-col bg-gray-800 text-white md:flex">
        <SidebarContent />
      </nav>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-40 md:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-gray-800 p-0">
          <SheetTitle>Menu</SheetTitle>
          <nav className="flex h-full flex-col text-white">
            <SidebarContent />
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}

