'use client'

import * as React from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, Phone, Mail, CreditCard } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Product {
  id: string
  name: string
  price: number
  sku: string
  category: string
}

interface Service {
  id: string
  name: string
  provider: string
  category: string
}

interface OrderFormProps {
  product: Product
  service: Service
  onSubmit?: (orderData: Record<string, unknown>) => void
  isLoading?: boolean
}

interface FormData {
  userId: string
  nickname?: string
  phone: string
  email: string
  paymentMethod: string
  quantity: number
}

const paymentMethods = [
  { value: "BANK_TRANSFER", label: "Transfer Bank", icon: "🏦" },
  { value: "E_WALLET", label: "E-Wallet", icon: "📱" },
  { value: "QRIS", label: "QRIS", icon: "📲" },
  { value: "CREDIT_CARD", label: "Kartu Kredit", icon: "💳" },
]

export function OrderForm({ 
  product, 
  service, 
  onSubmit,
  isLoading = false 
}: OrderFormProps) {
  const router = useRouter()
  const [formData, setFormData] = React.useState<FormData>({
    userId: '',
    nickname: '',
    phone: '',
    email: '',
    paymentMethod: '',
    quantity: 1
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isCheckingNickname, setIsCheckingNickname] = React.useState(false)

  const totalAmount = product.price * formData.quantity

  // Check nickname for supported games
  const checkNickname = async (userId: string) => {
    if (!userId || service.category !== 'game') return
    
    setIsCheckingNickname(true)
    try {
      const response = await fetch(`/api/services/nickname`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: service.provider,
          userId: userId
        })
      })
      
      const result = await response.json()
      if (result.success && result.nickname) {
        setFormData(prev => ({ ...prev, nickname: result.nickname }))
        setErrors(prev => ({ ...prev, userId: '' }))
      } else {
        setErrors(prev => ({ ...prev, userId: 'User ID tidak ditemukan' }))
      }
    } catch (error) {
      console.error('Error checking nickname:', error)
    } finally {
      setIsCheckingNickname(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.userId) {
      newErrors.userId = 'User ID wajib diisi'
    }
    if (!formData.phone) {
      newErrors.phone = 'Nomor HP wajib diisi'
    }
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Metode pembayaran wajib dipilih'
    }
    if (formData.quantity < 1) {
      newErrors.quantity = 'Jumlah minimal 1'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const orderData = {
      serviceId: service.id,
      productId: product.id,
      customerData: {
        userId: formData.userId,
        nickname: formData.nickname,
        phone: formData.phone,
        email: formData.email,
      },
      quantity: formData.quantity,
      paymentMethod: formData.paymentMethod,
      totalAmount,
    }

    if (onSubmit) {
      onSubmit(orderData)
    }
  }

  return (
    <GlassCard>
      <div className="space-y-6">
        
        {/* Order Summary */}
        <div className="border-b border-white/10 pb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Detail Pesanan
          </h2>
          
          <div className="bg-white/5 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Layanan:</span>
              <span className="text-white font-medium">{service.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Produk:</span>
              <span className="text-white font-medium">{product.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Harga:</span>
              <span className="text-neon-blue font-bold">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
              <span className="text-white">Total:</span>
              <span className="text-neon-blue text-lg">
                Rp {totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Game/Service Data */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white flex items-center">
              <User className="h-4 w-4 mr-2" />
              Data {service.category === 'game' ? 'Game' : 'Akun'}
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-white">
                {service.category === 'game' ? 'User ID' : 'Nomor/ID'}
              </Label>
              <div className="relative">
                <Input
                  id="userId"
                  placeholder={service.category === 'game' ? 
                    "Masukkan User ID" : 
                    "Masukkan nomor/ID"
                  }
                  value={formData.userId}
                  onChange={(e) => handleInputChange('userId', e.target.value)}
                  onBlur={(e) => checkNickname(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
                />
                {isCheckingNickname && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="loading-spinner" />
                  </div>
                )}
              </div>
              {errors.userId && (
                <p className="text-red-400 text-sm">{errors.userId}</p>
              )}
              {formData.nickname && (
                <p className="text-green-400 text-sm">
                  ✓ Nickname: {formData.nickname}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-white">
                Jumlah
              </Label>
              <Select 
                value={formData.quantity.toString()}
                onValueChange={(value) => handleInputChange('quantity', parseInt(value))}
              >
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 5, 10].map(qty => (
                    <SelectItem key={qty} value={qty.toString()}>
                      {qty}x - Rp {(product.price * qty).toLocaleString('id-ID')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Informasi Kontak
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  Nomor HP
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08xxxxxxxxx"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm">{errors.phone}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/60"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Metode Pembayaran
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <Button
                  key={method.value}
                  type="button"
                  variant={formData.paymentMethod === method.value ? "default" : "outline"}
                  className={`justify-start h-12 ${
                    formData.paymentMethod === method.value
                      ? 'bg-gradient-primary border-neon-blue'
                      : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                  }`}
                  onClick={() => handleInputChange('paymentMethod', method.value)}
                >
                  <span className="mr-3 text-lg">{method.icon}</span>
                  {method.label}
                </Button>
              ))}
            </div>
            {errors.paymentMethod && (
              <p className="text-red-400 text-sm">{errors.paymentMethod}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-white/10">
            <GradientButton
              type="submit"
              className="w-full"
              size="lg"
              loading={isLoading}
              disabled={isLoading}
            >
              Lanjut ke Pembayaran
            </GradientButton>
          </div>

        </form>
      </div>
    </GlassCard>
  )
}
