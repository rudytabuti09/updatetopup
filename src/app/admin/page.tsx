'use client'

import * as React from 'react'
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { GlassCard } from '@/components/ui/glass-card'
import { StatusBadge } from '@/components/ui/status-badge'

interface AdminStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  todayOrders: number
  todayRevenue: number
  activeUsers: number
  systemAlerts: number
}

interface RecentActivity {
  id: string
  type: 'order' | 'user' | 'payment' | 'system'
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'error'
}

interface RecentOrder {
  id: string
  orderNumber: string
  user: string
  service: string
  amount: number
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED'
  createdAt: string
}

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<AdminStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    todayOrders: 0,
    todayRevenue: 0,
    activeUsers: 0,
    systemAlerts: 0
  })
  const [recentActivity, setRecentActivity] = React.useState<RecentActivity[]>([])
  const [recentOrders, setRecentOrders] = React.useState<RecentOrder[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data.stats)
        setRecentActivity(result.data.recentActivity)
        setRecentOrders(result.data.recentOrders)
      } else {
        console.error('Failed to fetch dashboard data:', result.message)
      }
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error)
    } finally {
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingBag className="h-4 w-4" />
      case 'user': return <Users className="h-4 w-4" />
      case 'payment': return <DollarSign className="h-4 w-4" />
      case 'system': return <Activity className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'error': return 'text-red-400'
      default: return 'text-white/60'
    }
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
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="loading-spinner mb-4" />
            <p className="text-white/70">Memuat dashboard admin...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      
      {/* Header with retro styling */}
      <div className="mb-8 relative">
        <div className="flex items-center space-x-4 mb-4">
          <h1 className="text-4xl font-heading font-bold text-transparent bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-purple bg-clip-text animate-pulse">
            ADMIN DASHBOARD
          </h1>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-neon-green rounded-full animate-ping" />
            <div className="w-2 h-2 bg-neon-cyan rounded-full animate-ping" style={{animationDelay: '0.2s'}} />
            <div className="w-2 h-2 bg-neon-magenta rounded-full animate-ping" style={{animationDelay: '0.4s'}} />
          </div>
        </div>
        <p className="text-white/70 font-mono text-sm tracking-wide">
          {">"}  Kelola sistem WMX TOPUP dan pantau aktivitas platform
        </p>
        <div className="neon-divider mt-4" />
      </div>

      {/* Stats Grid with enhanced retro styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Users */}
        <GlassCard variant="cyber" hover glow>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-mono text-neon-cyan uppercase tracking-wider">TOTAL_USERS.EXE</p>
              <p className="text-3xl font-bold text-white font-mono">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-neon-green flex items-center">
                <span className="mr-1">▲</span> +12% SYSTEM_GROWTH
              </p>
            </div>
            <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-blue flex items-center justify-center shadow-glow-cyan">
              <Users className="h-7 w-7 text-black" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2">
            <div className="text-xs text-white/40 font-mono">[01]</div>
          </div>
        </GlassCard>

        {/* Total Orders */}
        <GlassCard variant="cyber" hover>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-mono text-neon-magenta uppercase tracking-wider">ORDERS_COUNT.DB</p>
              <p className="text-3xl font-bold text-white font-mono">{stats.totalOrders.toLocaleString()}</p>
              <p className="text-xs text-neon-green flex items-center">
                <span className="mr-1">▲</span> +8% TRANSACTIONS
              </p>
            </div>
            <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-neon-green to-neon-cyan flex items-center justify-center shadow-glow-cyan animate-pulse">
              <ShoppingBag className="h-7 w-7 text-black" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2">
            <div className="text-xs text-white/40 font-mono">[02]</div>
          </div>
        </GlassCard>

        {/* Total Revenue */}
        <GlassCard variant="neon" hover>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-mono text-retro-gold uppercase tracking-wider">REVENUE_TOTAL.CR</p>
              <p className="text-3xl font-bold text-white font-mono">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-retro-gold flex items-center">
                <span className="mr-1">▲</span> +15% PROFIT_MARGIN
              </p>
            </div>
            <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-retro-gold to-retro-orange flex items-center justify-center shadow-glow-gold">
              <TrendingUp className="h-7 w-7 text-black" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2">
            <div className="text-xs text-white/40 font-mono">[03]</div>
          </div>
        </GlassCard>

        {/* System Alerts */}
        <GlassCard variant="cyber" hover className="border-orange-500/30">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-mono text-orange-400 uppercase tracking-wider animate-pulse">ALERT_SYS.WAR</p>
              <p className="text-3xl font-bold text-orange-300 font-mono animate-pulse">{stats.systemAlerts}</p>
              <p className="text-xs text-orange-400 uppercase font-mono">REQUIRE_ATTENTION</p>
            </div>
            <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.5)] animate-pulse">
              <AlertCircle className="h-7 w-7 text-black" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2">
            <div className="text-xs text-orange-400/60 font-mono animate-pulse">[!]</div>
          </div>
        </GlassCard>

      </div>

      {/* Today Stats with retro enhancement */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <GlassCard variant="cyber">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-mono text-neon-cyan uppercase tracking-wider">TODAY::ORDERS</p>
              <p className="text-4xl font-bold text-white font-mono animate-pulse">{stats.todayOrders}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-blue flex items-center justify-center shadow-glow-cyan">
              <Calendar className="h-6 w-6 text-black" />
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="cyber">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-mono text-retro-gold uppercase tracking-wider">TODAY::REVENUE</p>
              <p className="text-4xl font-bold text-retro-gold font-mono drop-shadow-glow-gold">{formatCurrency(stats.todayRevenue)}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-retro-gold to-retro-orange flex items-center justify-center shadow-glow-gold">
              <DollarSign className="h-6 w-6 text-black" />
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="cyber" className="border-amber-500/30">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-mono text-amber-400 uppercase tracking-wider animate-pulse">PENDING::QUEUE</p>
              <p className="text-4xl font-bold text-amber-300 font-mono animate-pulse">{stats.pendingOrders}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse">
              <Clock className="h-6 w-6 text-black" />
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Recent Activity & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Activity */}
        <GlassCard variant="cyber">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neon-cyan uppercase font-mono tracking-wider">ACTIVITY_LOG.SYS</h2>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
            </div>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5">
                <div className={`p-2 rounded-lg ${getStatusColor(activity.status)} bg-white/10`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.description}</p>
                  <p className="text-xs text-white/60">{formatDate(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Orders */}
        <GlassCard variant="cyber">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neon-magenta uppercase font-mono tracking-wider">ORDER_QUEUE.DB</h2>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-neon-magenta rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse" style={{animationDelay: '0.3s'}} />
            </div>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-white text-sm">{order.service}</p>
                    <p className="text-xs text-white/60">{order.orderNumber}</p>
                    <p className="text-xs text-white/60">{order.user}</p>
                  </div>
                  <StatusBadge status={convertOrderStatus(order.status)} />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="text-white/60">
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

      </div>

    </AdminLayout>
  )
}
