import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { Providers } from '@/components/providers/session-provider'
import { SessionStatus } from '@/components/debug/session-status'
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"]
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
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <Providers>
          {children}
          {process.env.NODE_ENV === 'development' && <SessionStatus />}
        </Providers>
      </body>
    </html>
  )
}
