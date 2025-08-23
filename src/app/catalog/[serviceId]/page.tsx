'use client'

import * as React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Check, User, Mail, Phone, Search, Star, Shield, Zap } from "lucide-react"
import { RootLayout } from "@/components/layout/root-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  price: number
  buyPrice: number
  profit: number
  sku: string
  category: string
  isActive: boolean
  sortOrder: number
  description?: string
  isPopular?: boolean
  discount?: number
  originalPrice?: number
}

interface Service {
  id: string
  name: string
  description?: string
  logo?: string
  provider: string
  category: {
    name: string
    slug: string
  }
  products: Product[]
  gradient?: string
  image?: string
  inputLabel?: string
  inputPlaceholder?: string
  nicknameSupported?: boolean
}

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = params.serviceId as string
  
  const [service, setService] = React.useState<Service | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [customerId, setCustomerId] = React.useState('')
  const [nickname, setNickname] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [selectedProductId, setSelectedProductId] = React.useState(searchParams.get('product') || '')
  const [creating, setCreating] = React.useState(false)
  const [nicknameLoading, setNicknameLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  // Load service data on mount
  React.useEffect(() => {
    loadServiceData()
  }, [serviceId])

  const loadServiceData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/services?cached=true`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to load service data')
      }

      // Find service by ID or name slug
      const foundService = result.data.find((s: Service) => 
        s.id === serviceId || 
        s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === serviceId
      )

      if (!foundService) {
        setError('Service not found')
        return
      }

      setService(foundService)
      
      // Auto-select first active product
      const firstProduct = foundService.products.find((p: Product) => p.isActive)
      if (firstProduct && !selectedProductId) {
        setSelectedProductId(firstProduct.id)
      }

    } catch (err) {
      console.error('Error loading service:', err)
      setError(err instanceof Error ? err.message : 'Failed to load service')
    } finally {
      setLoading(false)
    }
  }

  const selectedProduct = service?.products.find(p => p.id === selectedProductId)

  // Auto-fetch nickname when customerId changes (for supported games)
  React.useEffect(() => {
    if (customerId && service && service.category.name === 'Game') {
      const timer = setTimeout(async () => {
        setNicknameLoading(true)
        try {
          const response = await fetch('/api/services/nickname', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service: service.provider,
              userId: customerId
            })
          })
          
          const result = await response.json()
          if (result.success && result.nickname) {
            setNickname(result.nickname)
            setErrors(prev => ({ ...prev, customerId: '' }))
          } else {
            setNickname('')
            // Don't show error for nickname lookup failures
          }
        } catch (error) {
          console.error('Nickname lookup failed:', error)
          setNickname('')
        } finally {
          setNicknameLoading(false)
        }
      }, 500)

      return () => clearTimeout(timer)
    } else {
      setNickname('')
    }
  }, [customerId, service])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!customerId) {
      newErrors.customerId = 'User ID / Nomor wajib diisi'
    }

    if (!email) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (!phone) {
      newErrors.phone = 'Nomor WhatsApp wajib diisi'
    } else if (!/^(\+62|62|0)[0-9]{9,13}$/.test(phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Format nomor WhatsApp tidak valid'
    }

    if (!selectedProductId) {
      newErrors.product = 'Pilih produk terlebih dahulu'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOrder = async () => {
    if (!validateForm() || !service) return

    setLoading(true)
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          productId: selectedProductId,
          customerId,
          nickname,
          email,
          phone,
          quantity: 1,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to checkout page with order details
        router.push(`/checkout/${result.data.orderNumber}?token=${result.data.snapToken}`)
      } else {
        setErrors({ submit: result.error || 'Terjadi kesalahan' })
      }
    } catch (error) {
      setErrors({ submit: 'Terjadi kesalahan jaringan' })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <RootLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-magenta"></div>
        </div>
      </RootLayout>
    )
  }

  if (error || !service) {
    return (
      <RootLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Service Not Found</h1>
            <p className="text-white/70 mb-6">{error || 'The requested service could not be found.'}</p>
            <Button onClick={() => router.push('/catalog')} className="bg-gradient-to-r from-neon-magenta to-neon-cyan">
              Back to Catalog
            </Button>
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
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Side - Service Info & Form */}
            <div className="space-y-6">
              
              {/* Service Header */}
              <GlassCard className="p-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${service.gradient || 'from-blue-500 to-purple-600'} text-4xl mb-4`}>
                  {service.image || '🎮'}
                </div>
                <h1 className="text-3xl font-heading font-bold text-white mb-2">
                  {service.name}
                </h1>
                <p className="text-white/70 mb-4">{service.description || 'Top up untuk ' + service.name}</p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center text-green-400">
                    <Zap className="h-4 w-4 mr-1" />
                    Proses Instan
                  </div>
                  <div className="flex items-center text-blue-400">
                    <Shield className="h-4 w-4 mr-1" />
                    100% Aman
                  </div>
                  <StatusBadge status="success">Tersedia</StatusBadge>
                </div>
              </GlassCard>

              {/* Order Form */}
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Detail Pemesanan</h2>
                
                <div className="space-y-4">
                  {/* Customer ID Input */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      {service.inputLabel || 'User ID'} *
                    </label>
                    <Input
                      placeholder={service.inputPlaceholder || 'Masukkan User ID'}
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                      className={cn(
                        "bg-white/5 border-white/20 text-white placeholder:text-white/50",
                        errors.customerId && "border-red-400"
                      )}
                    />
                    {errors.customerId && (
                      <p className="text-red-400 text-sm mt-1">{errors.customerId}</p>
                    )}
                  </div>

                  {/* Nickname Display */}
                  {service.nicknameSupported && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Nickname
                      </label>
                      <div className="relative">
                        <Input
                          value={nickname}
                          readOnly
                          placeholder="Nickname akan muncul otomatis"
                          className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        />
                        {nicknameLoading && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="loading-spinner w-4 h-4" />
                          </div>
                        )}
                        {nickname && !nicknameLoading && (
                          <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Email Input */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={cn(
                          "pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50",
                          errors.email && "border-red-400"
                        )}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Nomor WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        placeholder="08123456789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={cn(
                          "pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50",
                          errors.phone && "border-red-400"
                        )}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Right Side - Products */}
            <div className="space-y-6">
              
              {/* Products List */}
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">Pilih Nominal</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProductId(product.id)}
                      className={cn(
                        "relative p-4 rounded-xl border-2 transition-all cursor-pointer group",
                        selectedProductId === product.id 
                          ? "border-neon-blue bg-neon-blue/10" 
                          : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                      )}
                    >
                      {/* Popular Badge */}
                      {product.isPopular && (
                        <div className="absolute -top-2 -right-2 bg-gradient-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                          Popular
                        </div>
                      )}
                      
                      {/* Discount Badge */}
                      {product.discount && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{product.discount}%
                        </div>
                      )}
                      
                      <div className="text-center">
                        <h3 className="font-bold text-white mb-2">{product.name}</h3>
                        
                        <div className="mb-3">
                          <div className="text-lg font-bold text-neon-blue">
                            Rp {product.price.toLocaleString('id-ID')}
                          </div>
                          {product.originalPrice && (
                            <div className="text-sm text-white/60 line-through">
                              Rp {product.originalPrice.toLocaleString('id-ID')}
                            </div>
                          )}
                        </div>
                        
                        {product.description && (
                          <p className="text-xs text-white/70">{product.description}</p>
                        )}
                      </div>
                      
                      {/* Selected Indicator */}
                      {selectedProductId === product.id && (
                        <div className="absolute inset-0 border-2 border-neon-blue rounded-xl pointer-events-none">
                          <div className="absolute top-2 right-2 w-6 h-6 bg-neon-blue rounded-full flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {errors.product && (
                  <p className="text-red-400 text-sm mt-4">{errors.product}</p>
                )}
              </GlassCard>

              {/* Order Summary */}
              {selectedProduct && (
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Ringkasan Pesanan</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-white/70">
                      <span>Produk</span>
                      <span>{selectedProduct.name}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Harga</span>
                      <span>Rp {selectedProduct.price.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Biaya Admin</span>
                      <span className="text-green-400">GRATIS</span>
                    </div>
                    <hr className="border-white/20" />
                    <div className="flex justify-between text-lg font-bold text-white">
                      <span>Total</span>
                      <span>Rp {selectedProduct.price.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {errors.submit && (
                    <p className="text-red-400 text-sm mt-4">{errors.submit}</p>
                  )}

                  <GradientButton
                    variant="primary"
                    size="lg"
                    className="w-full mt-6"
                    onClick={handleOrder}
                    loading={loading}
                    disabled={!selectedProductId || loading}
                  >
                    Bayar Sekarang
                  </GradientButton>
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}
