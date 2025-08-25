'use client'

import * as React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard,
  Users,
  ShoppingBag,
  Settings,
  BarChart3,
  Package,
  LogOut,
  Menu,
  X,
  Bell,
  Shield,
  RefreshCw,
  Database,
  FolderOpen
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Pengguna', href: '/admin/users', icon: Users },
  { name: 'Pesanan', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Kategori & Service', href: '/admin/categories', icon: FolderOpen },
  { name: 'Produk & Layanan', href: '/admin/services', icon: Package },
  { name: 'Catalog VIP-Reseller', href: '/admin/catalog', icon: RefreshCw },
  { name: 'Stock Management', href: '/admin/stock', icon: Database },
  { name: 'Analitik', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
]

export function AdminLayout({ children }: AdminLayoutProps) {
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
          <p className="text-white/70">Memuat admin panel...</p>
        </div>
      </div>
    )
  }

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    router.push('/auth/signin')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h2>
          <p className="text-white/70">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative text-white">
      {/* Retro-modern background layers */}
      <div className="absolute inset-0 retro-bg-dark" />
      <div className="retro-grid-overlay" />
      <div className="scanline-overlay" />
      <div className="vignette-overlay" />

      {/* Foreground content */}
      <div className="relative z-10">
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
                          ? 'bg-gradient-to-r from-neon-magenta to-neon-cyan text-white shadow-neon'
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
                  <div className="mt-2 text-xs text-white/60 flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin Panel
                  </div>
                </div>

                {/* User Info */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{session.user.name}</p>
                      <p className="text-xs text-white/60">{session.user.role}</p>
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
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'bg-gradient-to-r from-neon-magenta to-neon-cyan text-white shadow-neon'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </button>
                    )
                  })}
                </nav>

                {/* Sign Out */}
                <div className="p-4 border-t border-white/10">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Keluar
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden bg-slate-900/70 backdrop-blur-xl border-b border-white/10 px-4 py-3">
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
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
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
    </div>
  )
}
