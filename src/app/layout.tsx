import type { Metadata } from "next"
import { Inter, Orbitron } from "next/font/google"
import { Providers } from '@/components/providers/session-provider'
import { SessionStatus } from '@/components/debug/session-status'
import { PerformanceMonitor } from '@/components/debug/performance-monitor'
import "./globals.css"

// Optimized font loading with preload and display swap
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial', 'sans-serif'],
})

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"], // Only load essential weights
  display: 'swap',
  preload: true,
  fallback: ['monospace', 'courier new'],
})

export const metadata: Metadata = {
  title: "WMX TOPUP - Platform Top Up Game & Pulsa Terpercaya",
  description: "Platform top up game, pulsa, dan e-money terpercaya dengan harga termurah dan proses tercepat. Dukung semua game populer dan operator seluler.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#FF00FF" />
      </head>
      <body className={`${inter.variable} ${orbitron.variable} antialiased font-sans text-foreground bg-gradient-light min-h-screen overflow-x-hidden`}>
        <Providers>
          {children}
          {process.env.NODE_ENV === 'development' && (
            <>
              <SessionStatus />
              <PerformanceMonitor />
            </>
          )}
        </Providers>
      </body>
    </html>
  )
}
