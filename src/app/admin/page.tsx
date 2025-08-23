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
      // Mock data for demo - replace with actual API calls
      setStats({
        totalUsers: 2456,
        totalOrders: 12847,
        totalRevenue: 125670000,
        pendingOrders: 23,
        todayOrders: 87,
        todayRevenue: 1450000,
        activeUsers: 156,
        systemAlerts: 3
      })

      setRecentActivity([
        {
          id: '1',
          type: 'order',
          description: 'Order baru #WMX-1234567890 dari user@example.com',
          timestamp: '2024-01-15T10:30:00Z',
          status: 'success'
        },
        {
          id: '2',
          type: 'payment',
          description: 'Pembayaran gagal untuk order #WMX-1234567891',
          timestamp: '2024-01-15T10:15:00Z',
          status: 'error'
        },
        {
          id: '3',
          type: 'user',
          description: 'User baru mendaftar: newuser@example.com',
          timestamp: '2024-01-15T09:45:00Z',
          status: 'success'
        },
        {
          id: '4',
          type: 'system',
          description: 'VIP-Reseller API response time tinggi (>2s)',
          timestamp: '2024-01-15T09:30:00Z',
          status: 'warning'
        }
      ])

      setRecentOrders([
        {
          id: '1',
          orderNumber: 'WMX-1234567890',
          user: 'user@example.com',
          service: 'Mobile Legends - 86 Diamond',
          amount: 15000,
          status: 'SUCCESS',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          orderNumber: 'WMX-1234567891',
          user: 'gamer@example.com',
          service: 'Free Fire - 70 Diamond',
          amount: 10000,
          status: 'PROCESSING',
          createdAt: '2024-01-15T09:15:00Z'
        },
        {
          id: '3',
          orderNumber: 'WMX-1234567892',
          user: 'customer@example.com',
          service: 'Telkomsel - Pulsa 25.000',
          amount: 26000,
          status: 'PENDING',
          createdAt: '2024-01-15T08:45:00Z'
        }
      ])

      setLoading(false)
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error)
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
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">
          Dashboard Admin
        </h1>
        <p className="text-white/70">
          Kelola sistem WMX TOPUP dan pantau aktivitas platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Users */}
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Total Pengguna</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-green-400">↗ +12% dari bulan lalu</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        {/* Total Orders */}
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Total Pesanan</p>
              <p className="text-2xl font-bold text-white">{stats.totalOrders.toLocaleString()}</p>
              <p className="text-xs text-green-400">↗ +8% dari bulan lalu</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        {/* Total Revenue */}
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Total Revenue</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-green-400">↗ +15% dari bulan lalu</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </GlassCard>

        {/* System Alerts */}
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Sistem Alert</p>
              <p className="text-2xl font-bold text-white">{stats.systemAlerts}</p>
              <p className="text-xs text-orange-400">Perlu perhatian</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Today Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Pesanan Hari Ini</p>
              <p className="text-3xl font-bold text-white">{stats.todayOrders}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Revenue Hari Ini</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(stats.todayRevenue)}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Pesanan Pending</p>
              <p className="text-3xl font-bold text-white">{stats.pendingOrders}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Recent Activity & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Activity */}
        <GlassCard>
          <h2 className="text-xl font-bold text-white mb-6">Aktivitas Terbaru</h2>
          
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
        <GlassCard>
          <h2 className="text-xl font-bold text-white mb-6">Pesanan Terbaru</h2>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-white text-sm">{order.service}</p>
                    <p className="text-xs text-white/60">{order.orderNumber}</p>
                    <p className="text-xs text-white/60">{order.user}</p>
                  </div>
                  <StatusBadge status={order.status} />
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
