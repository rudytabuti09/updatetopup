'use client'

import Link from "next/link"
import { Zap, Shield, Star } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { GradientButton } from "@/components/ui/gradient-button"
import { GlassCard } from "@/components/ui/glass-card"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}} />
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          
          {/* Main Logo */}
          <div className="mb-8 animate-fade-in">
            <Logo size="xl" variant="gradient" className="mb-4" />
            <div className="w-32 h-1 bg-gradient-primary mx-auto rounded-full" />
          </div>

          {/* Hero Title & Tagline */}
          <div className="mb-12 animate-slide-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black mb-6">
              <span className="text-white">Top Up </span>
              <span className="gradient-text">Cepat</span>
              <br />
              <span className="gradient-text">Murah & Aman</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              Platform top up terpercaya untuk game, pulsa, e-money, dan layanan digital. 
              Proses otomatis 24/7 dengan harga terbaik.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Link href="/catalog">
              <GradientButton variant="primary" size="xl">
                <Zap className="mr-2 h-6 w-6" />
                Top Up Sekarang
              </GradientButton>
            </Link>
            <Link href="/tracking">
              <GradientButton variant="outline" size="xl">
                Lacak Pesanan
              </GradientButton>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up" style={{animationDelay: '0.4s'}}>
            <GlassCard hover className="text-center">
              <Zap className="h-12 w-12 text-neon-blue mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Proses Cepat</h3>
              <p className="text-white/70 text-sm">Otomatis dalam hitungan detik</p>
            </GlassCard>
            
            <GlassCard hover className="text-center">
              <Star className="h-12 w-12 text-neon-purple mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Harga Murah</h3>
              <p className="text-white/70 text-sm">Harga terbaik se-Indonesia</p>
            </GlassCard>
            
            <GlassCard hover className="text-center">
              <Shield className="h-12 w-12 text-neon-cyan mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">100% Aman</h3>
              <p className="text-white/70 text-sm">Terpercaya dan bergaransi</p>
            </GlassCard>
          </div>

          {/* Statistics */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-slide-up" style={{animationDelay: '0.6s'}}>
            <div>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">1M+</div>
              <div className="text-white/60 text-sm">Transaksi Berhasil</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-white/60 text-sm">Layanan Non-Stop</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">500+</div>
              <div className="text-white/60 text-sm">Produk Tersedia</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">99%</div>
              <div className="text-white/60 text-sm">Tingkat Keberhasilan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
