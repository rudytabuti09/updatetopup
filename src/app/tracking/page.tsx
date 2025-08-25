'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, CheckCircle, Clock, XCircle, Package, Truck, Star } from "lucide-react"
import { RootLayout } from "@/components/layout/root-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { cn } from "@/lib/utils"

interface TrackingResult {
  orderNumber: string
  status: 'PENDING' | 'WAITING_PAYMENT' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
  service: string
  product: string
  customerId: string
  nickname?: string
  totalAmount: number
  createdAt: string
  updatedAt: string
  externalId?: string
  serialNumber?: string
  statusHistory: Array<{
    status: string
    timestamp: string
    message: string
  }>
}

const statusSteps = [
  { key: 'PENDING', label: 'Pesanan Dibuat', icon: Package },
  { key: 'WAITING_PAYMENT', label: 'Menunggu Pembayaran', icon: Clock },
  { key: 'PROCESSING', label: 'Diproses', icon: Truck },
  { key: 'SUCCESS', label: 'Berhasil', icon: CheckCircle },
]

export default function TrackingPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [searchType, setSearchType] = React.useState<'order' | 'email'>('order')
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<TrackingResult | null>(null)
  const [error, setError] = React.useState('')

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Masukkan nomor pesanan atau email')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch(`/api/orders/track?q=${encodeURIComponent(searchQuery)}&type=${searchType}`)
      const data = await response.json()

      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.error || 'Pesanan tidak ditemukan')
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentStepIndex = (status: string) => {
    const index = statusSteps.findIndex(step => step.key === status)
    return index >= 0 ? index : 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-green-400'
      case 'FAILED':
      case 'CANCELLED':
        return 'text-red-400'
      case 'PROCESSING':
        return 'text-blue-400'
      default:
        return 'text-yellow-400'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <RootLayout>
      <div className="min-h-screen py-8 relative">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 animate-float opacity-20">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-neon-magenta to-neon-cyan blur-sm"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float opacity-15" style={{animationDelay: '1s'}}>
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-neon-cyan to-retro-gold blur-sm"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float opacity-25" style={{animationDelay: '0.5s'}}>
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-retro-gold to-neon-purple blur-sm"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-12">
            {/* Retro Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 border border-neon-cyan/30 backdrop-blur-sm mb-6">
              <Package className="w-5 h-5 text-neon-cyan animate-pulse" />
              <span className="text-sm font-retro font-semibold text-neon-cyan uppercase tracking-wider">
                Order Tracking
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-black mb-4">
              <span className="text-glow-cyan">LACAK</span>{" "}
              <span className="text-neon-magenta">PESANAN</span>
            </h1>
            <p className="text-wmx-gray-700 text-lg max-w-2xl mx-auto">
              Pantau status pesanan Anda secara real-time dengan memasukkan nomor pesanan atau email
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-8">
            
            {/* Search Form */}
            <GlassCard className="p-6 bg-white/95 border-neon-magenta/20 relative">
              {/* Subtle neon glow line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-magenta/50 to-transparent"></div>
              
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={searchType === 'order' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSearchType('order')}
                    className={cn(
                      searchType === 'order' 
                        ? "bg-gradient-to-r from-neon-magenta to-neon-cyan text-white" 
                        : "border-wmx-gray-300 text-wmx-gray-600 bg-white hover:border-neon-magenta/30"
                    )}
                  >
                    Nomor Pesanan
                  </Button>
                  <Button
                    variant={searchType === 'email' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSearchType('email')}
                    className={cn(
                      searchType === 'email' 
                        ? "bg-gradient-to-r from-neon-magenta to-neon-cyan text-white" 
                        : "border-wmx-gray-300 text-wmx-gray-600 bg-white hover:border-neon-magenta/30"
                    )}
                  >
                    Email
                  </Button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-wmx-gray-400 h-5 w-5" />
                  <Input
                    placeholder={
                      searchType === 'order' 
                        ? "Masukkan nomor pesanan (contoh: WMX-1234567890-123)" 
                        : "Masukkan email yang digunakan saat pemesanan"
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 bg-white border border-wmx-gray-300 text-wmx-gray-800 placeholder:text-wmx-gray-400 focus:border-neon-magenta focus:ring-neon-magenta/20 h-12"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <GradientButton
                  variant="primary"
                  size="lg"
                  className="w-full font-heading uppercase tracking-wider"
                  onClick={handleSearch}
                  loading={loading}
                  disabled={loading}
                >
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? 'Mencari...' : 'Lacak Pesanan'}
                </GradientButton>
              </div>
            </GlassCard>

            {/* Search Results */}
            {result && (
              <div className="space-y-6">
                
                {/* Order Status Header */}
                <GlassCard className="p-6 text-center bg-white/95 border-neon-cyan/20 relative">
                  {/* Subtle neon glow line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent"></div>
                  
                  <div className="text-6xl mb-4 animate-bounce">
                    {result.status === 'SUCCESS' && '✅'}
                    {result.status === 'PROCESSING' && '⚡'}
                    {result.status === 'WAITING_PAYMENT' && '⏳'}
                    {result.status === 'FAILED' && '❌'}
                    {result.status === 'CANCELLED' && '🚫'}
                    {result.status === 'PENDING' && '📦'}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-wmx-gray-800 mb-2 font-heading">
                    {result.status === 'SUCCESS' && 'Pesanan Berhasil!'}
                    {result.status === 'PROCESSING' && 'Sedang Diproses'}
                    {result.status === 'WAITING_PAYMENT' && 'Menunggu Pembayaran'}
                    {result.status === 'FAILED' && 'Pesanan Gagal'}
                    {result.status === 'CANCELLED' && 'Pesanan Dibatalkan'}
                    {result.status === 'PENDING' && 'Pesanan Diterima'}
                  </h2>
                  
                  <p className="text-wmx-gray-600 mb-4">
                    {result.status === 'SUCCESS' && 'Item telah berhasil dikirim ke akun Anda'}
                    {result.status === 'PROCESSING' && 'Pesanan sedang dalam proses pengiriman'}
                    {result.status === 'WAITING_PAYMENT' && 'Silakan selesaikan pembayaran'}
                    {result.status === 'FAILED' && 'Terjadi kesalahan dalam pemrosesan pesanan'}
                    {result.status === 'CANCELLED' && 'Pesanan telah dibatalkan'}
                    {result.status === 'PENDING' && 'Pesanan menunggu konfirmasi'}
                  </p>

                  <StatusBadge 
                    status={
                      result.status === 'SUCCESS' ? 'success' :
                      result.status === 'PROCESSING' ? 'processing' :
                      result.status === 'FAILED' || result.status === 'CANCELLED' ? 'failed' :
                      'pending'
                    }
                  />
                </GlassCard>

                {/* Progress Steps */}
                <GlassCard className="p-6 bg-white/95 border-neon-magenta/20 relative">
                  {/* Subtle neon glow line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-magenta/50 to-transparent"></div>
                  
                  <h3 className="text-lg font-bold text-wmx-gray-800 mb-6 font-heading flex items-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-neon-magenta to-neon-cyan rounded-full mr-3 animate-pulse"></div>
                    Progress Pesanan
                  </h3>
                  
                  <div className="space-y-4">
                    {statusSteps.map((step, index) => {
                      const currentStep = getCurrentStepIndex(result.status)
                      const isActive = index <= currentStep
                      const isCurrent = index === currentStep
                      const Icon = step.icon

                      return (
                        <div key={step.key} className="flex items-center">
                          <div className={cn(
                            "flex items-center justify-center w-12 h-12 rounded-full border-2 mr-4",
                            isActive 
                              ? "bg-gradient-to-r from-neon-magenta to-neon-cyan border-neon-magenta text-white shadow-glow-magenta" 
                              : "border-wmx-gray-300 bg-white text-wmx-gray-400"
                          )}>
                            <Icon className="h-6 w-6" />
                          </div>
                          
                          <div className="flex-1">
                            <div className={cn(
                              "font-medium",
                              isActive ? "text-wmx-gray-800" : "text-wmx-gray-500"
                            )}>
                              {step.label}
                            </div>
                            {isCurrent && (
                              <div className="text-sm text-neon-magenta">
                                Terakhir update: {formatDate(result.updatedAt)}
                              </div>
                            )}
                          </div>

                          {isActive && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </GlassCard>

                {/* Order Details */}
                <GlassCard className="p-6 bg-white/95 border-neon-cyan/20 relative">
                  {/* Subtle neon glow line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent"></div>
                  
                  <h3 className="text-lg font-bold text-wmx-gray-800 mb-4 font-heading flex items-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-neon-cyan to-retro-gold rounded-full mr-3 animate-pulse"></div>
                    Detail Pesanan
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-wmx-gray-600">
                      <span>Nomor Pesanan</span>
                      <span className="font-mono text-wmx-gray-800">{result.orderNumber}</span>
                    </div>
                    <div className="flex justify-between text-wmx-gray-600">
                      <span>Layanan</span>
                      <span className="text-wmx-gray-800">{result.service}</span>
                    </div>
                    <div className="flex justify-between text-wmx-gray-600">
                      <span>Produk</span>
                      <span className="text-wmx-gray-800">{result.product}</span>
                    </div>
                    <div className="flex justify-between text-wmx-gray-600">
                      <span>ID Pelanggan</span>
                      <span className="text-wmx-gray-800">{result.customerId}</span>
                    </div>
                    {result.nickname && (
                      <div className="flex justify-between text-wmx-gray-600">
                        <span>Nickname</span>
                        <span className="text-wmx-gray-800">{result.nickname}</span>
                      </div>
                    )}
                    {result.serialNumber && (
                      <div className="flex justify-between text-wmx-gray-600">
                        <span>Serial Number</span>
                        <span className="text-wmx-gray-800 font-mono">{result.serialNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-wmx-gray-600">
                      <span>Total</span>
                      <span className="text-neon-magenta font-bold">Rp {result.totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-wmx-gray-600">
                      <span>Tanggal Pesanan</span>
                      <span className="text-wmx-gray-800">{formatDate(result.createdAt)}</span>
                    </div>
                  </div>
                </GlassCard>

                {/* Status History */}
                {result.statusHistory && result.statusHistory.length > 0 && (
                  <GlassCard className="p-6 bg-white/95 border-neon-magenta/20 relative">
                    {/* Subtle neon glow line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-magenta/50 to-transparent"></div>
                    
                    <h3 className="text-lg font-bold text-wmx-gray-800 mb-4 font-heading flex items-center">
                      <div className="w-2 h-2 bg-gradient-to-r from-neon-magenta to-neon-cyan rounded-full mr-3 animate-pulse"></div>
                      Riwayat Status
                    </h3>
                    
                    <div className="space-y-3">
                      {result.statusHistory.map((history, index) => (
                        <div key={index} className="flex items-start gap-3 pb-3 border-b border-wmx-gray-200 last:border-b-0">
                          <div className="w-2 h-2 bg-neon-cyan rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-wmx-gray-800 font-medium">{history.message}</div>
                            <div className="text-wmx-gray-600 text-sm">{formatDate(history.timestamp)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  {result.status === 'SUCCESS' && (
                    <GradientButton
                      variant="primary"
                      className="flex-1"
                      onClick={() => router.push('/catalog')}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Pesan Lagi
                    </GradientButton>
                  )}
                  
                  {(result.status === 'WAITING_PAYMENT' || result.status === 'PENDING') && (
                    <GradientButton
                      variant="primary"
                      className="flex-1"
                      onClick={() => router.push(`/checkout/${result.orderNumber}`)}
                    >
                      Lanjut Pembayaran
                    </GradientButton>
                  )}

                  <Button
                    variant="outline"
                    className="border-wmx-gray-300 text-wmx-gray-600 hover:text-wmx-gray-800 bg-white"
                    onClick={() => {
                      setResult(null)
                      setSearchQuery('')
                      setError('')
                    }}
                  >
                    Cari Lagi
                  </Button>
                </div>
              </div>
            )}

            {/* Help Section */}
            <GlassCard className="p-6 text-center bg-white/95 border-retro-gold/20 relative">
              {/* Subtle neon glow line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-retro-gold/50 to-transparent"></div>
              
              <h3 className="text-lg font-bold text-wmx-gray-800 mb-3 font-heading">Butuh Bantuan?</h3>
              <p className="text-wmx-gray-600 text-sm mb-4">
                Tim customer service kami siap membantu Anda 24/7
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" size="sm" className="border-wmx-gray-300 text-wmx-gray-600 bg-white hover:border-green-400">
                  <span className="text-green-600 mr-2">📱</span>
                  WhatsApp: +62 813-1234-5678
                </Button>
                <Button variant="outline" size="sm" className="border-wmx-gray-300 text-wmx-gray-600 bg-white hover:border-blue-400">
                  <span className="text-blue-600 mr-2">📧</span>
                  support@wmxtopup.com
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}
