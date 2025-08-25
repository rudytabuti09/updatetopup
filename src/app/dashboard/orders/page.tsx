'use client'

import * as React from 'react'
import { Search, Filter, Calendar, ShoppingBag, Eye, Zap, Clock, Star } from 'lucide-react'
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
        {/* Retro Background Effects */}
        <div className="absolute inset-0 retro-grid opacity-5 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="scan-lines" />
        </div>
        
        <div className="flex items-center justify-center py-20 relative z-10">
          <div className="text-center">
            {/* Futuristic Loading Ring */}
            <div className="relative mb-8">
              <div className="w-24 h-24 border-4 border-slate-800 rounded-full">
                <div className="absolute inset-0 border-4 border-transparent border-t-neon-cyan rounded-full animate-spin" />
                <div className="absolute inset-2 border-4 border-transparent border-r-neon-magenta rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}} />
                <div className="absolute inset-4 border-4 border-transparent border-b-neon-gold rounded-full animate-spin" style={{animationDuration: '2s'}} />
              </div>
              {/* Center Orb */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-primary rounded-full animate-pulse shadow-neon" />
              </div>
              {/* Floating Particles */}
              <div className="absolute -inset-8">
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-neon-cyan rounded-full animate-ping" />
                <div className="absolute bottom-0 right-1/2 w-1 h-1 bg-neon-magenta rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
                <div className="absolute left-0 top-1/2 w-1.5 h-1.5 bg-neon-gold rounded-full animate-ping" style={{animationDelay: '1s'}} />
                <div className="absolute right-0 bottom-1/2 w-1 h-1 bg-neon-cyan rounded-full animate-ping" style={{animationDelay: '1.5s'}} />
              </div>
            </div>
            
            {/* Loading Text */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold font-mono uppercase tracking-widest bg-gradient-to-r from-neon-cyan via-white to-neon-magenta bg-clip-text text-transparent">
                ACCESSING DATABASE
              </h3>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-neon-magenta rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
                <div className="w-2 h-2 bg-neon-gold rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" style={{animationDelay: '0.6s'}} />
                <div className="w-2 h-2 bg-neon-magenta rounded-full animate-pulse" style={{animationDelay: '0.8s'}} />
              </div>
              <p className="text-white/80 font-mono text-lg animate-pulse">
                Loading transaction records...
              </p>
              <div className="text-neon-gold font-mono text-sm">
                <span className="animate-pulse">█</span> Establishing secure connection
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      
      {/* Retro Gaming Background Grid */}
      <div className="absolute inset-0 retro-grid opacity-10 pointer-events-none" />
      
      {/* Floating Neon Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-neon-cyan/20 rounded-full blur-xl animate-float" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-neon-magenta/20 rounded-full blur-xl animate-float-delayed" />
        <div className="absolute top-1/2 left-3/4 w-40 h-40 bg-neon-gold/10 rounded-full blur-xl animate-float-slow" />
      </div>
      
      {/* Scan Lines Effect */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="scan-lines" />
      </div>
      
      {/* Header with Enhanced Retro Styling */}
      <div className="relative mb-10 z-20">
        {/* Decorative Background with Grid Pattern */}
        <div className="absolute inset-0 -m-8 rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta/10 via-neon-cyan/5 to-transparent blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-neon-blue/5 to-neon-gold/5 rounded-3xl" />
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-gold opacity-50" />
        </div>
        
        <div className="relative p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-neon border border-neon-cyan/30">
                <ShoppingBag className="h-8 w-8 text-white" />
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-neon-magenta/50 animate-pulse" />
                <div className="absolute -inset-1 rounded-2xl border border-neon-cyan/30 animate-ping" />
              </div>
              {/* Corner Decorations */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-neon-cyan" />
              <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-neon-magenta" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-neon-gold" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-neon-cyan" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-4xl font-heading font-black bg-gradient-to-r from-neon-cyan via-white to-neon-magenta bg-clip-text text-transparent">
                  ORDERS DATABASE
                </h1>
                <div className="flex space-x-1">
                  <Star className="h-5 w-5 text-neon-gold animate-pulse" />
                  <Star className="h-4 w-4 text-neon-cyan animate-pulse" style={{animationDelay: '0.2s'}} />
                  <Star className="h-3 w-3 text-neon-magenta animate-pulse" style={{animationDelay: '0.4s'}} />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="h-1 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-gold rounded-full" />
                <p className="text-white/80 text-lg font-mono uppercase tracking-wider">
                  Transaction History & Status Monitor
                </p>
                <div className="flex items-center space-x-2 text-sm text-white/60">
                  <Clock className="h-4 w-4" />
                  <span>Real-time Updates</span>
                  <Zap className="h-4 w-4 text-neon-gold" />
                  <span>Secure Processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <div 
                key={order.id} 
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/50 via-slate-800/50 to-slate-900/50 border border-white/10 hover:border-neon-cyan/50 transition-all duration-500 hover:shadow-2xl hover:shadow-neon-cyan/20 animate-slideUp"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  backdropFilter: 'blur(20px)'
                }}
              >
                {/* Holographic Border Effect */}
                <div className="absolute inset-0 rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 via-neon-magenta/20 to-neon-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-800/90" />
                </div>
                
                {/* Cyber Grid Background */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }} />
                </div>
                
                {/* Corner Tech Decorations */}
                <div className="absolute top-0 left-0 w-8 h-8">
                  <div className="absolute top-2 left-2 w-4 h-1 bg-neon-cyan" />
                  <div className="absolute top-2 left-2 w-1 h-4 bg-neon-cyan" />
                </div>
                <div className="absolute top-0 right-0 w-8 h-8">
                  <div className="absolute top-2 right-2 w-4 h-1 bg-neon-magenta" />
                  <div className="absolute top-2 right-2 w-1 h-4 bg-neon-magenta" />
                </div>
                <div className="absolute bottom-0 left-0 w-8 h-8">
                  <div className="absolute bottom-2 left-2 w-4 h-1 bg-neon-gold" />
                  <div className="absolute bottom-2 left-2 w-1 h-4 bg-neon-gold" />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8">
                  <div className="absolute bottom-2 right-2 w-4 h-1 bg-neon-cyan" />
                  <div className="absolute bottom-2 right-2 w-1 h-4 bg-neon-cyan" />
                </div>
                
                {/* Status Indicator Strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-gold opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    
                    {/* Order Info Section */}
                    <div className="flex items-start space-x-6 flex-1">
                      {/* Service Icon */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-2xl border border-neon-cyan/30 group-hover:border-neon-cyan/60 transition-all duration-300">
                          <ShoppingBag className="h-8 w-8 text-white" />
                          {/* Animated Ring */}
                          <div className="absolute -inset-2 rounded-2xl border-2 border-neon-magenta/30 animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute -inset-1 rounded-2xl border border-neon-cyan/50 animate-pulse" />
                        </div>
                        {/* Status Light */}
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                          order.status === 'SUCCESS' ? 'bg-green-500' :
                          order.status === 'PROCESSING' ? 'bg-neon-gold animate-pulse' :
                          order.status === 'WAITING_PAYMENT' ? 'bg-neon-cyan animate-pulse' :
                          order.status === 'FAILED' ? 'bg-red-500' : 'bg-gray-500'
                        }`} />
                      </div>
                      
                      {/* Order Details */}
                      <div className="flex-1 min-w-0">
                        <div className="space-y-3">
                          {/* Game & Product */}
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white group-hover:text-neon-cyan transition-colors duration-300 font-mono uppercase tracking-wide">
                              {order.service}
                            </h3>
                            <div className="flex items-center space-x-3">
                              <span className="text-neon-gold font-semibold text-lg">
                                {order.product}
                              </span>
                              <StatusBadge status={convertOrderStatus(order.status)} />
                            </div>
                          </div>
                          
                          {/* Technical Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-mono">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-white/40 uppercase tracking-wider">ORDER ID:</span>
                                <span className="text-neon-blue font-bold">{order.orderNumber}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-white/40 uppercase tracking-wider">USER ID:</span>
                                <span className="text-white/80">{order.customerData.customerId}</span>
                                {order.customerData.nickname && (
                                  <span className="text-neon-magenta">({order.customerData.nickname})</span>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-white/40" />
                                <span className="text-white/60">{formatDate(order.createdAt)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Zap className="h-4 w-4 text-neon-gold" />
                                <span className="text-white/60 uppercase">Processing Node: WMX-{order.id}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment & Actions Section */}
                    <div className="flex flex-col items-end space-y-4 min-w-[200px]">
                      {/* Amount Display */}
                      <div className="text-right">
                        <div className="text-3xl font-black text-neon-gold tracking-wider font-mono">
                          {formatCurrency(order.amount)}
                        </div>
                        <div className="text-xs text-white/40 uppercase tracking-[3px] mt-1 font-mono">
                          TOTAL AMOUNT
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-neon-gold/50 to-transparent mt-2" />
                      </div>
                      
                      {/* Action Button */}
                      <GradientButton
                        onClick={() => router.push(`/tracking?order=${order.orderNumber}`)}
                        className="group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-neon-cyan/30 transition-all duration-300 font-mono uppercase tracking-wider"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        VIEW DETAILS
                      </GradientButton>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Progress Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent group-hover:via-neon-cyan/60 transition-all duration-300" />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative text-center py-16 overflow-hidden">
            {/* Holographic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-neon-cyan/5 to-neon-magenta/5 blur-3xl" />
            
            {/* Floating Grid Lines */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,0,128,0.3) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px'
              }} />
            </div>
            
            <div className="relative z-10 space-y-8">
              {/* Futuristic Icon */}
              <div className="relative mx-auto w-32 h-32">
                <div className="absolute inset-0 rounded-full border-4 border-neon-cyan/30 animate-pulse" />
                <div className="absolute inset-2 rounded-full border-2 border-neon-magenta/20 animate-ping" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center border border-neon-gold/30">
                    <ShoppingBag className="h-10 w-10 text-white" />
                  </div>
                </div>
                {/* Corner Brackets */}
                <div className="absolute -top-2 -left-2 w-6 h-6">
                  <div className="absolute top-0 left-0 w-4 h-1 bg-neon-cyan" />
                  <div className="absolute top-0 left-0 w-1 h-4 bg-neon-cyan" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6">
                  <div className="absolute top-0 right-0 w-4 h-1 bg-neon-magenta" />
                  <div className="absolute top-0 right-0 w-1 h-4 bg-neon-magenta" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6">
                  <div className="absolute bottom-0 left-0 w-4 h-1 bg-neon-gold" />
                  <div className="absolute bottom-0 left-0 w-1 h-4 bg-neon-gold" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6">
                  <div className="absolute bottom-0 right-0 w-4 h-1 bg-neon-cyan" />
                  <div className="absolute bottom-0 right-0 w-1 h-4 bg-neon-cyan" />
                </div>
              </div>
              
              {/* Status Display */}
              <div className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold font-mono uppercase tracking-widest bg-gradient-to-r from-neon-cyan via-white to-neon-magenta bg-clip-text text-transparent">
                    {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                      ? 'NO MATCHES FOUND'
                      : 'DATABASE EMPTY'
                    }
                  </h3>
                  <div className="h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent mx-auto w-32" />
                </div>
                
                {/* Status Message */}
                <div className="space-y-4">
                  <p className="text-white/80 text-lg font-mono">
                    {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                      ? 'Adjust your search parameters'
                      : 'Your transaction history is empty'
                    }
                  </p>
                  
                  {/* Technical Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono text-white/60">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
                      <span>System Status: ONLINE</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Zap className="h-3 w-3 text-neon-gold" />
                      <span>Connection: SECURE</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="h-3 w-3 text-neon-magenta" />
                      <span>Last Sync: {new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                {!searchQuery && statusFilter === 'all' && dateFilter === 'all' && (
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-neon-cyan/20 via-neon-magenta/20 to-neon-gold/20 rounded-full blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
                    <GradientButton 
                      onClick={() => router.push('/catalog')}
                      className="relative font-mono uppercase tracking-wider text-lg px-8 py-4 hover:scale-110 transition-transform duration-300"
                    >
                      <ShoppingBag className="mr-3 h-5 w-5" />
                      INITIALIZE SHOPPING
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-neon-gold to-transparent" />
                    </GradientButton>
                  </div>
                )}
                
                {(searchQuery || statusFilter !== 'all' || dateFilter !== 'all') && (
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setSearchQuery('')
                        setStatusFilter('all')
                        setDateFilter('all')
                      }}
                      className="group font-mono uppercase tracking-wider text-neon-cyan hover:text-white transition-colors duration-300 border border-neon-cyan/30 hover:border-neon-cyan rounded-lg px-6 py-3 hover:shadow-lg hover:shadow-neon-cyan/20"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-neon-cyan rounded-full group-hover:animate-ping" />
                        <span>CLEAR FILTERS</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </GlassCard>

    </DashboardLayout>
  )
}
