'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, Search, User, ShoppingCart, Settings } from "lucide-react"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
    activeColor: "text-neon-cyan-accessible",
    inactiveColor: "text-gray-500",
  },
  {
    name: "Games",
    href: "/catalog", 
    icon: Package,
    activeColor: "text-neon-magenta-accessible",
    inactiveColor: "text-gray-500",
  },
  {
    name: "Track",
    href: "/tracking",
    icon: Search,
    activeColor: "text-retro-gold-accessible", 
    inactiveColor: "text-gray-500",
  },
  {
    name: "Profile",
    href: "/dashboard",
    icon: User,
    activeColor: "text-neon-purple-accessible",
    inactiveColor: "text-gray-500",
    requiresAuth: true,
  },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  // Don't show on desktop or when loading
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMobile) return null

  return (
    <>
      {/* Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        role="navigation"
        aria-label="Mobile Navigation"
      >
        {/* Background with blur effect */}
        <div className="relative">
          {/* Glass morphism background */}
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50" />
          
          {/* Subtle neon accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-magenta-accessible/30 to-transparent" />
          
          {/* Navigation Items */}
          <div className="relative grid grid-cols-4 gap-1 px-2 py-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              // Handle auth-required items
              if (item.requiresAuth && !session?.user) {
                return (
                  <Link
                    key="auth"
                    href="/login"
                    className={cn(
                      "flex flex-col items-center justify-center p-3",
                      "min-h-[56px] min-w-[56px]", // 56px = larger than 44px minimum
                      "rounded-xl transition-all duration-300",
                      "hover:bg-gray-100/80 active:bg-gray-200/80",
                      "focus:outline-none focus:ring-2 focus:ring-neon-magenta-accessible/50",
                      "group relative"
                    )}
                    aria-label="Login to access profile"
                  >
                    <Icon 
                      className={cn(
                        "h-6 w-6 mb-1 transition-colors duration-200",
                        "text-gray-500 group-hover:text-neon-magenta-accessible"
                      )}
                    />
                    <span className="text-xs font-medium text-gray-500 group-hover:text-neon-magenta-accessible leading-tight">
                      Login
                    </span>
                    
                    {/* Subtle hover effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-neon-magenta-accessible/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                )
              }
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center p-3",
                    "min-h-[56px] min-w-[56px]", // Touch target optimization
                    "rounded-xl transition-all duration-300",
                    "hover:bg-gray-100/80 active:bg-gray-200/80",
                    "focus:outline-none focus:ring-2 focus:ring-offset-1",
                    "group relative",
                    isActive 
                      ? "focus:ring-neon-magenta-accessible/50" 
                      : "focus:ring-gray-400/50"
                  )}
                  aria-label={`Navigate to ${item.name}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon 
                    className={cn(
                      "h-6 w-6 mb-1 transition-all duration-200",
                      isActive 
                        ? cn(item.activeColor, "scale-110") 
                        : cn(item.inactiveColor, "group-hover:scale-105")
                    )}
                  />
                  <span className={cn(
                    "text-xs font-medium leading-tight transition-colors duration-200",
                    isActive 
                      ? item.activeColor 
                      : "text-gray-500 group-hover:text-gray-700"
                  )}>
                    {item.name}
                  </span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neon-magenta-accessible animate-pulse" />
                  )}
                  
                  {/* Subtle hover effect */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                    isActive 
                      ? "from-neon-magenta-accessible/10 to-transparent"
                      : "from-gray-400/10 to-transparent"
                  )} />
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
      
      {/* Bottom padding for content to avoid overlap */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </>
  )
}
