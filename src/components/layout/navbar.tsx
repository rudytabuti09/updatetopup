'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, Search, User, LogOut, Settings, ShoppingCart, Zap, Gamepad2 } from "lucide-react"
import { WMXLogoPNGCompact } from "@/components/ui/wmx-logo-png"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useScrollPosition, useThrottle, usePrefersReducedMotion } from "@/lib/performance"

const navigation = [
  { name: "HOME", href: "/", icon: Gamepad2 },
  { name: "GAMES", href: "/catalog", icon: Zap },
  { name: "TRACK", href: "/tracking" },
  { name: "HELP", href: "/faq" },
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
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 gpu-accelerated",
      prefersReducedMotion ? "transition-none" : "transition-all duration-500 ease-out",
      isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-transparent"
    )}>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-magenta to-transparent opacity-50" />
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <div className="flex items-center gap-3">
              <WMXLogoPNGCompact 
                className="group-hover:scale-110 transition-transform duration-300" 
                width={48} 
                height={48}
              />
              <div className="hidden sm:block">
                <div className="font-heading font-black text-xl bg-gradient-to-r from-neon-magenta to-neon-cyan bg-clip-text text-transparent">
                  WMX TOPUP
                </div>
                <div className="text-xs text-wmx-gray-600 font-medium tracking-wider uppercase">
                  Services
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-heading font-semibold uppercase tracking-wider transition-all duration-300 group",
                  pathname === item.href 
                    ? "text-neon-magenta" 
                    : "text-wmx-gray-700 hover:text-neon-magenta"
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.name}
                </span>
                {pathname === item.href && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-magenta to-neon-cyan" />
                )}
                <div className="absolute inset-0 bg-neon-magenta/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-lg" />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wmx-gray-400 h-4 w-4 group-focus-within:text-neon-magenta transition-colors" />
              <Input
                placeholder="Search games..."
                className="w-64 pl-10 bg-white border border-wmx-gray-200 text-wmx-dark placeholder:text-wmx-gray-400 focus:border-neon-magenta focus:ring-1 focus:ring-neon-magenta/20 rounded-lg transition-all"
              />
            </div>
            
            {!isClient ? (
              <div className="w-20 h-9 bg-white/10 rounded animate-pulse" />
            ) : status === 'loading' ? (
              <div className="w-20 h-9 bg-white/10 rounded animate-pulse" />
            ) : status === 'authenticated' && session?.user ? (
              <div className="relative user-menu-container">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-wmx-dark hover:text-neon-magenta transition-colors font-retro"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <User className="h-4 w-4 mr-2" />
                  {session.user.name || session.user.email}
                </Button>
                
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-neon-magenta/20 py-2 z-50 overflow-hidden">
                    <div className="px-3 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{session.user.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{session.user.email}</p>
                    </div>
                    
                    <Link
                      href="/dashboard"
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    
                    <Link
                      href="/dashboard/orders"
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Pesanan Saya
                    </Link>
                    
                    {(session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') && (
                      <Link
                        href="/admin"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-200 mt-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                variant="neon" 
                size="sm" 
                className="font-heading uppercase"
                onClick={() => router.push('/auth/signin')}
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-wmx-dark hover:text-neon-magenta"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-6 pt-6 border-t border-white/10">
            <div className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block text-sm font-medium transition-colors hover:text-neon-blue",
                    pathname === item.href 
                      ? "text-neon-blue" 
                      : "text-white/80"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    placeholder="Cari game..."
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                {session?.user ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-white mb-2">
                      {session.user.name || session.user.email}
                    </div>
                    <GradientButton 
                      variant="primary" 
                      size="sm" 
                      className="w-full mb-2"
                      onClick={() => {
                        router.push('/dashboard')
                        setIsMenuOpen(false)
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </GradientButton>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-white border-white/20 hover:bg-red-500"
                      onClick={() => {
                        setIsMenuOpen(false)
                        signOut({ callbackUrl: '/' })
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Keluar
                    </Button>
                  </div>
                ) : isClient && (
                  <GradientButton 
                    variant="primary" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      router.push('/auth/signin')
                      setIsMenuOpen(false)
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Masuk
                  </GradientButton>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
