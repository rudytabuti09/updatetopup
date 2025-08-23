'use client'

import Link from "next/link"
import { Facebook, Instagram, Twitter, MessageCircle } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { GlassCard } from "@/components/ui/glass-card"

const footerLinks = {
  layanan: [
    { name: "Top Up Game", href: "/catalog?category=game" },
    { name: "Pulsa & Data", href: "/catalog?category=pulsa" },
    { name: "E-Money", href: "/catalog?category=emoney" },
    { name: "Social Media", href: "/catalog?category=sosmed" },
    { name: "PPOB", href: "/catalog?category=ppob" },
  ],
  bantuan: [
    { name: "FAQ", href: "/faq" },
    { name: "Cara Order", href: "/help/order" },
    { name: "Lacak Pesanan", href: "/tracking" },
    { name: "Hubungi CS", href: "/contact" },
  ],
  perusahaan: [
    { name: "Tentang Kami", href: "/about" },
    { name: "Kebijakan Privasi", href: "/privacy" },
    { name: "Syarat & Ketentuan", href: "/terms" },
    { name: "Karir", href: "/careers" },
  ],
}

const socialLinks = [
  { name: "WhatsApp", icon: MessageCircle, href: "https://wa.me/6281234567890", color: "text-green-400" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/wmxtopup", color: "text-pink-400" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/wmxtopup", color: "text-blue-400" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/wmxtopup", color: "text-sky-400" },
]

export function Footer() {
  return (
    <footer className="relative mt-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-wmx-dark via-transparent to-transparent" />
      
      <div className="relative container mx-auto px-4 py-16">
        <GlassCard className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Logo size="lg" variant="gradient" className="mb-4" />
              <p className="text-white/70 text-sm mb-6 max-w-md">
                Platform top up terpercaya untuk game, pulsa, e-money, dan layanan digital lainnya. 
                Cepat, murah, dan aman dengan sistem otomatis 24/7.
              </p>
              
              {/* Social Media */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors ${social.color} hover:scale-110 transform duration-200`}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Layanan */}
            <div>
              <h3 className="font-semibold text-white mb-4">Layanan</h3>
              <ul className="space-y-2">
                {footerLinks.layanan.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 text-sm hover:text-neon-blue transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bantuan */}
            <div>
              <h3 className="font-semibold text-white mb-4">Bantuan</h3>
              <ul className="space-y-2">
                {footerLinks.bantuan.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 text-sm hover:text-neon-blue transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Perusahaan */}
            <div>
              <h3 className="font-semibold text-white mb-4">Perusahaan</h3>
              <ul className="space-y-2">
                {footerLinks.perusahaan.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 text-sm hover:text-neon-blue transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/60 text-sm mb-4 md:mb-0">
              © 2024 WMX TOPUP. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-white/60">
              <span>Powered by VIP-Reseller</span>
              <span>•</span>
              <span>Pembayaran by Midtrans</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </footer>
  )
}
