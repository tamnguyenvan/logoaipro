"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Image,
  CreditCard,
  User,
  LogOut,
  Menu,
  Activity,
  ChevronLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { signOutAction } from "@/app/actions/auth"
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Usage", href: "/dashboard/usage", icon: Activity },
  { name: "Generations", href: "/dashboard/generations", icon: Image },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const { execute: signOut } = useAction(signOutAction)

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    signOut()
    router.push("/")
  }

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex h-full flex-col">
      <div className={cn(
        "flex h-16 items-center transition-all duration-300",
        isCollapsed && !isMobile ? "justify-center" : "px-4"
      )}>
        <Link href="/logo-generator" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <img src="/logo.png" alt="LogoAIPro" className="h-6 w-6" />
          </div>
          {(!isCollapsed || isMobile) && (
            <span className="text-xl font-semibold">LogoAIPro</span>
          )}
        </Link>
      </div>

      <div className="flex-1 space-y-2 p-4">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <TooltipProvider>
              <Tooltip key={link.name} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isCollapsed && !isMobile ? "px-2" : "px-4",
                      isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/50"
                    )}
                  >
                    <Link href={link.href} className="flex items-center gap-3">
                      <link.icon className={cn(
                        "h-5 w-5",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} />
                      {(!isCollapsed || isMobile) && <span>{link.name}</span>}
                    </Link>
                  </Button>
                </TooltipTrigger>
                {isCollapsed && !isMobile && (
                  <TooltipContent side="right">
                    {link.name}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>

      <div className="mt-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          {(!isCollapsed || isMobile) && (
            <span className="text-sm text-muted-foreground">Theme</span>
          )}
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:bg-destructive/90 hover:text-destructive-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-5 w-5" />
          {(!isCollapsed || isMobile) && "Log out"}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden h-screen bg-background border-r transition-all duration-300 relative md:flex",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 hidden md:flex"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform",
            isCollapsed && "rotate-180"
          )} />
        </Button>
        <SidebarContent />
      </aside>

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
        <SheetContent
          side="left"
          className="w-80 p-0"
        >
          <SheetHeader className="border-b p-4">
            <span className="font-semibold">Menu</span>
          </SheetHeader>
          <SidebarContent isMobile />
        </SheetContent>
      </Sheet>
    </>
  )
}