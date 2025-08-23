'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react'
import { RootLayout } from '@/components/layout/root-layout'
import { GlassCard } from '@/components/ui/glass-card'
import { GradientButton } from '@/components/ui/gradient-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak sama')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Terjadi kesalahan')
      } else {
        router.push('/auth/signin?message=Akun berhasil dibuat. Silakan login.')
      }
    } catch (error) {
      setError('Terjadi kesalahan saat mendaftar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <RootLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          
          {/* Logo */}
          <div className="text-center mb-8">
            <Logo size="large" />
            <h1 className="text-2xl font-heading font-bold text-white mt-4 mb-2">
              Buat Akun Baru
            </h1>
            <p className="text-white/70">
              Bergabung dengan WMX TOPUP sekarang
            </p>
          </div>

          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-medium">
                  Nama Lengkap
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nama lengkap Anda"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/60"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/60"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white font-medium">
                  Nomor HP (Opsional)
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/60"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white font-medium">
                  Konfirmasi Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/60"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <GradientButton
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner mr-2" />
                    Mendaftar...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Daftar Sekarang
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </GradientButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/70">
                Sudah punya akun?{' '}
                <button 
                  onClick={() => router.push('/auth/signin')}
                  className="text-neon-blue hover:text-neon-purple transition-colors font-medium"
                >
                  Masuk di sini
                </button>
              </p>
            </div>
          </GlassCard>

        </div>
      </div>
    </RootLayout>
  )
}
