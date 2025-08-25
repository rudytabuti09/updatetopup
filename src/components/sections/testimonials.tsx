'use client'

import * as React from "react"
import { Star, Quote, Heart, ThumbsUp, Users } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    id: 1,
    name: "Ahmad Rizki",
    role: "ML Pro Player",
    avatar: "👨‍💻",
    rating: 5,
    content: "Top up paling cepat yang pernah saya coba! Literally instant, perfect untuk rank push malam-malam.",
    game: "Mobile Legends",
    verified: true,
    gradient: "from-blue-500 to-purple-600"
  },
  {
    id: 2,
    name: "Sari Indah",
    role: "Casual Gamer",
    avatar: "👩‍🎨",
    rating: 5,
    content: "Udah langganan di sini hampir 2 tahun. Harga bersaing, pelayanan ramah, gak pernah kecewa!",
    game: "Free Fire",
    verified: true,
    gradient: "from-pink-500 to-rose-600"
  },
  {
    id: 3,
    name: "Budi Santoso",
    role: "Content Creator",
    avatar: "🎬",
    rating: 5,
    content: "Sebagai content creator, saya butuh top up yang reliable. WMX selalu jadi pilihan utama!",
    game: "PUBG Mobile",
    verified: true,
    gradient: "from-yellow-500 to-orange-600"
  },
  {
    id: 4,
    name: "Linda Sari",
    role: "Streamer",
    avatar: "🎭",
    rating: 4,
    content: "Customer service responsif banget! Problem langsung ditangani dengan baik. Recommended!",
    game: "Genshin Impact",
    verified: true,
    gradient: "from-purple-500 to-indigo-600"
  },
  {
    id: 5,
    name: "Fadil Rahman",
    role: "Esports Player",
    avatar: "🏆",
    rating: 5,
    content: "Untuk pro player kayak saya, timing is everything. WMX gak pernah ngecewain soal kecepatan!",
    game: "Valorant",
    verified: true,
    gradient: "from-red-500 to-pink-600"
  },
  {
    id: 6,
    name: "Maya Putri",
    role: "Guild Leader",
    avatar: "👑",
    rating: 5,
    content: "Saya sering top up untuk member guild. Sistem discount bulk-nya sangat membantu budget guild.",
    game: "Call of Duty",
    verified: true,
    gradient: "from-gray-600 to-gray-800"
  }
]

const stats = [
  { label: "Happy Customers", value: "150K+", icon: "😊" },
  { label: "Success Rate", value: "99.9%", icon: "✅" },
  { label: "Average Rating", value: "4.9/5", icon: "⭐" },
]

export function Testimonials() {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = React.useState(0)
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-64 h-64 bg-neon-magenta/3 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-neon-cyan/3 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-pink/20 to-retro-gold/20 border border-neon-pink/30 backdrop-blur-sm mb-6">
            <Heart className="w-4 h-4 text-neon-pink" />
            <span className="text-sm font-retro font-semibold text-neon-pink uppercase tracking-wider">
              Customer Love
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-heading font-black mb-4">
            <span className="text-glow-pink">APA</span>{" "}
            <span className="text-neon-cyan">KATA MEREKA</span>
          </h2>
          <p className="text-wmx-gray-700 text-lg max-w-2xl mx-auto font-sans">
            Lebih dari 150.000 gamer mempercayai WMX TOPUP untuk kebutuhan gaming mereka
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="text-center animate-slide-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <GlassCard hover className="p-6">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-wmx-gray-600 font-medium">
                  {stat.label}
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-4xl mx-auto mb-16">
          <GlassCard className="p-8 md:p-12 relative overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 opacity-10">
              <Quote className="w-16 h-16 text-neon-magenta" />
            </div>
            
            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 animate-float">
                  {testimonials[currentTestimonialIndex].avatar}
                </div>
                <div className="flex justify-center mb-2">
                  {Array.from({ length: testimonials[currentTestimonialIndex].rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <blockquote className="text-xl md:text-2xl font-medium text-wmx-gray-800 text-center leading-relaxed mb-6">
                &ldquo;{testimonials[currentTestimonialIndex].content}&rdquo;
              </blockquote>

              <div className="text-center">
                <div className="font-heading font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan">
                  {testimonials[currentTestimonialIndex].name}
                </div>
                <div className="text-wmx-gray-600 text-sm">
                  {testimonials[currentTestimonialIndex].role} • {testimonials[currentTestimonialIndex].game}
                </div>
                {testimonials[currentTestimonialIndex].verified && (
                  <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full bg-green-100 border border-green-200">
                    <ThumbsUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium text-green-700">Verified Purchase</span>
                  </div>
                )}
              </div>
            </div>

            {/* Background Gradient */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-5 transition-all duration-1000",
              testimonials[currentTestimonialIndex].gradient
            )} />
            
            {/* Scan Line Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent animate-scan-line" />
            </div>
          </GlassCard>

          {/* Testimonial Indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonialIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentTestimonialIndex
                    ? "w-6 bg-gradient-to-r from-neon-magenta to-neon-cyan"
                    : "bg-wmx-gray-300 hover:bg-wmx-gray-400"
                )}
              />
            ))}
          </div>
        </div>

        {/* Grid Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="animate-slide-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <GlassCard hover className="p-6 h-full relative overflow-hidden group">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className="absolute inset-0 bg-grid-retro bg-[length:20px_20px]" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-2xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-medium text-wmx-gray-800">{testimonial.name}</div>
                      <div className="text-xs text-wmx-gray-600">{testimonial.role}</div>
                    </div>
                    {testimonial.verified && (
                      <div className="ml-auto">
                        <ThumbsUp className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-wmx-gray-700 text-sm leading-relaxed mb-3">
                    {testimonial.content}
                  </p>

                  <div className="text-xs text-neon-magenta font-medium">
                    {testimonial.game}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity",
                  testimonial.gradient
                )} />
              </GlassCard>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-neon-green/10 to-neon-cyan/10 border border-neon-green/30 backdrop-blur-sm">
            <Users className="w-5 h-5 text-neon-green" />
            <span className="text-sm font-retro font-semibold text-neon-green uppercase tracking-wider">
              Trusted by 150,000+ Gamers
            </span>
            <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
