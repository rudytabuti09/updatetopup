'use client'

import * as React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Clock, CreditCard, Shield, CheckCircle, XCircle } from "lucide-react"
import { RootLayout } from "@/components/layout/root-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"

interface OrderDetail {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  customerData: {
    customerId: string
    nickname?: string
    email: string
    phone: string
    product: {
      id: string
      name: string
    }
  }
  createdAt: string
  expiredAt: string
}

// Declare global for Midtrans Snap
declare global {
  interface Window {
    snap: {
      pay: (token: string, options?: {
        onSuccess?: (result: unknown) => void
        onPending?: (result: unknown) => void
        onError?: (result: unknown) => void
        onClose?: () => void
      }) => void
      embed: (token: string, options: Record<string, unknown>) => void
    }
  }
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderNumber = params.orderNumber as string
  const snapToken = searchParams.get('token')
  
  const [order, setOrder] = React.useState<OrderDetail | null>(null)
  const [timeRemaining, setTimeRemaining] = React.useState(900) // 15 minutes in seconds
  const [paymentStatus, setPaymentStatus] = React.useState<'waiting' | 'processing' | 'success' | 'failed'>('waiting')
  const [loading, setLoading] = React.useState(true)
  const [paymentError, setPaymentError] = React.useState('')

  // Load Midtrans Snap script
  React.useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js' // Change to production URL for production
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '')
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Fetch order details
  React.useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderNumber}`)
        const result = await response.json()
        
        if (result.success) {
          setOrder(result.data)
          
          // Calculate remaining time
          const expiryTime = new Date(result.data.expiredAt).getTime()
          const now = Date.now()
          const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000))
          setTimeRemaining(remaining)
        } else {
          setPaymentError('Pesanan tidak ditemukan')
        }
      } catch (error) {
        setPaymentError('Gagal memuat data pesanan')
      } finally {
        setLoading(false)
      }
    }

    if (orderNumber) {
      fetchOrder()
    }
  }, [orderNumber])

  // Countdown timer
  React.useEffect(() => {
    if (timeRemaining > 0 && paymentStatus === 'waiting') {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setPaymentStatus('failed')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeRemaining, paymentStatus])

  // Poll payment status
  React.useEffect(() => {
    if (paymentStatus === 'processing') {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/orders/${orderNumber}/status`)
          const result = await response.json()
          
          if (result.success) {
            const status = result.data.status
            if (status === 'SUCCESS') {
              setPaymentStatus('success')
              clearInterval(interval)
            } else if (status === 'FAILED' || status === 'CANCELLED') {
              setPaymentStatus('failed')
              clearInterval(interval)
            }
          }
        } catch (error) {
          console.error('Status check error:', error)
        }
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [paymentStatus, orderNumber])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handlePayment = () => {
    if (!snapToken || !window.snap) {
      setPaymentError('Payment system not ready')
      return
    }

    setPaymentStatus('processing')
    
    window.snap.pay(snapToken, {
      onSuccess: (result: unknown) => {
        console.log('Payment success:', result)
        setPaymentStatus('success')
        // Redirect to success page after a delay
        setTimeout(() => {
          router.push(`/tracking/${orderNumber}`)
        }, 2000)
      },
      onPending: (result: unknown) => {
        console.log('Payment pending:', result)
        setPaymentStatus('processing')
      },
      onError: (result: unknown) => {
        console.log('Payment error:', result)
        setPaymentStatus('failed')
        setPaymentError('Pembayaran gagal. Silakan coba lagi.')
      },
      onClose: () => {
        console.log('Payment popup closed')
        setPaymentStatus('waiting')
      }
    })
  }

  const handleRetry = () => {
    setPaymentStatus('waiting')
    setPaymentError('')
    handlePayment()
  }

  if (loading) {
    return (
      <RootLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4" />
            <p className="text-white/70">Memuat data pesanan...</p>
          </div>
        </div>
      </RootLayout>
    )
  }

  if (!order) {
    return (
      <RootLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-white mb-2">Pesanan Tidak Ditemukan</h2>
            <p className="text-white/70 mb-6">{paymentError || 'Pesanan yang Anda cari tidak dapat ditemukan'}</p>
            <GradientButton onClick={() => router.push('/catalog')}>
              Kembali ke Katalog
            </GradientButton>
          </div>
        </div>
      </RootLayout>
    )
  }

  return (
    <RootLayout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="mb-6 text-white hover:text-neon-blue"
            disabled={paymentStatus === 'processing'}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>

          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Payment Status Header */}
            <GlassCard className="p-6 text-center">
              {paymentStatus === 'waiting' && (
                <>
                  <Clock className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-white mb-2">Menunggu Pembayaran</h1>
                  <p className="text-white/70 mb-4">Silakan selesaikan pembayaran sebelum waktu habis</p>
                  <div className="text-3xl font-mono text-neon-blue mb-2">{formatTime(timeRemaining)}</div>
                  <p className="text-white/60 text-sm">Waktu tersisa</p>
                </>
              )}
              
              {paymentStatus === 'processing' && (
                <>
                  <div className="loading-spinner mx-auto mb-4 w-16 h-16" />
                  <h1 className="text-2xl font-bold text-white mb-2">Memproses Pembayaran</h1>
                  <p className="text-white/70">Mohon tunggu, pembayaran sedang diverifikasi...</p>
                </>
              )}
              
              {paymentStatus === 'success' && (
                <>
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-white mb-2">Pembayaran Berhasil!</h1>
                  <p className="text-white/70">Terima kasih, pesanan Anda sedang diproses</p>
                </>
              )}
              
              {paymentStatus === 'failed' && (
                <>
                  <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-white mb-2">Pembayaran Gagal</h1>
                  <p className="text-white/70 mb-2">
                    {paymentError || 'Pembayaran tidak dapat diproses'}
                  </p>
                  {timeRemaining <= 0 && (
                    <p className="text-red-400 text-sm">Waktu pembayaran telah habis</p>
                  )}
                </>
              )}
            </GlassCard>

            {/* Order Summary */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Detail Pesanan</h2>
                <StatusBadge 
                  status={
                    paymentStatus === 'waiting' ? 'pending' : 
                    paymentStatus === 'processing' ? 'processing' : 
                    paymentStatus === 'success' ? 'success' : 'failed'
                  }
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-white/70">
                  <span>Nomor Pesanan</span>
                  <span className="font-mono text-white">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Produk</span>
                  <span className="text-white">{order.customerData.product.name}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>ID Pelanggan</span>
                  <span className="text-white">{order.customerData.customerId}</span>
                </div>
                {order.customerData.nickname && (
                  <div className="flex justify-between text-white/70">
                    <span>Nickname</span>
                    <span className="text-white">{order.customerData.nickname}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/70">
                  <span>Email</span>
                  <span className="text-white">{order.customerData.email}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>WhatsApp</span>
                  <span className="text-white">{order.customerData.phone}</span>
                </div>
                <hr className="border-white/20" />
                <div className="flex justify-between text-lg font-bold text-white">
                  <span>Total Pembayaran</span>
                  <span>Rp {order.totalAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </GlassCard>

            {/* Payment Actions */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="h-5 w-5 text-neon-blue" />
                <h3 className="text-lg font-bold text-white">Metode Pembayaran</h3>
              </div>
              
              <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-lg">
                <Shield className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Midtrans Payment Gateway</p>
                  <p className="text-white/60 text-sm">Pembayaran aman dengan berbagai pilihan metode</p>
                </div>
              </div>

              {paymentStatus === 'waiting' && timeRemaining > 0 && (
                <GradientButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handlePayment}
                >
                  Bayar Sekarang
                </GradientButton>
              )}
              
              {paymentStatus === 'failed' && timeRemaining > 0 && (
                <div className="space-y-3">
                  <GradientButton
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleRetry}
                  >
                    Coba Lagi
                  </GradientButton>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => router.push('/catalog')}
                  >
                    Batalkan Pesanan
                  </Button>
                </div>
              )}
              
              {paymentStatus === 'success' && (
                <GradientButton
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={() => router.push(`/tracking/${orderNumber}`)}
                >
                  Lacak Pesanan
                </GradientButton>
              )}
              
              {timeRemaining <= 0 && paymentStatus !== 'success' && (
                <GradientButton
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={() => router.push('/catalog')}
                >
                  Pesan Ulang
                </GradientButton>
              )}
            </GlassCard>

            {/* Help Text */}
            <div className="text-center text-white/60 text-sm">
              <p>Butuh bantuan? Hubungi customer service kami</p>
              <p className="mt-1">WhatsApp: <span className="text-neon-blue">+62 813-1234-5678</span></p>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}
