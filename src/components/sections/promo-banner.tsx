'use client'

import * as React from "react"
import { ChevronLeft, ChevronRight, Zap, Sparkles, Trophy, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { cn } from "@/lib/utils"

const promoBanners = [
  {
    id: 1,
    title: "MEGA SALE ML",
    subtitle: "Diamond 20% OFF - Limited Time!",
    badge: "HOT DEAL",
    icon: "💎",
    image: "/banners/ml-promo.jpg",
    link: "/catalog/mobile-legends",
    gradient: "from-neon-magenta via-neon-purple to-neon-cyan",
    accentColor: "neon-magenta"
  },
  {
    id: 2,
    title: "FF SPECIAL EVENT",
    subtitle: "Double Diamond Bonus Up to 100%",
    badge: "EXCLUSIVE",
    icon: "🔥",
    image: "/banners/ff-promo.jpg", 
    link: "/catalog/free-fire",
    gradient: "from-retro-orange via-retro-sunset to-neon-pink",
    accentColor: "retro-orange"
  },
  {
    id: 3,
    title: "GENSHIN PRIMO",
    subtitle: "Genesis Crystals Best Price!",
    badge: "LIMITED",
    icon: "⭐",
    image: "/banners/genshin-promo.jpg",
    link: "/catalog/genshin-impact", 
    gradient: "from-neon-cyan via-neon-blue to-neon-purple",
    accentColor: "neon-cyan"
  },
  {
    id: 4,
    title: "PULSA CASHBACK",
    subtitle: "Get 50K Cashback Today!",
    badge: "NEW",
    icon: "📱",
    image: "/banners/pulsa-promo.jpg",
    link: "/catalog?category=pulsa",
    gradient: "from-retro-gold via-retro-orange to-neon-pink",
    accentColor: "retro-gold"
  }
]

export function PromoBanner() {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === promoBanners.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? promoBanners.length - 1 : prevIndex - 1
    )
  }

  React.useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000) // Auto slide every 5 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-20 relative">
      {/* Retro Grid Background */}
      <div className="absolute inset-0 bg-grid-retro bg-[length:40px_40px] opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-slide-up">
          {/* Retro Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-retro-gold/20 to-neon-magenta/20 border border-retro-gold/30 backdrop-blur-sm mb-6">
            <Gift className="w-4 h-4 text-retro-gold" />
            <span className="text-sm font-retro font-semibold text-retro-gold uppercase tracking-wider">
              Special Offers
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-heading font-black mb-4">
            <span className="text-glow-magenta">PROMO</span>{" "}
            <span className="text-retro-gold">SPESIAL</span>
          </h2>
          <p className="text-wmx-gray-700 text-lg max-w-2xl mx-auto font-sans">
            Jangan lewatkan penawaran menarik dan diskon besar-besaran untuk produk favorit kamu
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <GlassCard className="p-0 overflow-hidden">
            <div className="relative h-64 md:h-80 lg:h-96">
              {promoBanners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={cn(
                    "absolute inset-0 transition-transform duration-500 ease-in-out",
                    index === currentIndex ? "translate-x-0" : "translate-x-full",
                    index < currentIndex && "-translate-x-full"
                  )}
                >
                  <div className={cn(
                    "relative w-full h-full bg-gradient-to-r flex items-center",
                    banner.gradient
                  )}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-repeat" />
                    </div>

                    <div className="relative z-10 container mx-auto px-8 flex items-center justify-between">
                      <div className="flex-1 max-w-lg">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                          <Sparkles className="w-4 h-4 text-white" />
                          <span className="text-xs font-retro font-bold text-white uppercase tracking-wider">
                            {banner.badge}
                          </span>
                        </div>
                        
                        <h3 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 drop-shadow-2xl">
                          {banner.title}
                        </h3>
                        <p className="text-white/90 text-lg md:text-xl mb-8 font-sans">
                          {banner.subtitle}
                        </p>
                        
                        <GradientButton
                          variant="secondary"
                          size="xl"
                          className="group shadow-2xl"
                        >
                          <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                          CLAIM NOW
                        </GradientButton>
                      </div>

                      {/* Retro-styled banner image */}
                      <div className="hidden md:block flex-shrink-0 ml-8">
                        <div className="relative group">
                          {/* Neon Glow Effect */}
                          <div className={cn(
                            "absolute inset-0 blur-3xl opacity-50 group-hover:opacity-70 transition-opacity",
                            banner.accentColor === "neon-magenta" && "bg-neon-magenta",
                            banner.accentColor === "neon-cyan" && "bg-neon-cyan",
                            banner.accentColor === "retro-gold" && "bg-retro-gold",
                            banner.accentColor === "retro-orange" && "bg-retro-orange"
                          )} />
                          
                          <div className="relative w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-3xl border-2 border-white/30 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                            {/* Scan Line Effect */}
                            <div className="absolute inset-0 pointer-events-none">
                              <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent animate-scan-line" />
                            </div>
                            
                            <div className="text-center z-10">
                              <div className="text-7xl lg:text-8xl mb-4 animate-float">
                                {banner.icon}
                              </div>
                              <div className="text-white font-retro font-bold text-sm uppercase tracking-wider">
                                Limited Offer
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Retro Navigation Buttons */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-neon-magenta/20 hover:border-neon-magenta/50 hover:text-neon-magenta transition-all z-20 flex items-center justify-center group"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </button>

            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-neon-cyan/20 hover:border-neon-cyan/50 hover:text-neon-cyan transition-all z-20 flex items-center justify-center group"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </button>

            {/* Retro Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-20">
              {promoBanners.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "relative transition-all duration-300",
                    index === currentIndex 
                      ? "w-8 h-2" 
                      : "w-2 h-2"
                  )}
                  onClick={() => setCurrentIndex(index)}
                >
                  <div className={cn(
                    "absolute inset-0 rounded-full transition-all duration-300",
                    index === currentIndex 
                      ? "bg-gradient-to-r from-neon-magenta to-neon-cyan shadow-glow-magenta" 
                      : "bg-white/50 hover:bg-white/70"
                  )} />
                  {index === currentIndex && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-magenta to-neon-cyan animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
