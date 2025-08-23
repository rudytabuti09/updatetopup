'use client'

import Link from "next/link"
import { Facebook, Instagram, Twitter, MessageCircle, Gamepad2, Zap, Shield, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const footerLinks = {
  layanan: [
    { name: "Top Up Game", href: "/catalog?category=game", icon: "🎮" },
    { name: "Pulsa & Data", href: "/catalog?category=pulsa", icon: "📱" },
    { name: "E-Money", href: "/catalog?category=emoney", icon: "💳" },
    { name: "Social Media", href: "/catalog?category=sosmed", icon: "📸" },
    { name: "PPOB", href: "/catalog?category=ppob", icon: "⚡" },
  ],
  bantuan: [
    { name: "FAQ", href: "/faq", icon: "❓" },
    { name: "Cara Order", href: "/help/order", icon: "📋" },
    { name: "Lacak Pesanan", href: "/tracking", icon: "📦" },
    { name: "Hubungi CS", href: "/contact", icon: "💬" },
  ],
  perusahaan: [
    { name: "Tentang Kami", href: "/about", icon: "🏢" },
    { name: "Kebijakan Privasi", href: "/privacy", icon: "🔐" },
    { name: "Syarat & Ketentuan", href: "/terms", icon: "📄" },
    { name: "Karir", href: "/careers", icon: "💼" },
  ],
}

const socialLinks = [
  { name: "WhatsApp", icon: MessageCircle, href: "https://wa.me/6281234567890", color: "hover:text-green-400", gradient: "from-green-500 to-green-600" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/wmxtopup", color: "hover:text-pink-400", gradient: "from-pink-500 to-purple-600" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/wmxtopup", color: "hover:text-blue-400", gradient: "from-blue-500 to-blue-600" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/wmxtopup", color: "hover:text-sky-400", gradient: "from-sky-500 to-sky-600" },
]

const stats = [
  { label: "Active Users", value: "1M+", icon: "👥" },
  { label: "Games Available", value: "500+", icon: "🎮" },
  { label: "Success Rate", value: "99.9%", icon: "⚡" },
  { label: "Response Time", value: "< 1s", icon: "🚀" },
]

export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Retro-Modern Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent" />
        
        {/* Retro Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to right, #FF00FF 1px, transparent 1px), linear-gradient(to bottom, #00FFFF 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
            }}
          />
        </div>
        
        {/* Neon Light Beams */}
        <div className="absolute top-0 left-1/4 w-px h-32 bg-gradient-to-b from-neon-magenta/30 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-32 bg-gradient-to-b from-neon-cyan/30 to-transparent" />
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-neon-magenta/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
      </div>
      
      <div className="relative z-10">
        {/* Stats Section */}
        <div className="border-b border-white/10 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className="relative mb-3">
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-30 bg-gradient-to-r from-neon-magenta to-neon-cyan rounded-full transition-opacity" />
                  </div>
                  <div className="text-2xl md:text-3xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="relative">
            {/* Glass Card Effect */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-neon-magenta/5 to-neon-cyan/5 rounded-3xl" />
            
            <div className="relative p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                
                {/* Brand Section */}
                <div className="lg:col-span-2">
                  {/* Logo */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative">
                      <Gamepad2 className="h-8 w-8 text-neon-magenta" />
                      <div className="absolute inset-0 bg-neon-magenta/20 blur-lg" />
                    </div>
                    <span className="font-heading font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-neon-magenta to-neon-cyan">
                      WMX TOPUP
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-6 max-w-md leading-relaxed">
                    Platform top up terpercaya dengan teknologi arcade-grade untuk game, pulsa, e-money, dan layanan digital. 
                    <span className="text-neon-cyan font-semibold">Cepat • Murah • Aman</span> dengan sistem otomatis 24/7.
                  </p>
                  
                  {/* Trust Badges */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span className="text-xs font-medium text-green-300">SECURE</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span className="text-xs font-medium text-blue-300">24/7</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
                      <Zap className="h-4 w-4 text-purple-400" />
                      <span className="text-xs font-medium text-purple-300">INSTANT</span>
                    </div>
                  </div>
                  
                  {/* Social Media */}
                  <div className="flex space-x-3">
                    {socialLinks.map((social) => {
                      const Icon = social.icon
                      return (
                        <Link
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative p-3 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:scale-110 hover:border-white/20"
                        >
                          <Icon className={cn("h-5 w-5 text-gray-400 transition-colors duration-300", social.color)} />
                          <div className={cn("absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-r", social.gradient)} />
                          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity border border-white/20" />
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Links Sections */}
                {Object.entries(footerLinks).map(([category, links]) => (
                  <div key={category}>
                    <h3 className="font-heading font-bold text-lg text-white mb-4 relative">
                      {category === 'layanan' ? 'Layanan' : category === 'bantuan' ? 'Bantuan' : 'Perusahaan'}
                      <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-neon-magenta to-neon-cyan rounded-full" />
                    </h3>
                    <ul className="space-y-3">
                      {links.map((link) => (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            className="group flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-all duration-300"
                          >
                            <span className="text-xs group-hover:scale-110 transition-transform">{link.icon}</span>
                            <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-magenta group-hover:to-neon-cyan transition-all">
                              {link.name}
                            </span>
                            <div className="w-0 group-hover:w-2 h-px bg-gradient-to-r from-neon-magenta to-neon-cyan transition-all duration-300" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Bottom Section */}
              <div className="mt-12 pt-8 border-t border-gradient-to-r from-transparent via-white/10 to-transparent">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-gray-400 text-sm">
                    © 2024 <span className="text-neon-magenta font-semibold">WMX TOPUP</span>. All rights reserved.
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <span>Powered by</span>
                      <span className="text-neon-cyan font-semibold">VIP-Reseller</span>
                    </div>
                    <span className="text-gray-600">•</span>
                    <div className="flex items-center gap-2 text-gray-500">
                      <span>Payment by</span>
                      <span className="text-retro-gold font-semibold">Midtrans</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Neon Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-magenta to-transparent opacity-50" />
    </footer>
  )
}
