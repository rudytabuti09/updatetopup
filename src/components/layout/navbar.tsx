'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, Search, User, LogOut, Settings, ShoppingCart, Zap, Package, Home, Crosshair, HelpCircle } from "lucide-react"
import { WMXLogoPNGCompact } from "@/components/ui/wmx-logo-png"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useScrollPosition, useThrottle, usePrefersReducedMotion } from "@/lib/performance"

// Holographic Navigation with Modern Icons
const navigation = [
  { 
    name: "HOME", 
    href: "/", 
    icon: Home,
    color: "from-cyan-400 to-blue-500",
    description: "Main Portal" 
  },
  { 
    name: "PRODUCTS", 
    href: "/catalog", 
    icon: Package,
    color: "from-purple-400 to-pink-500",
    description: "Product Catalog" 
  },
  { 
    name: "TRACK", 
    href: "/tracking", 
    icon: Crosshair,
    color: "from-green-400 to-emerald-500",
    description: "Order Tracking" 
  },
  { 
    name: "HELP", 
    href: "/faq", 
    icon: HelpCircle,
    color: "from-yellow-400 to-orange-500",
    description: "Support Center" 
  },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [showUserMenu, setShowUserMenu] = React.useState(false)
  const [isClient, setIsClient] = React.useState(false)
  
  // Performance optimized scroll handling
  const scrollPosition = useScrollPosition()
  const throttledScrollPosition = useThrottle(scrollPosition, 16) // 60fps
  const isScrolled = throttledScrollPosition > 20
  const prefersReducedMotion = usePrefersReducedMotion()

  // Fix hydration mismatch
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // Debug logging and session timeout handling
  React.useEffect(() => {
    console.log('Session status:', status)
    console.log('Session data:', session)
    console.log('Is client:', isClient)
    
    // Handle stuck loading state
    if (isClient && status === 'loading') {
      const timeoutId = setTimeout(() => {
        console.warn('Session loading timeout detected - this may indicate NextAuth API issues')
        // Force re-render by updating a dummy state
      }, 10000) // 10 second timeout
      
      return () => clearTimeout(timeoutId)
    }
  }, [status, session, isClient])

  // Removed scroll event listener - now using useScrollPosition hook for better performance

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        const target = event.target as HTMLElement
        if (!target.closest('.user-menu-container')) {
          setShowUserMenu(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  return (
    <>
      {/* Holographic Floating Topbar */}
      <header className={cn(
        "fixed left-1/2 -translate-x-1/2 z-[100] gpu-accelerated",
        prefersReducedMotion ? "transition-none" : "transition-all duration-700 ease-out",
        isScrolled ? "top-2" : "top-4"
      )}>
        {/* Holographic Container */}
        <div className="relative">
          {/* Main Floating Bar */}
          <div className={cn(
            "relative backdrop-blur-xl bg-white/80 border border-white/20 rounded-2xl",
            "shadow-[0_4px_20px_rgba(255,0,255,0.15),0_0_40px_rgba(0,255,255,0.1)]",
            "before:absolute before:inset-0 before:rounded-2xl before:p-[1px]",
            "before:bg-gradient-to-r before:from-purple-300/30 before:via-pink-300/30 before:to-cyan-300/30",
            "before:-z-10",
            "hover:shadow-[0_6px_30px_rgba(255,0,255,0.2),0_0_50px_rgba(0,255,255,0.15)]",
            "hover:bg-white/85 transition-all duration-500"
          )}>
            {/* Holographic Grid Overlay */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px),
                    linear-gradient(0deg, rgba(255,0,255,0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                  animation: 'hologram-shift 8s linear infinite'
                }}
              />
            </div>
            
            {/* Floating Glow Effects */}
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-magenta-500/20 rounded-3xl blur-xl animate-pulse opacity-60" />
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-pink-500/10 rounded-2xl blur-lg animate-pulse opacity-40" style={{animationDelay: '1s'}} />
            
            <nav className="relative px-8 py-4">
              <div className="flex items-center justify-between w-full">
                {/* Holographic Logo */}
                <Link href="/" className="flex-shrink-0 group relative">
                  <div className="flex items-center gap-3">
                    {/* Logo with Holographic Effect */}
                    <div className="relative">
                      <WMXLogoPNGCompact 
                        className="group-hover:scale-110 transition-transform duration-300 relative z-10" 
                        width={40} 
                        height={40}
                      />
                      {/* Holographic Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-magenta-400/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="hidden sm:block">
                      <div className="font-heading font-black text-lg bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
                        WMX TOPUP
                      </div>
                      <div className="text-xs text-gray-500 font-medium tracking-wider uppercase font-mono">
                        GAMING STORE
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Holographic Navigation Icons */}
                <div className="hidden lg:flex items-center space-x-2">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="group relative"
                      >
                        {/* Holographic Icon Container */}
                        <div className={cn(
                          "relative w-12 h-12 rounded-xl transition-all duration-500 cursor-pointer",
                          "backdrop-blur-sm border border-white/20",
                          "hover:scale-110 hover:border-white/40",
                          "flex items-center justify-center",
                          isActive 
                            ? "bg-gradient-to-r " + item.color + " border-white/60 shadow-lg" 
                            : "bg-white/5 hover:bg-white/10"
                        )}>
                          {/* Modern Icon */}
                          <div className="relative">
                            <Icon className={cn(
                              "w-5 h-5 filter drop-shadow-sm transition-colors duration-300",
                              isActive ? "text-white" : "text-gray-600 group-hover:text-gray-800"
                            )} />
                            {isActive && (
                              <div className="absolute inset-0 bg-white/20 rounded-full blur-sm animate-pulse" />
                            )}
                          </div>
                          
                          {/* Holographic Border Effect */}
                          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className={cn("absolute inset-0 rounded-xl border-2 bg-gradient-to-r", item.color, "opacity-60 animate-pulse")} />
                          </div>
                        </div>
                        
                        {/* Holographic Label on Hover */}
                        <div className={cn(
                          "absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg",
                          "bg-black/80 backdrop-blur-xl border border-cyan-400/50",
                          "text-xs font-mono text-cyan-300 uppercase tracking-wider",
                          "opacity-0 group-hover:opacity-100 transition-all duration-300",
                          "transform translate-y-2 group-hover:translate-y-0",
                          "pointer-events-none whitespace-nowrap",
                          "shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                        )}>
                          {/* Holographic Shimmer Effect */}
                          <div className="absolute inset-0 rounded-lg">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-pulse" />
                          </div>
                          
                          {/* Label Content */}
                          <div className="relative z-10 flex flex-col items-center">
                            <span className="font-bold">{item.name}</span>
                            <span className="text-cyan-400/70 text-[10px]">{item.description}</span>
                          </div>
                          
                          {/* Arrow Pointer */}
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-cyan-400/50" />
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {/* Holographic Search & User Actions */}
                <div className="hidden lg:flex items-center space-x-3">
                  {/* Holographic Search */}
                  <div className="relative group">
                    <div className="relative w-10 h-10 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 hover:border-purple-400/50 transition-all duration-300 cursor-pointer hover:scale-110">
                      <Search className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-hover:text-purple-500" />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 to-cyan-400/0 group-hover:from-cyan-400/20 group-hover:to-blue-400/20 transition-all duration-300" />
                    </div>
                    
                    {/* Holographic Search Label */}
                    <div className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg",
                      "bg-black/80 backdrop-blur-xl border border-cyan-400/50",
                      "text-xs font-mono text-cyan-300 uppercase tracking-wider",
                      "opacity-0 group-hover:opacity-100 transition-all duration-300",
                      "transform translate-y-2 group-hover:translate-y-0",
                      "pointer-events-none whitespace-nowrap",
                      "shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                    )}>
                      <span>SEARCH</span>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-cyan-400/50" />
                    </div>
                  </div>
                  
                  {/* Holographic User Profile */}
                  {!isClient ? (
                    <div className="w-10 h-10 bg-white/10 rounded-xl animate-pulse" />
                  ) : status === 'loading' ? (
                    <div className="w-10 h-10 bg-white/10 rounded-xl animate-pulse" />
                  ) : status === 'authenticated' && session?.user ? (
                    <div className="relative user-menu-container group">
                      <div 
                        className={cn(
                          "relative w-10 h-10 rounded-xl transition-all duration-300",
                          "bg-gradient-to-r from-neon-purple-accessible/20 to-neon-pink/20 backdrop-blur-sm",
                          "border border-white/20 hover:border-neon-purple-accessible/60",
                          "hover:scale-110 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]",
                          "flex items-center justify-center focus-accessible touch-target-optimal"
                        )}
                        onClick={() => setShowUserMenu(!showUserMenu)}
                      >
                        <User className="w-5 h-5 text-purple-300" />
                        {/* Active User Indicator */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black animate-pulse" />
                      </div>
                      
                      {/* Holographic User Label */}
                      <div className={cn(
                        "absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg",
                        "bg-black/80 backdrop-blur-xl border border-purple-400/50",
                        "text-xs font-mono text-purple-300 uppercase tracking-wider",
                        "opacity-0 group-hover:opacity-100 transition-all duration-300",
                        "transform translate-y-2 group-hover:translate-y-0",
                        "pointer-events-none whitespace-nowrap",
                        "shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                      )}>
                        <span>{session.user.name || session.user.email}</span>
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-purple-400/50" />
                      </div>
                      
                      {/* Holographic Dropdown Menu */}
                      {showUserMenu && (
                        <div className={cn(
                          "absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden z-50",
                          "bg-black/80 backdrop-blur-xl border border-purple-400/50",
                          "shadow-[0_0_40px_rgba(168,85,247,0.3)]",
                          "animate-fade-in"
                        )}>
                          {/* Holographic Grid Overlay */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div 
                              className="absolute inset-0 opacity-5"
                              style={{
                                backgroundImage: `
                                  linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px),
                                  linear-gradient(0deg, rgba(219,39,119,0.3) 1px, transparent 1px)
                                `,
                                backgroundSize: '15px 15px'
                              }}
                            />
                          </div>
                          
                          {/* User Info Header */}
                          <div className="relative px-4 py-3 border-b border-purple-400/30">
                            <p className="text-sm font-mono text-purple-300 font-bold uppercase tracking-wider">{session.user.name || 'User'}</p>
                            <p className="text-xs text-purple-400/70 font-mono">{session.user.email}</p>
                          </div>
                          
                          {/* Menu Items */}
                          <div className="relative py-2">
                            <Link
                              href="/dashboard"
                              className={cn(
                                "flex items-center px-4 py-2.5 text-sm font-mono text-purple-300",
                                "hover:bg-purple-500/20 hover:text-purple-200 transition-all duration-300",
                                "border-l-2 border-transparent hover:border-purple-400"
                              )}
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Settings className="h-4 w-4 mr-3 text-purple-400" />
                              <span className="uppercase tracking-wider">Dashboard</span>
                            </Link>
                            
                            <Link
                              href="/dashboard/orders"
                              className={cn(
                                "flex items-center px-4 py-2.5 text-sm font-mono text-purple-300",
                                "hover:bg-purple-500/20 hover:text-purple-200 transition-all duration-300",
                                "border-l-2 border-transparent hover:border-purple-400"
                              )}
                              onClick={() => setShowUserMenu(false)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-3 text-purple-400" />
                              <span className="uppercase tracking-wider">Orders</span>
                            </Link>
                            
                            {(session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') && (
                              <Link
                                href="/admin"
                                className={cn(
                                  "flex items-center px-4 py-2.5 text-sm font-mono text-orange-300",
                                  "hover:bg-orange-500/20 hover:text-orange-200 transition-all duration-300",
                                  "border-l-2 border-transparent hover:border-orange-400"
                                )}
                                onClick={() => setShowUserMenu(false)}
                              >
                                <Settings className="h-4 w-4 mr-3 text-orange-400" />
                                <span className="uppercase tracking-wider">Admin</span>
                              </Link>
                            )}
                            
                            <div className="border-t border-purple-400/30 mt-2 pt-2">
                              <button
                                onClick={() => {
                                  setShowUserMenu(false)
                                  signOut({ callbackUrl: '/' })
                                }}
                                className={cn(
                                  "flex items-center w-full px-4 py-2.5 text-sm font-mono text-red-400",
                                  "hover:bg-red-500/20 hover:text-red-300 transition-all duration-300",
                                  "border-l-2 border-transparent hover:border-red-400"
                                )}
                              >
                                <LogOut className="h-4 w-4 mr-3" />
                                <span className="uppercase tracking-wider">Logout</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="group relative">
                        <div 
                          className={cn(
                            "relative w-10 h-10 rounded-xl cursor-pointer transition-all duration-300",
                            "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm",
                            "border border-white/20 hover:border-cyan-400/60",
                            "hover:scale-110 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]",
                            "flex items-center justify-center"
                          )}
                          onClick={() => router.push('/auth/signin')}
                        >
                          <User className="w-5 h-5 text-cyan-300" />
                        </div>
                        
                        {/* Holographic Login Label */}
                        <div className={cn(
                          "absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg",
                          "bg-black/80 backdrop-blur-xl border border-cyan-400/50",
                          "text-xs font-mono text-cyan-300 uppercase tracking-wider",
                          "opacity-0 group-hover:opacity-100 transition-all duration-300",
                          "transform translate-y-2 group-hover:translate-y-0",
                          "pointer-events-none whitespace-nowrap",
                          "shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                        )}>
                          <span>LOGIN</span>
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-cyan-400/50" />
                        </div>
                      </div>
                    )}
                </div>

                {/* Mobile Holographic Menu Button */}
                <div className="lg:hidden group relative">
                  <div 
                    className={cn(
                      "relative w-10 h-10 rounded-xl cursor-pointer transition-all duration-300",
                      "bg-gradient-to-r from-magenta-500/20 to-purple-500/20 backdrop-blur-sm",
                      "border border-white/20 hover:border-magenta-400/60",
                      "hover:scale-110 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]",
                      "flex items-center justify-center"
                    )}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    {isMenuOpen ? 
                      <X className="w-5 h-5 text-magenta-300" /> : 
                      <Menu className="w-5 h-5 text-magenta-300" />
                    }
                  </div>
                </div>
              </div>

            </nav>
          </div>
          
          {/* Holographic Corner Accents */}
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/60 rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-magenta-400/60 rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-magenta-400/60 rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/60 rounded-br-lg" />
        </div>
        
        {/* Mobile Holographic Dropdown */}
        {isMenuOpen && (
          <div className={cn(
            "lg:hidden absolute top-full left-1/2 -translate-x-1/2 mt-4 w-80 rounded-xl overflow-hidden",
            "bg-black/80 backdrop-blur-xl border border-magenta-400/50",
            "shadow-[0_0_40px_rgba(236,72,153,0.3)]",
            "animate-fade-in"
          )}>
            {/* Holographic Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, rgba(236,72,153,0.3) 1px, transparent 1px),
                    linear-gradient(0deg, rgba(139,92,246,0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
            </div>
            
            <div className="relative p-6">
              {/* Mobile Navigation */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex flex-col items-center p-4 rounded-xl transition-all duration-300",
                        "backdrop-blur-sm border border-white/20 hover:border-white/40",
                        isActive 
                          ? "bg-gradient-to-r " + item.color + " border-white/60" 
                          : "bg-white/5 hover:bg-white/10"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-6 h-6 mb-2 text-white" />
                      <span className="text-xs font-mono text-white uppercase tracking-wider">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
              
              {/* Mobile User Section */}
              {session?.user ? (
                <div className="space-y-3">
                  <div className="text-center p-3 bg-white/5 rounded-xl">
                    <p className="text-sm font-mono text-purple-300 font-bold">{session.user.name || session.user.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => {
                        router.push('/dashboard')
                        setIsMenuOpen(false)
                      }}
                      className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 text-purple-300 font-mono text-xs"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      DASHBOARD
                    </Button>
                    <Button
                      onClick={() => {
                        setIsMenuOpen(false)
                        signOut({ callbackUrl: '/' })
                      }}
                      className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 text-red-300 font-mono text-xs"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      LOGOUT
                    </Button>
                  </div>
                </div>
              ) : isClient && (
                <Button 
                  className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 font-mono text-sm"
                  onClick={() => {
                    router.push('/auth/signin')
                    setIsMenuOpen(false)
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  LOGIN
                </Button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
