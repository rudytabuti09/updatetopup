'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { ShoppingBag, Wallet, Clock, TrendingUp, ArrowRight, Calendar } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/ui/glass-card'
import { GradientButton } from '@/components/ui/gradient-button'
import { StatusBadge } from '@/components/ui/status-badge'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  totalOrders: number
  totalSpent: number
  pendingOrders: number
  successOrders: number
  balance: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  service: string
  amount: number
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED'
  createdAt: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = React.useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    successOrders: 0,
    balance: 0
  })
  const [recentOrders, setRecentOrders] = React.useState<RecentOrder[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Mock data for demo - replace with actual API calls
      setStats({
        totalOrders: 15,
        totalSpent: 450000,
        pendingOrders: 2,
        successOrders: 13,
        balance: 50000
      })

      setRecentOrders([
        {
          id: '1',
          orderNumber: 'WMX-1234567890',
          service: 'Mobile Legends - 86 Diamond',
          amount: 15000,
          status: 'SUCCESS',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          orderNumber: 'WMX-1234567891',
          service: 'Free Fire - 70 Diamond',
          amount: 10000,
          status: 'PROCESSING',
          createdAt: '2024-01-15T09:15:00Z'
        },
        {
          id: '3',
          orderNumber: 'WMX-1234567892',
          service: 'Telkomsel - Pulsa 25.000',
          amount: 26000,
          status: 'SUCCESS',
          createdAt: '2024-01-14T16:45:00Z'
        }
      ])

      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="loading-spinner mb-4" />
            <p className="text-white/70">Memuat dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">
          Selamat datang, {session?.user.name}! 👋
        </h1>
        <p className="text-white/70">
          Kelola pesanan dan lihat statistik akun Anda di sini
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Orders */}
        <GlassCard>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Total Pesanan</p>
              <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
            </div>
          </div>
        </GlassCard>

        {/* Total Spent */}
        <GlassCard>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Total Belanja</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalSpent)}</p>
            </div>
          </div>
        </GlassCard>

        {/* Balance */}
        <GlassCard>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Saldo</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.balance)}</p>
            </div>
          </div>
        </GlassCard>

        {/* Pending Orders */}
        <GlassCard>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/70">Pesanan Pending</p>
              <p className="text-2xl font-bold text-white">{stats.pendingOrders}</p>
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Orders List */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Pesanan Terbaru</h2>
            <GradientButton 
              variant="secondary" 
              size="sm"
              onClick={() => router.push('/dashboard/orders')}
            >
              <div className="flex items-center">
                Lihat Semua
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </GradientButton>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <ShoppingBag className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">{order.service}</p>
                      <p className="text-xs text-white/60">{order.orderNumber}</p>
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-white/60">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(order.createdAt)}
                  </div>
                  <div className="font-bold text-neon-blue">
                    {formatCurrency(order.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard>
          <h2 className="text-xl font-bold text-white mb-6">Aksi Cepat</h2>
          
          <div className="space-y-4">
            <GradientButton 
              className="w-full justify-start"
              onClick={() => router.push('/catalog')}
            >
              <ShoppingBag className="mr-3 h-5 w-5" />
              Beli Produk Baru
            </GradientButton>
            
            <GradientButton 
              variant="secondary"
              className="w-full justify-start"
              onClick={() => router.push('/dashboard/orders')}
            >
              <Clock className="mr-3 h-5 w-5" />
              Cek Status Pesanan
            </GradientButton>
            
            <GradientButton 
              variant="secondary"
              className="w-full justify-start"
              onClick={() => router.push('/dashboard/balance')}
            >
              <Wallet className="mr-3 h-5 w-5" />
              Top Up Saldo
            </GradientButton>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                <div>
                  <p className="text-sm text-white">Pesanan ML Diamond berhasil diproses</p>
                  <p className="text-xs text-white/60">2 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                <div>
                  <p className="text-sm text-white">Login dari perangkat baru</p>
                  <p className="text-xs text-white/60">1 hari yang lalu</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2"></div>
                <div>
                  <p className="text-sm text-white">Profil berhasil diperbarui</p>
                  <p className="text-xs text-white/60">3 hari yang lalu</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

      </div>
    </DashboardLayout>
  )
}
