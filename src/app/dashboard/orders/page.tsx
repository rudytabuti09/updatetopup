'use client'

import * as React from 'react'
import { Search, Filter, Calendar, ShoppingBag, Eye } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/ui/glass-card'
import { GradientButton } from '@/components/ui/gradient-button'
import { StatusBadge } from '@/components/ui/status-badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  orderNumber: string
  service: string
  product: string
  amount: number
  status: 'PENDING' | 'WAITING_PAYMENT' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
  createdAt: string
  customerData: {
    customerId: string
    nickname?: string
  }
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = React.useState<Order[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [dateFilter, setDateFilter] = React.useState('all')

  React.useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      // Mock data for demo - replace with actual API call
      setOrders([
        {
          id: '1',
          orderNumber: 'WMX-1234567890',
          service: 'Mobile Legends',
          product: '86 Diamond',
          amount: 15000,
          status: 'SUCCESS',
          createdAt: '2024-01-15T10:30:00Z',
          customerData: { customerId: '123456789', nickname: 'PlayerOne' }
        },
        {
          id: '2',
          orderNumber: 'WMX-1234567891',
          service: 'Free Fire',
          product: '70 Diamond',
          amount: 10000,
          status: 'PROCESSING',
          createdAt: '2024-01-15T09:15:00Z',
          customerData: { customerId: '987654321', nickname: 'FireGamer' }
        },
        {
          id: '3',
          orderNumber: 'WMX-1234567892',
          service: 'Telkomsel',
          product: 'Pulsa 25.000',
          amount: 26000,
          status: 'SUCCESS',
          createdAt: '2024-01-14T16:45:00Z',
          customerData: { customerId: '08123456789' }
        },
        {
          id: '4',
          orderNumber: 'WMX-1234567893',
          service: 'PUBG Mobile',
          product: '300 UC',
          amount: 45000,
          status: 'FAILED',
          createdAt: '2024-01-14T14:20:00Z',
          customerData: { customerId: '555666777', nickname: 'PubgPro' }
        },
        {
          id: '5',
          orderNumber: 'WMX-1234567894',
          service: 'Valorant',
          product: '1000 VP',
          amount: 75000,
          status: 'WAITING_PAYMENT',
          createdAt: '2024-01-13T11:30:00Z',
          customerData: { customerId: '111222333', nickname: 'ValPlayer' }
        }
      ])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    // Date filter logic
    let matchesDate = true
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.createdAt)
      const now = new Date()
      
      switch (dateFilter) {
        case 'today':
          matchesDate = orderDate.toDateString() === now.toDateString()
          break
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = orderDate >= weekAgo
          break
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = orderDate >= monthAgo
          break
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="loading-spinner mb-4" />
            <p className="text-white/70">Memuat riwayat pesanan...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">
          Riwayat Pesanan
        </h1>
        <p className="text-white/70">
          Lihat dan kelola semua pesanan Anda
        </p>
      </div>

      {/* Filters */}
      <GlassCard className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
            <Input
              placeholder="Cari pesanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/60"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="SUCCESS">Berhasil</SelectItem>
              <SelectItem value="PROCESSING">Diproses</SelectItem>
              <SelectItem value="WAITING_PAYMENT">Menunggu Pembayaran</SelectItem>
              <SelectItem value="FAILED">Gagal</SelectItem>
              <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Waktu</SelectItem>
              <SelectItem value="today">Hari Ini</SelectItem>
              <SelectItem value="week">7 Hari Terakhir</SelectItem>
              <SelectItem value="month">30 Hari Terakhir</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset */}
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('all')
              setDateFilter('all')
            }}
            className="text-white/70 hover:text-white"
          >
            Reset Filter
          </Button>

        </div>
      </GlassCard>

      {/* Orders List */}
      <GlassCard>
        
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Order Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-white" />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-white">{order.service} - {order.product}</h3>
                        <StatusBadge status={order.status} />
                      </div>
                      
                      <div className="text-sm text-white/60 space-y-1">
                        <p>Order: {order.orderNumber}</p>
                        <p>ID: {order.customerData.customerId} 
                          {order.customerData.nickname && ` (${order.customerData.nickname})`}
                        </p>
                        <p>{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Amount and Actions */}
                  <div className="flex items-center justify-between md:justify-end space-x-4">
                    <div className="text-right">
                      <div className="font-bold text-neon-blue text-lg">
                        {formatCurrency(order.amount)}
                      </div>
                    </div>
                    
                    <GradientButton
                      size="sm"
                      variant="secondary"
                      onClick={() => router.push(`/tracking?order=${order.orderNumber}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Detail
                    </GradientButton>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-white mb-2">Tidak ada pesanan ditemukan</h3>
            <p className="text-white/70 mb-6">
              {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Coba ubah filter pencarian Anda'
                : 'Anda belum memiliki pesanan. Mulai berbelanja sekarang!'
              }
            </p>
            
            {!searchQuery && statusFilter === 'all' && dateFilter === 'all' && (
              <GradientButton onClick={() => router.push('/catalog')}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Mulai Berbelanja
              </GradientButton>
            )}
          </div>
        )}

      </GlassCard>

    </DashboardLayout>
  )
}
