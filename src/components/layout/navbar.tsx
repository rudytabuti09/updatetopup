'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search, User } from "lucide-react"
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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
            <Button variant="ghost" size="sm" className="text-white">
              <User className="h-4 w-4 mr-2" />
              Masuk
            </Button>
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
                <GradientButton variant="primary" size="sm" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Masuk
                </GradientButton>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
