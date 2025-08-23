'use client'

import { Search, CreditCard, CheckCircle, Gamepad2, Wallet, Zap } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

const steps = [
  {
    icon: Gamepad2,
    title: "SELECT GAME",
    description: "Choose your favorite game from 500+ available titles",
    color: "text-neon-magenta",
    bgGradient: "from-neon-magenta/20 to-neon-purple/20",
    borderColor: "border-neon-magenta/30",
    glowColor: "shadow-glow-magenta",
    step: "01",
    emoji: "🎮"
  },
  {
    icon: Wallet, 
    title: "MAKE PAYMENT",
    description: "Secure payment via Transfer, E-Wallet, or QRIS",
    color: "text-retro-gold",
    bgGradient: "from-retro-gold/20 to-retro-orange/20",
    borderColor: "border-retro-gold/30",
    glowColor: "shadow-glow-gold",
    step: "02",
    emoji: "💳"
  },
  {
    icon: Zap,
    title: "INSTANT DELIVERY",
    description: "Get your items in seconds, automatically!",
    color: "text-neon-cyan",
    bgGradient: "from-neon-cyan/20 to-neon-blue/20",
    borderColor: "border-neon-cyan/30",
    glowColor: "shadow-glow-cyan",
    step: "03",
    emoji: "⚡"
  }
]

export function HowItWorks() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-neon-magenta/5 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          {/* Retro Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 border border-neon-cyan/30 backdrop-blur-sm mb-6">
            <Zap className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-retro font-semibold text-neon-cyan uppercase tracking-wider">
              How It Works
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-heading font-black mb-4">
            <span className="text-glow-cyan">CARA</span>{" "}
            <span className="text-neon-magenta">KERJA</span>
          </h2>
          <p className="text-wmx-gray-700 text-lg max-w-2xl mx-auto font-sans">
            Hanya dalam 3 langkah mudah, kamu sudah bisa mendapatkan item yang diinginkan
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="relative animate-slide-up" style={{animationDelay: `${index * 0.2}s`}}>
                  {/* Retro Connection Line (desktop only) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-[calc(100%-1rem)] right-[-2rem] h-0.5 z-10">
                      <div className="w-full h-full bg-gradient-to-r from-neon-magenta via-retro-gold to-neon-cyan opacity-50" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-retro-gold rounded-full animate-pulse" />
                    </div>
                  )}
                  
                  <GlassCard hover className="text-center relative overflow-hidden group h-full">
                    {/* Retro Grid Pattern */}
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                      <div className="absolute inset-0 bg-grid-retro bg-[length:20px_20px]" />
                    </div>
                    
                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -left-2 z-20">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.bgGradient} border ${step.borderColor} backdrop-blur-sm flex items-center justify-center ${step.glowColor}`}>
                        <span className="font-heading font-black text-lg ${step.color}">
                          {step.step}
                        </span>
                      </div>
                    </div>
                    
                    {/* Main Icon */}
                    <div className="relative z-10 mb-6 mt-4">
                      {/* Emoji Background */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-10 group-hover:opacity-20 transition-opacity animate-float">
                          {step.emoji}
                        </span>
                      </div>
                      
                      {/* Icon Container */}
                      <div className="relative">
                        <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${step.bgGradient} p-0.5 ${step.glowColor} group-hover:scale-110 transition-transform`}>
                          <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                            <Icon className={`h-10 w-10 ${step.color}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className={`text-xl font-heading font-bold mb-3 ${step.color}`}>
                        {step.title}
                      </h3>
                      <p className="text-wmx-gray-700 text-sm leading-relaxed font-sans">
                        {step.description}
                      </p>
                    </div>

                    {/* Hover Effects */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl`} />
                    
                    {/* Scan Line Effect */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                      <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent animate-scan-line" />
                    </div>
                  </GlassCard>
                </div>
              )
            })}
          </div>

          {/* Retro Additional Info */}
          <div className="mt-16 text-center animate-slide-up" style={{animationDelay: '0.8s'}}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-neon-green/10 to-neon-cyan/10 border border-neon-green/30 backdrop-blur-sm group hover:scale-105 transition-transform">
              <CheckCircle className="h-5 w-5 text-neon-green animate-pulse" />
              <span className="text-sm font-retro font-semibold text-neon-green uppercase tracking-wider">
                24/7 AUTO PROCESS
              </span>
              <span className="text-retro-gold">•</span>
              <span className="text-sm font-retro font-semibold text-neon-cyan uppercase tracking-wider">
                NO REGISTRATION
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
