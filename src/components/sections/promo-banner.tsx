'use client'

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

const promoBanners = [
  {
    id: 1,
    title: "DISKON 20% Mobile Legends",
    subtitle: "Top up diamond ML dengan harga terbaik!",
    image: "/banners/ml-promo.jpg",
    link: "/catalog/mobile-legends",
    gradient: "from-blue-600 to-purple-600"
  },
  {
    id: 2,
    title: "FREE FIRE Bonus Event",
    subtitle: "Dapatkan bonus diamond hingga 100%",
    image: "/banners/ff-promo.jpg", 
    link: "/catalog/free-fire",
    gradient: "from-orange-500 to-red-600"
  },
  {
    id: 3,
    title: "GENSHIN Impact Promo",
    subtitle: "Genesis Crystal murah meriah!",
    image: "/banners/genshin-promo.jpg",
    link: "/catalog/genshin-impact", 
    gradient: "from-purple-500 to-pink-600"
  },
  {
    id: 4,
    title: "Pulsa & Data Cashback",
    subtitle: "Cashback hingga 50rb untuk pembelian perdana",
    image: "/banners/pulsa-promo.jpg",
    link: "/catalog?category=pulsa",
    gradient: "from-green-500 to-teal-600"
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
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            <span className="gradient-text">Promo</span> Spesial
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
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
                        <h3 className="text-2xl md:text-4xl font-heading font-bold text-white mb-4">
                          {banner.title}
                        </h3>
                        <p className="text-white/90 text-lg mb-6">
                          {banner.subtitle}
                        </p>
                        <Button 
                          className="bg-white text-gray-900 hover:bg-white/90 font-semibold"
                          size="lg"
                        >
                          Ambil Promo
                        </Button>
                      </div>

                      {/* Placeholder for banner image */}
                      <div className="hidden md:block flex-shrink-0 ml-8">
                        <div className="w-48 h-48 lg:w-64 lg:h-64 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center">
                          <div className="text-white/50 text-center">
                            <div className="text-4xl mb-2">🎮</div>
                            <div className="text-sm">Banner Image</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 z-20"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 z-20"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {promoBanners.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors",
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  )}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
