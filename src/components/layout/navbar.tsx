'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, Search, User, LogOut, Settings, ShoppingCart } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Katalog", href: "/catalog" },
  { name: "Lacak Pesanan", href: "/tracking" },
  { name: "FAQ", href: "/faq" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [showUserMenu, setShowUserMenu] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
      "fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-6xl mx-auto z-50 px-4 transition-all duration-300",
      isScrolled ? "top-2" : "top-4"
    )}>
      <nav className={cn(
        "rounded-2xl px-6 py-4 transition-all duration-300",
        isScrolled 
          ? "glass backdrop-blur-xl border border-white/20 shadow-2xl" 
          : "bg-transparent"
      )}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size="md" variant="gradient" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-neon-blue",
                  pathname === item.href 
                    ? "text-neon-blue" 
                    : "text-white/80"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
              <Input
                placeholder="Cari game..."
                className="w-64 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            
            {status === 'loading' ? (
              <div className="w-16 h-8 bg-white/10 rounded animate-pulse" />
            ) : session?.user ? (
              <div className="relative user-menu-container">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:text-neon-blue transition-colors"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <User className="h-4 w-4 mr-2" />
                  {session.user.name || session.user.email}
                </Button>
                
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-lg shadow-xl border border-white/20 py-2 z-50">
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
                variant="ghost" 
                size="sm" 
                className="text-white hover:text-neon-blue transition-colors"
                onClick={() => router.push('/auth/signin')}
              >
                <User className="h-4 w-4 mr-2" />
                Masuk
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white"
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
                ) : (
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
