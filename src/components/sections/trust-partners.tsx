'use client'

import * as React from "react"
import { Shield, CheckCircle, Award, Zap } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { LogoImage } from "@/components/ui/logo-image"
import { cn } from "@/lib/utils"

const gamePublishers = [
  { 
    name: "Moonton", 
    game: "Mobile Legends", 
    logoSrc: "/logos/publishers/moonton.png",
    fallbackEmoji: "🏆", 
    gradient: "from-blue-500 to-purple-600" 
  },
  { 
    name: "Garena", 
    game: "Free Fire", 
    logoSrc: "/logos/publishers/garena.png",
    fallbackEmoji: "🔥", 
    gradient: "from-orange-500 to-red-600" 
  },
  { 
    name: "Tencent", 
    game: "PUBG Mobile", 
    logoSrc: "/logos/publishers/tencent.png",
    fallbackEmoji: "🎯", 
    gradient: "from-yellow-500 to-orange-600" 
  },
  { 
    name: "Riot Games", 
    game: "Valorant", 
    logoSrc: "/logos/publishers/riot.png",
    fallbackEmoji: "🎮", 
    gradient: "from-red-500 to-pink-600" 
  },
  { 
    name: "miHoYo", 
    game: "Genshin Impact", 
    logoSrc: "/logos/publishers/mihoyo.png",
    fallbackEmoji: "⭐", 
    gradient: "from-purple-500 to-indigo-600" 
  },
]

const paymentProviders = [
  { 
    name: "DANA", 
    logoSrc: "/logos/payments/dana.png",
    fallbackEmoji: "💙", 
    type: "E-Wallet" 
  },
  { 
    name: "OVO", 
    logoSrc: "/logos/payments/ovo.png",
    fallbackEmoji: "💜", 
    type: "E-Wallet" 
  },
  { 
    name: "GoPay", 
    logoSrc: "/logos/payments/gopay.png",
    fallbackEmoji: "💚", 
    type: "E-Wallet" 
  },
  { 
    name: "ShopeePay", 
    logoSrc: "/logos/payments/shopeepay.png",
    fallbackEmoji: "🤝", 
    type: "E-Wallet" 
  },
  { 
    name: "QRIS", 
    logoSrc: "/logos/payments/qris.png",
    fallbackEmoji: "📱", 
    type: "Universal" 
  },
  { 
    name: "Bank Transfer", 
    logoSrc: "/logos/payments/bank.png",
    fallbackEmoji: "🏦", 
    type: "Banking" 
  },
  { 
    name: "Indomaret", 
    logoSrc: "/logos/payments/indomaret.png",
    fallbackEmoji: "🏪", 
    type: "Retail" 
  },
  { 
    name: "Alfamart", 
    logoSrc: "/logos/payments/alfamart.png",
    fallbackEmoji: "🛒", 
    type: "Retail" 
  },
]

const certifications = [
  {
    title: "SSL Secured",
    description: "256-bit encryption untuk keamanan data",
    icon: Shield,
    color: "text-neon-green",
    bgColor: "from-neon-green/20 to-neon-green/10",
    borderColor: "border-neon-green/30"
  },
  {
    title: "Auto Process",
    description: "Sistem otomatis 24/7 tanpa gangguan",
    icon: Zap,
    color: "text-neon-cyan",
    bgColor: "from-neon-cyan/20 to-neon-cyan/10",
    borderColor: "border-neon-cyan/30"
  },
  {
    title: "Verified Partner",
    description: "Official partner dari game publishers",
    icon: Award,
    color: "text-retro-gold",
    bgColor: "from-retro-gold/20 to-retro-gold/10",
    borderColor: "border-retro-gold/30"
  },
  {
    title: "99.9% Success",
    description: "Tingkat keberhasilan transaksi tertinggi",
    icon: CheckCircle,
    color: "text-neon-magenta",
    bgColor: "from-neon-magenta/20 to-neon-magenta/10",
    borderColor: "border-neon-magenta/30"
  }
]

