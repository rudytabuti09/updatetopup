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

  const convertOrderStatus = (status: string) => {
    switch (status) {
      case 'PENDING': return 'pending'
      case 'WAITING_PAYMENT': return 'waiting'
      case 'PROCESSING': return 'processing'
      case 'SUCCESS': return 'success'
      case 'FAILED': return 'failed'
      case 'CANCELLED': return 'cancelled'
      case 'REFUNDED': return 'cancelled'
      default: return 'pending'
    }
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
        <h1 className="text-3xl font-heading font-bold text-wmx-dark mb-2">
          <span className="text-glow-magenta">Welcome back,</span> {session?.user.name}! 🎮
        </h1>
        <p className="text-wmx-gray-600">
          Manage your orders and track your gaming activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Orders */}
        <GlassCard hover>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-blue flex items-center justify-center relative">
              <ShoppingBag className="h-6 w-6 text-white relative z-10" />
              <div className="absolute inset-0 bg-neon-cyan/20 blur-lg rounded-lg" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-wmx-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-glow-cyan">{stats.totalOrders}</p>
            </div>
          </div>
        </GlassCard>

        {/* Total Spent */}
        <GlassCard hover>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-retro-gold to-retro-orange flex items-center justify-center relative">
              <TrendingUp className="h-6 w-6 text-white relative z-10" />
              <div className="absolute inset-0 bg-retro-gold/20 blur-lg rounded-lg" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-wmx-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-retro-gold">{formatCurrency(stats.totalSpent)}</p>
            </div>
          </div>
        </GlassCard>

        {/* Balance */}
        <GlassCard hover>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-neon-magenta to-neon-pink flex items-center justify-center relative">
              <Wallet className="h-6 w-6 text-white relative z-10" />
              <div className="absolute inset-0 bg-neon-magenta/20 blur-lg rounded-lg" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-wmx-gray-600">Balance</p>
              <p className="text-2xl font-bold text-glow-magenta">{formatCurrency(stats.balance)}</p>
            </div>
          </div>
        </GlassCard>

        {/* Pending Orders */}
        <GlassCard hover>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-neon-purple to-retro-orange flex items-center justify-center relative">
              <Clock className="h-6 w-6 text-white relative z-10" />
              <div className="absolute inset-0 bg-neon-purple/20 blur-lg rounded-lg" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-wmx-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-neon-purple">{stats.pendingOrders}</p>
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Orders List */}
        <GlassCard hover>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold text-wmx-dark">Recent Orders</h2>
            <GradientButton 
              variant="secondary" 
              size="sm"
              onClick={() => router.push('/dashboard/orders')}
            >
              <div className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </GradientButton>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 rounded-lg bg-white/80 border border-neon-magenta/20 hover:border-neon-magenta/40 transition-all duration-300 hover:shadow-glow-magenta group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-blue flex items-center justify-center relative">
                      <ShoppingBag className="h-4 w-4 text-white relative z-10" />
                      <div className="absolute inset-0 bg-neon-cyan/20 blur-lg rounded-lg" />
                    </div>
                    <div>
                      <p className="font-medium text-wmx-dark text-sm font-retro">{order.service}</p>
                      <p className="text-xs text-wmx-gray-600">{order.orderNumber}</p>
                    </div>
                  </div>
                  <StatusBadge status={convertOrderStatus(order.status)} />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-wmx-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(order.createdAt)}
                  </div>
                  <div className="font-bold text-glow-cyan">
                    {formatCurrency(order.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard hover>
          <h2 className="text-xl font-heading font-bold text-wmx-dark mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <GradientButton 
              className="w-full justify-start"
              onClick={() => router.push('/catalog')}
            >
              <ShoppingBag className="mr-3 h-5 w-5" />
              Shop New Products
            </GradientButton>
            
            <GradientButton 
              variant="secondary"
              className="w-full justify-start"
              onClick={() => router.push('/dashboard/orders')}
            >
              <Clock className="mr-3 h-5 w-5" />
              Check Order Status
            </GradientButton>
            
            <GradientButton 
              variant="sunset"
              className="w-full justify-start"
              onClick={() => router.push('/dashboard/balance')}
            >
              <Wallet className="mr-3 h-5 w-5" />
              Top Up Balance
            </GradientButton>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h3 className="text-lg font-heading font-semibold text-wmx-dark mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/60 border border-neon-green/20">
                <div className="w-2 h-2 rounded-full bg-neon-green mt-2 animate-pulse"></div>
                <div>
                  <p className="text-sm text-wmx-dark font-medium">ML Diamond order completed</p>
                  <p className="text-xs text-wmx-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/60 border border-neon-cyan/20">
                <div className="w-2 h-2 rounded-full bg-neon-cyan mt-2 animate-pulse"></div>
                <div>
                  <p className="text-sm text-wmx-dark font-medium">Login from new device</p>
                  <p className="text-xs text-wmx-gray-600">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/60 border border-neon-purple/20">
                <div className="w-2 h-2 rounded-full bg-neon-purple mt-2 animate-pulse"></div>
                <div>
                  <p className="text-sm text-wmx-dark font-medium">Profile updated successfully</p>
                  <p className="text-xs text-wmx-gray-600">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

      </div>
    </DashboardLayout>
  )
}
