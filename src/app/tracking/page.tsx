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
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-black mb-4">
              <span className="gradient-text">Lacak</span> Pesanan
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Pantau status pesanan Anda secara real-time dengan memasukkan nomor pesanan atau email
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-8">
            
            {/* Search Form */}
            <GlassCard className="p-6">
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button
                    variant={searchType === 'order' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSearchType('order')}
                    className={cn(
                      searchType === 'order' 
                        ? "bg-gradient-primary text-white" 
                        : "border-white/20 text-white/70"
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
                        ? "bg-gradient-primary text-white" 
                        : "border-white/20 text-white/70"
                    )}
                  >
                    Email
                  </Button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                  <Input
                    placeholder={
                      searchType === 'order' 
                        ? "Masukkan nomor pesanan (contoh: WMX-1234567890-123)" 
                        : "Masukkan email yang digunakan saat pemesanan"
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 h-12"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <GradientButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleSearch}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Mencari...' : 'Lacak Pesanan'}
                </GradientButton>
              </div>
            </GlassCard>

            {/* Search Results */}
            {result && (
              <div className="space-y-6">
                
                {/* Order Status Header */}
                <GlassCard className="p-6 text-center">
                  <div className={cn("text-6xl mb-4", getStatusColor(result.status))}>
                    {result.status === 'SUCCESS' && '✅'}
                    {result.status === 'PROCESSING' && '⚡'}
                    {result.status === 'WAITING_PAYMENT' && '⏳'}
                    {result.status === 'FAILED' && '❌'}
                    {result.status === 'CANCELLED' && '🚫'}
                    {result.status === 'PENDING' && '📦'}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {result.status === 'SUCCESS' && 'Pesanan Berhasil!'}
                    {result.status === 'PROCESSING' && 'Sedang Diproses'}
                    {result.status === 'WAITING_PAYMENT' && 'Menunggu Pembayaran'}
                    {result.status === 'FAILED' && 'Pesanan Gagal'}
                    {result.status === 'CANCELLED' && 'Pesanan Dibatalkan'}
                    {result.status === 'PENDING' && 'Pesanan Diterima'}
                  </h2>
                  
                  <p className="text-white/70 mb-4">
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
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Progress Pesanan</h3>
                  
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
                              ? "bg-gradient-primary border-neon-blue text-white" 
                              : "border-white/20 bg-white/5 text-white/50"
                          )}>
                            <Icon className="h-6 w-6" />
                          </div>
                          
                          <div className="flex-1">
                            <div className={cn(
                              "font-medium",
                              isActive ? "text-white" : "text-white/50"
                            )}>
                              {step.label}
                            </div>
                            {isCurrent && (
                              <div className="text-sm text-neon-blue">
                                Terakhir update: {formatDate(result.updatedAt)}
                              </div>
                            )}
                          </div>

                          {isActive && (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </GlassCard>

                {/* Order Details */}
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Detail Pesanan</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-white/70">
                      <span>Nomor Pesanan</span>
                      <span className="font-mono text-white">{result.orderNumber}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Layanan</span>
                      <span className="text-white">{result.service}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Produk</span>
                      <span className="text-white">{result.product}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>ID Pelanggan</span>
                      <span className="text-white">{result.customerId}</span>
                    </div>
                    {result.nickname && (
                      <div className="flex justify-between text-white/70">
                        <span>Nickname</span>
                        <span className="text-white">{result.nickname}</span>
                      </div>
                    )}
                    {result.serialNumber && (
                      <div className="flex justify-between text-white/70">
                        <span>Serial Number</span>
                        <span className="text-white font-mono">{result.serialNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white/70">
                      <span>Total</span>
                      <span className="text-white font-bold">Rp {result.totalAmount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Tanggal Pesanan</span>
                      <span className="text-white">{formatDate(result.createdAt)}</span>
                    </div>
                  </div>
                </GlassCard>

                {/* Status History */}
                {result.statusHistory && result.statusHistory.length > 0 && (
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Riwayat Status</h3>
                    
                    <div className="space-y-3">
                      {result.statusHistory.map((history, index) => (
                        <div key={index} className="flex items-start gap-3 pb-3 border-b border-white/10 last:border-b-0">
                          <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-white font-medium">{history.message}</div>
                            <div className="text-white/60 text-sm">{formatDate(history.timestamp)}</div>
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
                    className="border-white/20 text-white/70 hover:text-white"
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
            <GlassCard className="p-6 text-center">
              <h3 className="text-lg font-bold text-white mb-3">Butuh Bantuan?</h3>
              <p className="text-white/70 text-sm mb-4">
                Tim customer service kami siap membantu Anda 24/7
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" size="sm" className="border-white/20 text-white/70">
                  <span className="text-green-400 mr-2">📱</span>
                  WhatsApp: +62 813-1234-5678
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 text-white/70">
                  <span className="text-blue-400 mr-2">📧</span>
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