export function TrustPartners() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-transparent to-wmx-gray-50/50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-magenta/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 border border-neon-green/30 backdrop-blur-sm mb-6">
            <Shield className="w-4 h-4 text-neon-green" />
            <span className="text-sm font-retro font-semibold text-neon-green uppercase tracking-wider">
              Trusted Partners
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-heading font-black mb-4">
            <span className="text-glow-green">DIPERCAYA</span>{" "}
            <span className="text-neon-magenta">BANYAK PIHAK</span>
          </h2>
          <p className="text-wmx-gray-700 text-lg max-w-2xl mx-auto font-sans">
            Bekerjasama dengan publisher game terkemuka dan menyediakan berbagai metode pembayaran terpercaya
          </p>
        </div>

        {/* Certifications */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {certifications.map((cert, index) => {
            const Icon = cert.icon
            return (
              <div 
                key={cert.title}
                className="animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <GlassCard hover className="p-6 text-center relative overflow-hidden group h-full">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                    <div className="absolute inset-0 bg-grid-retro bg-[length:20px_20px]" />
                  </div>

                  <div className="relative z-10">
                    <div className={cn(
                      "w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br p-0.5 mb-4 group-hover:scale-110 transition-transform",
                      cert.bgColor,
                      cert.borderColor
                    )}>
                      <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                        <Icon className={cn("h-8 w-8", cert.color)} />
                      </div>
                    </div>
                    
                    <h3 className={cn("font-heading font-bold text-sm mb-2", cert.color)}>
                      {cert.title}
                    </h3>
                    <p className="text-wmx-gray-600 text-xs leading-relaxed">
                      {cert.description}
                    </p>
                  </div>

                  {/* Hover Effect */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl",
                    cert.bgColor
                  )} />
                </GlassCard>
              </div>
            )
          })}
        </div>

        {/* Game Publishers */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-heading font-bold mb-2">
              <span className="text-wmx-gray-800">OFFICIAL </span>
              <span className="text-neon-magenta">PARTNERS</span>
            </h3>
            <p className="text-wmx-gray-600 text-sm">
              Bekerjasama langsung dengan publisher game ternama
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {gamePublishers.map((publisher, index) => (
              <div 
                key={publisher.name}
                className="animate-slide-up group"
                style={{animationDelay: `${0.5 + index * 0.1}s`}}
              >
                <GlassCard hover className="p-6 text-center relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity",
                    publisher.gradient
                  )} />

                  <div className="relative z-10">
                    <div className="mb-3 group-hover:scale-110 transition-transform">
                      <LogoImage
                        src={publisher.logoSrc}
                        alt={`${publisher.name} Logo`}
                        fallbackEmoji={publisher.fallbackEmoji}
                        width={48}
                        height={48}
                      />
                    </div>
                    <h4 className="font-heading font-bold text-sm text-wmx-gray-800 mb-1">
                      {publisher.name}
                    </h4>
                    <p className="text-xs text-wmx-gray-600">
                      {publisher.game}
                    </p>
                  </div>

                  {/* Scan Line Effect */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent animate-scan-line" />
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-heading font-bold mb-2">
              <span className="text-wmx-gray-800">PAYMENT </span>
              <span className="text-neon-cyan">METHODS</span>
            </h3>
            <p className="text-wmx-gray-600 text-sm">
              Berbagai pilihan pembayaran untuk kemudahan Anda
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-6xl mx-auto">
            {paymentProviders.map((payment, index) => (
              <div 
                key={payment.name}
                className="animate-slide-up group"
                style={{animationDelay: `${0.8 + index * 0.05}s`}}
              >
                <GlassCard hover className="p-4 text-center relative overflow-hidden aspect-square">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                    <div className="absolute inset-0 bg-grid-retro bg-[length:15px_15px]" />
                  </div>

                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <div className="mb-2 group-hover:scale-110 transition-transform">
                      <LogoImage
                        src={payment.logoSrc}
                        alt={`${payment.name} Logo`}
                        fallbackEmoji={payment.fallbackEmoji}
                        width={48}
                        height={48}
                      />
                    </div>
                    <h4 className="font-medium text-xs text-wmx-gray-800 mb-1">
                      {payment.name}
                    </h4>
                    <p className="text-xs text-wmx-gray-500">
                      {payment.type}
                    </p>
                  </div>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-neon-magenta/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Statement */}
        <div className="text-center mt-16">
          <GlassCard className="p-8 max-w-4xl mx-auto relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-grid-retro bg-[length:30px_30px]" />
            </div>

            <div className="relative z-10">
              <div className="flex justify-center items-center gap-4 mb-6">
                <Shield className="w-8 h-8 text-neon-green" />
                <CheckCircle className="w-8 h-8 text-neon-cyan" />
                <Award className="w-8 h-8 text-retro-gold" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-neon-cyan to-retro-gold">
                  SECURITY & TRUST GUARANTEED
                </span>
              </h3>
              
              <p className="text-wmx-gray-700 leading-relaxed max-w-2xl mx-auto">
                Data Anda dilindungi dengan enkripsi SSL 256-bit. Semua transaksi diproses melalui sistem keamanan berlapis 
                dan dipantau 24/7 oleh tim security kami. <span className="text-neon-magenta font-semibold">100% Aman & Terpercaya</span>.
              </p>

              <div className="flex justify-center items-center gap-8 mt-6 text-sm text-wmx-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
                  <span>24/7 Monitored</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-retro-gold rounded-full animate-pulse" />
                  <span>Licensed Partner</span>
                </div>
              </div>
            </div>

            {/* Scan Line Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-green/30 to-transparent animate-scan-line" />
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
