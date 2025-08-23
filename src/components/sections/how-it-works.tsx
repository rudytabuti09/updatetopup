'use client'

import { Search, CreditCard, CheckCircle } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

const steps = [
  {
    icon: Search,
    title: "Pilih Produk",
    description: "Pilih game atau layanan yang ingin kamu top up dari ratusan produk yang tersedia",
    color: "text-neon-blue",
    step: "01"
  },
  {
    icon: CreditCard, 
    title: "Bayar",
    description: "Lakukan pembayaran dengan berbagai metode yang tersedia: Bank Transfer, E-Wallet, QRIS",
    color: "text-neon-purple",
    step: "02"
  },
  {
    icon: CheckCircle,
    title: "Selesai",
    description: "Item akan masuk otomatis ke akun kamu dalam hitungan detik setelah pembayaran berhasil",
    color: "text-neon-cyan",
    step: "03"
  }
]

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Cara <span className="gradient-text">Kerja</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Hanya dalam 3 langkah mudah, kamu sudah bisa mendapatkan item yang diinginkan
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="relative">
                  {/* Connection Line (desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-8 h-0.5 bg-gradient-to-r from-neon-blue to-neon-purple transform -translate-y-1/2 z-10" 
                         style={{left: 'calc(100% - 2rem)'}} />
                  )}
                  
                  <GlassCard hover className="text-center relative overflow-hidden group">
                    {/* Step Number Background */}
                    <div className="absolute -top-4 -right-4 text-6xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                      {step.step}
                    </div>
                    
                    {/* Icon */}
                    <div className="relative z-10 mb-6">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple p-0.5`}>
                        <div className="w-full h-full bg-wmx-dark rounded-2xl flex items-center justify-center">
                          <Icon className={`h-8 w-8 ${step.color}`} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  </GlassCard>
                </div>
              )
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-2 bg-white/5 rounded-full px-6 py-3 border border-white/10">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-white/80 text-sm font-medium">
                Proses otomatis 24/7 • Tanpa perlu daftar akun
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
