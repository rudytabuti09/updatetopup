'use client'

import * as React from 'react'
import { 
  ShoppingBag, 
  Search, 
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

interface Order {
  id: string
  orderNumber: string
  userId: string
  user: {
    name: string
    email: string
  }
  serviceId: string
  service: {
    name: string
    category: {
      name: string
    }
  }
  productName: string
  targetAccount: string
  quantity: number
  amount: number
  status: 'PENDING' | 'WAITING_PAYMENT' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED'
  paymentStatus: 'PENDING' | 'SETTLEMENT' | 'FAILED' | 'EXPIRED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
}

interface OrderStats {
  totalOrders: number
  pendingOrders: number
  processingOrders: number
  completedOrders: number
  failedOrders: number
  totalRevenue: number
  todayOrders: number
  todayRevenue: number
}

const statusColors = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  WAITING_PAYMENT: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  PROCESSING: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  SUCCESS: 'bg-green-500/20 text-green-400 border-green-500/30',
  FAILED: 'bg-red-500/20 text-red-400 border-red-500/30',
  CANCELLED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  REFUNDED: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
}

const paymentStatusColors = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  SETTLEMENT: 'bg-green-500/20 text-green-400 border-green-500/30',
  FAILED: 'bg-red-500/20 text-red-400 border-red-500/30',
  EXPIRED: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  CANCELLED: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

export default function AdminOrdersPage() {
  const { toast } = useToast()
  const [orders, setOrders] = React.useState<Order[]>([])
  const [stats, setStats] = React.useState<OrderStats>({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    failedOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0
  })
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = React.useState('all')

  const fetchOrders = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/orders')
      const result = await response.json()
      
      if (result.success) {
        setOrders(result.data.orders)
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const fetchOrderStats = React.useCallback(async () => {
    try {
      const response = await fetch('/api/admin/orders/stats')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching order stats:', error)
    }
  }, [])

  React.useEffect(() => {
    fetchOrders()
    fetchOrderStats()
  }, [fetchOrders, fetchOrderStats])

  const handleOrderAction = async (orderId: string, action: string) => {
    try {
      const response = await fetch('/api/admin/orders/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId, action })
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message
        })
        fetchOrders()
        fetchOrderStats()
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error performing order action:', error)
      toast({
        title: 'Error',
        description: 'Failed to perform action',
        variant: 'destructive'
      })
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.targetAccount.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPaymentStatus = paymentStatusFilter === 'all' || order.paymentStatus === paymentStatusFilter
    
    return matchesSearch && matchesStatus && matchesPaymentStatus
  })

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'WAITING_PAYMENT': return <Clock className="h-4 w-4" />
      case 'PROCESSING': return <RefreshCw className="h-4 w-4" />
      case 'SUCCESS': return <CheckCircle className="h-4 w-4" />
      case 'FAILED': return <XCircle className="h-4 w-4" />
      case 'CANCELLED': return <XCircle className="h-4 w-4" />
      case 'REFUNDED': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="loading-spinner mb-4" />
            <p className="text-white/70">Memuat data pesanan...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Manajemen Pesanan
        </h1>
        <p className="text-white/70">
          Kelola pesanan, status pembayaran, dan tracking order
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6 mb-8">
        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-3">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Total Orders</p>
              <p className="text-xl font-bold text-white">{stats.totalOrders}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center mr-3">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Pending</p>
              <p className="text-xl font-bold text-white">{stats.pendingOrders}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-3">
              <RefreshCw className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Processing</p>
              <p className="text-xl font-bold text-white">{stats.processingOrders}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mr-3">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Completed</p>
              <p className="text-xl font-bold text-white">{stats.completedOrders}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center mr-3">
              <XCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Failed</p>
              <p className="text-xl font-bold text-white">{stats.failedOrders}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-3">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Total Revenue</p>
              <p className="text-xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center mr-3">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Today Orders</p>
              <p className="text-xl font-bold text-white">{stats.todayOrders}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center mr-3">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Today Revenue</p>
              <p className="text-xl font-bold text-white">{formatCurrency(stats.todayRevenue)}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
            <Input
              placeholder="Cari nomor order, nama user, email, produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="WAITING_PAYMENT">Waiting Payment</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Payment</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SETTLEMENT">Settlement</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </GlassCard>

      {/* Orders Table */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/70 font-medium">Order</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Product</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Target</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Payment</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Date</th>
                <th className="text-right py-3 px-4 text-white/70 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-white">{order.orderNumber}</div>
                      <div className="text-xs text-white/40">{order.service.category.name}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-white">{order.user.name}</div>
                      <div className="text-sm text-white/60">{order.user.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-white">{order.productName}</div>
                      <div className="text-sm text-white/60">{order.service.name}</div>
                      <div className="text-xs text-white/40">Qty: {order.quantity}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-white font-medium">
                    {order.targetAccount}
                  </td>
                  <td className="py-4 px-4 text-white font-medium">
                    {formatCurrency(order.amount)}
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={statusColors[order.status]}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={paymentStatusColors[order.paymentStatus]}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-white/70 text-sm">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {order.status === 'PENDING' && (
                          <DropdownMenuItem 
                            onClick={() => handleOrderAction(order.id, 'process')}
                            className="text-blue-400"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Start Processing
                          </DropdownMenuItem>
                        )}
                        {order.status === 'PROCESSING' && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleOrderAction(order.id, 'complete')}
                              className="text-green-400"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleOrderAction(order.id, 'fail')}
                              className="text-red-400"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Mark as Failed
                            </DropdownMenuItem>
                          </>
                        )}
                        {(order.status === 'FAILED' || order.status === 'SUCCESS') && order.paymentStatus === 'SETTLEMENT' && (
                          <DropdownMenuItem 
                            onClick={() => handleOrderAction(order.id, 'refund')}
                            className="text-orange-400"
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Process Refund
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">Tidak ada pesanan ditemukan</p>
            </div>
          )}
        </div>
      </GlassCard>
    </AdminLayout>
  )
}
