'use client'

import * as React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Home, 
  ShoppingBag, 
  History, 
  Wallet, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Bell
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Riwayat Pesanan', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Saldo', href: '/dashboard/balance', icon: Wallet },
  { name: 'Profil', href: '/dashboard/profile', icon: User },
  { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mb-4" />
          <p className="text-white/70">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-wmx-light via-retro-lavender/10 to-wmx-light">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 bg-grid-retro bg-[length:50px_50px] opacity-10" />
      
      {/* Animated Neon Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-neon-magenta/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 left-20 w-80 h-80 bg-neon-cyan/5 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}} />
        <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-retro-gold/5 rounded-full blur-3xl animate-pulse" />
      </div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10">
            <div className="flex items-center justify-between p-4">
              <Logo />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="px-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.href)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gradient-primary text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="flex h-screen">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col">
          <GlassCard className="flex-1 m-4 p-0 overflow-hidden">
            <div className="flex flex-col h-full">
              
              {/* Logo */}
              <div className="p-6 border-b border-white/10">
                <Logo />
              </div>

              {/* User Info */}
              <div className="p-6 border-b border-wmx-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-magenta to-neon-cyan flex items-center justify-center relative">
                    <User className="h-5 w-5 text-white relative z-10" />
                    <div className="absolute inset-0 bg-neon-magenta/20 blur-lg rounded-full" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-wmx-dark font-heading">{session.user.name}</p>
                    <p className="text-xs text-wmx-gray-600">{session.user.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <button
                      key={item.name}
                      onClick={() => router.push(item.href)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors font-retro ${
                        isActive
                          ? 'bg-gradient-to-r from-neon-magenta to-neon-cyan text-white shadow-neon'
                          : 'text-wmx-gray-700 hover:text-wmx-dark hover:bg-neon-magenta/10'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </button>
                  )
                })}
              </nav>

              {/* Sign Out */}
              <div className="p-4 border-t border-wmx-gray-200">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-wmx-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-retro"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>

            </div>
          </GlassCard>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Mobile Header */}
          <div className="lg:hidden bg-slate-900/95 backdrop-blur-xl border-b border-white/10 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="text-white/70 hover:text-white mr-3"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <Logo />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <Bell className="h-5 w-5" />
                </Button>
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  )
}
