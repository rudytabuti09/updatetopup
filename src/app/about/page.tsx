'use client'

import * as React from "react"
import { Users, Target, Award, Zap, Shield, Clock } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-neon-magenta to-neon-cyan overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
              About WMX TopUp
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Platform top-up game dan digital terpercaya dengan layanan tercepat dan harga terbaik di Indonesia
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-gray-600 mb-4">
                  WMX TopUp hadir untuk memberikan kemudahan dalam pembelian in-game currency, voucher game, pulsa, dan layanan digital lainnya dengan proses yang cepat, aman, dan terpercaya.
                </p>
                <p className="text-gray-600">
                  Kami berkomitmen untuk memberikan pengalaman terbaik dengan harga kompetitif dan layanan customer service 24/7.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <GlassCard className="p-6 text-center">
                  <Users className="w-12 h-12 text-neon-magenta mx-auto mb-3" />
                  <h3 className="font-bold text-2xl text-gray-900">10K+</h3>
                  <p className="text-gray-600">Happy Customers</p>
                </GlassCard>
                <GlassCard className="p-6 text-center">
                  <Zap className="w-12 h-12 text-neon-cyan mx-auto mb-3" />
                  <h3 className="font-bold text-2xl text-gray-900">50K+</h3>
                  <p className="text-gray-600">Transactions</p>
                </GlassCard>
                <GlassCard className="p-6 text-center">
                  <Shield className="w-12 h-12 text-retro-gold mx-auto mb-3" />
                  <h3 className="font-bold text-2xl text-gray-900">100%</h3>
                  <p className="text-gray-600">Secure</p>
                </GlassCard>
                <GlassCard className="p-6 text-center">
                  <Clock className="w-12 h-12 text-neon-pink mx-auto mb-3" />
                  <h3 className="font-bold text-2xl text-gray-900">24/7</h3>
                  <p className="text-gray-600">Support</p>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-heading font-bold text-center text-gray-900 mb-12">
              Why Choose WMX TopUp?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Instant Process",
                  description: "Proses top-up otomatis dalam hitungan detik setelah pembayaran dikonfirmasi"
                },
                {
                  icon: Shield,
                  title: "100% Secure",
                  description: "Transaksi aman dengan enkripsi SSL dan sistem pembayaran terpercaya"
                },
                {
                  icon: Award,
                  title: "Best Price",
                  description: "Harga kompetitif dengan berbagai promo dan cashback menarik"
                },
                {
                  icon: Target,
                  title: "Trusted Partner",
                  description: "Partner resmi dari berbagai game publisher dan provider digital"
                },
                {
                  icon: Users,
                  title: "24/7 Support",
                  description: "Customer service siap membantu Anda kapan saja"
                },
                {
                  icon: Clock,
                  title: "Quick & Easy",
                  description: "Interface user-friendly untuk pengalaman belanja yang mudah"
                }
              ].map((item, index) => (
                <GlassCard key={index} className="p-6">
                  <item.icon className="w-12 h-12 text-neon-magenta mb-4" />
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
